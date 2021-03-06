import styled from 'styled-components';

import { useToggle, useUpdateEffect } from 'lib/hooks';
import { Button } from 'components/Button';
import { Typography } from 'components/Typography';

import type { TDialog } from './types';
import { Dialog } from './Dialog';
import { dialog } from './utils';

export default {
  title: 'ui/Dialog',
  component: Dialog,
  argTypes: {
    boxStyle: { control: { type: null } },
    headerStyle: { control: { type: null } },
    bodyStyle: { control: { type: null } },
    footerStyle: { control: { type: null } },
    header: { control: 'text' },
    footer: { control: 'text' },
    variant: { options: ['modal', 'bottom-sheet'], control: { type: 'radio' } },
  },
  args: {
    isOpen: true,
    withOverlay: true,
    withHeader: true,
    zIndex: 20,
    variant: 'modal',
    className: '',
    name: 'test',
    header: 'Title of Modal',
    footer: '',
  },
};

export const Default = (args: TDialog) => {
  const [isVisible, onToggle] = useToggle(args.isOpen);

  useUpdateEffect(() => {
    onToggle(args.isOpen);
  }, [args.isOpen]);

  return (
    <StyledBox>
      <Button onClick={onToggle}>Open dialog</Button>
      <Dialog
        {...args}
        isOpen={isVisible}
        footer={args.footer || <Button buttonStyle={{ marginLeft: 'auto' }}>Button</Button>}
        onAfterVisibleChange={onToggle}
        onClose={event => {
          dialog.hide(args.name ?? 'test');
          args.onClose(event);
        }}
      >
        <StyledContentBox>
          <Typography>Content</Typography>
        </StyledContentBox>
      </Dialog>
    </StyledBox>
  );
};

const StyledBox = styled.div`
  width: 100%;
  padding: 16px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.palette.white};
  box-shadow: 0 0 8px ${({ theme }) => theme.palette.grey_300};
`;

const StyledContentBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 100px;
  border: 1px dashed ${({ theme }) => theme.palette.primary_700};
  border-radius: 4px;
  background-color: ${({ theme }) => theme.palette.primary_50};
  color: ${({ theme }) => theme.palette.primary_700};
`;
