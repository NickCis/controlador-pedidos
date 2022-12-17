import * as React from 'react';
import { styled } from '@mui/material/styles';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions, { DialogActionsProps } from '@mui/material/DialogActions';
import DialogContent, { DialogContentProps } from '@mui/material/DialogContent';
import DialogTitle, { DialogTitleProps } from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const StyledDialog = styled(Dialog)(({ theme }) => ({
  zIndex: theme.zIndex.modal + 1,
  '& .MuiDialog-container': {
    alignItems: 'flex-end',
  },
  '& .MuiDialog-paper': {
    margin: 0,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    width: '100%',
  },
}));

export type BottomSheetProps = DialogProps;

export interface BottomSheetTitleProps extends DialogTitleProps {
  onClose?: DialogProps['onClose'];
}

export function BottomSheetTitle({
  onClose,
  children,
  sx,
  ...props
}: BottomSheetTitleProps) {
  return (
    <DialogTitle
      sx={{ position: 'relative', typography: 'subtitle1', ...sx }}
      {...props}
    >
      {children}
      {onClose && (
        <IconButton
          onClick={(e) => onClose(e, 'backdropClick')}
          sx={{ position: 'absolute', top: 12, right: 12 }}
        >
          <ExpandMoreIcon />
        </IconButton>
      )}
    </DialogTitle>
  );
}

export type BottomSheetContentProps = DialogContentProps;
export function BottomSheetContent({ sx, ...props }: BottomSheetContentProps) {
  return (
    <DialogContent dividers sx={{ borderBottom: 'none', ...sx }} {...props} />
  );
}
export type BottomSheetActionsProps = DialogActionsProps;
export function BottomSheetActions({ sx, ...props }: BottomSheetActionsProps) {
  return (
    <DialogActions sx={{ justifyContent: 'center', mb: 1, ...sx }} {...props} />
  );
}

function BottomSheet(props: BottomSheetProps) {
  return <StyledDialog TransitionComponent={Transition} {...props} />;
}

export default BottomSheet;
