# 보안 진단 및 개선 비교 — #137

진단일: 2026-11-06 (KST). 기존 PR #136의 19개 커밋을 포함한 `bc7560d30a1fee478431e2bbcbcf601d0f4c7355`를 개선 전 기준으로 사용했다. 해당 상태에서 분기한 `fix/137-security-audit`에서만 수정했다.

## 진단 범위와 집계 기준

- **ZAP 2.17.0**: production 빌드의 로컬 HTTP 응답을 passive scan으로 검사했다. 개발 서버의 헤더를 운영 보안 설정으로 오인하지 않도록 `vercel.json` 전역 헤더와 SPA fallback을 재현한 진단용 서버를 사용했다.
- 동일한 11개 문서 경로에 GET 요청을 전송했다: `/`, `/home`, `/community`, `/calendar`, `/learning`, `/typing`, `/mentoring`, `/notification`, `/store`, `/my`, `/login`.
- 로그인 전 SPA의 HTML 응답 검사다. 11개 화면의 인증된 업무 기능을 ZAP이 탐색했다는 뜻이 아니다. 외부 API, 계정 권한, 서버 데이터베이스, TLS/CDN 설정과 active scan은 제외했다.
- **npm audit**: 전체 lockfile과 `--omit=dev` 결과를 각각 수집했다. npm의 공개 advisory 데이터베이스를 사용한 의존성 검사이며, OWASP Dependency-Check 자체를 실행한 것으로 표기하지 않는다.
- npm 패키지 수는 전이 의존성으로 영향받는 상위 패키지를 포함한다. 별도로 advisory URL을 중복 제거해 실제 권고문 수를 집계했다. 서버용 어댑터에서만 재현되는 경고도 포함되므로 브라우저에서 공격 가능한 취약점 개수와 동일하지 않다.
- ZAP은 `alertRef`별 **경고 종류**를 비교했다. 동일 원인의 URL별 반복, 보고서의 제한된 증거 샘플 수, Informational 항목은 취약점 개수에 더하지 않는다. 서로 다른 도구의 수를 합산하지 않는다.
- 같은 ZAP 실행 파일·번들 규칙·URL·검사 설정을 전후 사용했다. 공식 배포 ZIP의 SHA-256을 릴리스 메타데이터와 대조했다. 버전과 lockfile 해시는 [environment.json](results/environment.json)에 기록했다.

## 개선 전후 통계

| 지표 | 개선 전 | 개선 후 | 변화 |
| --- | ---: | ---: | --- |
| 전체 의존성 영향 패키지 | 16 | 10 | 6개 감소, 37.5% |
| Critical | 0 | 0 | 동일 |
| High | 6 | 0 | 6개 감소, 100% |
| Moderate | 10 | 10 | 개발 도구 경로에 잔존 |
| Low | 0 | 0 | 동일 |
| 중복 제거 의존성 advisory | 26 | 1 | 25개 감소, 약 96.2% |
| 배포용 의존성 영향 패키지 | 2 | 0 | 2개 감소, 100% |
| 배포용 중복 제거 advisory | 15 | 0 | 15개 감소, 100% |
| ZAP Low 이상 경고 종류 | 3 | 2 | 순감소 1종, 약 33.3% |
| ZAP High | 0 | 0 | 동일 |
| ZAP Medium | 2 | 2 | 누락 경고 해소 후 정책 허용 범위 경고로 변경 |
| ZAP Low | 1 | 0 | MIME 추측 방어 누락 해소 |
| ZAP Informational | 1 | 1 | Modern Web Application, 취약점 통계 제외 |

**보안 위험 전체가 96.2% 감소했다는 의미가 아니다.** 96.2%는 이 시점의 의존성 advisory 개수 감소율이다. 실제 공격 가능성 및 사업 영향도에 대한 수치화는 수행하지 않았다.

집계 원본: [summary.json](results/summary.json). 전후 원본 JSON은 [results](results)에 함께 보관한다. 경고 필터/억제 설정으로 수를 줄이지 않았다.

## 의존성 개선 내용

