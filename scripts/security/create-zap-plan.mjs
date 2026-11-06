import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import process from 'node:process'

const output = resolve(process.argv[2] ?? 'output/security')
const phase = process.argv[3] ?? 'after'
if (!['before', 'after'].includes(phase)) throw new Error('phase: before | after')

// 같은 HTML 응답 경로만 비교한다. 외부 API 탐색과 activeScan은 실행하지 않는다.
const paths = ['/', '/home', '/community', '/calendar', '/learning', '/typing',
  '/mentoring', '/notification', '/store', '/my', '/login']
const plan = {
  env: {
    contexts: [{
      name: 'local-production',
      urls: ['http://127.0.0.1:4179'],
      includePaths: ['http://127\\.0\\.0\\.1:4179/.*'],
    }],
    parameters: { failOnError: true, failOnWarning: false, progressToStdout: true },
  },
  jobs: [
    { type: 'passiveScan-config', parameters: { scanOnlyInScope: true } },
    {
      type: 'requestor',
      requests: paths.map((path) => ({
        url: `http://127.0.0.1:4179${path}`, method: 'GET', responseCode: 200,
      })),
    },
    { type: 'passiveScan-wait', parameters: { maxDuration: 2 } },
    ...['json', 'html'].map((extension) => ({
      type: 'report',
      parameters: {
        template: `traditional-${extension}`, reportDir: output,
        reportFile: `zap-${phase}.${extension}`, reportTitle: `Switch ${phase} passive scan`,
      },
    })),
  ],
}
await mkdir(output, { recursive: true })
// JSON은 YAML의 부분집합이며 ZAP Automation Framework에서 읽을 수 있다.
const file = resolve(output, `${phase}.yaml`)
await writeFile(file, `${JSON.stringify(plan, null, 2)}\n`)
process.stdout.write(`${file}\n`)
