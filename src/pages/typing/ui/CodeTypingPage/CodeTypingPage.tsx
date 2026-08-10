import MonacoEditor, { loader, type OnMount } from '@monaco-editor/react'
import * as monaco from 'monaco-editor'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'

import * as S from './CodeTypingPage.style'
import { TypingCountdown } from '../TypingCountdown/TypingCountdown'
import { TypingPracticeHeader } from '../TypingPracticeHeader/TypingPracticeHeader'

const LANGUAGE_NAMES = { java: 'Java', javascript: 'JavaScript' } as const

const CODE_LINES = [
  'function transform(arr) {',
  '  let sum = 0;',
  '  for (let i = 0; i < arr.length; i++) {',
  '    if (arr[i] % 2 === 0) {',
  '      const squared = arr[i] * arr[i];',
  '      sum += squared;',
  '    }',
  '  }',
  '  return sum;',
  '}',
]

loader.config({ monaco })

interface CodeEditorProps {
  title: string
  lines: string[]
  language: string
  editable?: boolean
  onChange?: (value: string) => void
}

function CodeEditor({ title, lines, language, editable, onChange }: CodeEditorProps) {
  const errorDecorations = useRef<monaco.editor.IEditorDecorationsCollection | null>(null)

  const handleMount: OnMount = editor => {
    const model = editor.getModel()

    if (!model) return

    errorDecorations.current = editor.createDecorationsCollection()

    const updateErrorDecorations = () => {
      const typedCode = model.getValue()
      const referenceCode = CODE_LINES.join('\n')
      const decorations: monaco.editor.IModelDeltaDecoration[] = []

      onChange?.(typedCode)

      for (let index = 0; index < typedCode.length; index += 1) {
        const typedCharacter = typedCode[index]
        const referenceCharacter = referenceCode[index]

        if (typedCharacter === referenceCharacter) continue

        const start = model.getPositionAt(index)
        const isWhitespaceError = /\s/.test(typedCharacter) || (referenceCharacter !== undefined && /\s/.test(referenceCharacter))

        if (isWhitespaceError) {
          const end = model.getPositionAt(typedCode.length)
          decorations.push({ range: new monaco.Range(start.lineNumber, start.column, end.lineNumber, end.column), options: { inlineClassName: 'typing-error' } })
          break
        }

        const end = model.getPositionAt(index + 1)
        decorations.push({ range: new monaco.Range(start.lineNumber, start.column, end.lineNumber, end.column), options: { inlineClassName: 'typing-error' } })
      }

      errorDecorations.current?.set(decorations)
    }

    updateErrorDecorations()
    editor.onDidChangeModelContent(updateErrorDecorations)
  }

  return (
    <S.Editor>
      <S.EditorHeader>
        <S.WindowButtons aria-hidden="true"><i /><i /><i /></S.WindowButtons>
        <S.EditorTitle>{title}</S.EditorTitle>
      </S.EditorHeader>
      <S.EditorBody>
        <MonacoEditor
          defaultLanguage={language}
          defaultValue={lines.join('\n')}
          onMount={editable ? handleMount : undefined}
          theme="vs-dark"
          options={{
            ariaLabel: `${title} 에디터`,
            acceptSuggestionOnEnter: 'off',
            automaticLayout: true,
            autoClosingBrackets: 'always',
            autoClosingQuotes: 'always',
            bracketPairColorization: { enabled: true },
            cursorBlinking: 'blink',
            editContext: false,
            folding: false,
            fontFamily: "'Roboto Mono', monospace",
            fontSize: 14,
            glyphMargin: false,
            inlineSuggest: { enabled: false },
            lineDecorationsWidth: 10,
            lineHeight: 20,
            lineNumbersMinChars: 3,
            minimap: { enabled: false },
            padding: { top: 9, bottom: 9 },
            parameterHints: { enabled: false },
            quickSuggestions: false,
            readOnly: !editable,
            renderLineHighlight: editable ? 'line' : 'none',
            scrollBeyondLastLine: false,
            suggestOnTriggerCharacters: false,
            tabSize: 2,
            tabCompletion: 'off',
            wordBasedSuggestions: 'off',
            wordWrap: 'on',
            wrappingIndent: 'indent',
          }}
        />
      </S.EditorBody>
    </S.Editor>
  )
}

export function CodeTypingPage() {
  const { language } = useParams()
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [typedCode, setTypedCode] = useState('')
  const startTimeRef = useRef<number | null>(null)

  const handleCountdownComplete = useCallback(() => {
    startTimeRef.current = performance.now()
  }, [])

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      if (startTimeRef.current === null) return

      setElapsedSeconds(Math.floor((performance.now() - startTimeRef.current) / 1000))
    }, 250)

    return () => window.clearInterval(intervalId)
  }, [])

  if (!language || !(language in LANGUAGE_NAMES)) {
    return <Navigate to="/typing" replace />
  }

  const languageName = LANGUAGE_NAMES[language as keyof typeof LANGUAGE_NAMES]
  const editorLanguage = language === 'java' ? 'java' : 'javascript'
  const referenceCode = CODE_LINES.join('\n')
  const correctCharacterCount = [...typedCode].filter((character, index) => character === referenceCode[index]).length
  const typingSpeed = elapsedSeconds === 0 ? 0 : Math.round(typedCode.length / (elapsedSeconds / 60))
  const accuracy = typedCode.length === 0 ? 100 : Math.round((correctCharacterCount / typedCode.length) * 100)
  const minutes = Math.floor(elapsedSeconds / 60)
  const seconds = elapsedSeconds % 60
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`

  return (
    <S.Page>
      <TypingCountdown onComplete={handleCountdownComplete} />
      <S.PracticeFrame>
        <TypingPracticeHeader category={languageName} time={formattedTime} typingSpeed={`${typingSpeed}타`} accuracy={`${accuracy}%`} />
        <S.Workspace>
          <S.Monitor>
            <S.Screen>
              <CodeEditor title="따라 칠 코드" lines={CODE_LINES} language={editorLanguage} />
              <CodeEditor title="내가 쓴 코드" lines={[]} language={editorLanguage} editable onChange={setTypedCode} />
            </S.Screen>
            <S.MonitorNeck aria-hidden="true" />
            <S.MonitorBase aria-hidden="true" />
          </S.Monitor>
        </S.Workspace>
      </S.PracticeFrame>
    </S.Page>
  )
}
