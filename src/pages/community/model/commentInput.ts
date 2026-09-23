const MAX_COMMENT_INPUT_HEIGHT = 120;

export function resizeCommunityTextarea(
  textarea: HTMLTextAreaElement | null,
): void {
  if (!textarea) {
    return;
  }

  textarea.style.height = 'auto';
  textarea.style.height = `${Math.min(
    textarea.scrollHeight,
    MAX_COMMENT_INPUT_HEIGHT,
  )}px`;
}
