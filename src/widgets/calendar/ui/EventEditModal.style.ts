import styled from "styled-components";
import * as paletteToken from "@/shared/styles/values/token";
import * as token from "../lib/calendarTokens";

export const Background = styled.div`
    position: fixed;
    inset: 0;
    padding: 16px;
    background-color: rgba(0, 0, 0, 0.5);
    ${token.flexCenter};
    z-index: 1100;
`

export const Container = styled.div`
    box-sizing: border-box;
    width: clamp(400px, 37vw, 640px);
    max-width: 100%;
    max-height: calc(100dvh - 32px);
    min-width: 0;
    overflow-y: auto;
    background-color: ${token.colors.background.white};
    border-radius: ${token.shapes.large};
    padding: clamp(20px, 3vw, 40px);
    gap: 13px;
    ${token.flexColumn};

    > * {
        flex-shrink: 0;
    }

    @media (max-width: 480px) {
        width: 100%;
    }
`

export const ModalTitle = styled.h2`
    ${token.typography('heading', 'md', 'semibold')};
    color: #181F29;
    margin-bottom: 25px;
`

export const ForRow = styled.div`
    ${token.flexBetween};
    width: 100%;
    align-items: flex-start;
    gap: 12px;

    @media (max-width: 480px) {
        flex-direction: column;
        gap: 6px;
    }
`

export const Name = styled.span`
    ${token.typography('body', 'md', 'medium')};
    color: ${token.colors.fill.slate};
    padding-top: 6px;
    white-space: nowrap;
    width: 90px;
    flex-shrink: 0;
`

export const ForColumn = styled.div`
    ${token.flexColumn}
    flex: 1;
    min-width: 0;
    width: 100%;

    @media (max-width: 480px) {
        flex: none;
    }
`

export const ForPosition = styled.div`
    position: relative;
    width: 100%;
`

export const Input = styled.input`
    border: 1px solid ${token.colors.line.light};
    width: 100%;
    height: 35px;
    border-radius: 5px;
    padding-left: 10px;
    ${token.typography('body', 'sm', 'medium')};

    &:focus {
        outline-color: ${token.colors.line.highlight}
    }

    &::placeholder {
        color: ${token.colors.text.coolGray}
    }
`

export const DateInput = styled(Input)<{ $hasError?: boolean }>`
    padding-left: 40px;
    border-color: ${props => props.$hasError ? '#ef4444' : token.colors.line.light};
    ${token.typography('body', 'sm', 'medium')};

    &:focus {
        outline-color: ${token.colors.line.highlight}
    }
`

export const CalendarIconWrapper = styled.div`
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    font-size: 20px;
    display: flex;
    align-items: center;
`

export const HiddenDateInput = styled.input`
    opacity: 0;
    position: absolute;
    right: 12px;
    top: 50%;
`

export const ErrorMessage = styled.span`
    font-size: 12px;
    color: #ef4444;
    margin-top: 4px;
`

export const LetterCount = styled.span`
    font-size: 13px;
    align-self: flex-end;
`

export const ColorContainer = styled.div`
    flex: 1;
    width: 100%;
    height: 20px;
    align-self: flex-start;
    ${token.flexRow}
    gap: 10px;

    @media (max-width: 480px) {
        flex: none;
    }
`

export const Color = styled.div`
    height: 20px;
    width: 20px;
    border-radius: 50%;
`

export const TextArea = styled.textarea`
    border: 1px solid ${token.colors.line.light};
    width: 100%;
    min-height: 35px;
    height: 70px;
    border-radius: 5px;
    padding: 8px 10px;
    resize: vertical;
    font-family: inherit;
    font-size: inherit;
    line-height: 1.5;
    overflow-y: scroll;
    resize: none;
    ${token.typography('body', 'sm', 'medium')};

    &:focus {
        outline-color: ${token.colors.line.highlight}
    }

    &::placeholder {
        color: ${token.colors.text.coolGray}
    }
`

export const Buttons = styled.div`
    width: 100%;
    min-height: 35px;
    flex-shrink: 0;
    margin-top: 20px;
    ${token.flexRight};
    gap: clamp(8px, 2vw, 20px);
`

export const CancelButton = styled.button`
    height: 35px;
    min-width: 70px;
    width: 100px;
    background-color: ${token.colors.background.white};
    border: 1px solid ${token.colors.line.normal};
    border-radius: 4px;
    ${token.typography('body', 'sm', 'bold')};
    color: ${token.colors.text.dark};
`

export const ConfirmButton = styled.button<{ $isValid: boolean }>`
    height: 35px;
    min-width: 70px;
    width: 100px;
    background-color: ${paletteToken.colors.primary.primary50};
    border: 1px solid ${paletteToken.colors.primary.primary50};
    border-radius: 4px;
    ${token.typography('body', 'sm', 'bold')};
    color: ${paletteToken.colors.primary.foreground};
    opacity: ${({ $isValid }) => $isValid ? 1 : 0.5};
    cursor: ${({ $isValid }) => $isValid ? 'pointer' : 'not-allowed'};
`

export const DeleteButton = styled.button`
    height: 35px;
    min-width: 70px;
    width: 100px;
    background-color: ${token.colors.calendar.red};
    border: 1px solid ${token.colors.calendar.red};
    border-radius: 4px;
    ${token.typography('body', 'sm', 'bold')};
    color: ${token.colors.text.white};
    margin-right: auto;
`
