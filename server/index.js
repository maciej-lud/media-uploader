import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const uploadDir = path.resolve(__dirname, process.env.UPLOAD_DIR || './media');

app.use(cors());

const upload = multer({ storage: multer.memoryStorage() });

async function createUniqueFolder(basePath, folderName) {
  let folderPath = path.join(basePath, folderName);
  let counter = 1;
  while (true) {
    try {
      await fs.access(folderPath);
      folderPath = path.join(basePath, `${folderName}(${counter})`);
      counter++;
    } catch {
      await fs.mkdir(folderPath, { recursive: true });
      return folderPath;
    }
  }
}

app.post('/upload', upload.array('files'), async (req, res) => {
  try {
    const name = req.body.name;
    const mediaDir = uploadDir;
    const isMedia = (mimetype) => mimetype.startsWith('image/') || mimetype.startsWith('video/');
    const invalidFiles = req.files.filter((file) => !isMedia(file.mimetype));
    if (invalidFiles.length > 0) return res.status(400).json({ error: 'Dozwolone są tylko zdjęcia i filmy.' });
    try {
      await fs.access(mediaDir);
    } catch {
      await fs.mkdir(mediaDir, { recursive: true });
    }
    const folderPath = await createUniqueFolder(mediaDir, name);
    const totalFiles = req.files.length;
    for (let i = 0; i < totalFiles; i++) {
      const file = req.files[i];
      const filePath = path.join(folderPath, file.originalname);
      await fs.writeFile(filePath, file.buffer);
    }
    res.json({ message: `Liczba przesłanych plików: ${totalFiles}.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Coś poszło nie tak podczas przesyłania plików.' });
  }
});

const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server działa na porcie ${PORT}`);
});
