# 커뮤니티 사이트 링크 미리보기

게시글 본문에서 URL만 있는 문단은 사이트 제목·설명·이미지 카드로 표시합니다.
YouTube 링크는 기존 제목 조회와 클릭 재생을 그대로 사용합니다.

## 조회 흐름

`CommunityPostBlockContent` → 동일 출처 `GET /api/link-preview?url=...` → 공개 사이트 HTML 조회

- Vercel은 `api/link-preview.ts`를 Node.js Function으로 배포합니다. Java 백엔드나 외부 미리보기 서비스 설정은 필요하지 않습니다.
- `npm run dev`에서도 Vite middleware가 같은 핸들러를 실행합니다.
- 서버 구현과 HTML 파서·IP 검사 라이브러리는 브라우저 번들에 포함되지 않습니다.
- Vercel의 SPA rewrite보다 `/api/link-preview` 경로를 먼저 처리합니다.

## 표시 규칙

- Open Graph → Twitter 메타태그 → HTML 제목·설명 → 도메인 순서로 사용합니다.
- `twitter:card`가 `summary_large_image` 또는 `photo`이면 이미지가 텍스트 아래에 표시됩니다. 그 외에는 우측 썸네일로 표시합니다.
- 상대 이미지 주소는 최종 페이지 URL을 기준으로 해석합니다. 이미지는 HTTPS 주소만 사용합니다.
- 사이트 조회 실패 시 도메인과 원본 링크를 유지합니다. 이미지 로딩 실패 시 이미지 영역만 제거합니다.

## 요청 제한과 캐시

- HTTP/HTTPS 기본 포트만 허용하며 URL은 최대 2,048자입니다.
- 사용자 정보가 포함된 URL, 로컬 호스트, 사설·예약 IP는 차단합니다.
- DNS 응답의 모든 IP를 검사하고 검사한 IP로 연결합니다. 리다이렉트도 같은 검사를 거치며 최대 3회 허용합니다.
- 전체 조회의 HTTP 요청 제한은 8초, 각 DNS 조회는 2초입니다. Vercel Function 실행 한도는 10초입니다.
- HTML 응답은 최대 1 MiB입니다. 압축되지 않은 HTML을 요청하며 예상하지 않은 압축 응답은 거부합니다.
- 원본 사이트에는 사용자 인증 토큰이나 쿠키를 전달하지 않습니다.
- 브라우저의 미리보기 요청도 인증 인터셉터를 거치지 않는 `fetch`와 `credentials: 'omit'`을 사용합니다. 로그인 상태에서도 Authorization·Cookie를 보내지 않아 CDN 캐시를 사용할 수 있으며, 조회 실패는 로그인 상태에 영향을 주지 않습니다.
- 성공 응답은 Vercel CDN에서 URL 쿼리를 포함한 요청별로 30분 캐시합니다. 오류 응답은 캐시하지 않습니다.

## 지원 범위

HTML에 포함된 메타태그만 읽습니다. JavaScript 실행, oEmbed, 스크린샷 생성, 이미지 프록시는 제공하지 않습니다.
봇 접근을 차단하거나 로그인해야 볼 수 있는 사이트는 원본 링크 카드로 표시될 수 있습니다.
이미지는 브라우저가 원본 서버에서 직접 읽으며 Referer는 보내지 않습니다.
이 엔드포인트는 공개 조회용이며 트래픽 증가 시 Vercel 사용량과 방화벽 제한을 함께 점검해야 합니다.

## 검증

```sh
npm run test:link-preview
npm run test:community
npm run lint
npm run build
```

서버 테스트는 TypeScript 직접 실행을 지원하는 Node.js 22.6 이상이 필요합니다.
Vercel 배포 후에는 실제 도메인에서 `/api/link-preview`가 HTML 대신 JSON을 반환하는지와 캐시 헤더를 확인합니다.
