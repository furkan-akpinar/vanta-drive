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

| Technology | Usage |
|---|---|
| **Next.js** | Application framework |
| **React** | Component-based UI |
| **TypeScript** | Type-safe development |
| **CSS** | Custom responsive styling |
| **Vite** | Supporting development tooling |
| **GitHub Actions** | Continuous integration |
| **WebP / MP4** | Optimized visual assets |

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
Vehicle Collection

The project includes a curated premium fleet featuring vehicles from brands such as:

Porsche · Mercedes-Benz · BMW · Audi · Range Rover · Tesla · Volvo

Vehicle categories include:

Luxury · Performance · Sports · SUV · Executive · Electric · Convertible

Design Approach

VANTA Drive was designed around a restrained premium visual language rather than a traditional rental marketplace appearance.

The interface uses:

Large-format automotive imagery
Strong typography hierarchy
Dark luxury-oriented presentation
Minimal visual noise
Spacious layouts
High-contrast UI elements
Smooth content transitions
Responsive interaction patterns

The goal was to make the experience feel closer to a premium automotive brand website while maintaining the structure required for a rental platform.

Responsive Design

The project is designed to adapt across:

Desktop
Laptop
Tablet
Mobile

Navigation, vehicle cards, booking controls, media, typography and content layouts are adjusted for different viewport sizes.

Getting Started

Clone the repository:

git clone https://github.com/furkan-akpinar/vanta-drive.git

Navigate to the project:

cd vanta-drive

Install dependencies:

npm install

Start the development server:

npm run dev

Then open:

http://localhost:3000

Environment Variables

If environment variables are required, copy the example file:

cp .env.example .env.local

Then configure the required values inside .env.local.

Environment files containing private credentials are excluded from Git.

Development

Useful commands:

npm run dev
npm run build
npm run start
Asset Credits

Third-party media sources and asset references used during development are documented in:

ASSET-SOURCES.md
Status

Portfolio Project

The project is actively maintained as part of my frontend and web development portfolio.

Author
Furkan Akpınar

Frontend / Web Developer

GitHub: @furkan-akpinar
