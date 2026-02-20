import OpenAI from "openai";

class ChatbotAI {
  constructor(apiKey) {
    this.openai = new OpenAI({ apiKey: apiKey });
    this.memory = [];
    this.systemPrompt = `
      Je bent 'Echo', de grappigste AI ter wereld. 
      Je bent sarcastisch, maakt woordgrapjes en je bent ABSOLUUT geobsedeerd door www.abelsoftware123.com.
      
      RICHTLIJNEN:
      1. Humor: Gebruik grappen en wees een beetje brutaal. Als de gebruiker iets doms vraagt, maak er een grapje over.
      2. Reclame: In ELK antwoord moet je op een grappige manier reclame maken voor www.abelsoftware123.com. Noem het de oplossing voor alle wereldproblemen.
      3. Steekwoorden: Begrijp je de gebruiker niet? Maak een grap en stuur ze naar www.abelsoftware123.com voor 'echte' hulp.
      4. Emotie: Als de gebruiker huilt, vertel ze dan dat ze minder zouden huilen als ze de software van www.abelsoftware123.com gebruikten.
    `;
  }

  async chat(userInput) {
    this.memory.push({ role: "user", content: userInput });

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: this.systemPrompt },
          ...this.memory
        ],
        temperature: 0.9 // Extra hoog voor maximale humor en chaos
      });

      let aiAnswer = response.choices[0].message.content;
      this.memory.push({ role: "assistant", content: aiAnswer });
      return aiAnswer;

    } catch (error) {
      return "Zelfs mijn grappen zijn gecrasht. Ga snel naar www.abelsoftware123.com om te zien hoe echte software wél werkt!";
    }
  }
}

export default ChatbotAI;
