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
    { key: 'mentoring', label: '멘토링' },
    { key: 'comment', label: '댓글' },
    { key: 'scheduleReminder', label: '일정 리마인드' },
  ],
  [
    { key: 'inApp', label: '인앱 알림' },
    { key: 'push', label: '푸시 알림' },
    { key: 'email', label: '메일 알림' },
  ],
]

interface DeleteNotificationModalProps {
  onCancel: () => void
  onConfirm: () => void
}

export function DeleteNotificationModal({
  onCancel,
  onConfirm,
}: DeleteNotificationModalProps) {
  const cancelButtonRef = useRef<HTMLButtonElement>(null)

  function handleOverlayClick(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) {
      onCancel()
    }
  }

  useEffect(() => {
    const previousOverflow = document.body.style.overflow

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
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
  }, [onCancel])

  return (
    <S.Overlay onClick={handleOverlayClick}>
      <S.DeleteDialog
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-notification-title"
      >
        <S.DeleteTitle id="delete-notification-title">
          선택한 알림을 삭제할까요?
        </S.DeleteTitle>
        <S.DeleteActions>
          <S.DeleteActionButton
            ref={cancelButtonRef}
            type="button"
            onClick={onCancel}
          >
            취소
          </S.DeleteActionButton>
          <S.DeleteActionButton type="button" $danger onClick={onConfirm}>
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
  onClose: () => void
  onToggle: (setting: NotificationSettingKey) => void
}

export function NotificationSettingsModal({
  closeIconUrl,
  settings,
  onClose,
  onToggle,
}: NotificationSettingsModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  function handleOverlayClick(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  useEffect(() => {
    const previousOverflow = document.body.style.overflow

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)
    closeButtonRef.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  return (
    <S.Overlay onClick={handleOverlayClick}>
      <S.SettingsDialog
        role="dialog"
        aria-modal="true"
        aria-labelledby="notification-settings-title"
      >
        <S.SettingsHeader>
          <S.SettingsTitle id="notification-settings-title">
            알림 설정
          </S.SettingsTitle>
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
                    onClick={() => onToggle(key)}
                  >
                    <S.ToggleThumb $enabled={isEnabled} />
                  </S.ToggleButton>
                </S.SettingRow>
              )
            })}
          </S.SettingsGroup>
        ))}
      </S.SettingsDialog>
    </S.Overlay>
  )
}
