import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

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
    const dataDir = path.join(__dirname, './data');
    try {
      await fs.access(dataDir);
    } catch {
      await fs.mkdir(dataDir, { recursive: true });
    }
    const folderPath = await createUniqueFolder(dataDir, name);
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

const distPath = path.join(__dirname, './dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server działa na porcie ${PORT}`);
});
