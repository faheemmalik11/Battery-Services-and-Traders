# Battery Services & Traders

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4 + shadcn/ui (Nova preset)
- **Backend**: Firebase (Auth + Firestore, Spark plan)
- **Media**: Cloudinary (signed uploads)
- **Icons**: Lucide React
- **Font**: Geist

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

```bash
npm install# Battery Services & Traders

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4 + shadcn/ui (Nova preset)
- **Backend**: Firebase (Auth + Firestore, Spark plan)
- **Media**: Cloudinary (signed uploads)
- **Icons**: Lucide React
- **Font**: Geist


### Installation

```bash
clone
npm install
set env variables



# Firebase
 - NEXT_PUBLIC_FIREBASE_API_KEY=
 - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
 - NEXT_PUBLIC_FIREBASE_PROJECT_ID=
 - NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
 - NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
 - NEXT_PUBLIC_FIREBASE_APP_ID=

# Cloudinary
 - NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
 - CLOUDINARY_API_KEY=
 - CLOUDINARY_API_SECRET=
 - CLOUDINARY_UPLOAD_PRESET=

# Project Structure
 src/
├── app/           # App Router pages
├── components/    # React components
├── lib/          # Utilities (Firebase, Cloudinary configs)
├── hooks/        # Custom React hooks
└── types/        # TypeScript types