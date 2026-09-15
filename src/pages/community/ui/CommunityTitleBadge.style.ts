import styled from 'styled-components';

import * as token from '@/shared/styles/values/token';

export const CommunityTitleBadge = styled.span`
  display: inline-flex;
  align-items: center;
  box-sizing: border-box;
  flex: 0 0 auto;
  min-width: 0;
  overflow: hidden;
  border: 1px solid ${token.colors.gray.gray20};
  border-radius: ${token.shapes.xsmall};
  color: ${token.colors.gray.gray70};
  background: ${token.colors.white};
  ${token.typography('caption', 'sm', 'medium')}
  line-height: 1;
  white-space: nowrap;

  svg {
    flex: 0 0 auto;
    color: ${token.colors.gray.gray60};
  }

  span {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;
