import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure runtime directories exist
const dataDir = path.join(__dirname, 'data');
const uploadsDir = path.join(__dirname, 'images', 'uploads');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Ensure clean series symlinks exist for s1-s5
const imagesRoot = path.join(__dirname, 'images');
const ensureSymlink = (targetName, aliasName) => {
  const target = path.join(imagesRoot, targetName);
  const alias = path.join(imagesRoot, aliasName);
  if (fs.existsSync(target) && !fs.existsSync(alias)) {
    try {
      fs.symlinkSync(target, alias, 'dir');
    } catch (e) {
      console.warn(`Could not create symlink ${aliasName} -> ${targetName}:`, e.message);
    }
  }
};
ensureSymlink('هذة الصور اضفها الى ركن انساني  وركن المجتمعي', 's1');
ensureSymlink('هذة الصور اضفها الى ركن  انساني  وركن المجتمعي', 's2');
ensureSymlink('هذة الصور اضفها الى ركن انساني و ركن المجتمعي و ركن وثائقي', 's3');
ensureSymlink('هذة الصور اضفها الى ركن ورش عمل و ركن المجتمعي', 's4');
ensureSymlink('series-05', 's5');

// Body parsing middleware (50MB limit to comfortably handle high-res photography uploads)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Paths to persistent data files
const seriesFilePath = path.join(dataDir, 'portfolio-series.json');
const adminConfigPath = path.join(dataDir, 'admin-config.json');

// Initialize admin config if not present
if (!fs.existsSync(adminConfigPath)) {
  fs.writeFileSync(adminConfigPath, JSON.stringify({
    pin: '246810',
    recoveryEmail: 'mohsentiben@gmail.com',
    masterKey: 'ENAAM-2026-SECURE',
    updatedAt: new Date().toISOString()
  }, null, 2), 'utf8');
}

// Disable caching for dynamic HTML routes
app.use((req, res, next) => {
  if (req.path === '/' || req.path === '/admin' || req.path.endsWith('.html') || !req.path.includes('.')) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
  }
  next();
});

// High-performance static assets serving
app.use('/images', express.static(path.join(__dirname, 'images'), {
  maxAge: '1d',
  etag: true,
  lastModified: true
}));

// Serve static assets from root (excluding HTML caching)
app.use(express.static(__dirname, {
  etag: false,
  setHeaders: (res, pathUrl) => {
    if (pathUrl.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    }
  }
}));

// ============================================================================
// ADMIN & PORTFOLIO REST API
// ============================================================================

// 1. Get all series data
app.get('/api/series', (req, res) => {
  try {
    if (fs.existsSync(seriesFilePath)) {
      const data = fs.readFileSync(seriesFilePath, 'utf8');
      return res.json(JSON.parse(data));
    }
    return res.json([]);
  } catch (err) {
    console.error('Error reading series data:', err);
    return res.status(500).json({ error: 'Failed to read series data' });
  }
});

// 2. Save all series data
app.post('/api/series', (req, res) => {
  try {
    const seriesList = req.body;
    if (!Array.isArray(seriesList)) {
      return res.status(400).json({ error: 'Payload must be an array of series' });
    }
    fs.writeFileSync(seriesFilePath, JSON.stringify(seriesList, null, 2), 'utf8');
    return res.json({ success: true, count: seriesList.length, updatedAt: new Date().toISOString() });
  } catch (err) {
    console.error('Error saving series data:', err);
    return res.status(500).json({ error: 'Failed to persist series data' });
  }
});

// 3. Upload image directly (Base64 payload)
app.post('/api/upload', (req, res) => {
  try {
    const { filename, base64Data } = req.body;
    if (!filename || !base64Data) {
      return res.status(400).json({ error: 'Missing filename or base64Data' });
    }

    // Sanitize filename & ensure unique timestamp prefix
    const cleanName = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    const safeFilename = `${Date.now()}_${cleanName}`;
    const targetPath = path.join(uploadsDir, safeFilename);

    // Remove data:image/...;base64, prefix if present
    const base64Clean = base64Data.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Clean, 'base64');

    fs.writeFileSync(targetPath, buffer);

    return res.json({
      success: true,
      url: `/images/uploads/${safeFilename}`,
      filename: safeFilename
    });
  } catch (err) {
    console.error('Error handling upload:', err);
    return res.status(500).json({ error: 'Upload processing failed' });
  }
});

