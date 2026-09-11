// v1 캘린더의 색상과 치수를 그대로 보존하는 전용 디자인 값입니다.
import { css } from "styled-components";
/**
 *
 * 예시:
 *   color: ${colors.text.black};
 *   background-color: ${colors.background.f5};
 */

export const colors = {
  main: {
    white: "#FFFFFF",
    black: "#000000",
    yellow: "#FFD600",

    normal: "#1B1E21",
    alternative: "#FFD600",
    assistive: "#FBE246",
  },

  accent: {
    primary: "#FFD600",
    secondary1: "#FFDE33",
    secondary2: "#FFE666",
    secondary3: "#FFEF99",
    secondary4: "#FFF7CC",

    assistive3: "#FDF3B8",
    assistive4: "#FEF9E0",
  },

  text: {
    white: "#FFFFFF",
    lightGray: "#B8B8B8",
    coolGray: "#8A95A0",
    dark: "#333333",
    black: "#000000",
    goldDark: "#D3AB00",
    gold: "#FFBB00",
    goldLight: "#FFD600",

    normal: "#333333",
    strong: "#15181B",
    neutral: "#727272",
    disabled: "#CACACA",
  },

  line: {
    light: "#EEEEEE",
    dark: "#333333",
    highlight: "#FFD600",

    normal: "#E2E4E1",
    neutral: "#F6F6F1",
  },

  fill: {
    white: "#FFFFFF",
    f5: "#F5F5F5",
    f3: "#F3F4F6",
    a0: "#A0A0A0",
    darkOverlay: "rgba(12, 16, 20, 0.7)",
    slate: "#4E5968",
    charcoal: "#2A2B2B",
    almostBlack: "#191A1A",
    black: "#000000",
    yellow: "#FFD600",

    normal: "#F0F0F0",
    neutral: "#EDEDED",
    alternative: "#BFBFBF",
    assistive: "#FFFFFF",
  },

  background: {
    white: "#FFFFFF",
    f5: "#F5F5F5",
    almostBlack: "#191A1A",
    yellow: "#FFD600",

    lightGray: "#FBFBFB",
  },

  state: {
    error: "#E23737",
    info: "#4B88CE",
    success: "#5DBC86",
    warning: "#FFD600",

    errorSoft: "#E25353",
    infoSoft: "#4E90DB",
    successSoft: "#2CC448",
    warningSoft: "#E19145",
  },

  calendar: {
    red: "#FC675F",
    blue: "#2CA4FB",
    black: "#191A1A",
  },
} as const;

export type colors = typeof colors;

/**
 * size, weight를 한 번에 적용할 수 있는 믹스인
 *
 * 예시:
 *   ${typography("body", "md", "semibold")};
 *   ${typography("caption", "sm", "medium")};
 */

export const fontFamily = {
  system: '"Pretendard", "Inter", "Noto Sans KR", system-ui, sans-serif',
} as const;

export const fontSize = {
  heading: {
    xxl: "2.25rem",
    xl: "2rem",
    lg: "1.75rem",
    md: "1.5rem",
    sm: "1.25rem",
  },
  body: {
    lg: "1.125rem",
    md: "1rem",
    sm: "0.875rem",
  },
  caption: {
    lg: "0.8125rem",
    md: "0.75rem",
    sm: "0.6875rem",
  },
} as const;

export const fontWeight = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;
/**
 * border-radius를 통일하기 위한 값들
 *
 * 예시:
 *   border-radius: ${shapes.large};
 *   border-radius: ${shapes.small};
 */

export const shapes = {
  xlarge: "20px",
  large: "16px",
  medium: "12px",
  small: "10px",
  xsmall: "8px",
} as const;

export type ShapeSize = keyof typeof shapes;

/**
 *
 * 예시:
 *   ${flexRow}
 *   ${flexCenter}
 */

// 수평 flex 컨테이너
export const flexRow = css`
  display: flex;
  flex-direction: row;
`;

// 수직 flex 컨테이너
export const flexColumn = css`
  display: flex;
  flex-direction: column;
`;

// 가운데 정렬
export const flexCenter = css`
  display: flex;
  align-items: center;
  justify-content: center;
`;

// 왼쪽 정렬
export const flexLeft = css`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

// 오른쪽 정렬
export const flexRight = css`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

// 양쪽 정렬
export const flexBetween = css`
  display: flex;
  justify-content: space-between;
`;

// 컬럼, 가운데 정렬
export const flexColumnCenter = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

// 컬럼, 왼쪽 위 정렬
export const flexColumnStart = css`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
`;


// 깊이 단계별 그림자
const elevations = {
  black_1: "0 1px 2px rgba(0, 0, 0, 0.05)",
  black_2: "0 2px 6px rgba(0, 0, 0, 0.08)",
  black_3: "0 4px 12px rgba(0, 0, 0, 0.12)",
  none: "none",
};

/**
 * 그림자 단계별로 쉽게 적용할 수 있는 믹스인
 *
 * @param level "black_1" | "black_2" | "black_3"
 *
 * 예시:
 *   ${elevation("black_1")}
 *   ${elevation("black_3")}
 */

export const elevation = (level: keyof typeof elevations) => {
  const shadow = elevations[level];

  if (!shadow) {
    console.warn(`Unknown elevation level: ${level}`);
    return css``;
  }

  return css`
    box-shadow: ${shadow};
  `;
};


type Type = keyof typeof fontSize;
type Weight = keyof typeof fontWeight;

export const typography = <T extends Type>(
  type: T,
  size: keyof typeof fontSize[T],
  weight: Weight
) => css`
  font-size: ${
    (fontSize[type] as Record<string, string>)[size as string]
  };
  font-weight: ${fontWeight[weight]};
  font-family: ${fontFamily.system};
`;
