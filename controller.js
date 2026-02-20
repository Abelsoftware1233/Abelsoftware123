// main/controller.js

// Importeer beide bots
import BasicBot from './chatbot.js';
import EchoHumanBot from './aichatbot.js'; // Dit is het script van je foto

class EchoController {
    constructor(apiKey, mode = 'human') {
        this.basicBot = new BasicBot(apiKey);
        this.humanBot = new EchoHumanBot(apiKey);
        this.mode = mode; // 'basis' of 'human'
    }

    async ask(message) {
        console.log(`[Systeem] Bezig met nadenken in ${this.mode} modus...`);
        
        // De koppeling: hier kiest hij welk script het werk doet
        if (this.mode === 'human') {
            return await this.humanBot.chat(message);
        } else {
            return await this.basicBot.chat(message);
        }
    }

    setMode(newMode) {
        this.mode = newMode;
        console.log(`[Systeem] Modus gewijzigd naar: ${newMode}`);
    }
}

export default EchoController;
