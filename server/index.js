const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const multer = require('multer');

dotenv.config();

const upload = multer({
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit for uploaded files
});

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:8080' })); // Allow requests from your frontend
app.use(express.urlencoded({ extended: true, limit: '50mb' })); // Parse URL-encoded bodies with increased limit
app.use(express.json({ limit: '50mb' })); // Parse JSON bodies with increased limit

const PORT = process.env.PORT || 5000;

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI; // Replace with your MongoDB URI
mongoose.connect(MONGODB_URI, { dbName: 'test' }, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Mongoose Schema for Images
const imageSchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  userId: {
    type: String,
    required: true,
  },
  prompt: {
    type: String,
    required: true,
  },
  imageData: {
    type: Buffer, // Store the binary image data
    required: true,
  },
  contentType: {
    type: String, // Store the MIME type (e.g., "image/jpeg")
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Image = mongoose.model('Image', imageSchema);

// Save image (using multipart/form-data)
app.post('/api/images/save', upload.single('image'), async (req, res) => {
  try {
    const { userId, prompt } = req.body;
    const imageFile = req.file;

    console.log('Received image data:', { userId, prompt, imageFile: imageFile ? `File size: ${imageFile.size} bytes` : 'undefined' });

    if (!userId || !prompt || !imageFile) {
      return res.status(400).json({ error: 'Missing required fields: userId, prompt, or image' });
    }

    // Save to MongoDB
    const image = new Image({
      userId,
      prompt,
      imageData: imageFile.buffer,
      contentType: imageFile.mimetype,
      createdAt: new Date(),
    });

    await image.save();

    res.json({ id: image.id });
  } catch (error) {
    console.error('Error saving image:', error);
    res.status(500).json({ error: 'Failed to save image' });
  }
});

// Get user images
app.get('/api/images/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const images = await Image.find({ userId });

    // Convert binary data to base64 for the response
    const imageData = images.map((image) => ({
      id: image.id,
      userId: image.userId,
      prompt: image.prompt,
      imageUrl: `data:${image.contentType};base64,${image.imageData.toString('base64')}`,
      createdAt: image.createdAt.toISOString(),
    }));

    res.json(imageData);
  } catch (error) {
    console.error('Error getting user images:', error);
    res.status(500).json({ error: 'Failed to get user images' });
  }
});

// Proxy endpoint to forward requests to Cloudflare API
app.post('/generate-image', async (req, res) => {
  const { prompt } = req.body;
  console.log('Received prompt:', prompt);
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID 
  const apiToken = process.env.CLOUDFLARE_API_TOKEN 

  try {
    const response = await axios({
      method: 'POST',
      url: `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/stabilityai/stable-diffusion-xl-base-1.0`,
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      data: {
        prompt,
        num_steps: 20,
        seed: Math.floor(Math.random() * 1000),
      },
      responseType: 'arraybuffer', // Handle binary response
    });

    // Convert binary response to base64
    const base64 = Buffer.from(response.data, 'binary').toString('base64');
    const imageUrl = `data:image/png;base64,${base64}`;

    res.status(200).json({ imageUrl });
  } catch (error) {
    console.error('Error generating image:', error.response?.data || error.message);
    const errorMessage =
      error.response?.data?.errors?.[0]?.message ||
      error.response?.data?.error ||
      error.message ||
      'Internal server error';
    res.status(500).json({ error: errorMessage });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});