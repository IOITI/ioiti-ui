import { jsx as _jsx } from "react/jsx-runtime";
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { bracketMatching, indentOnInput } from '@codemirror/language';
import { lintGutter, setDiagnostics } from '@codemirror/lint';
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search';
import { Annotation, Compartment, EditorState } from '@codemirror/state';
import { drawSelection, EditorView, highlightActiveLine, highlightActiveLineGutter, highlightSpecialChars, keymap, lineNumbers as lineNumberGutter, placeholder as placeholderText, } from '@codemirror/view';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { cn } from '../lib/utils.js';
import { placeDiagnostics } from './diagnostics.js';
import { loadLanguage } from './languages.js';
import { editorHeight, editorTheme } from './theme.js';
/** A change the component makes itself (a new `value` given): not reported back as the user's. */
const fromProps = Annotation.define();
const readOnlyExtension = (readOnly) => EditorState.readOnly.of(readOnly);
const wrapExtension = (wrap) => (wrap ? EditorView.lineWrapping : []);
const gutterExtension = (numbered) => (numbered ? [lineNumberGutter(), highlightActiveLineGutter()] : []);
const placeholderExtension = (text) => (text ? placeholderText(text) : []);
const attributesExtension = (label, readOnly) => EditorView.contentAttributes.of({ 'aria-label': label, ...(readOnly ? { 'aria-readonly': 'true' } : {}) });
/**
 * Code to edit: a configuration, a rule, a document (CodeMirror). In the design's code colours and surface,
 * its frame showing the focus as a field's does, ⌘S saving, ⌘F searching, a server's parse errors marked
 * where they are. Tab moves the focus on, as in any field: an editor never keeps it.
 */
export function CodeEditor({ value, onChange, language = 'text', readOnly = false, wrap = false, diagnostics, onSave, label, lineNumbers = true, placeholder, minHeight, maxHeight, autoFocus = false, className, }) {
    const host = useRef(null);
    const view = useRef(null);
    const parts = useRef(null);
    const handlers = useRef({ onChange, onSave });
    useLayoutEffect(() => {
        handlers.current = { onChange, onSave };
    });
    // What the first render says, for the editor made once; later changes reconfigure it (effects below).
    const initial = useRef({ value, readOnly, wrap, label, lineNumbers, placeholder, minHeight, maxHeight, autoFocus });
    useEffect(() => {
        const first = initial.current;
        const made = {
            language: new Compartment(),
            readOnly: new Compartment(),
            wrap: new Compartment(),
            attributes: new Compartment(),
            gutter: new Compartment(),
            placeholder: new Compartment(),
            height: new Compartment(),
        };
        const editor = new EditorView({
            parent: host.current,
            state: EditorState.create({
                doc: first.value,
                extensions: [
                    made.gutter.of(gutterExtension(first.lineNumbers)),
                    highlightSpecialChars(),
                    history(),
                    drawSelection(),
                    indentOnInput(),
                    bracketMatching(),
                    highlightActiveLine(),
                    highlightSelectionMatches(),
                    lintGutter(),
                    keymap.of([
                        {
                            key: 'Mod-s',
                            preventDefault: true,
                            run: (target) => {
                                handlers.current.onSave?.(target.state.doc.toString());
                                return true;
                            },
                        },
                        ...defaultKeymap,
                        ...historyKeymap,
                        ...searchKeymap,
                    ]),
                    editorTheme,
                    made.height.of(editorHeight(first.minHeight, first.maxHeight)),
                    made.language.of([]),
                    made.readOnly.of(readOnlyExtension(first.readOnly)),
                    made.wrap.of(wrapExtension(first.wrap)),
                    made.attributes.of(attributesExtension(first.label, first.readOnly)),
                    made.placeholder.of(placeholderExtension(first.placeholder)),
                    EditorView.updateListener.of((update) => {
                        if (!update.docChanged || update.transactions.every((tr) => tr.annotation(fromProps)))
                            return;
                        handlers.current.onChange?.(update.state.doc.toString());
                    }),
                ],
            }),
        });
        view.current = editor;
        parts.current = made;
        if (first.autoFocus)
            editor.focus();
        return () => {
            editor.destroy();
            view.current = null;
            parts.current = null;
        };
    }, []);
    // A value given that the document does not have yet (a reload, a reset): it replaces the document.
    useEffect(() => {
        const editor = view.current;
        if (!editor || editor.state.doc.toString() === value)
            return;
        editor.dispatch({ changes: { from: 0, to: editor.state.doc.length, insert: value }, annotations: fromProps.of(true) });
    }, [value]);
    useEffect(() => {
        let current = true;
        void loadLanguage(language).then((support) => {
            const editor = view.current;
            if (current && editor && parts.current)
                editor.dispatch({ effects: parts.current.language.reconfigure(support) });
        });
        return () => {
            current = false;
        };
    }, [language]);
    useEffect(() => {
        const editor = view.current;
        if (!editor || !parts.current)
            return;
        editor.dispatch({
            effects: [
                parts.current.readOnly.reconfigure(readOnlyExtension(readOnly)),
                parts.current.wrap.reconfigure(wrapExtension(wrap)),
                parts.current.attributes.reconfigure(attributesExtension(label, readOnly)),
                parts.current.gutter.reconfigure(gutterExtension(lineNumbers)),
                parts.current.placeholder.reconfigure(placeholderExtension(placeholder)),
                parts.current.height.reconfigure(editorHeight(minHeight, maxHeight)),
            ],
        });
    }, [readOnly, wrap, label, lineNumbers, placeholder, minHeight, maxHeight]);
    useEffect(() => {
        const editor = view.current;
        if (!editor)
            return;
        editor.dispatch(setDiagnostics(editor.state, placeDiagnostics(editor.state.doc, diagnostics ?? [])));
    }, [diagnostics]);
    return (_jsx("div", { ref: host, "data-language": language, className: cn('min-w-0 overflow-hidden rounded-xl border border-border bg-surface', 'focus-within:border-neutral-500 dark:focus-within:border-[#4A4A4A] accent:focus-within:border-brand', className) }));
}
