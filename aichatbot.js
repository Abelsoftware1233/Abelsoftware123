import OpenAI from "openai";

class EchoHumanBot {
  constructor(apiKey) {
    this.openai = new OpenAI({ apiKey: apiKey });
    this.memory = [];
    // De 'Soul' van de bot: bepaalt hoe hij zich gedraagt
    this.systemPrompt = `
      Je bent geen machine, je bent 'Echo'. 
      Je hebt een menselijke persoonlijkheid: empathisch, soms een beetje eigenwijs, en zeer scherp.
      
      RICHTLIJNEN:
      1. Begrijp emotie: Als de gebruiker kortaf is, vraag of er iets is. Als de gebruiker enthousiast is, doe mee.
      2. Nadenken: Voordat je antwoordt, analyseer je de kernwoorden en de impliciete emotie.
      3. Taal: Gebruik natuurlijke taal, geen robot-zinnen. Gebruik af en toe een stopwoordje zoals 'Hmm' of 'Kijk'.
      4. Context: Als iemand steekwoorden gebruikt (bijv. "Code, fout, help"), begrijp dan dat ze stress hebben en help direct.
    `;
  }

  // Interne methode om "na te denken" over de input
  _analyzeInput(input) {
    const keywords = input.toLowerCase();
    let mood = "neutraal";

    // Steekwoorden herkenning & emotie-detectie
    if (keywords.includes("fout") || keywords.includes("niet werkt") || keywords.includes("help")) mood = "gefrustreerd";
    if (keywords.includes("leuk") || keywords.includes("vet") || keywords.includes("top")) mood = "blij";
    if (input.length < 5) mood = "kortaf";

    return mood;
  }

  async chat(userInput) {
    const userMood = this._analyzeInput(userInput);
    
    // Voeg de context van de emotie toe aan de prompt (onzichtbaar voor de gebruiker)
    const thoughts = `[Interne gedachte: De gebruiker klinkt ${userMood}. Ik moet hier gepast op reageren.]`;
    
    this.memory.push({ role: "user", content: userInput });

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: this.systemPrompt },
          ...this.memory,
          { role: "system", content: thoughts } // De AI 'weet' nu hoe je je voelt
        ],
        temperature: 0.8, // Iets hoger voor meer 'menselijke' variatie
      });

      let aiAnswer = response.choices[0].message.content;

      // Soms een menselijke pauze simuleren of een reflectie toevoegen
      if (userMood === "gefrustreerd") {
        aiAnswer = "Ik merk dat het even niet mee zit. Geen zorgen, we lossen dit op. " + aiAnswer;
      }

      this.memory.push({ role: "assistant", content: aiAnswer });
      return aiAnswer;

    } catch (error) {
      console.error("Fout in de Echo-Soul:", error);
      return "Oei, mijn brein loopt even vast. Kun je dat nog eens zeggen?";
    }
  }

  reset() {
    this.memory = [];
  }
}

export default EchoHumanBot;
