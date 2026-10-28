import { loader } from '@monaco-editor/react'
import * as monaco from 'monaco-editor'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import TypeScriptWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

// ESM 에디터가 언어 분석을 메인 스레드로 넘기지 않도록 로컬 worker를 제공한다.
const monacoGlobal = globalThis as typeof globalThis & {
  MonacoEnvironment?: monaco.Environment
}

monacoGlobal.MonacoEnvironment = {
  getWorker(_workerId, label) {
    return label === 'typescript' || label === 'javascript'
      ? new TypeScriptWorker()
      : new EditorWorker()
  },
}

loader.config({ monaco })
monaco.editor.defineTheme('typing-vs-dark', {
  base: 'vs-dark',
  inherit: true,
  rules: [{ token: 'invalid', foreground: 'D4D4D4' }],
  colors: {},
})
monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
  allowNonTsExtensions: true,
  jsx: monaco.languages.typescript.JsxEmit.ReactJSX,
})

export { monaco }
