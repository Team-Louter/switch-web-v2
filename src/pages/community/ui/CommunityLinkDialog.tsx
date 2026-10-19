import { type FormEvent, useCallback, useEffect, useRef, useState } from 'react';

import { Button, Modal } from '@/shared/ui';

import * as S from './CommunityLinkDialog.style';

interface CommunityLinkDialogProps {
  initialUrl: string;
  initialText: string;
  onApply: (url: string, text: string) => void;
  onRemove?: () => void;
  onClose: () => void;
}

export function CommunityLinkDialog({
  initialUrl,
  initialText,
  onApply,
  onRemove,
  onClose,
}: CommunityLinkDialogProps) {
  const urlInputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState(initialUrl);
  const [text, setText] = useState(initialText);
  const [error, setError] = useState('');
  const [isClosing, setIsClosing] = useState(false);
  const requestClose = useCallback(() => setIsClosing(true), []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isClosing) return;
    const value = url.trim();
    try {
      const parsed = new URL(value);
      if (
        !['https:', 'http:', 'mailto:', 'tel:'].includes(parsed.protocol) ||
        (!parsed.pathname && !parsed.hostname)
      ) {
        throw new Error('Unsupported link');
      }
    } catch {
      setError('http://, https://, mailto: 또는 tel:로 시작하는 올바른 주소를 입력해주세요.');
      return;
    }
    onApply(value, text.trim() ? text : '');
    requestClose();
  };

  const handleRemove = () => {
    if (isClosing) return;
    onRemove?.();
    requestClose();
  };

  useEffect(() => {
    urlInputRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      requestClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [requestClose]);

  useEffect(() => {
    if (!isClosing) return;
    const delay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 180;
    const timeout = window.setTimeout(onClose, delay);
    return () => window.clearTimeout(timeout);
  }, [isClosing, onClose]);

  return (
    <Modal
      label={onRemove ? '링크 수정' : '링크 삽입'}
      width={300}
      placement="bottom-right"
      isClosing={isClosing}
      onClose={requestClose}
    >
      <S.Form onSubmit={handleSubmit}>
        <S.Title>{onRemove ? '링크 수정' : '링크 삽입'}</S.Title>
        <S.Field>
          링크 주소
          <S.Input
            ref={urlInputRef}
            value={url}
            placeholder="https://example.com"
            autoComplete="off"
            spellCheck={false}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'community-link-error' : undefined}
            disabled={isClosing}
            onChange={(event) => {
              setUrl(event.target.value);
              setError('');
            }}
          />
        </S.Field>
        <S.Field>
          표시할 문구
          <S.Input
            value={text}
            placeholder="비워두면 주소를 표시합니다"
            disabled={isClosing}
            onChange={(event) => setText(event.target.value)}
          />
        </S.Field>
        {error && <S.Error id="community-link-error" role="alert">{error}</S.Error>}
        <S.Actions>
          {onRemove && <Button variant="text" onClick={handleRemove} disabled={isClosing}>링크 해제</Button>}
          <Button variant="line" onClick={requestClose} disabled={isClosing}>취소</Button>
          <Button type="submit" disabled={isClosing}>{onRemove ? '수정' : '삽입'}</Button>
        </S.Actions>
      </S.Form>
    </Modal>
  );
}
