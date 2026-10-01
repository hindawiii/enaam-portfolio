import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Disable caching for HTML so live edits appear immediately
app.use((req, res, next) => {
  if (req.path === '/' || req.path.endsWith('.html') || !req.path.includes('.')) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
  }
  next();
});

// High-performance static assets serving with caching headers
app.use('/images', express.static(path.join(__dirname, 'images'), {
  maxAge: '1d',
  etag: true,
  lastModified: true
}));

// Serve other static assets from root directory (excluding cached html)
app.use(express.static(__dirname, {
  etag: false,
  setHeaders: (res, pathUrl) => {
    if (pathUrl.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    }
  }
}));

// Fallback to index.html for client routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});
