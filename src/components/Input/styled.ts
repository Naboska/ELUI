import styled, { DefaultTheme, css } from 'styled-components';

import { TStyledComponentsProps, getComponentStyle, normalizeMixin } from 'lib';
import { FieldMessage } from 'internal';

import type { TInputValidate } from './types';

type TInputWrapper = {
  theme: DefaultTheme;
  validate: TInputValidate;
  isFocused: boolean;
  isDisabled: boolean;
};

export const StyledInputBox = styled.div<{ boxStyle?: TStyledComponentsProps }>`
  ${normalizeMixin};

  width: 100%;
  padding-bottom: 24px;

  ${({ theme, boxStyle }) => getComponentStyle(boxStyle, { theme })}
`;

const getInputStyle = ({ theme, isFocused, isDisabled, validate }: TInputWrapper) => {
  if (isDisabled)
    return css`
      background-color: ${({ theme }) => theme.palette.grey_100};
      border-color: ${theme.palette.grey_100};
      color: ${theme.palette.grey_400};
      pointer-events: none;

      input {
        ::-webkit-input-placeholder {
          color: ${theme.palette.grey_400};
        }
      }
    `;

  if (isFocused)
    return css`
      background-color: ${({ theme }) => theme.palette.white};
      border-color: ${theme.palette.primary_700};
      color: ${theme.palette.grey_900};
    `;

  const hoverMixin = css`
    &:hover {
      background-color: ${({ theme }) => theme.palette.white};
      border-color: ${theme.palette.primary_100};
    }
  `;

  if (validate === false)
    return css`
      background-color: ${({ theme }) => theme.palette.white};
      border-color: ${theme.palette.error};
      color: ${theme.palette.grey_900};

      ${hoverMixin}
    `;

  if (validate === true)
    return css`
      background-color: ${({ theme }) => theme.palette.white};
      border-color: ${theme.palette.success};
      color: ${theme.palette.grey_900};

      ${hoverMixin}
    `;

  return css`
    background-color: ${({ theme }) => theme.palette.grey_200};
    border-color: ${theme.palette.grey_200};
    color: ${theme.palette.grey_900};

    input {
      ::-webkit-input-placeholder {
        color: ${theme.palette.grey_700};
      }
    }

    ${hoverMixin}
  `;
};

export const StyledInputWrapper = styled.div<TInputWrapper>`
  display: flex;
  width: 100%;
  height: 48px;
  padding: 12px 16px;
  border-radius: 8px;
  border: 4px solid transparent;
  overflow: hidden;
  transition-property: background-color, border-color, color;
  transition-duration: 0.3s;
  transition-timing-function: ease-out;

  ${getInputStyle};
`;

export const StyledLeftSlot = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-right: 16px;
`;

export const StyledInput = styled.input`
  flex: 1;
  min-width: 1px;
  height: 24px;
  margin-top: -4px;
  border: none;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.5px;
  background-color: transparent;
  color: inherit;
  cursor: inherit;

  &:focus {
    outline: none;
  }
`;

export const StyledValidateMessage = styled(FieldMessage)<{ validate: boolean }>`
  color: ${({ theme, validate }) => (validate ? theme.palette.success : theme.palette.error)};
`;
