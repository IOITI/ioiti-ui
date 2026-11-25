/** The selects: MultiSelect, Combobox, SelectMenu. */
export const select = {
    /** "Select…": what Combobox and SelectMenu say while nothing is chosen, where the application says nothing. */
    placeholder: 'Select…',
    /** "Search…": the placeholder of Combobox's search. */
    search: 'Search…',
    /** "No results.": what Combobox says beside its list, and to a screen reader, when its search finds nothing. */
    noResults: 'No results.',
    // MultiSelect.
    /** "Choose…": what MultiSelect says while nothing is chosen, where the application says nothing. */
    choosePlaceholder: 'Choose…',
    /** "Nothing matches": what it says beside its list, and to a screen reader, when nothing matches what is typed. */
    nothingMatches: 'Nothing matches',
    /** "Remove Lyon": the name of a chip's × button. */
    removeChoice: (label) => `Remove ${label}`,
    // English names the chips "+3" stands for with commas alone, as it always has: its list (`kit.list`) says "a, b and c".
    /** "Nantes, Lille, Nice": the chips "+3" stands for, in its hint. */
    hiddenChoices: (labels, _kit) => labels.join(', '),
    /** "Clear": the name and the hint of the button that removes every chip. */
    clear: 'Clear',
    /** "3 at most: remove one to choose another.": what the list says once as many as can be are chosen. */
    atMost: (max, { number }) => `${number(max)} at most: remove one to choose another.`,
    /** "Add “Paris”": the option that makes a value of what is typed. */
    create: (text) => `Add “${text}”`,
};
