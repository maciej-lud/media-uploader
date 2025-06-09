import React, { useEffect, useState, memo } from 'react';
import { Box, CardMedia, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface FilePreviewProps {
  file: File;
  index: number;
  onRemove: (index: number) => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({ file, index, onRemove }) => {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => {
      URL.revokeObjectURL(objectUrl);
      setUrl(null);
    };
  }, [file]);

  if (!url) return null;

  const isVideo = file.type.startsWith('video');

  return (
    <Box sx={{ position: 'relative', width: '100%', height: 150 }}>
      {isVideo ? (
        <Box component="video" src={url} height={150} sx={{ objectFit: 'cover', width: '100%' }} muted controls />
      ) : (
        <CardMedia
          component="img"
          src={url}
          alt={file.name}
          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )}
      <IconButton
        aria-label="Usuń media"
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          transform: 'translate(50%, -50%)',
          bgcolor: 'error.main',
          color: 'common.white',
          width: 24,
          height: 24,
          borderRadius: '50%',
          boxShadow: 2,
          '&:hover': { bgcolor: 'error.dark' },
        }}
        onClick={() => onRemove(index)}
      >
        <CloseIcon sx={{ fontSize: 16 }} />
      </IconButton>
    </Box>
  );
};

export default memo(FilePreview);
