import type { MessageKit } from '../../lib/messages.js';
/** The selects: MultiSelect, Combobox, SelectMenu. */
export declare const select: {
    /** "Select…": what Combobox and SelectMenu say while nothing is chosen, where the application says nothing. */
    placeholder: string;
    /** "Search…": the placeholder of Combobox's search. */
    search: string;
    /** "No results.": what Combobox says beside its list, and to a screen reader, when its search finds nothing. */
    noResults: string;
    /** "Choose…": what MultiSelect says while nothing is chosen, where the application says nothing. */
    choosePlaceholder: string;
    /** "Nothing matches": what it says beside its list, and to a screen reader, when nothing matches what is typed. */
    nothingMatches: string;
    /** "Remove Lyon": the name of a chip's × button. */
    removeChoice: (label: string) => string;
    /** "Nantes, Lille, Nice": the chips "+3" stands for, in its hint. */
    hiddenChoices: (labels: readonly string[], _kit: MessageKit) => string;
    /** "Clear": the name and the hint of the button that removes every chip. */
    clear: string;
    /** "3 at most: remove one to choose another.": what the list says once as many as can be are chosen. */
    atMost: (max: number, { number }: MessageKit) => string;
    /** "Add “Paris”": the option that makes a value of what is typed. */
    create: (text: string) => string;
};
