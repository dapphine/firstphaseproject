const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 5000;

// Serve static files (optional)
app.use(express.static('public')); // If you want to serve static files (e.g., images, CSS)

// Parse JSON requests
app.use(express.json());

// Endpoint to get all models
app.get('/models', (req, res) => {
    const filePath = path.join(__dirname, 'db.json'); // Adjust if the path to db.json is different
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send("Error reading the database");
        }
        const models = JSON.parse(data).BMWs || [];
        res.json(models);
    });
});

// Endpoint to get a specific model by ID
app.get('/models/:id', (req, res) => {
    const modelId = req.params.id;
    const filePath = path.join(__dirname, 'db.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send("Error reading the database");
        }
        const models = JSON.parse(data).BMWs || [];
        const model = models.find(m => m.id == modelId);
        if (model) {
            res.json(model);
        } else {
            res.status(404).send("Model not found");
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
