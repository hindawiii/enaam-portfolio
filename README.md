# 📸 Enaam Ali Osman | Documentary Photographer Portfolio

> A luxury interactive digital portfolio and documentary storytelling platform showcasing humanitarian, community, and educational visual narratives.

**🌐 [Visit Live Portfolio](https://hindawiii.github.io/enaam-portfolio/)** | **📱 Responsive Design** | **🎬 Cinematic Interface**

---

## ✨ Features

### **Core Portfolio**
- ✅ **5 Documentary Series** with curated photo collections
  - 01: Humanitarian & Community Impact
  - 02: Community Development & Social Cohesion
  - 03: Field Chronicles & Cultural Documentation
  - 04: Visual Storytelling Workshops
  - 05: Humanitarian Coordination & Community Accountability

- 🎨 **Dual View Modes**
  - Cinematic Story Sliders (Sequential browsing)
  - Editorial Asymmetric Mosaic (Grid layout)

- 🌍 **Bilingual Support**
  - Arabic (العربية) - RTL Direction
  - English - LTR Direction
  - Real-time language switching

- 📸 **Advanced Image Features**
  - Hero Photo System (Featured masterpiece per series)
  - Full-screen Lightbox Studio
  - Filmstrip Thumbnails
  - Ambient Background Blur
  - Progressive image loading

- 📱 **Responsive Design**
  - Mobile-optimized touch interactions
  - Desktop cinematic experience
  - Tablet-friendly layouts

### **Admin Dashboard** (`/admin`)
- 🔐 **6-Digit Smart PIN Authentication**
  - Secure access control
  - PIN recovery via email
  - Master key backup system

- 💼 **Comprehensive CMS**
  - Full album/series management
  - Bilingual content editing (Arabic/English)
  - Photo upload & reordering
  - Hero photo assignment
  - Automatic EXIF date extraction
  - Smart auto-translation engine

- 📊 **Real-time Statistics**
  - Total albums counter
  - Documentary photos count
  - Hero photos active
  - Sync status indicator

- 🔄 **GitHub Integration**
  - One-click folder imports from GitHub
  - Batch photo import
  - Direct URL-based album creation

---

## 🚀 Quick Start

### **Installation**

```bash
# Clone repository
git clone https://github.com/hindawiii/enaam-portfolio.git
cd enaam-portfolio

# Install dependencies
npm install

# Start development server
npm start
```

Server runs on `http://localhost:3000`

### **Admin Access**

```
URL: http://localhost:3000/admin
Default PIN: 246810
Recovery Email: mohsentiben@gmail.com
Master Key: ENAAM-2026-SECURE
```

---

## 📁 Project Structure

```
enaam-portfolio/
├── index.html           # Main portfolio website
├── admin.html          # Protected admin dashboard
├── server.js           # Express backend server
├── package.json        # Node dependencies
│
├── data/               # Runtime data storage
│   ├── portfolio-series.json    # Serialized album data
│   └── admin-config.json        # PIN & recovery settings
│
├── images/             # Photo galleries directory
│   ├── s1/            # Series 1 photos (Humanitarian)
│   ├── s2/            # Series 2 photos (Community)
│   ├── s3/            # Series 3 photos (Documentary)
│   ├── s4/            # Series 4 photos (Workshops)
│   ├── s5/            # Series 5 photos (Humanitarian Coordination)
│   ├── uploads/       # User-uploaded photos
│   └── ركن انساني وركن مجتمعي/  # Legacy folder reference (maps to s5)
│
├── .github/workflows/  # CI/CD automation
├── README.md          # This file
└── [documentation]    # Architecture & guides
```

---

## 🎯 Photo Gallery Structure

### **Documentary Series (5 Collections)**

| # | Title (EN) | Title (AR) | Category | Photos | Hero Photo |
|---|------------|-----------|----------|--------|-----------|
| 01 | Humanitarian Relief & Community Pulse | الإغاثة الإنسانية والنبض الميداني | Humanitarian | 6-7 | ✓ |
| 02 | Social Cohesion & Development | التماسك الاجتماعي والتنمية | Community | 5-6 | ✓ |
| 03 | Field Chronicles & Living Memory | وثائقيات الهوية والذاكرة الميدانية | Documentary | 7-8 | ✓ |
| 04 | Visual Advocacy Workshops | ورش العمل السينمائية | Workshops | 6 | ✓ |
| 05 | Humanitarian Coordination & Community Accountability | تنسيق العمل الإنساني والمساعلة المجتمعية | Humanitarian + Community | 8 | ✓ |

**Total Images:** ~34 documentary photographs

### **Series 05: Humanitarian Coordination & Community Accountability**

**Field Workshops & Inter-Agency Coordination**

- **Location:** Sudan — Inter-Agency Coordination & Field Capacity Halls
- **Date Range:** 2025 - 2026
- **Photos:** 8 documentary images
- **Focus:** Documenting inter-agency field coordination and capacity-building workshops on Accountability to Affected Populations (IAA CFM AAP WG), empowering community voices with dignity
- **Tags:** humanitarian, community, advocacy

---

## 🔌 API Endpoints

### **Public APIs**
```
GET  /api/series              # Fetch all series data
GET  /api/portfolio           # Get portfolio metadata
```

### **Admin APIs** (Protected)
```
POST /api/admin/verify        # Verify 6-digit PIN
POST /api/admin/reset         # Reset PIN with recovery credentials
POST /api/series              # Save all series data
POST /api/upload              # Upload single photo (Base64)
POST /api/admin/import-github-folder  # Batch import from GitHub
POST /api/translate           # Bilingual translation service
```

---

## 🔐 Security Notes

- ✅ PIN stored in `data/admin-config.json` (local file)
- ✅ Session tokens in browser sessionStorage
- ✅ Recovery email verification for PIN reset
- ✅ Master key backup system
- ⚠️ **Production:** Use environment variables for sensitive data
- ⚠️ **HTTPS:** Deploy with SSL certificate for secure transmission

---

## 🛠️ Technology Stack

**Frontend:**
- HTML5 + CSS3 (Vanilla, no frameworks)
- JavaScript (ES6+, Fetch API)
- Responsive Design (Mobile-first)
- Arabic RTL Support
- Bilingual i18n System

**Backend:**
- Node.js + Express.js
- File-based data persistence (JSON)
- Static asset serving
- GitHub API integration
- EXIF metadata extraction

**Deployment:**
- Vercel / Netlify ready
- Heroku compatible
- GitHub Pages ready (Static hosting)
- Supports custom domains

---

## 📸 Photo Management Workflow

### **Series Image Requirements**
```javascript
{
  id: "series-humanitarian-coordination",
  number: "05",
  titleAr: "تنسيق العمل الإنساني والمساعلة المجتمعية",
  titleEn: "Humanitarian Coordination & Community Accountability",
  category: "humanitarian",              // humanitarian, community, documentary, workshops
  tags: ["humanitarian", "community", "advocacy"],
  subtitleAr: "توثيقات التنسيق الميداني وورش العمل التدريبية",
  subtitleEn: "Documenting inter-agency field coordination and capacity-building workshops",
  locationAr: "السودان — قاعات التنسيق الإنساني والتدريبات الميدانية",
  locationEn: "Sudan — Inter-Agency Coordination & Field Capacity Halls",
  date: "2025 - 2026",
  folder: "images/s5",
  images: [
    {
      file: "img1.jpg",
      url: "/images/s5/img1.jpg",
      isHero: true,                      // Designated masterpiece photo
      captionAr: "شرح الصورة بالعربية",
      captionEn: "Photo caption in English"
    },
    // ... more images (total 8)
  ]
}
```

---

## 🚀 Deployment Guide

### **Vercel** (Recommended)
```bash
npm install -g vercel
vercel
```

### **Heroku**
```bash
heroku create your-app-name
git push heroku main
```

### **Self-hosted (VPS)**
```bash
npm install
npm start
# Server runs on port 3000
# Use nginx/Apache as reverse proxy
```

### **GitHub Pages** (Static)
```bash
# Already configured and running at:
# https://hindawiii.github.io/enaam-portfolio/
```

---

## 🐛 Known Issues & Solutions

### **Issue: Series 5 Images Not Displaying**
**Cause:** Image folder missing or incorrectly mapped  
**Solution:** 
1. Verify folder exists: `images/s5/` or `images/ركن انساني وركن مجتمعي/`
2. Ensure all 8 images are present (img1.jpg - img8.jpg)
3. Use Admin Dashboard → Import GitHub Folder
4. Or upload via drag-and-drop in admin panel

### **Issue: Admin Login Not Working**
**Cause:** PIN mismatch or session expired  
**Solution:**
- Default PIN: `246810`
- Use recovery modal: "Forgot or Reset PIN?"
- Recovery Email: mohsentiben@gmail.com
- Master Key: ENAAM-2026-SECURE

### **Issue: Images Not Loading in Browser**
**Cause:** Incorrect file paths or CORS  
**Solution:**
- Check `images/` folder structure
- Verify file permissions (chmod 644)
- Clear browser cache
- Check browser console for errors
- Verify pathMapping in index.html (line 2165)

---

## 📝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📄 License

This project is **proprietary**. All photography, design, and content are copyright © 2024-2026 Enaam Ali Osman. 

Usage rights reserved. Contact for licensing inquiries.

---

## 📞 Contact & Support

- **Website:** [enaam-portfolio.vercel.app](https://hindawiii.github.io/enaam-portfolio/)
- **Email:** mohsentiben@gmail.com
- **GitHub:** [@hindawiii](https://github.com/hindawiii)
- **Documentation:** See `/docs` folder for architecture details

---

## 🎨 Credits

**Design & Development:**  
Enaam Ali Osman - Documentary Photographer & Visual Storyteller

**Built with:**
- ❤️ Passion for visual storytelling
- 🎬 Cinematic design principles  
- 📱 Mobile-first approach
- 🌍 Bilingual accessibility
- ♿ Inclusive design practices

---

**Last Updated:** October 2026  
**Status:** ✅ Live & Production Ready  
**Series:** 5 Complete Collections | 34+ Documentary Photos

---

## 🌟 Star Us!

If you find this portfolio inspiring, please give it a ⭐ on GitHub!
