# ERP CRM Full-Stack Platform with AI Integration

A comprehensive Enterprise Resource Planning and Customer Relationship Management platform built with React.js and integrated with Google's Gemini AI for intelligent business insights and automation.

## 🌟 Features

### Core ERP/CRM Functionality
- **Customer Management**: Complete customer lifecycle management with contact details, communication history
- **Invoice Management**: Create, manage, and track invoices with payment status monitoring
- **Query Management**: Customer support ticket system with status tracking and resolution management
- **Project Management**: Project timeline tracking with progress monitoring and resource allocation
- **Dashboard Analytics**: Real-time business metrics and performance indicators

### 🤖 AI-Powered Features (Gemini Integration)
- **Intelligent Query Summaries**: AI-generated summaries of customer support interactions
- **Smart Invoice Analysis**: Automated invoice content analysis and business insights
- **Response Suggestions**: AI-powered response suggestions for customer queries
- **Sentiment Analysis**: Automated sentiment analysis of customer communications
- **Business Insights**: AI-generated business intelligence reports and recommendations

## 🚀 Tech Stack

### Frontend
- **React 18.2.0** - Modern React with functional components and hooks
- **Vite** - Fast build tool and development server
- **Tailwind CSS 3.4.6** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **Framer Motion** - Animation library
- **React Hook Form** - Form management
- **Recharts** - Data visualization library
- **Axios** - HTTP client for API requests

### AI Integration
- **@google/generative-ai 0.24.1** - Official Google Gemini AI SDK
- **Custom Gemini Service Layer** - Abstracted AI service with rate limiting and error handling
- **React Hooks for AI** - Custom hooks for seamless AI feature integration

### Development Tools
- **ESLint** - Code linting and quality assurance
- **Prettier** - Code formatting
- **Vitest** - Testing framework
- **PostCSS** - CSS processing

## 📋 Prerequisites

