import React from 'react';
import { Dialog, DialogTitle, DialogActions, Button } from '@mui/material';

interface ErrorDialogProps {
  open: boolean;
  hasMultipleFiles: boolean;
  onClose: () => void;
}

const emoji = '\u{1F622}';

const ErrorDialog: React.FC<ErrorDialogProps> = ({ open, hasMultipleFiles, onClose }) => {
  return (
    <Dialog open={open} maxWidth="xs" fullWidth onClose={onClose}>
      <DialogTitle>
        {`Ups.. coś poszło nie tak podczas przesyłania ${
          hasMultipleFiles ? 'plików' : 'pliku'
        } ${emoji} Spróbuj ponownie!`}
      </DialogTitle>
      <DialogActions>
        <Button variant="contained" color="error" onClick={onClose}>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ErrorDialog;
