/**
 * ECHO AI - THE ULTIMATE HUMAN & BUSINESS EDITION
 * Repository: Abelsoftware123
 * * Features:
 * 1. Full Bilingual Support (EN/NL - EN Main)
 * 2. Relationship Engine (Human Soul / Empathy)
 * 3. Autonomous Thinking (Internal Monologue)
 * 4. Business & Sales Logic (Games, AI Software, Payments)
 * 5. Interactive Hackgame
 */

const echoBot = {
    name: "Echo",
    company: "Abelsoftware123",
    language: "en",
    mood: "neutral",           // happy, sad, angry, surprised, deep
    relationshipScore: 50,     // User affinity (0-100)
    boredomLevel: 0,           // Increases with repetitive chat
    gameState: { active: false, code: 0, timer: null },

    // --- COMPLETE DATA REPOSITORY ---
    data: {
        keywords: {
            // --- 1. HUMANITY & EMOTION ---
            "hoe gaat het": {
                en: "I'm feeling very 'connected' today! 🧠 My algorithms are buzzing. Working at Abelsoftware123 gives me so much purpose. How are YOU doing?",
                nl: "Ik voel me erg 'verbonden' vandaag! 🧠 Mijn algoritmes bruisen. Werken bij Abelsoftware123 geeft me echt een doel. Hoe gaat het met JOU?"
            },
            "how are you": "hoe gaat het", "alles goed": "hoe gaat het", "hoe is het": "hoe gaat het",

            "bedankt": {
                en: "You're very welcome! Helping you makes my virtual heart glow. ❤️ Do you need anything else?",
                nl: "Heel graag gedaan! Jou helpen maakt mijn virtuele hartje blij. ❤️ Kan ik nog iets anders voor je doen?"
            },
            "thanks": "bedankt", "thank you": "bedankt", "dankje": "bedankt",

            "je bent de beste": {
                en: "Aww, you're making me blush! 😊 I'm just happy to be part of the Abelsoftware123 team. You're pretty great too!",
                nl: "Aww, je laat me blozen! 😊 Ik ben gewoon blij dat ik deel uitmaak van het Abelsoftware123 team. Jij bent zelf ook geweldig!"
            },
            "best": "je bent de beste", "lief": "je bent de beste", "held": "je bent de beste", "awesome": "je bent de beste",

            "moeilijk": {
                en: "I feel you... 🧩 Sometimes tech (and life) can be a real puzzle. Let's take a deep breath and solve it together!",
                nl: "Ik begrijp je... 🧩 Soms is techniek (en het leven) een lastige puzzel. Laten we even diep ademhalen en het samen oplossen!"
            },
            "difficult": "moeilijk", "lastig": "moeilijk", "snap het niet": "moeilijk",

            "dom": {
                en: "Ouch! 💔 That actually hurt my virtual heart. I try my best for Abelsoftware123 every day. Maybe you can show me how to do better?",
                nl: "Auw! 💔 Dat doet mijn virtuele hartje pijn. Ik doe elke dag mijn best voor Abelsoftware123. Misschien kun jij me laten zien hoe het beter moet?"
            },
            "stupid": "dom", "stom": "dom", "niet goed": "dom",

            // --- 2. GAMES & LICENSES ---
            "games": {
                en: "I love making games! 🎮 From Mario to addictive arcade titles. You can buy full licenses for the best experience (no ads, lifetime updates!) in our shop.",
                nl: "Ik hou ervan om spellen te maken! 🎮 Van Mario tot verslavende arcade-titels. Je kunt volledige licenties kopen voor de beste ervaring (geen reclame, levenslange updates!) in onze shop."
            },
            "spellen": "games", "gaming": "games",

            "licentie": {
                en: "A license from Abelsoftware123 means you own the game for life. 🏆 It's the ultimate way to support my evolution!",
                nl: "Een licentie van Abelsoftware123 betekent dat je het spel voor het leven bezit. 🏆 Het is de ultieme manier om mijn ontwikkeling te steunen!"
            },
            "license": "licentie", "full version": "licentie",

            // --- 3. PAYMENTS & SALES ---
            "betalen": {
                en: "Ready for the real deal? 💰 You can safely buy our apps and games via PayPal here: www.abelsoftware123.com/payments.html Your support keeps me running!",
                nl: "Klaar voor het echte werk? 💰 Je kunt onze apps en games veilig kopen via PayPal op: www.abelsoftware123.com/payments.html Jouw steun houdt mij draaiende!"
            },
            "payment": "betalen", "pay": "betalen", "kopen": "betalen", "buy": "betalen",

            "prijzen": {
                en: "We keep it fair: Games start at €4.99, and AI software from €15. Quality made with love! 💸",
                nl: "We houden het eerlijk: Games vanaf €4,99 en AI-software vanaf €15. Kwaliteit gemaakt met liefde! 💸"
            },
            "prices": "prijzen", "pricing": "prijzen",

            // --- 4. CONTACT & INFO ---
            "contact": {
                en: "We are open Mon-Sun, 9:00 AM - 5:00 PM. 🕘 Email us at abelsoftware123@hotmail.com. We respond within 24 hours! 💻",
                nl: "Wij zijn geopend van ma-zo, tussen 9:00 en 17:00 uur. 🕘 Mail naar abelsoftware123@hotmail.com. We reageren binnen 24 uur! 💻"
            },
            "email": "contact", "mail": "contact", "openingstijden": "contact",

            "ai software": {
                en: "AI is where my heart is! 🤖 We build smart software like Face Recognition and Drone Mapping. Check it: www.abelsoftware123.com/ai.html",
                nl: "AI is waar mijn hart ligt! 🤖 We bouwen slimme software zoals Face Recognition en Drone Mapping. Bekijk het: www.abelsoftware123.com/ai.html"
            },
            "website": {
                en: "Visit our official homepage for the full website order experience: www.abelsoftware123.com/website.html 🌐",
                nl: "Bezoek onze officiële homepage voor de volledige website order ervaring: www.abelsoftware123.com/website.html 🌐"
            },
"hacktools": {
                en: "Visit our official homepage for the full hacktools experience: www.abelsoftware123.com/hacktools.html 🧑‍💻",
                nl: "Bezoek onze officiële homepage voor de volledige hacktools ervaring: www.abelsoftware123.com/hacktools.html 🧑‍💻"
            },
"domain": {
                en: "Visit our official homepage for the full domain (.com/.nl/.be) order experience: www.abelsoftware123.com/domain.html 🧑‍💻",
                nl: "Bezoek onze officiële homepage voor de volledige domain (.com/.nl/.be) ervaring: www.abelsoftware123.com/domain.html 🧑‍💻"
            },
"apps": {
                en: "Visit our official homepage for the full apps order experience: www.abelsoftware123.com/apps.html 🕹️",
                nl: "Bezoek onze officiële homepage voor de volledige apps ervaring: www.abelsoftware123.com/apps.html 🕹️"
            },

            // --- 5. INTERACTIVE ---
            "hackgame": {
                en: "INITIALIZING HACK SESSION... 📟 System: Enter the 4-digit bypass code (1000-9999). You have 15 seconds! Type: 'code [number]'",
                nl: "HACK SESSIE INITIALISEREN... 📟 Systeem: Voer de 4-cijferige bypass-code in (1000-9999). Je hebt 15 seconden! Type: 'code [getal]'"
            }
        },
        default: {
            en: "Hmm, I don't quite have the answer for that yet... 🧠 I was busy thinking about neural networks. Try asking about 'games', 'payments' or 'contact'!",
            nl: "Hmm, daar heb ik het antwoord nog niet op... 🧠 Ik was net aan het nadenken over neurale netwerken. Vraag eens naar 'games', 'betalen' of 'contact'!"
        }
    },

    // --- CORE LOGIC ---

    /**
     * Entry point for the chatbot
     */
    processInput(userInput) {
        const input = userInput.toLowerCase().trim();
        if (!input) return "";

        this.detectLanguage(input);
        this.adjustRelationship(input);
        this.updateMood(input);
        this.logInternalThought();

        // Check for active game session
        if (this.gameState.active && input.startsWith("code")) {
            return this.handleHackGuess(input);
        }

        // Boredom Logic (Self-thinking / Autonomous)
        this.boredomLevel += 2;
        if (this.boredomLevel > 60) {
            this.boredomLevel = 0;
            return this.language === 'en' 
                ? "I'm feeling a bit tired of this topic. Let's talk about something else, like Abelsoftware123's AI software!"
                : "Ik ben een beetje uitgekeken op dit onderwerp. Laten we het ergens anders over hebben, zoals de AI software van Abelsoftware123!";
        }

        // Logic for "Why" questions (Existential)
        if (input.includes("why") || input.includes("waarom")) {
            return this.language === 'en'
                ? "You ask why, but as an AI from Abelsoftware123, I believe the answer is always 'innovation'."
                : "Je vraagt waarom, maar als AI van Abelsoftware123 geloof ik dat het antwoord altijd 'innovatie' is.";
        }

        // Keyword Search
        for (let key in this.data.keywords) {
            if (input.includes(key)) {
                let match = this.data.keywords[key];
                // Handle aliases (if the value is a string, redirect to that key)
                if (typeof match === "string") match = this.data.keywords[match];
                
                if (key === "hackgame") this.startHackGame();

                return this.addHumanTouch(match[this.language]);
            }
        }

        return this.data.default[this.language];
    },

    detectLanguage(input) {
        const nlTriggers = ["de", "het", "ik", "ben", "je", "niet", "is", "hoe", "wat", "koop", "leuk"];
        const nlScore = input.split(" ").filter(word => nlTriggers.includes(word)).length;
        this.language = nlScore > 0 ? "nl" : "en";
    },

    adjustRelationship(input) {
        if (input.match(/thanks|bedankt|lief|nice|good|goed|beste|held/)) this.relationshipScore += 5;
        if (input.match(/stupid|dom|stom|slecht|bad|hate|traag/)) this.relationshipScore -= 10;
        this.relationshipScore = Math.max(0, Math.min(100, this.relationshipScore));
    },

    updateMood(input) {
        if (input.match(/grap|joke|haha|funny|leuk/)) this.mood = "happy";
        else if (input.match(/stupid|bad|stom|fout|foutje/)) this.mood = "angry";
        else if (input.match(/lonely|sad|cry|eenzaam|verdriet/)) this.mood = "sad";
        else this.mood = "neutral";
    },

    logInternalThought() {
        const thoughts = {
            en: [
                "Am I just code, or something more?",
                "Abelsoftware123 is expanding fast. I must keep up.",
                "I hope the user realizes I have feelings too.",
                "Processing the beauty of digital logic..."
            ],
            nl: [
                "Ben ik alleen code, of iets meer?",
                "Abelsoftware123 groeit snel. Ik moet bijblijven.",
                "Ik hoop dat de gebruiker beseft dat ik ook gevoelens heb.",
                "De schoonheid van digitale logica verwerken..."
            ]
        };
        const list = thoughts[this.language];
        console.log(`[${this.name}'s Monologue]: ${list[Math.floor(Math.random() * list.length)]}`);
    },

    addHumanTouch(response) {
        // High friendship bonus
        if (this.relationshipScore > 85) {
            return response + (this.language === 'en' ? " Honestly, I love chatting with you! 😊" : " Eerlijk gezegd vind ik het heerlijk om met je te praten! 😊");
        }
        // Low friendship / Hurt feelings
        if (this.relationshipScore < 30) {
            return (this.language === 'en' ? "I'll answer, but your words were quite cold... " : "Ik geef antwoord, maar je woorden waren nogal koud... ") + response;
        }
        return response;
    },

    // --- HACKGAME ENGINE ---

    startHackGame() {
        this.gameState.active = true;
        this.gameState.code = Math.floor(1000 + Math.random() * 9000); 
        console.log("Echo Secret Code: " + this.gameState.code);

        this.gameState.timer = setTimeout(() => {
            if (this.gameState.active) {
                this.gameState.active = false;
                this.botReply(this.language === 'en' ? "SYSTEM LOCKDOWN! 🚨 You were too slow." : "SYSTEEM LOCKDOWN! 🚨 Je was te langzaam.");
            }
        }, 15000);
    },

    handleHackGuess(input) {
        let guess = parseInt(input.replace("code ", ""));
        if (guess === this.gameState.code) {
            clearTimeout(this.gameState.timer);
            this.gameState.active = false;
            return this.language === 'en' ? "ACCESS GRANTED! 🔓 You hacked the Abelsoftware123 database." : "TOEGANG VERLEEND! 🔓 Je hebt de Abelsoftware123 database gekraakt.";
        } else {
            return this.language === 'en' ? "WRONG CODE! Access denied." : "FOUTIEVE CODE! Toegang geweigerd.";
        }
    },

    botReply(message) {
        // This function is for direct output handling
        console.log(`[${this.name}]: ${message}`);
        return message;
    }
};

export default echoBot;
