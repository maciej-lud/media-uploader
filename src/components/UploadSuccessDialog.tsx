import React from 'react';
import { Dialog, DialogTitle, DialogActions, Button } from '@mui/material';

interface UploadSuccessDialogProps {
  open: boolean;
  hasMultipleFiles: boolean;
  onClose: () => void;
}

const emoji = '\u2764\uFE0F';

const UploadSuccessDialog: React.FC<UploadSuccessDialogProps> = ({ open, hasMultipleFiles, onClose }) => {
  return (
    <Dialog open={open} maxWidth="xs" fullWidth onClose={onClose}>
      <DialogTitle>
        {`${hasMultipleFiles ? 'Pliki zostały przesłane' : 'Plik został przesłany'}. Dziękujemy! ${emoji}`}
      </DialogTitle>
      <DialogActions>
        <Button variant="contained" onClick={onClose}>
          Zamknij
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadSuccessDialog;