| 패키지 | 개선 전 | 개선 후 | 목적 |
| --- | --- | --- | --- |
| axios | 1.19.0 | 1.21.0 | prototype pollution gadget, 요청 헤더·리다이렉트 처리 관련 공개 권고문 해소 |
| follow-redirects | 1.16.0 | 1.16.2 | 교차 출처 리다이렉트의 민감 헤더 처리 보완 |
| vite | 8.1.5 | 8.3.6 | 개발 서버의 파일 제공·에디터 실행 관련 권고문 해소 |
| brace-expansion | 5.0.9 | 5.0.12 | 비정상 중괄호 입력의 CPU·스택 소진 방어 |
| source-map-js | 1.2.1 | 1.2.2 | 비정상 source map 처리의 이벤트 루프 서비스 거부 방어 |
| zod | 4.4.3 | 4.6.7 | 큰 컬렉션 검증 시 메모리 소진 방어 |

`npm update`로 기존 범위 내에서 갱신했다. Vite에 필요한 Rolldown 및 플랫폼별 binding 등 전이 의존성도 함께 갱신됐다. 직접 의존성 Axios·Vite의 최소 버전을 패치 버전 이상으로 명시했다. `npm audit fix --force`, 주요 버전 강제 override, ESLint 강제 다운그레이드는 하지 않았다.

## 응답 헤더 개선 내용

| 개선 전 진단 | 적용한 방어 | 개선 후 |
| --- | --- | --- |
| CSP 미설정 (`10038-1`, Medium) | 스크립트 출처 제한, 인라인 스크립트/이벤트 핸들러 제한, object 차단, base/form 출처 제한 | 누락 경고 해소 |
| 클릭재킹 헤더 미설정 (`10020-1`, Medium) | `frame-ancestors 'none'` 및 `X-Frame-Options: DENY` | 누락 경고 해소 |
| MIME 보호 미설정 (`10021`, Low) | `X-Content-Type-Options: nosniff` | 누락 경고 해소 |

추가로 Referrer-Policy, 카메라·마이크·위치 권한 제한, HSTS를 설정했다. HSTS는 HTTPS에서만 유효하며 로컬 HTTP 검사로 실효성을 검증했다고 주장하지 않는다. `includeSubDomains`나 preload는 적용하지 않았다.

CSP 허용 출처는 현재 통합된 API 운영/개발 도메인, KLIPY API, YouTube oEmbed, Cloudflare Turnstile을 반영했다. iframe은 YouTube privacy-enhanced 임베드와 Turnstile로 제한하고 Monaco worker는 자체 출처와 blob을 허용했다. 이미지·미디어는 기존 사용자 콘텐츠를 보존하기 위해 HTTPS 외부 출처를 허용한다. 프로필 이미지 변환용 data/blob 접근도 유지한다.

## 검증 결과

- `npm run lint`: 통과.
- `npm run build`: 통과. 기존 500 kB 초과 청크 경고는 남아 있다.
- `npm run test:community`: 기존 회귀 테스트 **66개 통과**. 의존성 업데이트에 따른 커뮤니티·첨부파일·GIF·캐시 동작을 확인했다.
- production 모사 서버의 브라우저 smoke test: 홈, 달력, 커뮤니티 목록/작성, 타자연습, Monaco 코드 타자연습, 상점, 마이페이지 **8개 경로 통과**. 검사 중 예상하지 않은 CSP 위반·JavaScript 예외·외부 요청은 0건이었다.
- CSP 방어 확인 **4종 통과**: DOM에 추가한 인라인 스크립트 실행 차단, 인라인 이벤트 핸들러 차단, 비허용 출처 스크립트 차단, 다른 로컬 출처의 iframe 삽입 차단(`ERR_BLOCKED_BY_RESPONSE`).
- 브라우저 검증의 API는 모두 합성 응답이며 실제 계정/API를 호출하지 않았다. 네트워크 차단이 정책 차단으로 오인되지 않도록 iframe은 실제 별도 로컬 HTTP 서버를 사용했다. 결과: [browser-after.json](results/browser-after.json).
- 빈/합성 데이터로 수행한 smoke test이므로 실제 OAuth·Turnstile 성공, 모든 콘텐츠·업로드·결제 흐름의 통과를 의미하지 않는다. 기존 회귀 테스트의 개발 서버에는 운영 CSP가 적용되지 않으므로 CSP 검증 결과와 구분한다.

## 남은 경고 및 후속 확인

