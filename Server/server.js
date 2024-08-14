import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { fileURLToPath } from 'url';
import { GoogleAIFileManager } from "@google/generative-ai/server";
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
// Set up file upload handling
const upload = multer({ storage: multer.memoryStorage() });
// Initialize GoogleGenerativeAI with your API_KEY
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-pro',
});
// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Temporary file path
const tempFilePath = path.join(__dirname, 'temp', 'upload.tmp');
// Ensure temp directory exists
fs.mkdirSync(path.dirname(tempFilePath), { recursive: true });
// Route to handle file upload and content generation
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const prompt = req.body.prompt; // Get the prompt from the request body

    // Save the file buffer to a temporary file
    fs.writeFileSync(tempFilePath, req.file.buffer);

    // Upload file using GoogleAIFileManager
    const fileManager = new GoogleAIFileManager(process.env.API_KEY);
    const uploadResponse = await fileManager.uploadFile(tempFilePath, {
      mimeType: req.file.mimetype,
      displayName: req.file.originalname,
    });

    // Generate content using the uploaded file's URI and the provided prompt
    const result = await model.generateContent([
      {
        fileData: {
          mimeType: uploadResponse.file.mimeType,
          fileUri: uploadResponse.file.uri,
        },
      },
      { text: prompt }, // Use the prompt as part of the content generation
    ]);

    const generatedText = result.response.text();
    console.log(generatedText);

    res.json({
      description: generatedText,
      fileName: uploadResponse.file.displayName,
    });

    // Clean up temporary file
    fs.unlinkSync(tempFilePath);
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).send('An error occurred.');
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
