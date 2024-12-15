const express = require('express');
const multer = require('multer');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Configure Multer for file uploads
const upload = multer({ dest: 'uploads/' });

let words = [];

// Upload Endpoint
app.post('/upload', upload.single('wordfile'), (req, res) => {
    const filePath = req.file.path;
    const fileContent = fs.readFileSync(filePath, 'utf8');
    words = fileContent.split('\n').map(line => {
        const [word, meaning] = line.split(':').map(str => str.trim());
        return { word, meaning, correctCount: 0 };
    });
    fs.unlinkSync(filePath); // Delete uploaded file
    res.json({ message: 'File uploaded successfully!' });
});

// Get Random Words Endpoint
app.get('/words', (req, res) => {
    const shuffled = words.sort(() => 0.5 - Math.random());
    const selectedWords = shuffled.slice(0, 10);
    res.json(selectedWords);
});

// Check Word Endpoint
app.post('/check-word', (req, res) => {
    const { word, meaning } = req.body;
    const wordEntry = words.find(w => w.word === word);

    if (wordEntry && wordEntry.meaning.toLowerCase() === meaning.toLowerCase()) {
        wordEntry.correctCount++;
        if (wordEntry.correctCount >= 5) {
            words = words.filter(w => w.word !== word);
        }
        return res.json({ correct: true });
    }

    res.json({ correct: false });
});

// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
