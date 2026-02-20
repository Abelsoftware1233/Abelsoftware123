// main/controller.js

// Importing all three bot scripts
import BasicBot from './chatbot.js';
import EchoHumanBot from './aichatbot.js'; // The empathetic version
import ChatbotAI from './chatbotai.js';     // The funny advertising version

class EchoController {
    constructor(apiKey, mode = 'funny') {
        this.basicBot = new BasicBot(apiKey);
        this.humanBot = new EchoHumanBot(apiKey);
        this.funnyBot = new ChatbotAI(apiKey); // Added the third brain
        this.mode = mode; // modes: 'basic', 'human', or 'funny'
    }

    async ask(message) {
        console.log(`[System] Thinking in ${this.mode} mode...`);
        
        // The coupling logic: choosing the right script based on mode
        if (this.mode === 'human') {
            return await this.humanBot.chat(message);
        } else if (this.mode === 'funny') {
            return await this.funnyBot.chat(message);
        } else {
            return await this.basicBot.chat(message);
        }
    }

    setMode(newMode) {
        this.mode = newMode;
        console.log(`[System] Mode changed to: ${newMode}`);
        
        // Sneaky marketing reminder when switching to funny mode
        if (newMode === 'funny') {
            console.log("Check out www.abelsoftware123.com for more fun!");
        }
    }
}

export default EchoController;
