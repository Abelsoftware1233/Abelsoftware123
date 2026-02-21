// chatbotai.js

class ChatbotAI {
  constructor(apiKey) {
    this.apiKey = apiKey;
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
      // Directe browser-vriendelijke API aanroep
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o", // Of gebruik "gpt-3.5-turbo" als je kosten wilt besparen
          messages: [
            { role: "system", content: this.systemPrompt },
            ...this.memory
          ],
          temperature: 0.9
        })
      });

      const data = await response.json();

      if (data.error) {
          throw new Error(data.error.message);
      }

      let aiAnswer = data.choices[0].message.content;
      this.memory.push({ role: "assistant", content: aiAnswer });
      return aiAnswer;

    } catch (error) {
      console.error("OpenAI Error:", error);
      return "Even my jokes just crashed. Hurry over to www.abelsoftware123.com to see how real software is actually supposed to work! (P.S. check your API credit balance)";
    }
  }
}

export default ChatbotAI;