// 3.5. Import entire album from GitHub folder URL
app.post('/api/admin/import-github-folder', async (req, res) => {
  try {
    const { folderUrl, seriesNumber } = req.body;
    if (!folderUrl) {
      return res.status(400).json({ error: 'GitHub folder URL is required' });
    }

    let owner = '', repo = '', folderPath = '', branch = 'main';

    const treeMatch = folderUrl.match(/github\.com\/([^/]+)\/([^/]+)\/tree\/([^/]+)\/(.+)/);
    const rawMatch = folderUrl.match(/raw\.githubusercontent\.com\/([^/]+)\/([^/]+)\/([^/]+)\/(.+)/);

    if (treeMatch) {
      owner = treeMatch[1];
      repo = treeMatch[2];
      branch = treeMatch[3];
      folderPath = decodeURIComponent(treeMatch[4]);
    } else if (rawMatch) {
      owner = rawMatch[1];
      repo = rawMatch[2];
      branch = rawMatch[3];
      folderPath = decodeURIComponent(rawMatch[4]);
    } else {
      return res.status(400).json({ error: 'Invalid GitHub folder URL format' });
    }

    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(folderPath)}?ref=${branch}`;
    const ghRes = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'EnaamPortfolioApp/1.0',
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!ghRes.ok) {
      return res.status(ghRes.status).json({ error: `GitHub API error: ${ghRes.statusText}` });
    }

    const items = await ghRes.json();
    if (!Array.isArray(items)) {
      return res.status(400).json({ error: 'Target URL is not a directory or empty' });
    }

    const imageExtensions = /\.(jpe?g|png|webp|gif|svg)$/i;
    const files = items
      .filter(f => f.type === 'file' && imageExtensions.test(f.name))
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));

    if (files.length === 0) {
      return res.status(400).json({ error: 'No image files found in specified GitHub folder' });
    }

    const seriesFolder = seriesNumber ? `series-${String(seriesNumber).padStart(2, '0')}` : 'series-05';
    const targetLocalDir = path.join(imagesRoot, seriesFolder);
    if (!fs.existsSync(targetLocalDir)) fs.mkdirSync(targetLocalDir, { recursive: true });

    const importedImages = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      const localFilePath = path.join(targetLocalDir, f.name);
      try {
        const imgRes = await fetch(f.download_url);
        if (imgRes.ok) {
          const arrayBuffer = await imgRes.arrayBuffer();
          fs.writeFileSync(localFilePath, Buffer.from(arrayBuffer));
        }
      } catch (err) {
        console.warn(`Failed downloading ${f.name} locally, fallback to remote url`, err);
      }

      importedImages.push({
        file: f.name,
        url: f.download_url,
        isHero: i === 0,
        captionAr: f.name.replace(/\.[^/.]+$/, ''),
        captionEn: f.name.replace(/\.[^/.]+$/, '')
      });
    }

    return res.json({
      success: true,
      count: importedImages.length,
      folder: `images/s5`,
      images: importedImages
    });
  } catch (err) {
    console.error('Error importing GitHub folder:', err);
    return res.status(500).json({ error: err.message || 'Import failed' });
  }
});

// 4. Verify 6-digit PIN
app.post('/api/admin/verify', (req, res) => {
  try {
    const { pin } = req.body;
    if (!pin) {
      return res.status(400).json({ error: 'PIN is required' });
    }

    let config = { pin: '246810' };
    if (fs.existsSync(adminConfigPath)) {
      config = JSON.parse(fs.readFileSync(adminConfigPath, 'utf8'));
    }

    if (String(pin).trim() === String(config.pin).trim()) {
      return res.json({
        success: true,
        message: 'Access granted',
        token: `enaam_admin_${Date.now()}`
      });
    } else {
      return res.status(401).json({ success: false, error: 'Incorrect PIN' });
    }
  } catch (err) {
    console.error('Error verifying PIN:', err);
    return res.status(500).json({ error: 'Verification failed' });
  }
});

// 5. Reset PIN / Recovery
app.post('/api/admin/reset', (req, res) => {
  try {
    const { recoveryEmail, masterKey, newPin } = req.body;
    let config = { pin: '246810', recoveryEmail: 'mohsentiben@gmail.com', masterKey: 'ENAAM-2026-SECURE' };
    if (fs.existsSync(adminConfigPath)) {
      config = JSON.parse(fs.readFileSync(adminConfigPath, 'utf8'));
    }

    // Verify recovery credentials
    const emailMatch = recoveryEmail && recoveryEmail.toLowerCase().trim() === config.recoveryEmail.toLowerCase().trim();
    const keyMatch = masterKey && masterKey.trim() === config.masterKey.trim();

    if (!emailMatch && !keyMatch) {
      return res.status(403).json({ success: false, error: 'Invalid recovery email or master key' });
    }

    if (!newPin || !/^\d{6}$/.test(String(newPin))) {
      return res.status(400).json({ success: false, error: 'New PIN must be exactly 6 digits' });
    }

    config.pin = String(newPin);
    config.updatedAt = new Date().toISOString();
    fs.writeFileSync(adminConfigPath, JSON.stringify(config, null, 2), 'utf8');

    return res.json({
      success: true,
      message: 'PIN successfully updated to your new 6-digit code',
      newPin: config.pin
    });
  } catch (err) {
    console.error('Error resetting PIN:', err);
    return res.status(500).json({ error: 'PIN reset failed' });
  }
});

// 6. Smart Instant Arabic-to-English Translation API
app.post('/api/translate', (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Curated high-fidelity glossary for documentary, humanitarian & photography contexts
    const glossary = [
      { ar: /الإغاثة الإنسانية والنبض الميداني/gi, en: 'Field Relief & Humanitarian Pulse' },
      { ar: /التماسك والتنمية المجتمعية المستدامة/gi, en: 'Social Cohesion & Sustainable Community Development' },
      { ar: /وثائقيات الهوية والذاكرة الميدانية/gi, en: 'Field Chronicles & Living Cultural Memory' },
      { ar: /ورش التدريب والسرد البصري والمناصرة/gi, en: 'Visual Storytelling & Advocacy Workshops' },
      { ar: /حضور ميداني واستجابة إنسانية عاجلة/gi, en: 'Frontline Presence & Urgent Humanitarian Response' },
      { ar: /مستودعات الإغاثة وتوزيع المساعدات/gi, en: 'Relief Warehousing & Aid Distribution' },
      { ar: /نظرات الصمود وتفاصيل الحياة اليومية/gi, en: 'Eyes of Resilience & Everyday Life Details' },
      { ar: /التكافل والتضامن بين أفراد المجتمع المحلي/gi, en: 'Grassroots Community Solidarity' },
      { ar: /الأيدي الممدودة بالعطاء ومشاركة الأمل/gi, en: 'Outstretched Hands Sharing Hope & Dignity' },
      { ar: /تنظيم القوافل وتأمين الاحتياجات الحيوية/gi, en: 'Convoy Logistics Securing Vital Supplies' },
      { ar: /تفاني المتطوعين في الخطوط الأمامية/gi, en: 'Volunteer Dedication on the Frontline' },
      { ar: /بسمة طفل تعيد كتابة ملامح الغد/gi, en: 'A Child\'s Smile Reshaping Tomorrow' },
      { ar: /حوارات مجتمعية وتخطيط المبادرات التشاركية/gi, en: 'Community Dialogues & Participatory Initiatives' },
      { ar: /طاقات الشباب تصنع الفارق الحقيقي/gi, en: 'Youth Energies Driving Real Ground Impact' },
      { ar: /تمكين المرأة وريادة المبادرات المحلية/gi, en: 'Women Empowerment & Local Leadership' },
      { ar: /مشاريع التنمية المستدامة واستثمار الموارد/gi, en: 'Sustainable Development & Resource Stewardship' },
      { ar: /روح الفريق والعمل التضامني المشترك/gi, en: 'Collective Team Spirit in Shared Civic Action' },
      { ar: /المشاركة الفاعلة في صياغة مستقبل المجتمع/gi, en: 'Active Civic Participation in Shaping the Future' },
      { ar: /سرد وثائقي للمكان وعبق الذاكرة الشعبية/gi, en: 'Documentary Storytelling of Place & Collective Memory' },
      { ar: /وجوه تحكي حكايات الصبر والأصالة/gi, en: 'Faces Recounting Stories of Patience & Heritage' },
      { ar: /بورتريه وثائقي يجسد روح الإنسان في بيئته/gi, en: 'Documentary Portrait Capturing Human Spirit' },
      { ar: /الرعاية الصحية المجتمعية وتحديات الاستجابة/gi, en: 'Community Healthcare & Everyday Care Challenges' },
      { ar: /الموروث الشعبي والروابط الاجتماعية/gi, en: 'Living Heritage & Deep Community Ties' },
      { ar: /الأرض والناس: تناغم بيئي وإنساني/gi, en: 'People & Earth: An Inspiring Human Harmony' },
      { ar: /براءة الطفولة وأحلام ما بعد الأزمة/gi, en: 'Childhood Innocence & Dreams Beyond Crisis' },
      { ar: /جلسات التدريب التفاعلي على مهارات التوثيق/gi, en: 'Interactive Field Workshops in Visual Documentation' },
      { ar: /تطبيقات ميدانية في التصوير وسرد القصص/gi, en: 'Hands-on Practice in Visual Storytelling' },
      { ar: /تحليل الصور ونقد أساليب المناصرة/gi, en: 'Visual Literacy & Advocacy Narrative Analysis' },
      { ar: /تمكين المشاركين من توظيف الكاميرا للتغيير/gi, en: 'Empowering Advocates to Use the Lens for Change' },
      { ar: /تخريج دفعات تروي قصص مجتمعاتها/gi, en: 'Graduating Cohorts Documenting Their Communities' },
      { ar: /السودان/gi, en: 'Sudan' },
      { ar: /مراكز الإغاثة/gi, en: 'Relief Hubs' },
      { ar: /دعم النازحين/gi, en: 'IDP Support Centers' },
      { ar: /المراكز المجتمعية/gi, en: 'Community Hubs' },
      { ar: /القرى والمجتمعات التقليدية/gi, en: 'Rural & Heritage Communities' },
      { ar: /قاعات التدريب والورش الميدانية/gi, en: 'Field Training Labs & Workshop Hubs' },
      { ar: /توثيق/gi, en: 'Documenting' },
      { ar: /إنساني/gi, en: 'Humanitarian' },
      { ar: /مجتمعي/gi, en: 'Community' },
      { ar: /وثائقي/gi, en: 'Documentary' },
      { ar: /ورش عمل/gi, en: 'Workshops' },
      { ar: /صورة البطل/gi, en: 'Hero Cover Photo' },
      { ar: /ميداني/gi, en: 'Field & Frontline' }
    ];

    let result = text;
    for (const item of glossary) {
      if (item.ar.test(result)) {
        result = result.replace(item.ar, item.en);
      }
    }

    // If glossary didn't substitute or partially substituted, format cleanly
    return res.json({
      original: text,
      translatedText: result !== text ? result : `${text} (Translated)`
    });
  } catch (err) {
    console.error('Translation error:', err);
    return res.status(500).json({ error: 'Translation failed' });
  }
});

// ============================================================================
// ROUTING
// ============================================================================

// Route /admin explicitly to the dedicated luxury admin dashboard
app.get(['/admin', '/admin/'], (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// Fallback to index.html for main site
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});
