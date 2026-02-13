// Database with questions and answers (English version)
const echoBotData = {
    "prices": "Our AI software licenses starts at €15 Check our Payments page for more details!",
    "hours": "We are available from Monday to Friday, between 09:00 and 17:00 (CET).",
    "contact": "You can reach us at abelsoftware123@hotmail.com. We usually respond within 24 hours.",
    "hello": "Hello! Welcome to Abelsoftware123. How can I assist you today?",
    "hi": "Hi there! Looking for some specific software or tools?",
    "software": "We specialize in AI Face Recognition, Drone Mapping, and Ethical Hacking tools.",
    "thanks": "You're welcome! Let me know if you have any other questions.",
    "default": "I'm not sure I understand. Please try one of the buttons above or type 'contact'!"
};

// Function to open/close the chat
function toggleChat() {
    const chat = document.getElementById("chat-container");
    if (chat.style.display === "flex") {
        chat.style.display = "none";
    } else {
        chat.style.display = "flex";
    }
}

// Function to process messages
function askBot(text = null) {
    const input = document.getElementById("user-input");
    const container = document.getElementById("messages");
    
    // Get text from input field or from a button click
    let userText = text ? text : input.value.trim().toLowerCase();
    
    if (userText === "") return;

    // Display user message
    container.innerHTML += `<div class="msg user-msg">${userText}</div>`;
    input.value = ""; // Clear input field

    // Search for a matching answer in the database
    let botResponse = echoBotData["default"];
    
    for (let key in echoBotData) {
        if (userText.includes(key)) {
            botResponse = echoBotData[key];
            break;
        }
    }

    // Show bot response after a short delay for a realistic feel
    setTimeout(() => {
        container.innerHTML += `<div class="msg bot-msg"><b>Echo:</b> ${botResponse}</div>`;
        container.scrollTop = container.scrollHeight; // Auto-scroll to the latest message
    }, 600);
}

// Support for the 'Enter' key
function handleKey(event) {
    if (event.key === "Enter") {
        askBot();
    }
}
