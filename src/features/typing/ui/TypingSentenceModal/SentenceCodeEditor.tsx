import MonacoEditor from '@monaco-editor/react'
import { useId } from 'react'
import '@/shared/lib/monacoSetup'


interface SentenceCodeEditorProps {
  language: string
  value: string
  onChange: (value: string) => void
}

export function SentenceCodeEditor({ language, value, onChange }: SentenceCodeEditorProps) {
  const modelId = useId()

  return (
    <MonacoEditor
      language={language}
      path={`file:///sentence-editor-${encodeURIComponent(modelId)}.jsx`}
      value={value}
      onChange={(nextValue) => onChange(nextValue ?? '')}
      theme="typing-vs-dark"
      options={{
        ariaLabel: '개발 언어 문장 에디터',
        automaticLayout: true,
        autoClosingBrackets: 'always',
        autoClosingQuotes: 'always',
        autoIndent: 'full',
        detectIndentation: false,
        editContext: false,
        folding: false,
        fontFamily: "'Roboto Mono', monospace",
        fontSize: 14,
        glyphMargin: false,
        lineDecorationsWidth: 18,
        lineHeight: 20,
        lineNumbers: 'on',
        lineNumbersMinChars: 2,
        minimap: { enabled: false },
        padding: { top: 8, bottom: 8 },
        renderLineHighlight: 'none',
        scrollBeyondLastLine: false,
        insertSpaces: true,
        tabSize: 2,
        wordWrap: 'on',
        wrappingIndent: 'indent',
      }}
    />
  )
}
