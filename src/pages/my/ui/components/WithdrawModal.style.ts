import styled from 'styled-components'

import * as token from '@/shared/styles/values/token'

const DialogButton = styled.button`
  ${token.flexCenter}
  flex: 1 1 0;
  min-width: 0;
  padding: 10px 20px;
  border-radius: ${token.shapes.small};
  line-height: 1;
  ${token.typography('body', 'md', 'medium')}
`

export const SecondaryButton = styled(DialogButton)`
  color: ${token.colors.gray.gray100};
  background: ${token.colors.gray.gray10};
`

export const PrimaryButton = styled(DialogButton)`
  color: ${token.colors.gray.gray100};
  background: ${token.colors.primary.primary50};

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export const DangerButton = styled(DialogButton)`
  color: ${token.colors.danger.danger20};
  background: ${token.colors.gray.gray10};
`

export const VerificationBody = styled.div`
  ${token.flexColumn}
  align-items: flex-start;
  width: fit-content;
  max-width: 100%;
  gap: 5px;
`

export const VerificationMeta = styled.div`
  ${token.flexBetween}
  width: 100%;
  ${token.typography('caption', 'lg', 'regular')}
`

export const ResendButton = styled.button`
  padding: 0;
  color: ${token.colors.gray.gray60};
  background: transparent;
  line-height: 1;
  ${token.typography('caption', 'lg', 'regular')}

  &:disabled {
    color: ${token.colors.gray.gray30};
    cursor: not-allowed;
  }
`

export const TimerText = styled.span`
  color: ${token.colors.danger.danger20};
  line-height: 1;
`
