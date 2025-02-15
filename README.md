# Node.js Backend Template

A production-ready Node.js backend boilerplate for quick MVP development. This template includes essential configurations and integrations commonly needed in modern web applications.

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see Environment Variables section)
4. Start development server: `npm run dev`

## 🏗️ Project Structure

```
├── src/
│ ├── config/          # Configuration files and environment variables
│ ├── controllers/     # Request handlers/controllers
│ ├── middleware/      # Custom middleware (auth, validation, etc.)
│ ├── models/          # Database models/schemas
│ ├── routes/          # API routes
│ ├── services/        # Business logic and external service integrations
│ ├── utils/           # Utility functions and helpers
│ ├── validations/     # Input validation and sanitization
│ │ ├── rules/         # Validation rules for different entities
│ │ ├── patterns.js    # Common validation patterns
│ │ └── index.js       # Validation middleware exports
│ ├── app.js          # Express app setup
│ └── server.js       # Server entry point
```

## 🛠️ Tech Stack

### Core

- **express**: Web framework
- **mongoose**: MongoDB ODM
- **cors**: CORS middleware
- **helmet**: Security middleware
- **dotenv**: Environment management
- **winston**: Logging

### Security & Validation

- **express-rate-limit**: Rate limiting
- **express-validator**: Data validation
- **jsonwebtoken**: JWT authentication

### External Services

- **@sendgrid/mail**: Email service
- **aws-sdk**: AWS integration
- **stripe**: Payment processing

### Development

- **nodemon**: Auto-reload
- **eslint**: Linting
- **prettier**: Formatting
- **jest**: Testing
- **supertest**: HTTP testing

## 🔐 Authentication

This template uses JWT (JSON Web Token) based authentication.

### Endpoints

- `POST /api/auth/login`: Authenticate user
- `POST /api/auth/logout`: End session
- `POST /api/users`: Register new user
- `GET /api/users/profile`: Get user profile (protected)
- `PATCH /api/users/update-profile`: Update profile (protected)
- `GET /api/users/all`: List all users (admin only)

### Protected Routes

Add JWT token to Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 🔒 Validation System

The validation system provides modular input validation and sanitization.

### Features

- Centralized validation patterns
- Input sanitization (strip fields, normalize email, escape HTML)
- Validation chains
- Custom validation rules

### Usage

```javascript
// In routes
const { validateUser } = require('../validations');
router.post('/users', validateUser, userController.createUser);
```

## 📝 API Documentation

API documentation is available via Swagger UI at `http://localhost:5001/swagger` when running the development server.

### Features

- Interactive API testing
- Request/response schemas
- Model documentation
- Authentication documentation

## 🧪 Testing

### Structure

```
├── tests/
│   ├── unit/           # Unit tests
│   │   ├── models/     # Model tests
│   │   ├── services/   # Service tests
│   │   └── utils/      # Utility tests
│   ├── integration/    # Integration tests
│   │   └── api/        # API tests
│   └── setup.js        # Test configuration
```

### Running Tests

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

## 🔐 Environment Variables

```env
# Server
PORT=5001
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/your-database

# Authentication
JWT_SECRET=your-super-secure-secret-key
JWT_EXPIRES_IN=24h

# AWS
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=your-region
AWS_BUCKET_NAME=your-bucket-name

# SendGrid
SENDGRID_API_KEY=your-sendgrid-key
SENDGRID_FROM_EMAIL=your-sender-email

# Stripe
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-webhook-secret
```

## 📦 Available Scripts

- `npm start`: Production server
- `npm run dev`: Development server
- `npm test`: Run tests
- `npm run lint`: Run ESLint
- `npm run lint:fix`: Fix ESLint errors
- `npm run format`: Format code

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.
