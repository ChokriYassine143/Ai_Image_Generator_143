AI Image Generator
AI Image Generator is a web application that allows users to generate images using the Cloudflare AI API (via Stable Diffusion) and save them to a MongoDB database. The project consists of a React frontend and an Express.js backend, with MongoDB for persistent storage. Users can generate images based on text prompts, save them, and retrieve their saved images. The backend integrates with the Cloudflare AI API to securely handle image generation.
Features

Image Generation: Generate images using the Cloudflare AI API (Stable Diffusion XL Base 1.0).
Cloudflare Integration: The backend proxies requests to the Cloudflare AI API, securely managing API keys and handling image generation.
Image Saving: Save generated images to MongoDB with associated metadata (user ID, prompt, and creation date).
Image Retrieval: Retrieve saved images for a specific user.
Image Compression: Compress images on the frontend to reduce upload size.
Proxy Backend: The backend acts as a proxy to securely call the Cloudflare AI API, keeping API keys hidden.

Planned Features (Not Yet Implemented)

Google Authentication: Add Google OAuth for user login.
Email Notifications: Send emails for account actions (e.g., registration, password reset).
Forgot Password: Implement a forgot password workflow with email-based reset links.
Note: These features can be implemented using Firebase Authentication (previously used in the project) or a custom solution with the current backend (e.g., using NodeMailer for emails and JWT for authentication).



Tech Stack

Frontend:
React (with TypeScript)
Fetch API for HTTP requests
browser-image-compression for image compression


Backend:
Express.js
MongoDB (with Mongoose)
Multer for handling multipart/form-data uploads
Axios for making requests to the Cloudflare AI API


Database:
MongoDB (local or MongoDB Atlas)


External APIs:
Cloudflare AI API (Stable Diffusion XL Base 1.0)


Environment Variables:
Managed with dotenv (backend) and React environment variables (frontend)



Project Structure
ai-image-generator/
├── server.js              # Backend Express server
├── .env                   # Backend environment variables
├── frontend/              # React frontend directory (assumed to be a subdirectory)
│   ├── src/
│   │   ├── userImageService.ts  # Service for saving and retrieving images
│   │   └── ...            # Other React components and files
│   ├── .env               # Frontend environment variables
│   └── package.json       # Frontend dependencies
└── README.md              # Project documentation

Prerequisites

Node.js (v14 or higher)
MongoDB (local installation or MongoDB Atlas account)
Cloudflare API Access (account ID and API token for the AI API)
npm (comes with Node.js)

Setup Instructions
1. Clone the Repository
git clone <repository-url>
cd ai-image-generator

2. Backend Setup
Install Dependencies
Navigate to the root directory (where server.js is located) and install backend dependencies:
npm install

Configure Environment Variables
Create a .env file in the root directory with the following variables:
# MongoDB URI (replace with your MongoDB Atlas URI or local URI)
MONGODB_URI=mongodb://localhost:27017

# Backend Port
PORT=5000

# Cloudflare API Credentials (replace with your credentials)
CLOUDFLARE_ACCOUNT_ID=dc33f77ea5277f7c87a79e0c935790a1
CLOUDFLARE_API_TOKEN=X6NDpzQE5AUv365-4-tcCn2Kcos2AWUyu4nErqUJ

Run the Backend
Start the backend server:
node server.js

The server will run on http://localhost:5000 (or the port specified in PORT).
3. Frontend Setup
Navigate to the Frontend Directory
Assuming the frontend is in a subdirectory named frontend:
cd frontend

Install Dependencies
Install frontend dependencies:
npm install

Configure Environment Variables
Create a .env file in the frontend directory with the following variable:
# Backend API URL
REACT_APP_API_URL=http://localhost:5000

Run the Frontend
Start the React development server:
npm start

The frontend will run on http://localhost:3000 (default for Create React App).
4. Test the Application

Open your browser and navigate to http://localhost:3000.
Use the UI to:
Generate an image by entering a prompt (this calls the /generate-image endpoint).
Save the generated image (this calls the /api/images/save endpoint).
Retrieve your saved images (this calls the /api/images/user/:userId endpoint).



Cloudflare Integration
The backend integrates with the Cloudflare AI API to generate images using Stable Diffusion XL Base 1.0. The /generate-image endpoint proxies requests to the Cloudflare API, ensuring that API keys are securely stored in the backend environment variables (CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN). This prevents exposing sensitive keys in the frontend.
How It Works

The frontend sends a prompt to the /generate-image endpoint.
The backend uses Axios to call the Cloudflare AI API with the prompt.
The Cloudflare API returns a binary image, which the backend converts to a base64-encoded string and sends back to the frontend as data:image/png;base64,....

API Endpoints
Backend API (Express)

POST /generate-image

Generates an image using the Cloudflare AI API.
Request Body: { "prompt": "A futuristic car" }
Response: { "imageUrl": "data:image/png;base64,..." }


POST /api/images/save

Saves an image to MongoDB.
Request: multipart/form-data with fields userId, prompt, and image (file)
Response: { "id": "some-uuid" }


GET /api/images/user/:userId

Retrieves all images for a user.
Response: Array of saved images with base64-encoded imageUrl



Environment Variables
Backend (.env in root directory)



Variable
Description
Example Value



MONGODB_URI
MongoDB connection string
mongodb://localhost:27017


PORT
Backend server port
5000


CLOUDFLARE_ACCOUNT_ID
Cloudflare account ID
dc33f77ea5277f7c87a79e0c935790a1


CLOUDFLARE_API_TOKEN
Cloudflare API token
X6NDpzQE5AUv365-4-tcCn2Kcos2AWUyu4nErqUJ


Frontend (.env in frontend directory)



Variable
Description
Example Value



REACT_APP_API_URL
Backend API base URL
http://localhost:5000


Troubleshooting

MongoDB Connection Error:
Ensure MongoDB is running locally (mongod) or that your MONGODB_URI is correct.


CORS Issues:
Verify that the backend CORS configuration (cors({ origin: 'http://localhost:8080' })) matches your frontend’s port (e.g., http://localhost:3000 if using Create React App).


Image Upload Fails:
Check the size of the image being uploaded; the backend has a 50MB limit (configured in multer).
Ensure the frontend is sending multipart/form-data with the correct fields (userId, prompt, image).


Cloudflare API Errors:
Verify your CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN in the backend .env file.
Check the Cloudflare API response in the backend logs for detailed error messages.



Deployment

Backend:

Deploy to a service like Heroku, Render, or a VPS.
Set environment variables in the hosting service’s dashboard.
Ensure MongoDB is accessible (e.g., use MongoDB Atlas).


Frontend:

Build the React app: cd frontend && npm run build.
Deploy to Netlify, Vercel, or another static hosting service.
Set REACT_APP_API_URL to your production backend URL (e.g., https://your-backend.com).



Future Improvements

Google Authentication: Implement Google OAuth for user login using Firebase Authentication or a custom solution (e.g., Passport.js with Google OAuth 2.0).
Email Notifications: Add email notifications for account actions (e.g., registration, password reset) using Firebase Authentication’s email features or a custom solution with NodeMailer.
Forgot Password: Implement a forgot password workflow with email-based reset links, either with Firebase Authentication or a custom solution (e.g., generating a reset token and sending it via email).
File Storage: Store images on the filesystem or a cloud storage service (e.g., AWS S3) instead of MongoDB to improve scalability.
Rate Limiting: Add rate limiting to the backend to prevent abuse of the Cloudflare API.
Error Handling: Improve error messages and add retry logic for failed API calls.

License
This project is licensed under the MIT License.
