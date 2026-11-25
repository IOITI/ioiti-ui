import type { Extension } from '@codemirror/state';
import type { BoundMessages } from '../components/locale-context.js';
/** The code editors' words, bound to a locale: a provider's `useMessages().code`. */
export type CodeWords = BoundMessages['code'];
/** CodeMirror's phrases in the words given: what its own panels, marks and announcements say. */
export declare function codeMirrorPhrases(words: CodeWords): Record<string, string>;
/** An editor's phrases (`EditorState.phrases`) in the words given, the provider's language's. */
export declare function phrasesExtension(words: CodeWords): Extension;
