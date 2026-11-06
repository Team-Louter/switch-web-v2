import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import process from 'node:process'

const directory = resolve(process.argv[2] ?? 'docs/security/137/results')
const read = async (name) => JSON.parse(await readFile(resolve(directory, name), 'utf8'))

function summarizeAudit(report) {
  if (report.error || !report.metadata?.vulnerabilities) {
    throw new Error('실패한 npm audit 응답은 0건으로 처리할 수 없습니다.')
  }
  const advisories = new Set(Object.values(report.vulnerabilities).flatMap((entry) =>
    entry.via.filter((via) => typeof via === 'object').map((via) => via.url)))
  return { packages: report.metadata.vulnerabilities, uniqueAdvisories: advisories.size }
}

function summarizeZap(report) {
  if (!report.site?.length) throw new Error('ZAP 응답 사이트가 없습니다.')
  const alerts = new Map(report.site.flatMap((site) => site.alerts)
    .map((alert) => [alert.alertRef ?? alert.pluginid, alert]))
  const counts = { informational: 0, low: 0, medium: 0, high: 0 }
  for (const alert of alerts.values()) {
    const risk = ['informational', 'low', 'medium', 'high'][Number(alert.riskcode)]
    if (!risk) throw new Error(`지원하지 않는 ZAP 위험도: ${alert.riskcode}`)
    counts[risk] += 1
  }
  return {
    counts, actionableTypes: counts.low + counts.medium + counts.high,
    alerts: [...alerts.values()].map((alert) => ({
      id: alert.alertRef ?? alert.pluginid, name: alert.alert, risk: alert.riskdesc,
    })),
  }
}

const summary = {}
for (const phase of ['before', 'after']) {
  summary[phase] = {
    npm: summarizeAudit(await read(`npm-${phase}.json`)),
    npmProduction: summarizeAudit(await read(`npm-production-${phase}.json`)),
    zap: summarizeZap(await read(`zap-${phase}.json`)),
  }
}
process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`)