- Node.js 18.0 or higher
- npm or yarn package manager
- Google Gemini API key (get from [Google AI Studio](https://aistudio.google.com/app/apikey))

## ⚡ Quick Start

### 1. Clone and Install
```bash
git clone [repository-url]
cd erp-crm-fullstack-platform
npm install
```

### 2. Environment Setup
Create a `.env` file in the root directory:

```env
VITE_GEMINI_API_KEY=your-gemini-api-key-here
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Get Your Gemini API Key
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env` file as `VITE_GEMINI_API_KEY`

### 4. Start Development Server
```bash
npm start
```

The application will open at `http://localhost:5173`

## 🔧 Available Scripts

```bash
# Development
npm start          # Start development server
npm run dev        # Alternative start command

# Building
npm run build      # Build for production
npm run serve      # Preview production build

# Testing
npm test           # Run tests
npm run test:ui    # Run tests with UI

# Code Quality
npm run lint       # Run ESLint
npm run lint:fix   # Fix ESLint errors automatically
```

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Base UI components (Button, Input, etc.)
│   └── AppIcon.jsx      # Icon component wrapper
├── pages/               # Main application pages
│   ├── dashboard/       # Dashboard with AI insights
│   ├── customer-management/
│   ├── invoice-management/
│   ├── query-management/
│   ├── project-management/
│   └── login/
├── services/            # Business logic and API services
│   └── geminiService.js # Gemini AI integration service
├── hooks/               # Custom React hooks
│   └── useGeminiAI.js   # AI features hook
├── utils/               # Utility functions
│   ├── cn.js           # Class name utility
│   └── geminiApiClient.js # Low-level Gemini API client
└── styles/              # Global styles and Tailwind config
```

## 🤖 AI Features Usage

### Query Notes Summarization
```javascript
import { useGeminiAI } from '../hooks/useGeminiAI';

const { generateSummary, isLoading, error } = useGeminiAI();

// Generate summary of query notes
const summary = await generateSummary(queryNotes, 'notes');
```

### Invoice AI Analysis
```javascript
// Generate invoice insights
const insights = await generateSummary(invoice, 'invoice');
```

### Business Intelligence
```javascript
// Generate business insights from invoice data
const businessInsights = await generateSummary(invoices, 'business');
```

### Response Suggestions
```javascript
const { generateResponseSuggestions } = useGeminiAI();

// Get AI-powered response suggestions
const suggestions = await generateResponseSuggestions(query);
```

## 🎨 UI Components

The application uses a comprehensive design system with:

- **Consistent Color Palette** - Primary, secondary, and semantic colors
- **Typography Scale** - Hierarchical text sizing and weights
- **Component Library** - Reusable buttons, inputs, modals, and tables
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Accessibility** - ARIA labels and keyboard navigation support

## 🔐 Security Features

### AI Integration Security
- **Environment Variable Protection** - API keys stored securely in environment variables
- **Rate Limiting** - Built-in rate limiting for AI API calls
- **Error Handling** - Comprehensive error handling for AI failures
- **Fallback Mechanisms** - Graceful degradation when AI services are unavailable

### General Security
- **Input Validation** - Form validation and sanitization
- **XSS Protection** - React's built-in XSS protection
- **CORS Handling** - Proper CORS configuration for API calls

## 📊 Performance Optimizations

- **Code Splitting** - Lazy loading of route components
- **Bundle Optimization** - Vite's optimized bundling
- **Image Optimization** - Responsive image handling
- **Caching Strategy** - Browser caching for static assets
- **AI Response Caching** - Local caching of AI-generated content

## 🧪 Testing

### Test Structure
```bash
src/
├── __tests__/           # Test files
├── components/
│   └── __tests__/       # Component tests
└── services/
    └── __tests__/       # Service tests
```

### Running Tests
```bash
npm test                 # Run all tests
npm run test:coverage    # Run tests with coverage report
npm run test:watch       # Run tests in watch mode
```

## 📈 Monitoring and Analytics

### Built-in Analytics
- **User Interaction Tracking** - Button clicks and form submissions
- **Performance Monitoring** - Page load times and API response times
- **Error Tracking** - Client-side error logging
- **AI Usage Metrics** - Track AI feature usage and success rates

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables for Production
Ensure these environment variables are set in your production environment:
```env
VITE_GEMINI_API_KEY=your-production-gemini-api-key
VITE_SUPABASE_URL=your-production-supabase-url
VITE_SUPABASE_ANON_KEY=your-production-supabase-key
```

### Deployment Platforms
- **Vercel** - Recommended for React applications
- **Netlify** - Alternative with great CI/CD integration
- **Firebase Hosting** - Google's hosting platform
- **AWS S3 + CloudFront** - For enterprise deployments

## 🔄 API Integration

### Gemini AI API
The application integrates with Google's Gemini AI API for:
- Text generation and summarization
- Sentiment analysis
- Business intelligence
- Response suggestions

### Rate Limits and Quotas
- **Rate Limiting** - Built-in rate limiting (1 request per second)
- **Quota Management** - Monitor usage in Google AI Studio
- **Error Handling** - Graceful handling of rate limit exceeded errors

## 🛠️ Development Guidelines

### Code Style
- **ESLint Configuration** - Enforced code style and best practices
- **Prettier Integration** - Automated code formatting
- **Component Structure** - Consistent component organization
- **Naming Conventions** - Clear and descriptive naming

### Git Workflow
```bash
# Feature development
git checkout -b feature/feature-name
git commit -m "feat: add new feature"
git push origin feature/feature-name

# Bug fixes
git checkout -b bugfix/issue-description
git commit -m "fix: resolve issue with component"
git push origin bugfix/issue-description
```

## 🐛 Troubleshooting

### Common Issues

#### Gemini AI Not Working
```bash
# Check API key configuration
echo $VITE_GEMINI_API_KEY

# Verify API key in browser console
console.log(import.meta.env.VITE_GEMINI_API_KEY)
```

#### Build Issues
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
npm start
```

#### Environment Variables Not Loading
- Ensure `.env` file is in root directory
- Restart development server after adding new variables
- Check variable names start with `VITE_` prefix

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Google Gemini AI Documentation](https://ai.google.dev/)
- [Lucide Icons](https://lucide.dev/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google AI team for the excellent Gemini API
- React team for the amazing framework
- Tailwind CSS team for the utility-first CSS framework
- The open-source community for the incredible tools and libraries

---

## 📞 Support

For support, email support@yourcompany.com or join our Slack channel.

## 🔗 Links

- [Live Demo](https://your-demo-url.com)
- [API Documentation](https://your-api-docs.com)
- [Design System](https://your-design-system.com)