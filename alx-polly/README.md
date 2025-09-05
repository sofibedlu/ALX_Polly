# ALX Polly - Polling Application

A modern, full-featured polling application built with Next.js 15, TypeScript, and Shadcn UI components.

## 🚀 Features

- **User Authentication**: Login, register, and profile management
- **Poll Management**: Create, view, edit, and delete polls
- **Voting System**: Vote on polls with real-time results
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Type Safety**: Full TypeScript support
- **Modern UI**: Beautiful components with Shadcn UI

## 📁 Project Structure

```
alx-polly/
├── app/                          # Next.js app directory
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Homepage
├── components/                   # Reusable components
│   ├── ui/                      # Shadcn UI components
│   ├── layout/                  # Layout components
│   │   ├── Header.tsx           # Navigation header
│   │   ├── Footer.tsx           # Site footer
│   │   └── Layout.tsx           # Main layout wrapper
│   └── common/                  # Common utility components
│       ├── LoadingSpinner.tsx   # Loading indicator
│       ├── ErrorBoundary.tsx    # Error handling
│       └── EmptyState.tsx       # Empty state component
├── features/                     # Feature-based organization
│   ├── auth/                    # Authentication feature
│   │   ├── components/          # Auth-specific components
│   │   │   ├── LoginForm.tsx    # Login form
│   │   │   ├── RegisterForm.tsx # Registration form
│   │   │   └── UserProfile.tsx  # User profile component
│   │   └── pages/               # Auth pages
│   │       ├── LoginPage.tsx    # Login page
│   │       ├── RegisterPage.tsx # Registration page
│   │       └── ProfilePage.tsx  # Profile page
│   └── polls/                   # Polls feature
│       ├── components/          # Poll-specific components
│       │   ├── PollCard.tsx     # Individual poll card
│       │   ├── PollList.tsx     # List of polls
│       │   └── CreatePollForm.tsx # Poll creation form
│       └── pages/               # Poll pages
│           ├── PollsPage.tsx    # Polls listing page
│           └── CreatePollPage.tsx # Poll creation page
├── lib/                         # Utility libraries
│   ├── api/                     # API client
│   │   └── client.ts            # API configuration and endpoints
│   └── utils/                   # Utility functions
│       ├── format.ts            # Formatting utilities
│       └── validation.ts        # Validation functions
├── types/                       # TypeScript type definitions
│   └── index.ts                 # Main type definitions
└── hooks/                       # Custom React hooks (future)
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Forms**: React Hook Form + Zod validation
- **Date Handling**: date-fns
- **Icons**: Lucide React (via Shadcn)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd alx-polly
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎨 UI Components

This project uses Shadcn UI components. To add new components:

```bash
npx shadcn@latest add [component-name]
```

Available components:
- Button, Card, Input, Label, Textarea
- Select, Dropdown Menu, Navigation Menu
- Avatar, Badge, Form components

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### Tailwind CSS

The project uses Tailwind CSS v4 with PostCSS. Configuration is in `tailwind.config.js`.

## 📱 Features Overview

### Authentication
- User registration and login
- Profile management
- Secure authentication flow

### Poll Management
- Create polls with multiple options
- Set poll visibility (public/private)
- Allow multiple votes per user
- Set expiration dates
- Real-time vote counting

### User Interface
- Responsive design
- Dark/light mode support
- Loading states
- Error handling
- Empty states

## 🚧 Next Steps

To complete the application, you'll need to:

1. **Backend Integration**: Connect to a real API backend
2. **Database**: Set up a database (PostgreSQL, MongoDB, etc.)
3. **Authentication**: Implement actual auth logic (NextAuth.js, Auth0, etc.)
4. **Real-time Updates**: Add WebSocket support for live poll updates
5. **Testing**: Add unit and integration tests
6. **Deployment**: Deploy to Vercel, Netlify, or your preferred platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Shadcn UI](https://ui.shadcn.com/) for beautiful components
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Vercel](https://vercel.com/) for hosting and deployment