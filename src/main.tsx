import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import MediaUploader from './components/MediaUploader/MediaUploader.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MediaUploader />
  </StrictMode>
);