1. **개발 의존성 Moderate 10개 / advisory 1개**: `minimatch`의 [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249)가 ESLint와 typescript-eslint 경로에 전파된다. 현재 상위 의존성이 요구하는 10.x 범위를 벗어나는 11.x 강제 적용은 별도 호환성 검토가 필요하다. 배포 번들 경고는 아니지만 CI에서 신뢰할 수 없는 패턴을 처리하는 위험은 남는다.
2. **CSP Wildcard Directive (`10055-4`, Medium)**: `img-src`·`media-src`의 `https:` 허용. 임의 HTTPS 미디어 지원을 폐지하거나 업로드/CDN 출처를 확정한 뒤 허용 목록을 좁힐 수 있다. 이미지·미디어를 통한 외부 요청 위험이 남는다.
3. **CSP style-src unsafe-inline (`10055-6`, Medium)**: styled-components와 에디터·달력의 동적 스타일 및 인라인 스타일을 유지하기 위한 허용. 이를 제거하려면 nonce 공급과 스타일 생성 방식까지 별도 검토해야 한다. 스크립트에 `unsafe-inline`/`unsafe-eval`을 허용한 것은 아니다.
4. **진단 범위 밖**: 기존 localStorage 액세스 토큰 구조, 백엔드 인증/인가·CSRF·업로드 검증은 변경하지 않았다. XSS 발생 시 토큰 접근 위험이 사라지는 것은 아니며 서버 측 진단이 별도로 필요하다.
5. **운영 배포 후 확인**: 이 결과는 Vercel 배포 완료의 증거가 아니다. HTTPS 응답 헤더/HSTS, 실제 OAuth·Turnstile, API·CDN 출처 및 Vercel preview toolbar의 CSP 호환성을 배포 환경에서 확인해야 한다. 환경변수의 API 출처를 변경하면 CSP의 `connect-src`도 함께 갱신한다.
6. **도구 메시지**: ZAP은 업데이트 확인 이력과 Firefox profile 부재에 대한 시작 경고를 남겼다. 이 실행은 Firefox/client spider를 사용하지 않고 requestor·passive scan을 사용했으며, 11개 요청과 보고서 작업은 정상 완료했다. 규칙은 배포 ZIP에 포함된 버전에 고정했다.

## 재현 방법

Node/npm, Java, ZAP 2.17.0이 필요하다. 설치 파일: [공식 ZAP 릴리스](https://github.com/zaproxy/zaproxy/releases/tag/v2.17.0). OWASP 설명과 작업 종류는 [ZAP Automation Framework](https://www.zaproxy.org/docs/automate/automation-framework/), 의존성 검사는 [npm audit 문서](https://docs.npmjs.com/auditing-package-dependencies-for-security-vulnerabilities/)를 따른다.

프로젝트 루트에서 현재 버전을 검사한다:

```sh
npm ci
npm run build
node scripts/security/serve.mjs
```

다른 터미널에서:

```sh
node scripts/security/create-zap-plan.mjs /tmp/switch-security-recheck after
# 실제로 설치한 ZAP 경로를 사용한다.
bash /path/to/ZAP_2.17.0/zap.sh -cmd \
  -dir /tmp/switch-security-recheck/zap-home \
  -config autoupdate.checkOnStart=false \
  -autorun /tmp/switch-security-recheck/after.yaml
npm audit --json > /tmp/switch-security-recheck/npm-after.json
npm audit --omit=dev --json > /tmp/switch-security-recheck/npm-production-after.json
```

`npm audit`는 경고가 있으면 종료 코드 1을 반환하므로 두 명령을 `&&`로 연결하지 않는다. 네트워크 오류 JSON은 진단 0건으로 간주하지 않는다.

저장된 전후 결과를 다시 집계한다:

```sh
node scripts/security/compare.mjs docs/security/137/results
```

브라우저 검증은 위 진단 서버(4179, 4180)를 실행한 채 Playwright CLI로 수행한다. `VITE_API_BASE_URL=https://api.dev.louter.site`로 빌드한 결과를 가정하며, 실제 API 요청은 브라우저에서 가로채 합성 데이터로 응답한다.

```sh
npx --package @playwright/cli playwright-cli -s=security-check open about:blank
npx --package @playwright/cli playwright-cli -s=security-check run-code --filename scripts/security/browser-check.js
npx --package @playwright/cli playwright-cli -s=security-check close
```

개선 전을 새로 검사하려면 별도 체크아웃에서 기준 커밋 `bc7560d`의 `npm ci`·빌드를 사용하고, 위 진단 스크립트만 복사해 `before` 단계로 실행한다. 전후 비교 중 앱·헤더·규칙 이외의 환경을 바꾸지 않는다. npm advisory 데이터베이스는 계속 갱신되므로 이후 실행 결과가 기록된 숫자와 달라질 수 있다.
