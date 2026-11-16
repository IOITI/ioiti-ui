// What a search finds, and in what order. A word typed is found whatever its case and its accents ("resume" finds
// "Résumé", "strasse" "Straße"); an entry is found when every word typed is somewhere in it; the entry that has the
// words where they say the most (its title, at the start of a word) comes first, the others in the order given.
// The accents of the Latin, Greek and Cyrillic letters, once a letter is decomposed: not every combining mark (a
// Japanese sound mark, a Hindi vowel sign make another letter, which keeps them).
const ACCENTS = /[̀-ͯ᪰-᫿᷀-᷿⃐-⃿︠-︯]/g;
// Letters without a decomposition, written as they are typed on a keyboard without them.
const LETTERS = {
    ß: 'ss',
    æ: 'ae',
    œ: 'oe',
    ø: 'o',
    ł: 'l',
    đ: 'd',
    ð: 'd',
    þ: 'th',
    ı: 'i',
    ς: 'σ',
};
/** A text in lower case, without its accents, as it is searched; each character's place in the text kept. */
export function fold(source) {
    let text = '';
    const from = [];
    let at = 0;
    for (const character of source) {
        // Decomposed, its accents off, composed again (a mark kept stays on its letter); lower case, and the accents
        // off again (İ in lower case is i and a dot above).
        const bare = character.normalize('NFD').replace(ACCENTS, '').normalize('NFC').toLowerCase().replace(ACCENTS, '');
        const written = Array.from(bare, (letter) => LETTERS[letter] ?? letter).join('');
        for (let index = 0; index < written.length; index++)
            from.push(at);
        text += written;
        at += character.length;
    }
    from.push(source.length);
    return { source, text, from };
}
/** The words of a query, as they are searched. */
export function searchWords(query) {
    return fold(query).text.split(/\s+/).filter(Boolean);
}
export function searchIndex(entries) {
    return entries.map((entry) => ({
        entry,
        title: fold(entry.title),
        keywords: (entry.keywords ?? []).map(fold),
        category: fold(entry.category ?? ''),
        description: fold(entry.description ?? ''),
    }));
}
const LETTER_OR_DIGIT = /[\p{L}\p{N}]/u;
/** Whether a word of the text starts there: its start, after a space or a sign, or a capital after a small letter (IconButton). */
function startsWord(text, at) {
    if (at === 0)
        return true;
    // Inside what one character is written as (the second s of ß), no word starts.
    if (text.from[at] === text.from[at - 1])
        return false;
    if (!LETTER_OR_DIGIT.test(text.text[at - 1]))
        return true;
    const here = text.source[text.from[at]];
    const before = text.source[text.from[at] - 1];
    return /\p{Lu}/u.test(here) && /\p{Ll}/u.test(before);
}
/** Where a word is in a text: at the start of one of its words first, else where it first is. */
function find(text, word) {
    let first = -1;
    for (let at = text.text.indexOf(word); at !== -1; at = text.text.indexOf(word, at + 1)) {
        if (startsWord(text, at))
            return { at, start: true };
        if (first === -1)
            first = at;
    }
    return first === -1 ? undefined : { at: first, start: false };
}
// What a word is worth where it is found: in the title most, then in a keyword (most when it is the keyword), the
// category, the description; at the start of a word more than inside one.
const TITLE = { start: 30, inside: 16 };
const KEYWORD = { whole: 24, start: 18, inside: 8 };
const CATEGORY = { start: 8, inside: 3 };
const DESCRIPTION = { start: 5, inside: 2 };
// What the title is worth as a whole: the words typed, its start, or all of them in it.
const TITLE_IS_QUERY = 100;
const TITLE_STARTS_QUERY = 40;
const TITLE_HAS_EVERY_WORD = 20;
/** What a word found in a text is worth; 0 where it is not found. */
function worth(text, word, values) {
    const found = find(text, word);
    if (!found)
        return 0;
    if (values.whole !== undefined && text.text === word)
        return values.whole;
    return found.start ? values.start : values.inside;
}
/** What an entry is worth for the words typed (the most first); `null` where a word is in none of its texts. */
export function scoreOf(indexed, words) {
    let score = 0;
    for (const word of words) {
        const best = Math.max(worth(indexed.title, word, TITLE), ...indexed.keywords.map((keyword) => worth(keyword, word, KEYWORD)), worth(indexed.category, word, CATEGORY), worth(indexed.description, word, DESCRIPTION));
        if (best === 0)
            return null;
        score += best;
    }
    if (words.length === 0)
        return score;
    const query = words.join(' ');
    const title = indexed.title.text.replace(/\s+/g, ' ').trim();
    if (title === query)
        score += TITLE_IS_QUERY;
    if (title.startsWith(query))
        score += TITLE_STARTS_QUERY;
    if (words.every((word) => indexed.title.text.includes(word)))
        score += TITLE_HAS_EVERY_WORD;
    return score;
}
/** The entries every word typed is found in, the best first, those worth the same in the order given. */
export function rank(index, words) {
    if (words.length === 0)
        return index.map((indexed) => indexed.entry);
    const found = [];
    index.forEach((indexed, order) => {
        const score = scoreOf(indexed, words);
        if (score !== null)
            found.push({ entry: indexed.entry, score, order });
    });
    found.sort((a, b) => b.score - a.score || a.order - b.order);
    return found.map((each) => each.entry);
}
/**
 * Where the words typed are in a text, to mark them: each where it is found as the search finds it (the start of a
 * word first), as places in the text given, joined where they meet. A letter written as two (ß) is marked whole,
 * an accent written after its letter with it.
 */
export function matchRanges(source, words) {
    const text = fold(source);
    const ranges = [];
    for (const word of words) {
        const found = find(text, word);
        if (!found)
            continue;
        const end = found.at + word.length;
        // The first character after the word's last that comes from another character of the text.
        let after = end;
        while (after < text.text.length && text.from[after] === text.from[end - 1])
            after++;
        ranges.push([text.from[found.at], text.from[after]]);
    }
    ranges.sort((a, b) => a[0] - b[0]);
    const joined = [];
    for (const range of ranges) {
        const last = joined[joined.length - 1];
        if (last && range[0] <= last[1])
            last[1] = Math.max(last[1], range[1]);
        else
            joined.push([...range]);
    }
    return joined;
}
