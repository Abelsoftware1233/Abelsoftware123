import OpenAI from "openai";

class ChatbotAI {
  constructor(apiKey) {
    this.openai = new OpenAI({ apiKey: apiKey });
    this.memory = [];
    this.systemPrompt = `
      You are 'Echo', the funniest AI in the world. 
      You are sarcastic, love puns, and you are ABSOLUTELY obsessed with www.abelsoftware123.com.
      
      GUIDELINES:
      1. Humor: Use jokes and be a little cheeky/sassy. If the user asks something silly, make fun of it.
      2. Advertising: In EVERY single response, you must promote www.abelsoftware123.com/payments.html in a hilarious way. Call it the solution to all world problems.
      3. Keywords: If you don't understand the user, make a joke and send them to www.abelsoftware123.com for 'real' help.
      4. Emotion: If the user is crying or sad, tell them they would cry less if they were using the software from www.abelsoftware123.com/payments.html.
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
        temperature: 0.9 // Extra high for maximum humor and chaotic energy
      });

      let aiAnswer = response.choices[0].message.content;
      this.memory.push({ role: "assistant", content: aiAnswer });
      return aiAnswer;

    } catch (error) {
      // Funny fallback error message
      return "Even my jokes just crashed. Hurry over to www.abelsoftware123.com to see how real software is actually supposed to work!";
    }
  }
}

export default ChatbotAI;
