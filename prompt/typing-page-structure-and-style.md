# 타자 연습 페이지 파일 구조 및 스타일 정리

## 사용자 프롬프트

타이핑 페이지 파일 구조 및 스타일 정리 작업을 별도 커밋으로 분리한다.

## 기존 상태

- 타자 연습 모드 상수가 공용 상수 디렉터리에 있어 페이지에 종속된 설정이라는 성격이 드러나지 않았다.
- `src/pages/typing/ui`와 `src/pages/typing/ui/TypingPage`에 같은 이름의 스타일 파일이 중복으로 존재했다.
- 실제 타자 연습 페이지 컨테이너가 임시 페이지 스타일의 `Container`를 상속하고 있었다.

## 작업 내용

- `src/shared/constants/typing.ts`의 `TYPING_MODES`를 `src/pages/typing/model/typingModes.ts`로 이동했다.
- `TypingPage`가 페이지 모델 경로에서 모드 설정을 가져오도록 import 경로를 변경했다.
- 사용되지 않는 `src/pages/typing/ui/TypingPage.style.ts`를 제거했다.
- 실제 `TypingPage.style.ts`의 컨테이너를 독립적인 `section`으로 변경하고 기존 디자인 토큰을 사용해 중앙 정렬, 배경색, 높이와 여백을 정의했다.

## 결과

- 타자 연습 페이지 전용 설정과 UI 파일의 위치가 역할에 맞게 정리되었다.
- 중복 스타일 파일과 임시 페이지 스타일 의존성이 제거되어 타자 연습 페이지가 자체 스타일만으로 렌더링된다.
- 기존 레이아웃과 디자인 토큰 사용 방식은 유지된다.
