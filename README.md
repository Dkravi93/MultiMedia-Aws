# Media Capture and Storage Web Application

## Overview
The **Media Capture and Storage Web Application** is a full-stack MERN project that allows users to upload, view, and manage media files (images & videos). The backend is deployed on **Render**, and the frontend is deployed on **Vercel**. The application supports media storage using **AWS S3** and integrates **JWT-based authentication**.

## Tech Stack
### **Frontend:**
- React.js
- Redux Toolkit
- Tailwind CSS / Material UI
- Axios (for API calls)
- Vercel (Deployment)

### **Backend:**
- Node.js
- Express.js
- MongoDB (Mongoose ORM)
- Multer (File Handling)
- AWS S3 SDK
- JWT Authentication (bcrypt for password hashing)
- Render (Deployment)

## Features
### **User Authentication:**
✅ User registration & login using **JWT** authentication.  
✅ Password hashing with **bcrypt** for security.  
✅ Token-based access control for protected routes.

### **Media Upload & Management:**
✅ Upload **images and videos** from local storage.  
✅ Store media files securely in **AWS S3**.  
✅ Fetch uploaded media with **pagination support**.  
✅ View media in a **grid/list format**.  
✅ Delete media from both **AWS S3 and MongoDB**.

### **State Management:**
✅ Redux Toolkit to manage authentication and media state.

### **Error Handling & Validation:**
✅ Validation for authentication and file uploads.  
✅ Proper error handling using try-catch blocks.  
✅ Success and error messages for API interactions.

## Project Setup
### **1️⃣ Clone the Repository**
```bash
git clone https://github.com/your-username/media-capture-app.git
cd media-capture-app
```

### **2️⃣ Backend Setup**
#### Install dependencies:
```bash
cd backend
npm install
```

#### Create a **.env** file:
```ini
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_BUCKET_NAME=your_s3_bucket_name
AWS_BUCKET_FOLDER=media-folder/
```

#### Start the backend server:
```bash
npm start
```
_Backend runs at: **http://localhost:5000**_

### **3️⃣ Frontend Setup**
#### Install dependencies:
```bash
cd frontend
npm install
```

#### Start the frontend app:
```bash
npm run dev
```
_Frontend runs at: **http://localhost:5173**_

## Deployment
### **Backend Deployment on Render**
1. Create a new **Web Service** on [Render](https://render.com/).
2. Connect your GitHub repository.
3. Set the **Build Command** to:
   ```bash
   npm install
   ```
4. Set the **Start Command** to:
   ```bash
   npm start
   ```
5. Add environment variables in **Render Dashboard**.
6. Deploy the backend.

### **Frontend Deployment on Vercel**
1. Push your React app to GitHub.
2. Go to [Vercel](https://vercel.com/), create a new project, and connect your repository.
3. Click **Deploy**.

## API Endpoints
### **Authentication**
| Method | Endpoint           | Description |
|--------|-------------------|-------------|
| POST   | `/api/auth/register` | Register a new user |
| POST   | `/api/auth/login` | User login and receive JWT token |

### **Media Management**
| Method | Endpoint           | Description |
|--------|-------------------|-------------|
| GET    | `/api/media` | Get all uploaded media |
| POST   | `/api/media/upload` | Upload a new media file |
| DELETE | `/api/media/:key` | Delete a media file |

## Live Demo
🔗 **Frontend URL:** [https://your-frontend.vercel.app](https://multi-media-aws.vercel.app/))  
🔗 **Backend URL:** [https://your-backend.onrender.com](https://multimedia-aws.onrender.com))

## Screenshots
![Media Gallery](https://via.placeholder.com/800x400.png?text=Media+Gallery+Screenshot)

## Future Improvements
- Implement user roles (Admin, User)
- Add drag-and-drop media upload
- Implement media search & tagging
- Improve UI with animations

## Contributors
👨‍💻 **Deepak Ravi**  
✉️ Email: [your-email@example.com](mailto:dpakravi93@gmail.com)  
🐙 GitHub: [your-github](https://github.com/Dkravi93)

---
🚀 _Happy coding!_ 🎉

