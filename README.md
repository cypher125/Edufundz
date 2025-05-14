This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Backend Integration

The frontend is designed to work with a Django backend that provides the following features:

- User authentication and registration
- Loan application and management
- Wallet functionality with Paystack integration for payments

### API Endpoints

The frontend makes requests to the following API endpoints:

- **Authentication**
  - `POST /api/users/register/` - Register a new user
  - `POST /api/users/login/` - Login and get auth token
  - `POST /api/users/logout/` - Logout user
  - `GET /api/users/profile/` - Get user profile

- **Loans**
  - `GET /api/loans/applications/` - List loan applications
  - `POST /api/loans/applications/` - Create new loan application
  - `GET /api/loans/loans/` - List approved loans
  - `GET /api/loans/repayments/` - List loan repayments
  - `POST /api/loans/repayments/{id}/pay/` - Make payment for a repayment

- **Wallet**
  - `GET /api/wallet/wallet/` - Get wallet details
  - `POST /api/wallet/wallet/deposit/` - Initialize deposit to wallet
  - `GET /api/wallet/transactions/` - List wallet transactions
  - `GET /api/wallet/verify-payment/{reference}/` - Verify a payment

### Paystack Integration

The backend integrates with Paystack for payment processing. To work with Paystack:

1. Replace the test keys in the backend settings with your own Paystack test keys
2. Make sure your frontend callback URLs correctly handle Paystack redirects
3. Use the wallet deposit endpoint to initiate payments

### Local Development

To run the frontend with the backend:

1. Start the backend server: `cd backend && python manage.py runserver`
2. Start the frontend dev server: `cd frontend && npm run dev`
3. The frontend will connect to the backend APIs at http://localhost:8000
