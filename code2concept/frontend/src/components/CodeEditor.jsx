import React, { useEffect, useRef } from 'react';
import { EditorView } from '@codemirror/view';
import { basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { python } from '@codemirror/lang-python';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';

const lightTheme = EditorView.theme({
  '&': {
    backgroundColor: '#FFFFFF',
    color: '#1A1A18',
    height: '100%',
    fontSize: '13px',
  },
  '.cm-content': { padding: '16px', fontFamily: "'JetBrains Mono', monospace" },
  '.cm-gutters': { backgroundColor: '#F8F7F4', borderRight: '1px solid #E8E6DF', color: '#A8A69F' },
  '.cm-activeLine': { backgroundColor: '#F1EFE8' },
  '.cm-activeLineGutter': { backgroundColor: '#E8E6DF' },
  '.cm-selectionBackground': { backgroundColor: '#E1F5EE !important' },
  '&.cm-focused .cm-selectionBackground': { backgroundColor: '#C5EBE0 !important' },
  '.cm-cursor': { borderLeftColor: '#1D9E75' },
  '.cm-scroller': { overflow: 'auto' },
});

export default function CodeEditor({ value, onChange, language = 'python', dark = false }) {
  const editorRef = useRef(null);
  const viewRef = useRef(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (!editorRef.current) return;

    const langExt = language === 'javascript' ? javascript() : python();
    const theme = dark ? oneDark : lightTheme;

    const state = EditorState.create({
      doc: value,
      extensions: [
        basicSetup,
        langExt,
        theme,
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChangeRef.current(update.state.doc.toString());
          }
        }),
        EditorView.lineWrapping,
      ],
    });

    const view = new EditorView({ state, parent: editorRef.current });
    viewRef.current = view;

    return () => view.destroy();
  }, [dark, language]);

  // Sync external value changes
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const current = view.state.doc.toString();
    if (current !== value) {
      view.dispatch({
        changes: { from: 0, to: current.length, insert: value },
      });
    }
  }, [value]);

  return (
    <div
      ref={editorRef}
      className="code-editor h-full w-full overflow-auto"
      style={{ minHeight: '300px' }}
    />
  );
}
