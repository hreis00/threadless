# Threadless

Threadless is a modern social media platform built with React, Node.js, and MongoDB. It features a beautiful UI powered by DaisyUI and Tailwind CSS, with real-time updates using React Query.

## 🌟 Features

- **Authentication**

  - Email & Password registration/login
  - Google OAuth integration
  - JWT-based authentication with secure HTTP-only cookies

- **User Management**

  - Customizable user profiles
  - Profile pictures and cover images
  - Follow/Unfollow functionality
  - Bio and personal information

- **Posts & Interactions**

  - Create, edit, and delete posts
  - Like and comment on posts
  - Share posts
  - Rich media support (images)

- **Exhibitions**

  - Create and view exhibitions
  - Showcase collections of posts
  - Interactive gallery view

- **Real-time Notifications**
  - Follow notifications
  - Like and comment notifications
  - Exhibition updates

## 🚀 Tech Stack

### Frontend

- React 18 with Vite
- React Router DOM for navigation
- TanStack Query (React Query) for data fetching
- Firebase for Google Authentication
- DaisyUI & Tailwind CSS for styling
- React Icons
- React Hot Toast for notifications

### Backend

- Node.js & Express
- MongoDB with Mongoose
- JWT for authentication
- Cloudinary for image storage
- CORS for cross-origin requests
- bcrypt for password hashing

## 📦 Prerequisites

- Node.js (v18 or higher)
- MongoDB
- Cloudinary account
- Firebase project
- pnpm (recommended) or npm

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/hreis00/threadless.git
   cd threadless
   ```

2. **Set up environment variables**

   Create `.env` file in the root directory:

   ```env
   MONGO_URI=your_mongodb_uri
   PORT=5000
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   ```

   Create `.env` file in the frontend directory:

   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_DATABASE_URL=your_firebase_database_url
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
   ```

3. **Install dependencies**

   ```bash
   # Install backend dependencies
   pnpm install

   # Install frontend dependencies
   cd frontend
   pnpm install
   ```

4. **Start the development servers**

   In the root directory:

   ```bash
   # Start backend server
   pnpm dev
   ```

   In the frontend directory:

   ```bash
   # Start frontend development server
   pnpm dev
   ```

The application will be available at:

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 📱 Usage

1. **Registration/Login**

   - Sign up with email and password
   - Or use Google OAuth for quick access
   - Accept terms and conditions

2. **Profile Setup**

   - Upload profile picture
   - Add cover image
   - Update bio and personal information

3. **Creating Posts**

   - Click the "Create Post" button
   - Add text and images
   - Share with your followers

4. **Exhibitions**

   - Create exhibitions to showcase your work
   - Add posts to exhibitions
   - Share exhibitions with others

5. **Interactions**
   - Follow other users
   - Like and comment on posts
   - Share interesting content

## 🔒 Security Features

- HTTP-only cookies for JWT storage
- Password hashing with bcrypt
- CORS protection
- Environment variable protection
- Secure Google OAuth implementation

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact

Hugo Reis - hbssreis@gmail.com
Project Link: [https://github.com/hreis/threadless](https://github.com/hreis/threadless)

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [TanStack Query](https://tanstack.com/query)
- [DaisyUI](https://daisyui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
