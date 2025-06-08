import React from 'react';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import LinearProgressWithLabel from './LinearProgressWithLabel';

interface UploadDialogProps {
  open: boolean;
  hasMultipleFiles: boolean;
  progress: number;
}

const UploadDialog: React.FC<UploadDialogProps> = ({ open, hasMultipleFiles, progress }) => {
  return (
    <Dialog open={open} maxWidth="xs" fullWidth>
      <DialogTitle>{`Trwa przesyłanie ${hasMultipleFiles ? 'plików' : 'pliku'}...`}</DialogTitle>
      <DialogContent>
        <LinearProgressWithLabel value={progress} />
      </DialogContent>
    </Dialog>
  );
};

export default UploadDialog;
