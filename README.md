# Node.js Backend Template

A production-ready Node.js backend boilerplate for quick MVP development. This template includes essential configurations and integrations commonly needed in modern web applications.

## 🏗️ Project Structure

├── src/
│ ├── config/ # Configuration files and environment variable handling
│ ├── controllers/ # Request handlers/controllers
│ ├── middleware/ # Custom middleware (auth, validation, etc.)
│ ├── models/ # Database models/schemas
│ ├── routes/ # API routes
│ ├── services/ # Business logic and external service integrations
│ ├── utils/ # Utility functions and helpers
│ ├── validations/ # Input validation and sanitization
│ │ ├── rules/ # Validation rules for different entities
│ │ ├── patterns.js # Common validation patterns
│ │ └── index.js # Validation middleware exports
│ ├── app.js # Express app setup
│ └── server.js # Server entry point

## 🛠️ Tech Stack & Dependencies

### Core Dependencies

- **express**: Web framework for Node.js
- **mongoose**: MongoDB object modeling tool
- **cors**: Enable Cross-Origin Resource Sharing
- **helmet**: Security middleware for Express
- **dotenv**: Environment variable management
- **winston**: Logging library

### Security & Validation

- **express-rate-limit**: Rate limiting middleware
- **express-validator**: Request data validation
- **helmet**: HTTP header security

### External Services

- **@sendgrid/mail**: Email service integration
- **aws-sdk**: AWS services integration
- **stripe**: Payment processing

### Development Dependencies

- **nodemon**: Development server with auto-reload
- **eslint**: Code linting
- **prettier**: Code formatting
- **jest**: Testing framework
- **supertest**: HTTP testing library

## 🔒 Validation System

### Overview

The validation system is designed to be modular and scalable, providing both validation and sanitization of input data.

### Structure

```
src/validations/
├── rules/              # Validation rules for different entities
│   └── user.rules.js   # User-specific validation rules
├── patterns.js         # Common validation patterns (regex)
├── sanitizers.js       # Input sanitization utilities
├── validator.js        # Core validation logic
└── index.js           # Exports validation middlewares
```

### Key Features

#### 1. Validation Patterns

Common validation patterns are centralized in `patterns.js`:

```javascript
exports.PATTERNS = {
  NAME: /^[a-zA-Z\s-']+$/,
  PASSWORD: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])/,
  // Add more patterns as needed
};
```

#### 2. Input Sanitization

- Strips unexpected fields
- Normalizes email addresses
- Escapes HTML characters
- Trims whitespace

#### 3. Validation Chains

Combines multiple validation steps:

```javascript
exports.validateUser = [sanitizeBody(allowedFields), ...validationRules, validate];
```

### Usage Example

```javascript
// In your routes file
const { validateUser } = require('../validations');

router.post('/users', validateUser, userController.createUser);
```

## 🚀 Getting Started

1. Clone the repository

## 🔐 Environment Variables

The following environment variables are required:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/your-database

# AWS
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=your-region
AWS_BUCKET_NAME=your-bucket-name

# SendGrid
SENDGRID_API_KEY=your-sendgrid-key
SENDGRID_FROM_EMAIL=your-verified-sender-email

# Stripe
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-webhook-secret
```

## 📝 API Documentation

### Health Check

- `GET /api/v1/health`: Server health check endpoint

More endpoints will be documented as they are implemented.

## 🔍 Code Quality & Standards

### Linting & Formatting

- ESLint for code linting
- Prettier for code formatting
- Pre-configured rules in `.eslintrc` and `.prettierrc`

### Error Handling

- Centralized error handling middleware
- Custom AppError class for operational errors
- Detailed error logging in development
- Sanitized error responses in production

### Logging

- Winston logger configuration
- Separate log files for errors and combined logs
- Console logging in development
- Structured JSON logging in production

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 🔒 Security Features

- Helmet.js for secure HTTP headers
- Rate limiting for API endpoints
- CORS configuration
- Environment variable management
- Secure error handling

## 📦 Available Scripts

- `npm start`: Start production server
- `npm run dev`: Start development server
- `npm test`: Run tests
- `npm run lint`: Run ESLint
- `npm run lint:fix`: Fix ESLint errors
- `npm run format`: Format code with Prettier

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.
