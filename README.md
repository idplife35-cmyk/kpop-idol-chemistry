# KPOP Idol Chemistry 🎤💜

Create your perfect Korean name with your favorite K-Pop idols! This is a fan-made entertainment app that generates Korean names and chemistry scores with 65+ K-Pop idols.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Astro](https://img.shields.io/badge/Astro-4.x-orange)
![React](https://img.shields.io/badge/React-18.x-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)

## ✨ Features

- **65+ K-Pop Idols** - BTS, BLACKPINK, NewJeans, SEVENTEEN, Stray Kids, IVE, aespa, PLAVE, RIIZE, and more
- **Chemistry Score** - Get your compatibility score (70-100%) with your favorite idol
- **VS Mode** - Battle with friends to see who has better chemistry
- **Gamification** - Earn badges, level up, and track your stats
- **Multi-language** - English and Korean support
- **SEO Optimized** - Schema.org structured data, sitemaps, and more

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/kpop-idol-chemistry.git
cd kpop-idol-chemistry

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
kpop-idol-chemistry/
├── public/                  # Static assets
│   ├── ads.txt              # AdSense verification
│   ├── robots.txt           # SEO robots file
│   ├── CNAME                # Custom domain
│   └── assets/              # Images and logos
├── src/
│   ├── components/          # React & Astro components
│   │   ├── common/          # Header, Footer, AdSlot
│   │   ├── gamification/    # Level, Badge, Stats, VS Mode
│   │   └── generator/       # Name generator form
│   ├── content/             # Content Collections (groups, FAQs)
│   │   └── groups/          # JSON files for each K-Pop group
│   ├── layouts/             # Page layouts
│   ├── lib/                 # Utilities and business logic
│   │   ├── gamification/    # Level, Badge, Stats, History systems
│   │   ├── generator/       # Name generation algorithm
│   │   └── seo/             # Schema.org generators
│   ├── pages/               # Astro pages (routes)
│   │   ├── [group]-name-generator/  # Dynamic group pages
│   │   ├── index.astro      # Home page
│   │   ├── about.astro      # About page
│   │   ├── contact.astro    # Contact page
│   │   ├── privacy.astro    # Privacy Policy
│   │   └── terms.astro      # Terms of Service
│   └── styles/              # Global CSS
├── data/                    # Legacy JSON data files
├── docs/                    # Documentation
├── astro.config.mjs         # Astro configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Project dependencies
```

## 🛠️ Tech Stack

- **Framework**: [Astro](https://astro.build/) 4.x with Islands Architecture
- **UI Components**: [React](https://react.dev/) 18.x (partial hydration)
- **Language**: [TypeScript](https://www.typescriptlang.org/) 5.x
- **Styling**: CSS Modules + CSS Custom Properties
- **Analytics**: Google Analytics 4
- **Ads**: Google AdSense

## 🎮 Gamification System

### Level System
- **Level 1**: 신입 팬 (Rookie Fan) - 0 XP
- **Level 2**: 열정 팬 (Passionate Fan) - 10 XP
- **Level 3**: 전문 팬 (Expert Fan) - 30 XP
- **Level 4**: 마스터 팬 (Master Fan) - 70 XP
- **Level 5**: 레전드 (Legend) - 150 XP

### Badges
- Generation badges (first gen, 10, 50, 100, 500)
- Chemistry badges (90%, 95%, 100%)
- VS Mode badges
- Social sharing badges
- Level achievement badges

## 🌐 Supported Groups

| Group | Members | Badge |
|-------|---------|-------|
| Huntrix | 5 | 🔥 HOT |
| aespa | 4 | ✨ NEW |
| PLAVE | 5 | ✨ NEW |
| RIIZE | 6 | ✨ NEW |
| BTS | 7 | - |
| BLACKPINK | 4 | - |
| NewJeans | 5 | - |
| SEVENTEEN | 13 | - |
| Stray Kids | 8 | - |
| IVE | 6 | - |
| Saja Boys | 4 | - |

## 📝 Adding New Groups

1. Create a new JSON file in `src/content/groups/`:

```json
{
  "id": "group-id",
  "name": "Group Name",
  "nameKr": "그룹명",
  "slug": "group-name",
  "fandom": "Fandom Name",
  "description": "Group description",
  "color": "#HEX",
  "members": [
    {
      "nameEn": "Member",
      "nameKr": "멤버",
      "gender": "male|female"
    }
  ],
  "pageTypes": ["name"],
  "seo": {
    "title": "Group Name Generator",
    "description": "SEO description",
    "keywords": ["keyword1", "keyword2"]
  }
}
```

2. Build and the page will be automatically generated!

## 🚀 Deployment

### GitHub Pages (Automatic)

Push to `main` branch triggers automatic deployment via GitHub Actions.

### Manual Deployment

```bash
npm run build
# Upload `dist/` folder to your hosting provider
```

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## ⚠️ Disclaimer

This is a fan-made entertainment tool and is not affiliated with, endorsed by, or connected to any K-Pop entertainment companies, artists, or their management. All idol names and group references are used for entertainment purposes only.

## 📧 Contact

- Email: idplife35@gmail.com
- Website: https://kpopnamegenerator.com
