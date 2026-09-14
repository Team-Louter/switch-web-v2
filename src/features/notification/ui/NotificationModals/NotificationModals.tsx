import { useEffect, useRef } from 'react'
import type { MouseEvent } from 'react'

import type {
  NotificationSettingKey,
  NotificationSettings,
} from '../../model/types'
import * as S from './NotificationModals.style'

interface NotificationSettingOption {
  key: NotificationSettingKey
  label: string
}

const NOTIFICATION_SETTING_GROUPS: NotificationSettingOption[][] = [
  [
    { key: 'mentoringEnabled', label: '멘토링' },
    { key: 'commentEnabled', label: '댓글' },
    { key: 'scheduleEnabled', label: '일정 리마인드' },
  ],
  [
    { key: 'inAppEnabled', label: '인앱 알림' },
    { key: 'pushEnabled', label: '푸시 알림' },
    { key: 'emailEnabled', label: '메일 알림' },
  ],
]

interface DeleteNotificationModalProps {
  isDeleting?: boolean
  onCancel: () => void
  onConfirm: () => void
}

export function DeleteNotificationModal({
  isDeleting = false,
  onCancel,
  onConfirm,
}: DeleteNotificationModalProps) {
  const cancelButtonRef = useRef<HTMLButtonElement>(null)

  function handleOverlayClick(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget && !isDeleting) {
      onCancel()
    }
  }

  useEffect(() => {
    const previousOverflow = document.body.style.overflow

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && !isDeleting) {
        onCancel()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)
    cancelButtonRef.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isDeleting, onCancel])

  return (
    <S.Overlay onClick={handleOverlayClick}>
      <S.DeleteDialog
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-notification-title"
        aria-busy={isDeleting}
      >
        <S.DeleteTitle id="delete-notification-title">
          선택한 알림을 삭제할까요?
        </S.DeleteTitle>
        <S.DeleteActions>
          <S.DeleteActionButton
            ref={cancelButtonRef}
            type="button"
            disabled={isDeleting}
            onClick={onCancel}
          >
            취소
          </S.DeleteActionButton>
          <S.DeleteActionButton
            type="button"
            $danger
            disabled={isDeleting}
            onClick={onConfirm}
          >
            삭제
          </S.DeleteActionButton>
        </S.DeleteActions>
      </S.DeleteDialog>
    </S.Overlay>
  )
}

interface NotificationSettingsModalProps {
  closeIconUrl: string
  settings: NotificationSettings
  errorMessage?: string
  isUpdating?: boolean
  onClose: () => void
  onToggle: (setting: NotificationSettingKey) => void
}

export function NotificationSettingsModal({
  closeIconUrl,
  settings,
  errorMessage,
  isUpdating = false,
  onClose,
  onToggle,
}: NotificationSettingsModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const settingsPopoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const previouslyFocusedElement = document.activeElement as HTMLElement | null

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    function handlePointerDown(event: PointerEvent) {
      const settingsAnchor = settingsPopoverRef.current?.parentElement

      if (
        event.target instanceof Node &&
        !settingsPopoverRef.current?.contains(event.target) &&
        !settingsAnchor?.contains(event.target)
      ) {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    document.addEventListener('pointerdown', handlePointerDown)
    closeButtonRef.current?.focus()

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('pointerdown', handlePointerDown)
      previouslyFocusedElement?.focus()
    }
  }, [onClose])

  return (
    <S.SettingsPopover
      ref={settingsPopoverRef}
      role="dialog"
      aria-label="알림 설정"
      aria-busy={isUpdating}
    >
      <S.SettingsContent>
        <S.SettingsHeader>
          <S.SettingsTitle>알림 설정</S.SettingsTitle>
          <S.CloseButton
            ref={closeButtonRef}
            type="button"
            aria-label="알림 설정 닫기"
            onClick={onClose}
          >
            <S.CloseIcon src={closeIconUrl} alt="" />
          </S.CloseButton>
        </S.SettingsHeader>

        {NOTIFICATION_SETTING_GROUPS.map((group, groupIndex) => (
          <S.SettingsGroup key={groupIndex}>
            {group.map(({ key, label }) => {
              const isEnabled = settings[key]

              return (
                <S.SettingRow key={key}>
                  <S.SettingLabel>{label}</S.SettingLabel>
                  <S.ToggleButton
                    type="button"
                    role="switch"
                    aria-checked={isEnabled}
                    aria-label={`${label} ${isEnabled ? '끄기' : '켜기'}`}
                    $enabled={isEnabled}
                    disabled={isUpdating}
                    onClick={() => onToggle(key)}
                  >
                    <S.ToggleThumb $enabled={isEnabled} />
                  </S.ToggleButton>
                </S.SettingRow>
              )
            })}
          </S.SettingsGroup>
        ))}

        {errorMessage && (
          <S.SettingsError role="alert">{errorMessage}</S.SettingsError>
        )}
      </S.SettingsContent>
    </S.SettingsPopover>
  )
}
