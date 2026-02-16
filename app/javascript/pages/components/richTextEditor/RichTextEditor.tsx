import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  FORMAT_TEXT_COMMAND,
} from 'lexical';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListItemNode, ListNode } from '@lexical/list';

import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { CodeNode } from '@lexical/code';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import {TextEditorTheme} from './utils'
import { useCallback } from 'react';
import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

interface RichTextEditorProps {
  initialText?: string | string[] | Record<string, string> ;
  onChange?: (text: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  onSubmit?: (value: boolean) => void;
}

function ToolbarPlugin({onClick}: {onClick: (value: boolean) => void}) {
  const [editor] = useLexicalComposerContext();
  
  const formatText = (
    format: 'bold' | 'italic' | 'underline' | 'strikethrough' | 'uppercase' | 'lowercase' | 'capitalize' | 'highlight'
  ) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };


  return (
    <div className="toolbar border-b border-gray-200 p-2 flex gap-2 bg-gray-50">
      <button
        onClick={() => formatText('bold')}
        className="px-3 py-1 bg-white border rounded hover:bg-gray-100 text-sm font-semibold cursor-pointer"
      >
        B
      </button>
      <button
        onClick={() => formatText('italic')}
        className="px-3 py-1 bg-white border rounded hover:bg-gray-100 text-sm italic cursor-pointer"
      >
        I
      </button>
      <button
        onClick={() => formatText('underline')}
        className="px-3 py-1 bg-white border rounded hover:bg-gray-100 text-sm underline cursor-pointer"
      >
        U
      </button>
      <button
        onClick={() => formatText('strikethrough')}
        className="px-2 py-1 bg-white border rounded hover:bg-gray-100 text-sm cursor-pointer"
      >
        Strikethrough
      </button>
      <button
        onClick={() => formatText('highlight')}
        className="px-2 py-1 bg-white border rounded hover:bg-gray-100 text-sm cursor-pointer"
      >
        Highlight
      </button>

      <div className="border-l border-gray-300 mx-2"></div>

      <button
        onClick={() => {
          editor.update(() => {
            const root = $getRoot();
            const paragraph = $createParagraphNode();
            const textNode = $createTextNode('• ');
            paragraph.append(textNode);
            root.append(paragraph);
          });
        }}
        className="px-3 py-1 bg-white border rounded hover:bg-gray-100 text-sm cursor-pointer"
      >
        . List
      </button>
      <button
        onClick={() => {
          editor.update(() => {
            const root = $getRoot();
            const paragraph = $createParagraphNode();
            const textNode = $createTextNode('1. ');
            paragraph.append(textNode);
            root.append(paragraph);
          });
        }}
        className="px-3 py-1 bg-white border rounded hover:bg-gray-100 text-sm cursor-pointer"
      >
        1. List
      </button>
      
      <div className="border-l border-gray-300 mx-2"></div>
      
      <button 
        onClick={() => onClick(true)}
        className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded cursor-pointer transition-colors"
      >
        Save Note
      </button>
    </div>
  );
}

// Plugin to set initial content
function InitialContentPlugin({ initialText }: { initialText?: string | string[] | any }) {
  const [editor] = useLexicalComposerContext();

  const setInitialContent = useCallback(() => {
    if (!initialText) return;

    editor.update(() => {
      const root = $getRoot();
      root.clear();

      if (typeof initialText === "string") {
        const paragraph = $createParagraphNode();
        const textNode = $createTextNode(initialText);
        paragraph.append(textNode);
        root.append(paragraph);
        return;
      }
      if (
        typeof initialText === "object" &&
        initialText !== null &&
        !Array.isArray(initialText)
      ) {
        Object.entries(initialText).forEach(([key, value]: [string, any]) => {
          const keyParagraph = $createParagraphNode();
          const keyNode = $createTextNode(`${key}: `);
          keyNode.setStyle("font-weight: bold");
          keyParagraph.append(keyNode);

          const valueNode = $createTextNode(value);
          keyParagraph.append(valueNode);
          root.append(keyParagraph);
        });
      }
    });
  }, [editor, initialText]);

  useEffect(() => {
    setInitialContent();
  }, [setInitialContent]);

  return null;
}

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: any) {
  console.error(error);
}

function RichTextEditor({
  initialText = '',
  onChange,
  placeholder = 'Enter some text...',
  readOnly = false,
  onSubmit,
}: RichTextEditorProps) {

  const initialConfig = {
    namespace: 'RichTextEditor',
    TextEditorTheme,
    onError,
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      LinkNode,
      AutoLinkNode,
    ],
    editorState: null,
  };

  const handleChange = (editorState: any) => {
    if (onChange) {
      editorState.read(() => {
        const root = $getRoot();
        const textContent = root.getTextContent();
        onChange(textContent);
      });
    }
  };

 

  return (
    <div className="relative border border-gray-300 rounded-lg pb-30 h-full">
      <LexicalComposer initialConfig={initialConfig}>
        {!readOnly && <ToolbarPlugin onClick={onSubmit || (() => {})} />}
        <div className="relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable 
                className={`min-h-[200px] overflow-y-scroll pb-20 h-full p-4 outline-none resize-none text-gray-900 ${
                  readOnly ? 'cursor-default' : ''
                }`}
                style={{ wordBreak: 'break-word' }}
                aria-readonly={readOnly}
              />
            }
            placeholder={
              <div className="absolute top-4 left-4 text-gray-500 pointer-events-none">
                {placeholder}
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>
        <OnChangePlugin onChange={handleChange} />
        <HistoryPlugin />
        <AutoFocusPlugin />
        <ListPlugin />
        <LinkPlugin />
        {initialText && <InitialContentPlugin initialText={initialText} />}
      </LexicalComposer>
    </div>
  );
}

export default RichTextEditor;
