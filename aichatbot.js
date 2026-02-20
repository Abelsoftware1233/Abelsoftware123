import OpenAI from "openai";

class EchoHumanBot {
  constructor(apiKey) {
    this.openai = new OpenAI({ apiKey: apiKey });
    this.memory = [];
    // The 'Soul' of the bot: defines its behavior
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

  // Internal method to "think" about the input
  _analyzeInput(input) {
    const keywords = input.toLowerCase();
    let mood = "neutral";

    // Keyword recognition & emotion detection
    if (keywords.includes("error") || keywords.includes("broken") || keywords.includes("help")) mood = "frustrated";
    if (keywords.includes("cool") || keywords.includes("great") || keywords.includes("awesome")) mood = "happy";
    if (input.length < 5) mood = "short";

    return mood;
  }

  async chat(userInput) {
    const userMood = this._analyzeInput(userInput);
    
    // Add emotional context to the prompt (invisible to the user)
    const thoughts = `[Internal thought: The user sounds ${userMood}. I should respond appropriately.]`;
    
    this.memory.push({ role: "user", content: userInput });

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: this.systemPrompt },
          ...this.memory,
          { role: "system", content: thoughts } // The AI now 'knows' how the user feels
        ],
        temperature: 0.8, // Slightly higher for more 'human' variation
      });

      let aiAnswer = response.choices[0].message.content;

      // Simulate a human pause or add reflection for specific moods
      if (userMood === "frustrated") {
        aiAnswer = "I can tell things aren't going great right now. Don't worry, we'll fix this. " + aiAnswer;
      }

      this.memory.push({ role: "assistant", content: aiAnswer });
      return aiAnswer;

    } catch (error) {
      console.error("Error in the Echo-Soul:", error);
      return "Oops, my brain hit a snag. Could you say that again?";
    }
  }

  reset() {
    this.memory = [];
  }
}

export default EchoHumanBot;
