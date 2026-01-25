# FinBoard 📊

A modern, customizable financial dashboard built with Next.js that allows users to connect to financial APIs and visualize data through interactive widgets.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Scripts](#scripts)

## ✨ Features

- **Dynamic Widget System** - Add, configure, and remove widgets to customize your dashboard
- **Multiple Widget Types**:
  - 📈 **Chart Widgets** - Visualize data with interactive charts using Recharts
  - 📊 **Table Widgets** - Display tabular data with virtualization for performance
  - 🎴 **Card Widgets** - Show key metrics and summary data
- **Dark/Light Theme Toggle** - Switch between themes for comfortable viewing
- **Configuration Backup** - Export and import your dashboard configurations
- **Responsive Design** - Fully responsive layout that works on all devices
- **Real-time API Integration** - Connect to financial APIs for live data

## 🛠️ Tech Stack

| Category             | Technologies                      |
| -------------------- | --------------------------------- |
| **Framework**        | Next.js 16, React 19              |
| **Language**         | TypeScript                        |
| **Styling**          | Tailwind CSS 4                    |
| **State Management** | Zustand                           |
| **Data Fetching**    | TanStack React Query, Axios       |
| **Charts**           | Recharts                          |
| **UI Components**    | Shadcn/ui                         |
| **Forms**            | React Hook Form, Zod              |
| **Utilities**        | date-fns, clsx, tailwind-merge    |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd finboard
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory with required API keys:

   ```env
   # Add your API keys here
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
finboard/
├── src/
│   ├── app/                    # Next.js App Router pages
│   ├── components/
│   │   ├── add-widget-dialog/  # Widget creation dialog
│   │   ├── common/             # Shared components (Navbar, ThemeToggle)
│   │   ├── config-backup/      # Configuration export/import
│   │   ├── dashboard/          # Dashboard layout and grid
│   │   ├── ui/                 # Reusable UI components (Shadcn)
│   │   └── widgets/            # Widget components (Chart, Table, Card)
│   ├── constants/              # Application constants
│   ├── context/                # React contexts
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utility functions
│   ├── services/               # API services
│   ├── store/                  # Zustand store (widget state)
│   └── types/                  # TypeScript type definitions
├── public/                     # Static assets
└── package.json
```

## 💡 Usage

1. **Adding Widgets**: Click the "Add Widget" button in the navbar to open the widget configuration dialog
2. **Configuring Widgets**: Select widget type, data source, and customize display options
3. **Theme Toggle**: Use the theme toggle in the navbar to switch between dark and light modes
4. **Backup Configuration**: Use the backup dialog to export or import your dashboard setup

## 📜 Scripts

| Command          | Description               |
| ---------------- | ------------------------- |
| `npm run dev`    | Start development server  |
| `npm run build`  | Build for production      |
| `npm run start`  | Start production server   |
| `npm run lint`   | Run ESLint                |
| `npm run format` | Format code with Prettier |

## 👨‍💻 Author

Yashashvi Sxena

---

_This project was created as an assignment submission._
