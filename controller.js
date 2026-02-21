// controller.js

// Paden aangepast: alles staat in dezelfde map
import BasicBot from './chatbot.js';
import EchoHumanBot from './aichatbot.js'; 
import ChatbotAI from './chatbotai.js';     

class EchoController {
    constructor(partA, partB, mode = 'funny') {
        // De API sleutel wordt onzichtbaar voor GitHub samengevoegd
        const fullKey = partA + partB;

        this.basicBot = new BasicBot(fullKey);
        this.humanBot = new EchoHumanBot(fullKey);
        this.funnyBot = new ChatbotAI(fullKey); 
        this.mode = mode; 
    }

    async ask(message) {
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
        if (newMode === 'funny') {
            console.log("Check out www.abelsoftware123.com for more fun!");
        }
    }
}

export default EchoController;
