import { useState } from 'react';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import ClearIcon from '@mui/icons-material/Clear';

function ClearButton({ onClick, ...props }: IconButtonProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Confirmar acción</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Se borrará toda la lista de productos perdiendo todo el trabajo
            realizado hasta el momento. ¿Esta seguro?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button
            onClick={(e) => {
              setOpen(false);
              onClick && onClick(e);
            }}
            autoFocus
          >
            Borrar
          </Button>
        </DialogActions>
      </Dialog>
      <Tooltip title="Borrar">
        <IconButton
          color="inherit"
          onClick={() => {
            setOpen(true);
          }}
        >
          <ClearIcon />
        </IconButton>
      </Tooltip>
    </>
  );
}

export default ClearButton;
