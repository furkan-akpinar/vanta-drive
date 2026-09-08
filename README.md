# VANTA Drive

<p align="center">
  <strong>Premium car rental experience built with Next.js, TypeScript and a detail-focused responsive interface.</strong>
</p>

<p align="center">
  A portfolio project focused on premium automotive presentation, modern UI/UX and responsive web development.
</p>

---

## Preview

<p align="center">
  <img
    src="./public/images/hero-vanta.webp"
    alt="VANTA Drive Preview"
    width="100%"
  />
</p>

> Live Demo: Coming soon

---

## About the Project

**VANTA Drive** is a premium car rental website concept designed to deliver a polished and modern digital experience for luxury vehicle rental.

The project combines an editorial automotive aesthetic with a functional rental experience, including vehicle discovery, filtering, reservation flows, location pages and detailed vehicle presentations.

The main focus of the project is visual quality, responsive behavior, reusable components and a clean frontend architecture.

---

## Features

- Premium automotive-focused user interface
- Responsive desktop, tablet and mobile layouts
- Full-screen video hero experience
- Luxury vehicle catalog
- Vehicle category browsing
- Individual vehicle detail pages
- Reservation interface
- Pickup and return date selection
- Location-based rental pages
- Favorites system
- Vehicle filtering and catalog controls
- Airport delivery page
- Chauffeur rental page
- Corporate rental content
- Rental packages
- FAQ section
- Contact page
- Privacy and legal pages
- Custom loading and error states
- SEO-ready sitemap and robots configuration
- Reusable UI component architecture
- Optimized WebP image assets
- Separate desktop and mobile hero video assets

---

## Tech Stack

| Technology         | Usage                          |
| ------------------ | ------------------------------ |
| **Next.js**        | Application framework          |
| **React**          | Component-based UI             |
| **TypeScript**     | Type-safe development          |
| **CSS**            | Custom responsive styling      |
| **Vite**           | Supporting development tooling |
| **GitHub Actions** | Continuous integration         |
| **WebP / MP4**     | Optimized visual assets        |

---

## Project Structure

```text
vanta-drive/
│
├── app/
│   ├── araclar/
│   ├── favoriler/
│   ├── hakkimizda/
│   ├── havalimani-teslimati/
│   ├── iletisim/
│   ├── kiralama-kosullari/
│   ├── kurumsal/
│   ├── lokasyonlar/
│   ├── paketler/
│   ├── rezervasyon/
│   ├── soforlu-kiralama/
│   └── sss/
│
├── components/
│   ├── ui/
│   ├── booking-console.tsx
│   ├── booking-flow.tsx
│   ├── fleet-carousel.tsx
│   ├── hero-video.tsx
│   ├── site-shell.tsx
│   ├── vehicle-card.tsx
│   ├── vehicle-catalog.tsx
│   └── vehicle-detail.tsx
│
├── data/
│   ├── classes.ts
│   ├── content.ts
│   └── vehicles.ts
│
├── hooks/
├── lib/
├── public/
│   ├── assets/
│   ├── fonts/
│   └── images/
│
├── scripts/
├── package.json
├── next.config.ts
└── tsconfig.json

```

## Vehicle Collection

The project features a curated premium fleet built around luxury, performance and executive mobility.

### Featured Brands

- **Porsche**
- **Mercedes-Benz**
- **BMW**
- **Audi**
- **Range Rover**
- **Tesla**
- **Volvo**

### Vehicle Categories

- **Luxury**
- **Performance**
- **Sports**
- **SUV**
- **Executive**
- **Electric**
- **Convertible**

---

## Design Approach

VANTA Drive was designed as a **premium digital experience** rather than a conventional rental marketplace.

### Core Design Principles

- Large-format automotive imagery
- Strong typography hierarchy
- Dark luxury-oriented presentation
- Minimal visual noise
- Spacious layouts
- High-contrast interface elements
- Smooth content transitions
- Responsive interaction patterns

The goal was to create an experience that feels closer to a **premium automotive brand website** while still preserving the functional structure of a rental platform.

---

## Responsive Design

The interface is optimized for a consistent experience across all major device sizes.

### Supported Viewports

- Desktop
- Laptop
- Tablet
- Mobile

### Responsive Considerations

- Adaptive navigation structure
- Flexible content spacing
- Responsive vehicle cards
- Mobile-friendly booking controls
- Scalable imagery and media
- Readable typography across breakpoints

---

## Getting Started

Follow the steps below to run the project locally.

### 1. Clone the repository

```bash
git clone https://github.com/furkan-akpinar/vanta-drive.git
2. Navigate into the project folder
cd vanta-drive
3. Install dependencies
npm install
4. Start the development server
npm run dev

Then open:

http://localhost:3000
Environment Variables

If environment variables are required, create a local environment file from the example below:

cp .env.example .env.local

Then update .env.local with the required values.

Private environment files are excluded from Git.

Available Scripts
npm run dev
npm run build
npm run start
Asset Credits

Third-party media sources and asset references used during development are documented in:

ASSET-SOURCES.md
Project Status

Portfolio Project
This project is actively maintained as part of my frontend and web development portfolio.

Author

Furkan Akpınar
Frontend / Web Developer

GitHub: @furkan-akpinar
```
