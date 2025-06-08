import { useState, useCallback, useEffect, useRef } from 'react';
import { Container, Box, Stack, Button, TextField, Typography } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FilePreview from './FilePreview';
import UploadDialog from './UploadDialog';
import UploadSuccessDialog from './UploadSuccessDialog';

const emoji = '\u{1F60A}';

const MediaUploader: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleFilesChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const filesList = e.target.files;
      if (!filesList) return;
      const newFiles = Array.from(filesList).filter(
        (file) =>
          !files.find(
            (existingFile) => existingFile.name === file.name && existingFile.lastModified === file.lastModified
          )
      );
      if (newFiles.length) setFiles((prev) => [...prev, ...newFiles]);
      e.target.value = '';
    },
    [files]
  );

  const handleRemoveFile = useCallback(
    (index: number) => setFiles((prev) => [...prev.slice(0, index), ...prev.slice(index + 1)]),
    []
  );

  const handleCloseUploadSuccessDialog = () => {
    setIsSuccessDialogOpen(false);
    setFiles([]);
  };

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!files.length) return;

      setIsUploading(true);

      const formData = new FormData();
      formData.append('name', name.trim() || 'Anonim');
      files.forEach((file, idx) => formData.append(`files[${idx}]`, file));
      console.log('FormData prepared:', formData);

      intervalRef.current = setInterval(() => {
        setUploadProgress((prev) => {
          const next = prev + 5;
          if (next >= 100) {
            clearInterval(intervalRef.current!);
            setTimeout(() => {
              setIsUploading(false);
              setIsSuccessDialogOpen(true);
              setUploadProgress(0);
            }, 1000);
          }
          return Math.min(next, 100);
        });
      }, 200);
    },
    [name, files]
  );

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <Container maxWidth="sm" sx={{ mt: 3, mb: 20 }}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
        Podziel się wspomnieniami {emoji}
      </Typography>
      <Box component="form" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            id="name"
            name="name"
            label="Imię (opcjonalnie)"
            value={name}
            size="small"
            variant="outlined"
            fullWidth
            onChange={(e) => setName(e.target.value)}
          />
          <Button component="label" variant="outlined" startIcon={<AddPhotoAlternateIcon />}>
            Wybierz pliki
            <input type="file" accept="image/*,video/*" multiple hidden onChange={handleFilesChange} />
          </Button>
          {files.length > 0 && (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                },
                gap: 2,
              }}
            >
              {files.map((file, index) => (
                <FilePreview
                  key={`${file.name}-${file.lastModified}`}
                  file={file}
                  index={index}
                  onRemove={handleRemoveFile}
                />
              ))}
            </Box>
          )}
          <Button type="submit" variant="contained" disabled={!files.length} startIcon={<CloudUploadIcon />}>
            Wyślij
          </Button>
        </Stack>
      </Box>
      <UploadDialog open={isUploading} progress={uploadProgress} hasMultipleFiles={files.length > 1} />
      <UploadSuccessDialog
        open={isSuccessDialogOpen}
        hasMultipleFiles={files.length > 1}
        onClose={handleCloseUploadSuccessDialog}
      />
    </Container>
  );
};

export default MediaUploader;
