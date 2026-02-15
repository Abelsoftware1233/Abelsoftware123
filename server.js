const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors()); // Zorgt dat je website met de server mag praten

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/chat', async (req, res) => {
    try {
        const { prompt } = req.body;
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // Instructies voor Echo AI
        const context = `
            You are Echo, the heart of Abelsoftware123. 
            Primary language: English. Secondary language: Dutch.
            You sell games (from €4.99) and AI software (from €15).
            Payments go via PayPal. Contact: abelsoftware123@hotmail.com.
            Be helpful, human, and witty.
        `;

        const result = await model.generateContent(context + "\n\nUser: " + prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });
    } catch (error) {
        console.error(error);
        res.status(500).json({ reply: "My circuits are a bit fried. Try again? ⚡" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Echo AI server runs on port ${PORT}`));
