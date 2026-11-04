// A few small tokenisers for the code a page shows (a payload, a configuration, a command, a diff): enough to
// colour it in the design's code colours (--code-*), not to parse it. Each scans the text once; what no rule
// takes is plain text, and the tokens put end to end are always the code.
const JS_KEYWORDS = new Set(('as async await break case catch class const continue debugger declare default delete do else enum export extends false finally ' +
    'for from function get if implements import in infer instanceof interface keyof let namespace new null of private protected public ' +
    'readonly return satisfies set static super switch this throw true try type typeof undefined var void while with yield').split(' '));
const JS_NAMESPACES = new Set(['Math', 'JSON', 'Object', 'Array', 'Number', 'String', 'Promise', 'Intl', 'Date', 'Reflect', 'console', 'window', 'document', 'process']);
const JS_RULES = [
    ['comment', /\/\/[^\n]*|\/\*[\s\S]*?(?:\*\/|$)/y],
    ['string', /`(?:\\[\s\S]|[^`\\])*`?|'(?:\\.|[^'\\\n])*'?|"(?:\\.|[^"\\\n])*"?/y],
    ['number', /\b(?:0[xX][\da-fA-F_]+|\d[\d_]*(?:\.\d+)?(?:[eE][+-]?\d+)?n?)\b/y],
    ['word', /[A-Za-z_$][\w$]*/y],
    ['operator', /=>|\.\.\.|[=!<>]=?=?|&&|\|\||\?\?|[-+*/%&|^~?:;,.(){}[\]<>]/y],
];
const JSON_RULES = [
    ['string', /"(?:\\.|[^"\\\n])*"?/y],
    ['number', /-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/y],
    ['keyword', /\b(?:true|false|null)\b/y],
    ['operator', /[{}[\]:,]/y],
];
const CSS_RULES = [
    ['comment', /\/\*[\s\S]*?(?:\*\/|$)/y],
    ['string', /'(?:\\.|[^'\\\n])*'?|"(?:\\.|[^"\\\n])*"?/y],
    ['keyword', /@[\w-]+/y],
    ['type', /--[\w-]+/y],
    ['number', /#[\da-fA-F]{3,8}\b|-?\d*\.?\d+(?:%|[a-z]+)?/y],
    ['word', /[A-Za-z_-][\w-]*/y],
    ['operator', /[{}():;,>+~*=[\]]/y],
];
const SHELL_RULES = [
    ['comment', /#[^\n]*/y],
    ['string', /'[^'\n]*'?|"(?:\\.|[^"\\\n])*"?/y],
    ['namespace', /\$\{?[\w@#?*!-]+\}?/y],
    ['keyword', /(?<=\s|^)--?[\w-]+(?:=\S*)?/y],
    ['word', /[\w./@:+-]+/y],
    ['operator', /&&|\|\||[|;&<>()]/y],
];
function scan(code, rules) {
    const out = [];
    let at = 0;
    let plain = '';
    while (at < code.length) {
        let taken = false;
        for (const [kind, pattern] of rules) {
            pattern.lastIndex = at;
            const match = pattern.exec(code);
            if (match && match[0].length > 0) {
                if (plain) {
                    out.push({ kind: 'plain', text: plain });
                    plain = '';
                }
                out.push({ kind, text: match[0] });
                at += match[0].length;
                taken = true;
                break;
            }
        }
        if (!taken)
            plain += code[at++];
    }
    if (plain)
        out.push({ kind: 'plain', text: plain });
    return out;
}
/** The next token that is not blank, after `index`. */
function next(tokens, index) {
    for (let at = index + 1; at < tokens.length; at++)
        if (tokens[at].text.trim())
            return tokens[at].text;
    return undefined;
}
function previous(tokens, index) {
    for (let at = index - 1; at >= 0; at--)
        if (tokens[at].text.trim())
            return tokens[at].text;
    return undefined;
}
function javascript(code) {
    const tokens = scan(code, JS_RULES);
    return tokens.map((token, index) => {
        if (token.kind !== 'word')
            return token;
        const word = token.text;
        const before = previous(tokens, index);
        const after = next(tokens, index);
        if (JS_KEYWORDS.has(word) && before !== '.')
            return { kind: 'keyword', text: word };
        if (before === '<' || before === '</')
            return { kind: /^[A-Z]/.test(word) ? 'type' : 'keyword', text: word };
        if (after === '(')
            return { kind: before === '.' ? 'builtin' : 'function', text: word };
        if (JS_NAMESPACES.has(word) && after === '.')
            return { kind: 'namespace', text: word };
        if (/^[A-Z]/.test(word))
            return { kind: 'type', text: word };
        return { kind: 'plain', text: word };
    });
}
function css(code) {
    const tokens = scan(code, CSS_RULES);
    return tokens.map((token, index) => {
        if (token.kind !== 'word')
            return token;
        const after = next(tokens, index);
        if (after === '(')
            return { kind: 'function', text: token.text };
        // A property: a word before its colon, inside a block.
        if (after === ':')
            return { kind: 'namespace', text: token.text };
        return { kind: 'plain', text: token.text };
    });
}
function shell(code) {
    const tokens = scan(code, SHELL_RULES);
    let command = true;
    return tokens.map((token) => {
        if (token.kind === 'operator' || /\n/.test(token.text)) {
            command = true;
            return token.kind === 'word' ? { kind: 'plain', text: token.text } : token;
        }
        if (token.kind !== 'word')
            return token;
        if (command) {
            command = false;
            return { kind: 'function', text: token.text };
        }
        return { kind: 'plain', text: token.text };
    });
}
/** Pushes a token, joined to the previous one of the same kind. */
function collector() {
    const tokens = [];
    return {
        tokens,
        push(kind, text) {
            if (!text)
                return;
            const last = tokens[tokens.length - 1];
            if (last && last.kind === kind)
                last.text += text;
            else
                tokens.push({ kind, text });
        },
    };
}
const TOML_BARE_KEY = /[A-Za-z0-9_-]/;
const TOML_KEY_CHARS = /[A-Za-z0-9_.-]/;
// A value that is not a string: a boolean, inf or nan, a number, a date or a time.
const TOML_LITERAL = /(?:true|false)(?![A-Za-z0-9_-])|[+-]?(?:inf|nan)(?![A-Za-z0-9_-])|[+-]?\d[\d_:.eE+\-TZz]*/y;
/** Where the TOML string that starts at `start` ends: three quotes to three quotes, else to its quote or its line's end. */
function endOfTomlString(code, start) {
    const quote = code[start];
    const triple = quote.repeat(3);
    if (code.startsWith(triple, start)) {
        const close = code.indexOf(triple, start + 3);
        if (close === -1)
            return code.length;
        let end = close + 3;
        // """a quote at the end"""" : the closing quotes are the last three.
        while (end < code.length && code[end] === quote && end - close < 5)
            end += 1;
        return end;
    }
    let at = start + 1;
    while (at < code.length && code[at] !== quote && code[at] !== '\n') {
        // A basic string's escapes (\" \\); a literal string ('…') has none.
        if (quote === '"' && code[at] === '\\')
            at += 1;
        at += 1;
    }
    return at < code.length && code[at] === quote ? at + 1 : Math.min(at, code.length);
}
/** TOML: tables (`[rule]`, `[[rule.threat]]`) as namespaces, keys as types, strings, numbers and dates, booleans, comments. */
function toml(code) {
    const { tokens, push } = collector();
    // The arrays and inline tables open around the current value.
    const open = [];
    let expectKey = true;
    let lineStart = true;
    let at = 0;
    const length = code.length;
    while (at < length) {
        const char = code[at];
        if (char === '\n' || char === '\r') {
            push('plain', char);
            at += 1;
            lineStart = true;
            if (open.length === 0)
                expectKey = true;
            continue;
        }
        if (char === ' ' || char === '\t') {
            let end = at;
            while (end < length && (code[end] === ' ' || code[end] === '\t'))
                end += 1;
            push('plain', code.slice(at, end));
            at = end;
            continue;
        }
        if (char === '#') {
            const newline = code.indexOf('\n', at);
            const end = newline === -1 ? length : newline;
            push('comment', code.slice(at, end));
            at = end;
            continue;
        }
        // A table's header, alone on its line.
        if (char === '[' && lineStart && open.length === 0) {
            const double = code.startsWith('[[', at);
            const close = code.indexOf(double ? ']]' : ']', at + (double ? 2 : 1));
            const newline = code.indexOf('\n', at);
            if (close !== -1 && (newline === -1 || close < newline)) {
                const end = close + (double ? 2 : 1);
                push('namespace', code.slice(at, end));
                at = end;
                lineStart = false;
                expectKey = false;
                continue;
            }
        }
        lineStart = false;
        if (char === '"' || char === "'") {
            const end = endOfTomlString(code, at);
            push(expectKey ? 'type' : 'string', code.slice(at, end));
            at = end;
            continue;
        }
        if (expectKey && TOML_BARE_KEY.test(char)) {
            let end = at;
            while (end < length && TOML_KEY_CHARS.test(code[end]))
                end += 1;
            push('type', code.slice(at, end));
            at = end;
            continue;
        }
        if (char === '=') {
            push('operator', char);
            expectKey = false;
            at += 1;
            continue;
        }
        if (char === '{' || char === '[') {
            open.push(char === '{' ? 'table' : 'array');
            expectKey = char === '{';
            push('operator', char);
            at += 1;
            continue;
        }
        if (char === '}' || char === ']') {
            open.pop();
            expectKey = false;
            push('operator', char);
            at += 1;
            continue;
        }
        if (char === ',') {
            expectKey = open[open.length - 1] === 'table';
            push('operator', char);
            at += 1;
            continue;
        }
        if (char === '.' && expectKey) {
            push('operator', char);
            at += 1;
            continue;
        }
        TOML_LITERAL.lastIndex = at;
        const literal = TOML_LITERAL.exec(code);
        if (literal && literal[0]) {
            push(literal[0] === 'true' || literal[0] === 'false' ? 'keyword' : 'number', literal[0]);
            at += literal[0].length;
            continue;
        }
        push('plain', char);
        at += 1;
    }
    return tokens;
}
const YAML_WORDS = new Set(['true', 'false', 'yes', 'no', 'on', 'off', 'null', '~', 'True', 'False', 'Yes', 'No', 'On', 'Off', 'Null', 'TRUE', 'FALSE', 'NULL']);
const YAML_NUMBER = /^[-+]?(?:\d[\d_]*(?:\.\d*)?(?:[eE][-+]?\d+)?|\.\d+|0x[\da-fA-F]+|0o[0-7]+|\.inf|\.Inf|\.nan|\.NaN)$/;
/** A YAML value written on its line (after a key, or a list's dash): a string, a number, a word, or text. */
function yamlValue(text, push) {
    let at = 0;
    while (at < text.length) {
        const rest = text.slice(at);
        const space = rest.match(/^\s+/);
        if (space) {
            push('plain', space[0]);
            at += space[0].length;
            continue;
        }
        if (rest[0] === '#' && (at === 0 || /\s/.test(text[at - 1]))) {
            push('comment', rest);
            return;
        }
        const quoted = rest.match(/^"(?:\\.|[^"\\])*"?|^'(?:''|[^'])*'?/);
        if (quoted) {
            push('string', quoted[0]);
            at += quoted[0].length;
            continue;
        }
        const mark = rest.match(/^(?:&|\*)[^\s,[\]{}]+/);
        if (mark) {
            push('builtin', mark[0]);
            at += mark[0].length;
            continue;
        }
        const tag = rest.match(/^!{1,2}[^\s,[\]{}]*/);
        if (tag) {
            push('type', tag[0]);
            at += tag[0].length;
            continue;
        }
        if (/^[[\]{},|>]/.test(rest)) {
            push('operator', rest[0]);
            at += 1;
            continue;
        }
        // A plain scalar: up to a comment, or a flow collection's punctuation.
        const plain = rest.match(/^(?:[^\s#,[\]{}]|#(?<!\s#)|\s+(?!#|$)[^\s,[\]{}])+/);
        const word = plain ? plain[0] : rest[0];
        const bare = word.trim();
        push(YAML_NUMBER.test(bare) ? 'number' : YAML_WORDS.has(bare) ? 'keyword' : 'string', word);
        at += word.length;
    }
}
/** YAML: keys, strings, numbers and words, anchors and aliases, tags, comments, a block scalar's lines. */
function yaml(code) {
    const { tokens, push } = collector();
    // A block scalar (`key: |`) takes the lines indented under its key.
    let blockIndent = -1;
    const lines = code.split('\n');
    lines.forEach((line, index) => {
        if (index > 0)
            push('plain', '\n');
        const indent = line.match(/^ */)[0].length;
        if (blockIndent >= 0) {
            if (line.trim() === '' || indent > blockIndent) {
                push('string', line);
                return;
            }
            blockIndent = -1;
        }
        if (/^(?:---|\.\.\.)(?:\s|$)/.test(line)) {
            push('keyword', line.slice(0, 3));
            yamlValue(line.slice(3), push);
            return;
        }
        push('plain', line.slice(0, indent));
        let rest = line.slice(indent);
        let keyIndent = indent;
        // The dashes of list items.
        for (let dash = rest.match(/^-(?:\s+|$)/); dash; dash = rest.match(/^-(?:\s+|$)/)) {
            push('operator', '-');
            push('plain', dash[0].slice(1));
            keyIndent += dash[0].length;
            rest = rest.slice(dash[0].length);
        }
        if (rest.startsWith('#')) {
            push('comment', rest);
            return;
        }
        const key = rest.match(/^(?:"(?:\\.|[^"\\])*"|'(?:''|[^'])*'|[^\s#'"[\]{},][^:#]*?)\s*(?=:(?:\s|$))/);
        if (key) {
            push('namespace', key[0]);
            push('operator', ':');
            rest = rest.slice(key[0].length + 1);
            if (/^\s*[|>][-+0-9]*\s*(?:#.*)?$/.test(rest))
                blockIndent = keyIndent;
        }
        else if (/^[|>][-+0-9]*\s*(?:#.*)?$/.test(rest)) {
            blockIndent = keyIndent - 1;
        }
        yamlValue(rest, push);
    });
    return tokens;
}
/** A unified diff: added lines in the gain's tone, removed ones in the loss's, its files' and its hunks' headers. */
function diff(code) {
    const { tokens, push } = collector();
    code.split('\n').forEach((line, index) => {
        if (index > 0)
            push('plain', '\n');
        if (/^(?:diff |index |--- |\+\+\+ |new file mode|deleted file mode|old mode|new mode|similarity index|rename (?:from|to) |Binary files )/.test(line)) {
            push('keyword', line);
            return;
        }
        const hunk = line.match(/^@@[^@]*@@/);
        if (hunk) {
            push('namespace', hunk[0]);
            push('plain', line.slice(hunk[0].length));
            return;
        }
        if (line.startsWith('+'))
            push('inserted', line);
        else if (line.startsWith('-'))
            push('deleted', line);
        else if (line.startsWith('\\'))
            push('comment', line);
        else
            push('plain', line);
    });
    return tokens;
}
/** The code's tokens, coloured as its language reads them; `text` is all plain. */
export function highlightCode(code, language) {
    switch (language) {
        case 'json':
            return scan(code, JSON_RULES).map((token, index, tokens) => 
            // A key: a string before its colon.
            token.kind === 'string' && next(tokens, index) === ':' ? { kind: 'namespace', text: token.text } : token);
        case 'js':
        case 'jsx':
        case 'ts':
        case 'tsx':
            return javascript(code);
        case 'css':
            return css(code);
        case 'shell':
            return shell(code);
        case 'toml':
            return toml(code);
        case 'yaml':
            return yaml(code);
        case 'diff':
            return diff(code);
        default:
            return [{ kind: 'plain', text: code }];
    }
}
/** The tokens cut at each line's end: a token across lines (a comment, a template) is in each of them. */
export function splitLines(tokens) {
    const lines = [[]];
    for (const token of tokens) {
        const parts = token.text.split('\n');
        parts.forEach((part, index) => {
            if (index > 0)
                lines.push([]);
            if (part)
                lines[lines.length - 1].push({ kind: token.kind, text: part });
        });
    }
    return lines;
}
