
# CraveKart API Server

This is the backend server for the CraveKart food delivery application.

## Getting Started

1. Install dependencies:
```
npm install
```

2. Set up environment variables:
Create a `.env` file with the following variables:
```
MONGODB_URI=mongodb://localhost:27017/food-delivery-app
PORT=5000
ADMIN_SECRET_KEY=your_secure_secret_key_here
```

3. Start the server:
```
npm start
```

## Creating an Admin Account

As the owner of the website, you have two options to create an admin account:

### Option 1: Using the Admin Creation Script (Recommended)

1. Navigate to the server directory
2. Run the following command:
```
node scripts/createAdmin.js admin@example.com yourSecurePassword "Admin Name"
```
Replace the email, password, and name with your desired values.

### Option 2: Using the Secure API Endpoint

Send a POST request to `/api/users/create-admin` with the following body:
```json
{
  "email": "admin@example.com",
  "password": "yourSecurePassword",
  "name": "Admin Name",
  "secretKey": "your_admin_secret_key_from_env_file"
}
```

Note: Make sure your ADMIN_SECRET_KEY is set in your .env file and is kept secure.

## Security Considerations

- Always use strong passwords for admin accounts
- Keep your ADMIN_SECRET_KEY secure and rotate it periodically
- In production, ensure all passwords are hashed before storing in the database
- Consider implementing JWT token-based authentication for enhanced security

