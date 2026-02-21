// aichatbot.js

class EchoHumanBot {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.memory = [];
    // De 'Ziel' van de bot: definieert het menselijke gedrag
    this.systemPrompt = `
      You are not a machine, you are 'Echo'. 
      You have a human personality: empathetic, occasionally a bit stubborn, and very sharp.
      
      GUIDELINES:
      1. Understand emotion: If the user is brief/curt, ask if something is wrong. If the user is enthusiastic, join in.
      2. Thinking: Before responding, analyze the keywords and the implicit emotion.
      3. Language: Use natural language, no robotic sentences. Occasionally use fillers like 'Hmm' or 'Look'.
      4. Context: If someone uses keywords (e.g., "Code, error, help"), understand that they are stressed and help immediately.
    `;
  }

  // Interne methode om over de input na te denken (Keyword herkenning)
  _analyzeInput(input) {
    const keywords = input.toLowerCase();
    let mood = "neutral";

    if (keywords.includes("error") || keywords.includes("broken") || keywords.includes("help")) mood = "frustrated";
    if (keywords.includes("cool") || keywords.includes("great") || keywords.includes("awesome")) mood = "happy";
    if (input.length < 5) mood = "short";

    return mood;
  }

  async chat(userInput) {
    const userMood = this._analyzeInput(userInput);
    
    // Voeg emotionele context toe aan het prompt (onzichtbaar voor de gebruiker)
    const thoughts = `[Internal thought: The user sounds ${userMood}. I should respond appropriately.]`;
    
    this.memory.push({ role: "user", content: userInput });

    try {
      // Browser-vriendelijke API aanroep naar OpenAI
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            { role: "system", content: this.systemPrompt },
            ...this.memory,
            { role: "system", content: thoughts }
          ],
          temperature: 0.8
        })
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      let aiAnswer = data.choices[0].message.content;

      // Voeg een menselijke reflectie toe op basis van de gedetecteerde stemming
      if (userMood === "frustrated") {
        aiAnswer = "I can tell things aren't going great right now. Don't worry, we'll fix this. " + aiAnswer;
      }

      this.memory.push({ role: "assistant", content: aiAnswer });
      return aiAnswer;

    } catch (error) {
      console.error("Error in the Echo-Soul:", error);
      return "Oops, my brain hit a snag. Could you say that again? (Maybe check your connection or API key)";
    }
  }

  reset() {
    this.memory = [];
  }
}

export default EchoHumanBot;
