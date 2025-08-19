# 🔒 NextGen Password Generator 

![Project Banner](https://raw.githubusercontent.com/nandkishor22/Passwoed_Generator/refs/heads/main/Public/banner.png) *<!-- Consider adding a banner image -->*

A modern password generation solution with advanced security features and seamless integration capabilities.

## 🏆 Features

- 🔐 Generate cryptographically secure passwords
- 🛠️ Customizable password policies (length, complexity rules)
- ⚡ Real-time strength assessment
- 🌐 REST API integration
- 📱 Responsive web interface
- 🔄 Cross-platform compatibility
- 📊 Usage analytics dashboard

## 🛠️ Technology Stack

### Core Framework
- **⚡ Next.js 15** - React framework with App Router
- **📘 TypeScript 5** - Type-safe development
- **🎨 Tailwind CSS** - Utility-first styling

### Security
- **🔑 Bcrypt** - Password hashing
- **🔒 Crypto** - Node.js crypto module
- **🎯 JWT** - Secure authentication

### Database
- **🗄️ Prisma** - Modern ORM
- **📦 PostgreSQL** - Primary database
- **⚡ Redis** - Rate limiting cache

### UI Components
- **🧩 shadcn/ui** - Accessible components
- **📊 Recharts** - Data visualization
- **🖱️ Framer Motion** - Smooth animations

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+
- PostgreSQL 12+
- Redis 6+

### Installation
```bash
git clone https://github.com/yourusername/password-generator.git
cd password-generator
npm install
cp .env.example .env
npx prisma migrate dev
npm run dev
```

## 🚀 Vercel Deployment Guide

### 1. Prerequisites
- GitHub account with the repository
- Vercel account (free tier available)

### 2. One-Click Deployment
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Fpassword-generator)

### 3. Manual Deployment
```bash
# Install Vercel CLI globally
npm install -g vercel

# Authenticate with Vercel
vercel login

# Initialize project
vercel init

# Push to production
vercel deploy --prod
```

### 4. Environment Configuration
In Vercel dashboard > Project Settings > Environment Variables:
```env
DATABASE_URL="postgres://user:pass@host:port/db"
JWT_SECRET="your-32-character-secret"
REDIS_URL="redis://default:pass@host:port"
NEXT_PUBLIC_API_URL=https://your-domain.vercel.app
```

### 5. Database Setup
1. Create PostgreSQL database using Vercel Storage
2. Connect to your database using connection string
3. Run migrations:
```bash
npx prisma migrate deploy
```

### 6. Post-Deployment
1. Configure custom domain in Vercel settings
2. Enable SSL/TLS encryption
3. Set up automatic CI/CD with GitHub integration
4. Monitor performance in Vercel Analytics

### 7. Troubleshooting
- Check deployment logs in Vercel dashboard
- Test API endpoints using Vercel's Edge Network
- Rollback to previous deployment if needed

## 📚 API Documentation

**Base URL:** `http://localhost:3000/api`

| Endpoint                | Method | Description                     |
|-------------------------|--------|---------------------------------|
| `/generate-password`    | POST   | Generate secure password        |
| `/analyze-strength`     | POST   | Password strength analysis      |
| `/history`              | GET    | Get generation history          |

```bash
curl -X POST http://localhost:3000/api/generate-password \
  -H "Content-Type: application/json" \
  -d '{"length": 16, "includeSymbols": true}'
```

## 📂 Project Structure
```
.
├── src/
│   ├── app/                 # Next.js routes
│   ├── components/          # React components
│   ├── lib/                 # Security utilities
│   ├── prisma/              # Database schema
│   └── styles/              # Global CSS
├── tests/                   # Unit tests
└── docs/                    # Documentation
```

## 🤝 Contributing
1. Fork the repository
2. Create feature branch (`git checkout -b feature/awesome`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push to branch (`git push origin feature/awesome`)
5. Open Pull Request

## 📄 License
MIT License - see [LICENSE](LICENSE) for details

## 🙏 Acknowledgments

## 🌐 Live Demo

Check out our live deployment on Vercel:
https://password-generator.vercel.app
- Next.js team for the framework
- Shadcn/ui for component library
- Cryptographic community for security best practices