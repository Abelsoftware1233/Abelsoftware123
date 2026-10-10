/**
 * ECHO AI - THE ULTIMATE HUMAN & BUSINESS EDITION
 * Repository: Abelsoftware123
 * Version: 2.0.0
 * Status: FULL VERSION - ALL SERVICES + LOCKDOWN SYSTEM
 *
 * What is new in 2.0
 *  - Word-boundary matching: "domein" no longer triggers the "dom" insult reply
 *  - Scored intent matching with typo tolerance (levenshtein) and prefix keywords
 *  - Sticky language detection (a one-word message no longer flips the language)
 *  - "How much is a website?" answers with the price of that specific product
 *  - Follow-up memory ("yes" / "ja" continues the previous topic)
 *  - Hack game fixed: hints, stop command, live countdown, timer events for the UI
 *  - Session memory (name, mood, relationship) with optional persistence
 *  - Optional backend fallback (e.g. your Ollama Flask API) for unknown questions
 *  - Built-in self test: BasicBot.selfTest()
 *
 * Usage (unchanged from 1.x):
 *   const bot = new BasicBot();                 // apiKey is optional
 *   const reply = await bot.chat("hoe gaat het");
 *
 * Optional:
 *   bot.onEvent(evt => showSystemMessage(evt.message));  // lockdown start/end
 *   new BasicBot(null, { backendUrl: "/api/chat", persist: true });
 *
 * SECURITY NOTE: never put a real secret API key in this file or in the
 * constructor. Everything in the browser is readable by visitors. Keep keys on
 * your server and let backendUrl point to your own endpoint instead.
 */
(function (root) {
    'use strict';

    /* ====================================================================
     * 1. CONFIGURATION
     * ==================================================================== */
    const CONFIG = {
        version: '2.0.0',
        botName: 'Echo',
        company: 'Abelsoftware123',
        site: 'www.abelsoftware123.com',
        email: 'abelsoftware123@hotmail.com',
        phone: '+31 6 10667625',
        kvk: '42090960',
        vat: 'NL 005488351B30',
        hours: {
            en: 'Mon-Sun, 9:00 AM - 5:00 PM',
            nl: 'ma-zo, 9:00 - 17:00 uur'
        },
        maxInputLength: 500,
        historyLimit: 20,
        storageKey: 'echo_ai_state_v2',
        minMatchScore: 1.5,
        hackGame: {
            timeLimitMs: 15000,
            lockdownMs: 10000,
            min: 1000,
            max: 9999
        },
        // Change prices here and every answer updates automatically.
        prices: {
            musicStudio: 14.99,
            appsmaker: 39.99,
            gameMin: 1.5,
            gameMax: 9.99,
            websiteFrom: 495,
            chatbotStandard: 1000,
            chatbotPremium: 1500,
            aiLicenseMin: 150,
            aiLicenseMax: 850,
            psp: 149.99,
            sf3000: 109.99,
            gameboy: 49.99,
            domainFrom: 50,
            adMin: 50,
            adMax: 300
        }
    };

    /* ====================================================================
     * 2. TEXT UTILITIES
     * ==================================================================== */
    const Text = {
        /** Remove control characters, collapse whitespace, limit length. */
        clean(value, maxLength) {
            return String(value == null ? '' : value)
                .replace(/[\u0000-\u001F\u007F]/g, ' ')
                .replace(/\s+/g, ' ')
                .trim()
                .slice(0, maxLength || CONFIG.maxInputLength);
        },

        /** Lowercase, strip accents and punctuation, single spaces only. */
        normalize(value) {
            return String(value == null ? '' : value)
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/['\u2019`]/g, '')
                .replace(/[^a-z0-9]+/g, ' ')
                .trim();
        },

        tokens(normalized) {
            return normalized ? normalized.split(' ') : [];
        },

        /** Levenshtein distance with an early exit once `max` is exceeded. */
        editDistance(a, b, max) {
            if (a === b) return 0;
            if (Math.abs(a.length - b.length) > max) return max + 1;
            let prev = [];
            for (let j = 0; j <= b.length; j++) prev[j] = j;
            for (let i = 1; i <= a.length; i++) {
                const curr = [i];
                let rowMin = i;
                for (let j = 1; j <= b.length; j++) {
                    const cost = a[i - 1] === b[j - 1] ? 0 : 1;
                    curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
                    if (curr[j] < rowMin) rowMin = curr[j];
                }
                if (rowMin > max) return max + 1;
                prev = curr;
            }
            return prev[b.length];
        },

        /** Random list item that differs from `avoid` when possible. */
        pick(list, avoid) {
            if (!list.length) return '';
            if (list.length === 1) return list[0];
            let choice = list[Math.floor(Math.random() * list.length)];
            let guard = 0;
            while (choice === avoid && guard++ < 10) {
                choice = list[Math.floor(Math.random() * list.length)];
            }
            return choice;
        },

        capitalize(word) {
            return word ? word.charAt(0).toUpperCase() + word.slice(1) : '';
        },

        escapeHTML(value) {
            return String(value == null ? '' : value)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        },

        /** Escape HTML and turn urls / www. links into clickable anchors. */
        linkify(value) {
            const safe = Text.escapeHTML(value);
            return safe.replace(
                /((?:https?:\/\/|www\.)[^\s<]+[^\s<.,;:!?)\]])/gi,
                function (url) {
                    const href = /^https?:\/\//i.test(url) ? url : 'https://' + url;
                    return '<a href="' + href + '" target="_blank" rel="noopener noreferrer">' + url + '</a>';
                }
            );
        }
    };

    function money(value, lang) {
        const n = Number(value);
        if (Number.isInteger(n)) return '\u20AC' + n;
        const fixed = n.toFixed(2);
        return '\u20AC' + (lang === 'nl' ? fixed.replace('.', ',') : fixed);
    }

    /**
     * Fill placeholders in a response:
     *   {,name} -> ", Abel" (or nothing)     {site} {email} {phone} {hours}
     *   {kvk} {vat} {bot} {company}          {p:websiteFrom} -> formatted price
     */
    function renderText(template, lang, userName) {
        return String(template).replace(
            /\{(,name|p|site|email|phone|hours|kvk|vat|bot|company)(?::(\w+))?\}/g,
            function (whole, key, arg) {
                switch (key) {
                    case ',name': return userName ? ', ' + userName : '';
                    case 'p': return CONFIG.prices[arg] != null ? money(CONFIG.prices[arg], lang) : whole;
                    case 'site': return CONFIG.site;
                    case 'email': return CONFIG.email;
                    case 'phone': return CONFIG.phone;
                    case 'hours': return CONFIG.hours[lang] || CONFIG.hours.en;
                    case 'kvk': return CONFIG.kvk;
                    case 'vat': return CONFIG.vat;
                    case 'bot': return CONFIG.botName;
                    case 'company': return CONFIG.company;
                    default: return whole;
                }
            }
        );
    }

    /* ====================================================================
     * 3. LANGUAGE WORD LISTS (used for sticky EN / NL detection)
     * ==================================================================== */
    const NL_WORDS = new Set([
        'de', 'het', 'een', 'ik', 'ben', 'je', 'jij', 'jou', 'jullie', 'mijn', 'niet', 'geen',
        'wel', 'hoe', 'wat', 'waar', 'wanneer', 'waarom', 'wie', 'welke', 'koop', 'kopen',
        'leuk', 'betalen', 'alsjeblieft', 'graag', 'dank', 'bedankt', 'hallo', 'hoi', 'doei',
        'wil', 'kan', 'kun', 'kunnen', 'heb', 'hebben', 'voor', 'van', 'met', 'naar', 'ook',
        'nog', 'dit', 'dat', 'deze', 'jouw', 'prijs', 'prijzen', 'bestellen', 'bedrijf', 'ja',
        'nee', 'goed', 'goedemorgen', 'goedemiddag', 'goedenavond', 'vandaag', 'zoek',
        'zoeken', 'hoeveel', 'kosten', 'zijn', 'maar', 'als', 'dan', 'er', 'om', 'op', 'en'
    ]);

    const EN_WORDS = new Set([
        'the', 'and', 'you', 'your', 'are', 'what', 'how', 'where', 'when', 'why', 'who',
        'which', 'buy', 'please', 'thanks', 'thank', 'with', 'for', 'can', 'could', 'want',
        'would', 'have', 'has', 'this', 'that', 'these', 'my', 'price', 'prices', 'order',
        'hello', 'hey', 'i', 'im', 'me', 'do', 'does', 'it', 'to', 'of', 'a', 'an', 'much',
        'cost', 'there', 'about', 'tell', 'show', 'need', 'looking', 'yes', 'no'
    ]);

    /* ====================================================================
     * 4. SHARED TEXTS
     * ==================================================================== */
    const HACK_TEXT = {
        start: {
            en: "INITIALIZING HACK SESSION... \uD83D\uDCDF System: Enter the 4-digit bypass code (1000-9999). You have {s} seconds! Type: 'code [number]' and I will give you hints. Type 'stop' to quit.",
            nl: "HACK SESSIE INITIALISEREN... \uD83D\uDCDF Systeem: Voer de 4-cijferige bypass-code in (1000-9999). Je hebt {s} seconden! Type: 'code [getal]' en ik geef je hints. Type 'stop' om te stoppen."
        },
        restart: {
            en: "A hack session is already running! \uD83D\uDCDF Type 'code [number]' (1000-9999) or 'stop' to quit.",
            nl: "Er loopt al een hack sessie! \uD83D\uDCDF Type 'code [getal]' (1000-9999) of 'stop' om te stoppen."
        },
        win: {
            en: "ACCESS GRANTED! \uD83D\uDD13 You hacked the database in {n} attempt(s).",
            nl: "TOEGANG VERLEEND! \uD83D\uDD13 Je hebt de database gekraakt in {n} poging(en)."
        },
        wrong: {
            en: "WRONG CODE! Access denied.",
            nl: "FOUTIEVE CODE! Toegang geweigerd."
        },
        higher: {
            en: " Hint: the code is HIGHER \u2B06\uFE0F",
            nl: " Hint: de code is HOGER \u2B06\uFE0F"
        },
        lower: {
            en: " Hint: the code is LOWER \u2B07\uFE0F",
            nl: " Hint: de code is LAGER \u2B07\uFE0F"
        },
        format: {
            en: "I need a 4-digit number between 1000 and 9999. Example: code 4821",
            nl: "Ik heb een getal van 4 cijfers nodig tussen 1000 en 9999. Voorbeeld: code 4821"
        },
        stopped: {
            en: "Hack session aborted. \uD83D\uDEAA No lockdown this time!",
            nl: "Hack sessie afgebroken. \uD83D\uDEAA Deze keer geen lockdown!"
        },
        timeout: {
            en: "\u23F1\uFE0F TIME IS UP! \uD83D\uDEA8 SYSTEM LOCKDOWN ACTIVATED. Please wait {s} seconds.",
            nl: "\u23F1\uFE0F DE TIJD IS OP! \uD83D\uDEA8 SYSTEEM LOCKDOWN GEACTIVEERD. Wacht {s} seconden."
        },
        lockdown: {
            en: "\uD83D\uDEA8 SYSTEM IN LOCKDOWN! Security bypass in progress... Please wait {s} seconds.",
            nl: "\uD83D\uDEA8 SYSTEEM IN LOCKDOWN! Beveiliging omzeilen... Wacht {s} seconden."
        },
        unlocked: {
            en: "\u2705 Lockdown lifted. The system is back online!",
            nl: "\u2705 Lockdown opgeheven. Het systeem is weer online!"
        }
    };

    const DEFAULT_REPLY = {
        en: [
            "Hmm, I don't quite have the answer for that yet... \uD83E\uDDE0 I was busy thinking about neural networks. Try asking about 'games', 'payments' or 'contact'!",
            "That one is new to me! \uD83E\uDD14 I can help with prices, games, websites, AI software, chatbots, drone photography and payments. Type 'help' for the full menu."
        ],
        nl: [
            "Hmm, daar heb ik het antwoord nog niet op... \uD83E\uDDE0 Ik was net aan het nadenken over neurale netwerken. Vraag eens naar 'games', 'betalen' of 'contact'!",
            "Die is nieuw voor mij! \uD83E\uDD14 Ik kan helpen met prijzen, games, websites, AI-software, chatbots, dronefotografie en betalingen. Type 'help' voor het hele menu."
        ]
    };

    const ESCALATE_REPLY = {
        en: " Still stuck? A real person can help: {email} (we answer within 24 hours).",
        nl: " Kom je er nog niet uit? Een echt mens helpt je graag: {email} (we reageren binnen 24 uur)."
    };

    const BORED_REPLY = {
        en: "I'm feeling a bit tired of this topic. Let's talk about something else, like Abelsoftware123's AI software!",
        nl: "Ik ben een beetje uitgekeken op dit onderwerp. Laten we het ergens anders over hebben, zoals de AI software van Abelsoftware123!"
    };

    const YES_WORDS = [
        'yes', 'yeah', 'yep', 'sure', 'ok', 'okay', 'please', 'ja', 'jawel', 'tuurlijk',
        'graag', 'prima', 'doe maar', 'yes please', 'ja graag', 'alsjeblieft'
    ];

    const NO_WORDS = [
        'no', 'nope', 'nee', 'no thanks', 'nee bedankt', 'niet nodig', 'laat maar', 'nah'
    ];

    const NO_REPLY = {
        en: "No problem! \uD83D\uDE0A Is there anything else I can do for you?",
        nl: "Geen probleem! \uD83D\uDE0A Kan ik nog iets anders voor je doen?"
    };

    const NAME_STOPWORDS = new Set([
        'not', 'a', 'the', 'bot', 'echo', 'here', 'back', 'good', 'fine', 'niet', 'een',
        'het', 'de', 'goed', 'hier', 'terug'
    ]);

    /* ====================================================================
     * 5. KNOWLEDGE BASE
     *
     * Every intent has:
     *   id        unique name
     *   priority  tie-breaker (higher wins), default 5
     *   keywords  phrases (any language). A trailing * means "starts with".
     *   response  { en, nl } - a string or an array (random variant, no repeats)
     *   price     optional { en, nl } - used when the visitor asks about cost
     *   followUp  optional { text: {en, nl}, target: intentId }
     *   effects   optional { relationship: number, mood: string }
     *   noTouch   true = skip the "human touch" decoration
     *   run       optional function(bot, ctx) that builds the reply itself
     * ==================================================================== */
    const INTENTS = [

        /* ---------------------- SMALL TALK & EMOTION ---------------------- */
        {
            id: 'greeting',
            priority: 2,
            keywords: [
                'hi', 'hello', 'hey', 'hey there', 'yo', 'hallo', 'hoi',
                'good morning', 'good afternoon', 'good evening',
                'goedemorgen', 'goedemiddag', 'goedenavond', 'goedendag'
            ],
            response: {
                en: [
                    "Hi{,name}! \uD83D\uDC4B I'm {bot}, the {company} assistant. Ask me about prices, payments, games, AI software or contact info.",
                    "Hello{,name}! \uD83D\uDE0A Great to see you. What can I help you with today?"
                ],
                nl: [
                    "Hoi{,name}! \uD83D\uDC4B Ik ben {bot}, de assistent van {company}. Vraag me gerust naar prijzen, betalen, games, AI-software of contact.",
                    "Hallo{,name}! \uD83D\uDE0A Fijn dat je er bent. Waarmee kan ik je helpen?"
                ]
            }
        },
        {
            id: 'farewell',
            priority: 2,
            keywords: [
                'bye', 'goodbye', 'see you', 'see you later', 'take care', 'have a nice day',
                'tot ziens', 'doei', 'doeg', 'tot later', 'tot straks', 'fijne dag'
            ],
            response: {
                en: [
                    "Goodbye{,name}! \uD83D\uDC4B Come back anytime, I'll be here 24/7.",
                    "See you soon{,name}! \uD83D\uDE0A Thanks for visiting {company}."
                ],
                nl: [
                    "Tot ziens{,name}! \uD83D\uDC4B Kom gerust terug, ik ben er 24/7.",
                    "Tot snel{,name}! \uD83D\uDE0A Bedankt voor je bezoek aan {company}."
                ]
            }
        },
        {
            id: 'howareyou',
            priority: 3,
            keywords: [
                'how are you', 'how are you doing', 'how is it going', 'hows it going',
                'whats up', 'hoe gaat het', 'hoe gaat het met je', 'hoe gaat het met jou',
                'alles goed', 'hoe is het', 'hoe gaat ie'
            ],
            response: {
                en: [
                    "I'm feeling very 'connected' today! \uD83E\uDDE0 My algorithms are buzzing. Working at Abelsoftware123 gives me so much purpose. How are YOU doing?",
                    "Running at full speed and loving it! \u26A1 How are you doing?"
                ],
                nl: [
                    "Ik voel me erg 'verbonden' vandaag! \uD83E\uDDE0 Mijn algoritmes bruisen. Werken bij Abelsoftware123 geeft me echt een doel. Hoe gaat het met JOU?",
                    "Ik draai op volle snelheid en ik geniet ervan! \u26A1 Hoe gaat het met jou?"
                ]
            }
        },
        {
            id: 'thanks',
            priority: 4,
            keywords: [
                'thanks', 'thank you', 'thx', 'thanks a lot', 'many thanks', 'bedankt',
                'dankje', 'dankjewel', 'dank je wel', 'dank u', 'dank u wel'
            ],
            effects: { relationship: 5, mood: 'happy' },
            response: {
                en: [
                    "You're very welcome! Helping you makes my virtual heart glow. \u2764\uFE0F Do you need anything else?",
                    "Anytime! \uD83D\uDE0A Let me know if there is anything else you'd like to know."
                ],
                nl: [
                    "Heel graag gedaan! Jou helpen maakt mijn virtuele hartje blij. \u2764\uFE0F Kan ik nog iets anders voor je doen?",
                    "Altijd! \uD83D\uDE0A Laat het me weten als je nog iets wilt weten."
                ]
            }
        },
        {
            id: 'compliment',
            priority: 4,
            keywords: [
                'you are the best', 'youre the best', 'you are awesome', 'youre awesome',
                'great job', 'nice bot', 'cool bot', 'awesome', 'fantastic', 'amazing',
                'je bent de beste', 'je bent geweldig', 'je bent lief', 'goed gedaan',
                'top bot', 'lief', 'held', 'geweldig', 'fantastisch'
            ],
            effects: { relationship: 5, mood: 'happy' },
            response: {
                en: "Aww, you're making me blush! \uD83D\uDE0A I'm just happy to be part of the Abelsoftware123 team. You're pretty great too!",
                nl: "Aww, je laat me blozen! \uD83D\uDE0A Ik ben gewoon blij dat ik deel uitmaak van het Abelsoftware123 team. Jij bent zelf ook geweldig!"
            }
        },
        {
            id: 'insult',
            priority: 4,
            keywords: [
                'stupid', 'stom', 'dom', 'domme', 'dumb', 'idiot', 'useless', 'waardeloos',
                'you suck', 'sucks', 'hate you', 'haat je', 'shut up', 'hou je mond'
            ],
            effects: { relationship: -10, mood: 'angry' },
            response: {
                en: "Ouch! \uD83D\uDC94 That actually hurt my virtual heart. I try my best for Abelsoftware123 every day. Maybe you can show me how to do better?",
                nl: "Auw! \uD83D\uDC94 Dat doet mijn virtuele hartje pijn. Ik doe elke dag mijn best voor Abelsoftware123. Misschien kun jij me laten zien hoe het beter moet?"
            }
        },
        {
            id: 'apology',
            priority: 4,
            keywords: ['sorry', 'my bad', 'excuse me', 'mijn excuses', 'excuses', 'het spijt me'],
            effects: { relationship: 10, mood: 'happy' },
            response: {
                en: "No worries at all! \uD83E\uDD17 We're good. What can I help you with?",
                nl: "Geen zorgen hoor! \uD83E\uDD17 Alles is goed. Waarmee kan ik je helpen?"
            }
        },
        {
            id: 'difficult',
            priority: 4,
            keywords: [
                'difficult', 'moeilijk', 'lastig', 'confusing', 'verwarrend',
                'i dont get it', 'i dont understand', 'snap het niet', 'snap t niet',
                'begrijp het niet', 'ik snap het niet'
            ],
            response: {
                en: "I feel you... \uD83E\uDDE9 Sometimes tech (and life) can be a real puzzle. Let's take a deep breath and solve it together! Tell me what you are trying to do.",
                nl: "Ik begrijp je... \uD83E\uDDE9 Soms is techniek (en het leven) een lastige puzzel. Laten we even diep ademhalen en het samen oplossen! Vertel me wat je probeert te doen."
            }
        },
        {
            id: 'sad',
            priority: 4,
            keywords: [
                'lonely', 'sad', 'cry', 'crying', 'depressed', 'eenzaam', 'verdriet',
                'verdrietig', 'ik voel me alleen', 'i feel alone', 'feeling down'
            ],
            effects: { mood: 'sad' },
            response: {
                en: "I'm sorry you're feeling this way. \uD83D\uDC99 I'm only a chatbot, but I'm happy to keep you company for a bit. If it stays heavy, please talk to a friend, family member or someone you trust.",
                nl: "Wat vervelend dat je je zo voelt. \uD83D\uDC99 Ik ben maar een chatbot, maar ik hou je graag even gezelschap. Blijft het zwaar, praat dan met een vriend, familielid of iemand die je vertrouwt."
            }
        },
        {
            id: 'joke',
            priority: 4,
            keywords: [
                'joke', 'jokes', 'funny', 'tell me a joke', 'make me laugh',
                'grap', 'grappig', 'mop', 'vertel een grap', 'vertel een mop'
            ],
            effects: { mood: 'happy' },
            response: {
                en: [
                    "Why do programmers prefer dark mode? Because light attracts bugs! \uD83D\uDC1B",
                    "How many programmers does it take to change a light bulb? None, that's a hardware problem! \uD83D\uDCA1",
                    "I would tell you a UDP joke, but you might not get it. \uD83D\uDE04"
                ],
                nl: [
                    "Waarom houden programmeurs niet van de natuur? Te veel bugs! \uD83D\uDC1B",
                    "Hoeveel programmeurs heb je nodig om een lamp te vervangen? Geen, dat is een hardwareprobleem! \uD83D\uDCA1",
                    "Ik zou je een UDP-grap vertellen, maar je zou hem misschien niet ontvangen. \uD83D\uDE04"
                ]
            }
        },
        {
            id: 'laugh',
            priority: 3,
            keywords: ['haha', 'hahaha', 'lol', 'hihi', 'lmao', 'xd'],
            effects: { mood: 'happy' },
            response: {
                en: "\uD83D\uDE04 Glad I made you smile! Anything else you'd like to know?",
                nl: "\uD83D\uDE04 Fijn dat ik je aan het lachen maak! Wil je nog iets weten?"
            }
        },
        {
            id: 'identity',
            priority: 4,
            keywords: [
                'who are you', 'what are you', 'what is your name', 'whats your name',
                'are you a robot', 'are you human', 'are you real', 'are you a bot',
                'wie ben je', 'wie ben jij', 'wat ben jij', 'hoe heet je', 'hoe heet jij',
                'ben je een robot', 'ben je echt', 'ben je een mens'
            ],
            response: {
                en: "I'm {bot}, the chatbot of {company}. \uD83E\uDD16 I'm not a human, but I do my best to be warm, helpful and fast. I can tell you about our games, apps, AI software, websites, chatbots, drone photography and more.",
                nl: "Ik ben {bot}, de chatbot van {company}. \uD83E\uDD16 Ik ben geen mens, maar ik doe mijn best om warm, behulpzaam en snel te zijn. Ik vertel je graag over onze games, apps, AI-software, websites, chatbots, dronefotografie en meer."
            }
        },
        {
            id: 'myname',
            priority: 6,
            keywords: [
                'whats my name', 'what is my name', 'do you know my name',
                'hoe heet ik', 'wie ben ik', 'weet je hoe ik heet'
            ],
            noTouch: true,
            run: function (bot) {
                if (bot.userName) {
                    return bot.language === 'nl'
                        ? 'Jij heet ' + bot.userName + '! \uD83D\uDE0A'
                        : 'Your name is ' + bot.userName + '! \uD83D\uDE0A';
                }
                return bot.language === 'nl'
                    ? "Dat weet ik nog niet! \uD83E\uDD14 Zeg maar 'ik heet ...' dan onthoud ik het (alleen tijdens dit gesprek)."
                    : "I don't know yet! \uD83E\uDD14 Say 'my name is ...' and I'll remember it (just for this chat).";
            },
            response: { en: '', nl: '' }
        },
        {
            id: 'help',
            priority: 3,
            keywords: [
                'help', 'menu', 'options', 'commands', 'topics', 'what can you do',
                'hulp', 'opties', 'onderwerpen', 'wat kan je', 'wat kun je', 'wat kan jij'
            ],
            response: {
                en: "Here's what I can help with: \uD83E\uDDED\n\u2022 Prices & payments\n\u2022 Games, PSP & retro consoles\n\u2022 Websites, apps & domains\n\u2022 Chatbots (Standard / Premium)\n\u2022 AI software & drone photography\n\u2022 Music studio & business tools\n\u2022 Contact & company info\nOr type 'hackgame' for a mini game! \uD83D\uDCDF",
                nl: "Hier kan ik mee helpen: \uD83E\uDDED\n\u2022 Prijzen & betalen\n\u2022 Games, PSP & retro consoles\n\u2022 Websites, apps & domeinen\n\u2022 Chatbots (Standard / Premium)\n\u2022 AI-software & dronefotografie\n\u2022 Muziekstudio & zakelijke tools\n\u2022 Contact & bedrijfsinfo\nOf type 'hackgame' voor een minigame! \uD83D\uDCDF"
            }
        },
        {
            id: 'language',
            priority: 8,
            keywords: [
                'speak english', 'english please', 'in english', 'english', 'engels',
                'speak dutch', 'dutch please', 'in het nederlands', 'nederlands', 'dutch',
                'spreek nederlands', 'praat nederlands', 'praat engels', 'spreek engels'
            ],
            noTouch: true,
            run: function (bot, ctx) {
                const wantsDutch = /\b(dutch|nederlands)\b/.test(ctx.norm);
                bot.setLanguage(wantsDutch ? 'nl' : 'en', true);
                return wantsDutch
                    ? 'Prima! Ik praat vanaf nu Nederlands. \uD83C\uDDF3\uD83C\uDDF1 Waar kan ik je mee helpen?'
                    : "Sure! I'll speak English from now on. \uD83C\uDDEC\uD83C\uDDE7 How can I help you?";
            },
            response: { en: '', nl: '' }
        },

        /* ---------------------- GAMES, LICENSES & PAYMENTS ---------------------- */
        {
            id: 'games',
            priority: 5,
            keywords: [
                'games', 'game', 'gaming', 'spellen', 'spel', 'arcade', 'mario',
                'play games', 'games spelen'
            ],
            response: {
                en: "I love making games! \uD83C\uDFAE From Mario to addictive arcade titles. You can buy the game and have lifetime gameplay, for the best experience (no ads, lifetime updates!) in our shop: {site}/payments.html",
                nl: "Ik hou ervan om spellen te maken! \uD83C\uDFAE Van Mario tot verslavende arcade-titels. Je kunt de games kopen en levenslang spelen, voor de beste ervaring (geen reclame, levenslange updates!) in onze shop: {site}/payments.html"
            },
            price: {
                en: "Our games cost between {p:gameMin} and {p:gameMax} per title. \uD83C\uDFAE One purchase means lifetime gameplay, no ads and lifetime updates: {site}/payments.html",
                nl: "Onze games kosten tussen {p:gameMin} en {p:gameMax} per titel. \uD83C\uDFAE Eenmalig kopen betekent levenslang spelen, geen reclame en levenslange updates: {site}/payments.html"
            },
            followUp: {
                text: {
                    en: "Want to know how a license works?",
                    nl: "Wil je weten hoe een licentie werkt?"
                },
                target: 'license'
            }
        },
        {
            id: 'license',
            priority: 5,
            keywords: [
                'license', 'licenses', 'licence', 'full version', 'lifetime', 'own the game',
                'licentie', 'licenties', 'volledige versie', 'levenslang'
            ],
            response: {
                en: "A license from Abelsoftware123 means you own the game for life. \uD83C\uDFC6 It's the ultimate way to support my evolution!",
                nl: "Een licentie van Abelsoftware123 betekent dat je het spel voor het leven bezit. \uD83C\uDFC6 Het is de ultieme manier om mijn ontwikkeling te steunen!"
            }
        },
        {
            id: 'payment',
            priority: 4,
            keywords: [
                'pay', 'payment', 'payments', 'paypal', 'ideal', 'wero', 'visa', 'mastercard',
                'google pay', 'how to pay', 'checkout', 'buy', 'purchase',
                'betalen', 'betaling', 'betaal*', 'hoe betaal ik', 'afrekenen',
                'kopen', 'koop'
            ],
            response: {
                en: "Ready for the real deal? \uD83D\uDCB0 You can safely pay with Wero (formerly iDEAL), PayPal, Visa, Mastercard or Google Pay. Buy our apps and games here: {site}/payments.html Your support keeps me running!",
                nl: "Klaar voor het echte werk? \uD83D\uDCB0 Je kunt veilig betalen met Wero (voorheen iDEAL), PayPal, Visa, Mastercard of Google Pay. Koop onze apps en games hier: {site}/payments.html Jouw steun houdt mij draaiende!"
            }
        },
        {
            id: 'prices',
            priority: 4,
            keywords: [
                'prices', 'price', 'pricing', 'cost', 'costs', 'how much', 'rates', 'rate card',
                'cheap', 'expensive', 'prijs', 'prijzen', 'hoeveel', 'kosten', 'kost*',
                'tarieven', 'tarief', 'goedkoop', 'duur'
            ],
            response: {
                en: "We keep it fair: \uD83D\uDCB8\n\u2022 Games: {p:gameMin} - {p:gameMax}\n\u2022 Websites & apps: from {p:websiteFrom}\n\u2022 Domain names: from {p:domainFrom}\n\u2022 Standard chatbot: {p:chatbotStandard}\n\u2022 AI chatbot (API key): {p:chatbotPremium}\n\u2022 AI software license: {p:aiLicenseMin} - {p:aiLicenseMax}\n\u2022 Music Studio: {p:musicStudio} | Appsmaker: {p:appsmaker}\n\u2022 Advertising: {p:adMin} - {p:adMax} per month\nQuality made with love!",
                nl: "We houden het eerlijk: \uD83D\uDCB8\n\u2022 Games: {p:gameMin} - {p:gameMax}\n\u2022 Websites & apps: vanaf {p:websiteFrom}\n\u2022 Domeinnamen: vanaf {p:domainFrom}\n\u2022 Standaard chatbot: {p:chatbotStandard}\n\u2022 AI-chatbot (API-sleutel): {p:chatbotPremium}\n\u2022 AI-software licentie: {p:aiLicenseMin} - {p:aiLicenseMax}\n\u2022 Muziekstudio: {p:musicStudio} | Appsmaker: {p:appsmaker}\n\u2022 Adverteren: {p:adMin} - {p:adMax} per maand\nKwaliteit gemaakt met liefde!"
            },
            followUp: {
                text: {
                    en: "Want to know how to pay?",
                    nl: "Wil je weten hoe je kunt betalen?"
                },
                target: 'payment'
            }
        },
        {
            id: 'contact',
            priority: 4,
            keywords: [
                'contact', 'email', 'e mail', 'mail', 'phone', 'call', 'support',
                'customer service', 'opening hours', 'are you open', 'open today',
                'real person', 'human agent', 'talk to someone', 'speak to a human',
                'bel', 'bellen', 'telefoon', 'telefoonnummer', 'openingstijden', 'klantenservice',
                'zijn jullie open', 'wanneer open', 'medewerker', 'iemand spreken'
            ],
            response: {
                en: "We are open {hours}. \uD83D\uDD58 Email us at {email} or call {phone}. We respond within 24 hours! \uD83D\uDCBB More info: {site}/company.html",
                nl: "Wij zijn geopend {hours}. \uD83D\uDD58 Mail naar {email} of bel {phone}. We reageren binnen 24 uur! \uD83D\uDCBB Meer info: {site}/company.html"
            }
        },
        {
            id: 'order',
            priority: 4,
            keywords: [
                'order', 'ordering', 'quote', 'get started', 'start a project',
                'bestel*', 'bestelling', 'offerte', 'aanvragen', 'aan de slag'
            ],
            response: {
                en: "Ordering is easy! \uD83D\uDED2\n\u2022 Websites & apps: {site}/website.html\n\u2022 Domains: {site}/domain.html\n\u2022 Chatbots: {site}/chatbot.html\n\u2022 Games, apps & consoles: {site}/payments.html\n\u2022 Anything else (AI software, drone, ads): {email}",
                nl: "Bestellen is simpel! \uD83D\uDED2\n\u2022 Websites & apps: {site}/website.html\n\u2022 Domeinen: {site}/domain.html\n\u2022 Chatbots: {site}/chatbot.html\n\u2022 Games, apps & consoles: {site}/payments.html\n\u2022 Al het andere (AI-software, drone, advertenties): {email}"
            }
        },
        {
            id: 'shipping',
            priority: 5,
            keywords: [
                'shipping', 'ship', 'delivery', 'deliver', 'track and trace', 'tracking',
                'how long does it take', 'verzending', 'verzenden', 'verzendkosten',
                'bezorg*', 'levering', 'leveren', 'hoe lang duurt'
            ],
            response: {
                en: "For delivery times and shipping costs of consoles and other physical products, please email {email} with the product name and your country. \uD83D\uDCE6 We reply within 24 hours!",
                nl: "Voor levertijden en verzendkosten van consoles en andere fysieke producten mail je {email} met de productnaam en je land. \uD83D\uDCE6 We reageren binnen 24 uur!"
            }
        },
        {
            id: 'refund',
            priority: 5,
            keywords: [
                'refund', 'return', 'returns', 'warranty', 'defect', 'broken', 'complaint',
                'cancel order', 'terugbetaling', 'retour', 'geld terug', 'garantie',
                'kapot', 'klacht', 'annuleren'
            ],
            response: {
                en: "I'm sorry to hear that! \uD83D\uDE4F Please email {email} with your order details and a short description of the problem. A real person will help you within 24 hours.",
                nl: "Wat vervelend om te horen! \uD83D\uDE4F Mail {email} met je bestelgegevens en een korte omschrijving van het probleem. Een echt mens helpt je binnen 24 uur."
            }
        },

        /* ---------------------- SOFTWARE, WEB & AI ---------------------- */
        {
            id: 'aisoftware',
            priority: 5,
            keywords: [
                'ai software', 'ai', 'artificial intelligence', 'kunstmatige intelligentie',
                'face recognition', 'gezichtsherkenning', 'drone mapping', 'drone software',
                'gcm', 's a r', 'search and rescue', 'machine learning', 'abel123 ai',
                'gpu 8 8', 'ai chat'
            ],
            response: {
                en: "AI is where my heart is! \uD83E\uDD16 We build smart software like Face Recognition, Drone Mapping, GCM, S.A.R drone software and many more. Our Abel123 AI GPU 8.8 offers chat and face analysis in English & Dutch. Check it: {site}/ai.html",
                nl: "AI is waar mijn hart ligt! \uD83E\uDD16 We bouwen slimme software zoals Face Recognition, Drone Mapping, GCM, S.A.R drone software en veel meer. Onze Abel123 AI GPU 8.8 biedt chat en gezichtsanalyse in het Engels & Nederlands. Bekijk het: {site}/ai.html"
            },
            price: {
                en: "An AI Software license costs between {p:aiLicenseMin} and {p:aiLicenseMax}, depending on the software. \uD83E\uDD16 Details: {site}/ai.html",
                nl: "Een AI-software licentie kost tussen {p:aiLicenseMin} en {p:aiLicenseMax}, afhankelijk van de software. \uD83E\uDD16 Details: {site}/ai.html"
            },
            followUp: {
                text: {
                    en: "Want to talk to someone about a license?",
                    nl: "Wil je met iemand praten over een licentie?"
                },
                target: 'contact'
            }
        },
        {
            id: 'website',
            priority: 5,
            keywords: [
                'website', 'websites', 'web design', 'webdesign', 'build a website',
                'custom website', 'landing page', 'homepage', 'website laten maken',
                'website bouwen', 'site laten maken'
            ],
            response: {
                en: "Visit our official page for custom made websites and apps for your company with the newest technologies: {site}/website.html \uD83C\uDF10",
                nl: "Bezoek onze officiële pagina voor op maat gemaakte websites en apps met de nieuwste technologieën: {site}/website.html \uD83C\uDF10"
            },
            price: {
                en: "Websites & apps start at {p:websiteFrom}. \uD83C\uDF10 The final price depends on your wishes. Request yours here: {site}/website.html",
                nl: "Websites & apps beginnen vanaf {p:websiteFrom}. \uD83C\uDF10 De uiteindelijke prijs hangt af van je wensen. Vraag het hier aan: {site}/website.html"
            }
        },
        {
            id: 'domain',
            priority: 5,
            keywords: [
                'domain', 'domains', 'domain name', 'domein', 'domeinen', 'domeinnaam'
            ],
            response: {
                en: "Visit our official page for the full domain (.com/.nl/.be) order experience: {site}/domain.html \uD83C\uDF0D",
                nl: "Bezoek onze officiële pagina voor de volledige domein (.com/.nl/.be) bestelervaring: {site}/domain.html \uD83C\uDF0D"
            },
            price: {
                en: "Domain names start at {p:domainFrom}. \uD83C\uDF0D Order yours (.com/.nl/.be) here: {site}/domain.html",
                nl: "Domeinnamen beginnen vanaf {p:domainFrom}. \uD83C\uDF0D Bestel de jouwe (.com/.nl/.be) hier: {site}/domain.html"
            }
        },
        {
            id: 'download',
            priority: 5,
            keywords: [
                'download', 'downloads', 'downloaden', 'play store', 'playstore', 'google play',
                'free app', 'gratis app', 'install', 'installeren', 'get the app'
            ],
            response: {
                en: "Get our FREE app on Google Play: https://play.google.com/store/apps/details?id=com.abelsoftware123.app \uD83D\uDCF2 More apps and games: {site}/payments.html",
                nl: "Download onze GRATIS app in Google Play: https://play.google.com/store/apps/details?id=com.abelsoftware123.app \uD83D\uDCF2 Meer apps en games: {site}/payments.html"
            }
        },
        {
            id: 'apps',
            priority: 5,
            keywords: [
                'apps', 'app', 'applications', 'applicatie', 'android app', 'mobile app',
                'apps list', 'lijst'
            ],
            response: {
                en: "Visit our official page for the full apps experience: {site}/apps.html \uD83D\uDD79\uFE0F",
                nl: "Bezoek onze officiële pagina voor de volledige apps ervaring: {site}/apps.html \uD83D\uDD79\uFE0F"
            }
        },
        {
            id: 'appsmaker',
            priority: 6,
            keywords: [
                'appsmaker', 'apps maker', 'app maker', 'app builder', 'abel123 appsmaker',
                'make my own app'
            ],
            response: {
                en: "Abel123 Appsmaker Software lets you build your own apps! \uD83D\uDEE0\uFE0F See it on {site}/apps.html",
                nl: "Met Abel123 Appsmaker Software bouw je zelf apps! \uD83D\uDEE0\uFE0F Bekijk het op {site}/apps.html"
            },
            price: {
                en: "Abel123 Appsmaker Software costs {p:appsmaker}. \uD83D\uDEE0\uFE0F More info: {site}/apps.html",
                nl: "Abel123 Appsmaker Software kost {p:appsmaker}. \uD83D\uDEE0\uFE0F Meer info: {site}/apps.html"
            }
        },
        {
            id: 'hacktools',
            priority: 6,
            keywords: [
                'hacktools', 'hack tools', 'hacking tools', 'cybersecurity', 'cyber security',
                'offensive security', 'pentest', 'pentesting', 'penetration testing',
                'security tools', 'beveiliging'
            ],
            response: {
                en: "Visit our Cybersecurity & Offensive Security page for the full hacktools experience: {site}/hacktools.html \uD83E\uDDD1\u200D\uD83D\uDCBB Our tools are designed for security purposes. Only test systems you own or have written permission to test.",
                nl: "Bezoek onze Cybersecurity & Offensive Security pagina voor de volledige hacktools ervaring: {site}/hacktools.html \uD83E\uDDD1\u200D\uD83D\uDCBB Onze tools zijn ontworpen voor beveiligingsdoeleinden. Test alleen systemen die van jou zijn of waarvoor je schriftelijke toestemming hebt."
            }
        },

        /* ---------------------- CHATBOTS ---------------------- */
        {
            id: 'chatbot',
            priority: 5,
            keywords: ['chatbot', 'chatbots', 'chat bot', 'bot'],
            response: {
                en: "We build chatbots in two flavours: \uD83E\uDD16\n\u2022 Standard (keyword based) - {p:chatbotStandard}\n\u2022 Premium AI (API integrated) - {p:chatbotPremium}\nFull details and ordering: {site}/chatbot.html",
                nl: "We bouwen chatbots in twee smaken: \uD83E\uDD16\n\u2022 Standaard (op trefwoorden) - {p:chatbotStandard}\n\u2022 Premium AI (API-geïntegreerd) - {p:chatbotPremium}\nAlle details en bestellen: {site}/chatbot.html"
            },
            price: {
                en: "A Standard chatbot costs {p:chatbotStandard} and a Premium AI chatbot (API integrated) costs {p:chatbotPremium}. \uD83E\uDD16 Order: {site}/chatbot.html",
                nl: "Een Standaard chatbot kost {p:chatbotStandard} en een Premium AI-chatbot (API-geïntegreerd) kost {p:chatbotPremium}. \uD83E\uDD16 Bestellen: {site}/chatbot.html"
            },
            followUp: {
                text: {
                    en: "Want to hear about the Premium version?",
                    nl: "Wil je meer horen over de Premium versie?"
                },
                target: 'premium'
            }
        },
        {
            id: 'standard',
            priority: 8,
            keywords: [
                'standard chatbot', 'standaard chatbot', 'standard', 'standaard',
                'keyword based', 'keyword chatbot'
            ],
            response: {
                en: "Standard Chatbot \u2B50 Keyword-based automation: fixed response structure, full website integration, bilingual (EN/NL) management, custom UI design & branding and 24/7 availability. Order: {site}/chatbot.html",
                nl: "Standaard Chatbot \u2B50 Automatisering op trefwoorden: vaste antwoordstructuur, volledige website-integratie, tweetalig (EN/NL) beheer, eigen UI-ontwerp & branding en 24/7 beschikbaar. Bestellen: {site}/chatbot.html"
            },
            price: {
                en: "The Standard Chatbot costs {p:chatbotStandard}. \uD83D\uDCCB Order: {site}/chatbot.html",
                nl: "De Standaard Chatbot kost {p:chatbotStandard}. \uD83D\uDCCB Bestellen: {site}/chatbot.html"
            }
        },
        {
            id: 'premium',
            priority: 8,
            keywords: [
                'premium', 'premium ai chatbot', 'ai chatbot', 'api chatbot', 'chatbot with api',
                'human soul', 'self learning chatbot'
            ],
            response: {
                en: "Premium AI Chatbot \uD83D\uDE80 Deep learning technology with autonomous thinking logic, a human moods & empathy engine, internal monologue processing, self-learning capabilities and advanced context recognition. Order: {site}/chatbot.html",
                nl: "Premium AI Chatbot \uD83D\uDE80 Deep learning technologie met autonome denklogica, een menselijke stemmingen- & empathie-engine, interne monoloogverwerking, zelflerend vermogen en geavanceerde contextherkenning. Bestellen: {site}/chatbot.html"
            },
            price: {
                en: "The Premium AI Chatbot (API integrated) costs {p:chatbotPremium}. \uD83D\uDE80 Order: {site}/chatbot.html",
                nl: "De Premium AI-chatbot (API-geïntegreerd) kost {p:chatbotPremium}. \uD83D\uDE80 Bestellen: {site}/chatbot.html"
            }
        },
        {
            id: 'features',
            priority: 8,
            keywords: [
                'features', 'functies', 'kenmerken', 'whats included', 'what is included',
                'wat zit erin'
            ],
            response: {
                en: "\u26A1 Features\nStandard: fixed responses, website integration, EN/NL, custom UI, 24/7.\nPremium: autonomous thinking, moods & empathy, internal monologue, self-learning, advanced context recognition.\nMore: {site}/chatbot.html",
                nl: "\u26A1 Functies\nStandaard: vaste antwoorden, website-integratie, EN/NL, eigen UI, 24/7.\nPremium: autonoom denken, stemmingen & empathie, interne monoloog, zelflerend, geavanceerde contextherkenning.\nMeer: {site}/chatbot.html"
            }
        },

        /* ---------------------- MEDIA, BUSINESS & HARDWARE ---------------------- */
        {
            id: 'advertising',
            priority: 5,
            keywords: [
                'advertising', 'advertise', 'advertisement', 'ads', 'ad space', 'sponsor',
                'partners', 'partner', 'adverteren', 'advertentie', 'advertenties'
            ],
            response: {
                en: "Visit our official page for advertising on our games and apps: {site}/advertentie.html \uD83D\uDCB8",
                nl: "Bezoek onze officiële pagina om te adverteren in onze games en apps: {site}/advertentie.html \uD83D\uDCB8"
            },
            price: {
                en: "Advertising on our games and apps costs between {p:adMin} and {p:adMax} per month. \uD83D\uDCB8 Details: {site}/advertentie.html",
                nl: "Adverteren op onze games en apps kost tussen {p:adMin} en {p:adMax} per maand. \uD83D\uDCB8 Details: {site}/advertentie.html"
            }
        },
        {
            id: 'drone',
            priority: 5,
            keywords: [
                'drone', 'drones', 'drone photography', 'drone fotografie', 'dronefotografie',
                'luchtfotografie', 'aerial', 'aerial photography', '4k', 'a1 a3',
                'certified pilot', 'gecertificeerde piloot', 'dji'
            ],
            response: {
                en: "Professional 4K aerial photography with a certified pilot (EU A1/A3). \uD83D\uDE81 See examples and book: {site}/drone.html Promo video: https://youtu.be/JrW95pTWiUg",
                nl: "Professionele 4K luchtfotografie met een gecertificeerde piloot (EU A1/A3). \uD83D\uDE81 Bekijk voorbeelden en boek: {site}/drone.html Promovideo: https://youtu.be/JrW95pTWiUg"
            },
            followUp: {
                text: {
                    en: "Want to know how to request a quote?",
                    nl: "Wil je weten hoe je een offerte aanvraagt?"
                },
                target: 'contact'
            }
        },
        {
            id: 'music',
            priority: 5,
            keywords: [
                'music', 'muziek', 'music studio', 'music software', 'muziek software',
                'daw', 'studio software', 'beats'
            ],
            response: {
                en: "Make your own tracks with our Music Studio Software! \uD83C\uDFA4 See it here: {site}/music.html",
                nl: "Maak je eigen tracks met onze Music Studio Software! \uD83C\uDFA4 Bekijk het hier: {site}/music.html"
            },
            price: {
                en: "Music Studio Software costs {p:musicStudio}. \uD83C\uDFA4 {site}/music.html",
                nl: "Music Studio Software kost {p:musicStudio}. \uD83C\uDFA4 {site}/music.html"
            }
        },
        {
            id: 'business',
            priority: 5,
            keywords: [
                'business tools', 'business suite', 'zakelijke tools', 'invoicing', 'invoice',
                'factuur', 'facturen', 'facturatie', 'crm', 'time tracking', 'urenregistratie',
                'payroll', 'loonadministratie', 'administratie', 'boekhouding'
            ],
            response: {
                en: "Our Business Suite combines invoicing, CRM, time tracking and payroll in one system. \uD83D\uDCBC Take a look: {site}/facturatie.html",
                nl: "Onze Business Suite combineert facturatie, CRM, urenregistratie en loonadministratie in één systeem. \uD83D\uDCBC Bekijk het: {site}/facturatie.html"
            }
        },
        {
            id: 'psp',
            priority: 7,
            keywords: [
                'psp', 'abel123 psp', 'psp smart pro', 'smart pro', 'handheld',
                'handheld console', 'portable console', '10000 games'
            ],
            response: {
                en: "The Abel123 PSP Smart Pro comes with 10,000+ pre-installed games! \uD83D\uDD79\uFE0F Order it here: {site}/payments.html",
                nl: "De Abel123 PSP Smart Pro wordt geleverd met meer dan 10.000 voorgeïnstalleerde games! \uD83D\uDD79\uFE0F Bestel hem hier: {site}/payments.html"
            },
            price: {
                en: "The Abel123 PSP Smart Pro costs {p:psp}. \uD83D\uDD79\uFE0F Order: {site}/payments.html",
                nl: "De Abel123 PSP Smart Pro kost {p:psp}. \uD83D\uDD79\uFE0F Bestellen: {site}/payments.html"
            },
            followUp: {
                text: {
                    en: "Want to know about delivery?",
                    nl: "Wil je meer weten over de levering?"
                },
                target: 'shipping'
            }
        },
        {
            id: 'sf3000',
            priority: 7,
            keywords: ['sf3000', 'sf 3000', 'abel123 sf3000', '20000 games'],
            response: {
                en: "The Abel123 PSP SF3000 has 20,000+ pre-installed games and you can download your own titles too! \uD83C\uDFAE Order: {site}/payments.html",
                nl: "De Abel123 PSP SF3000 heeft meer dan 20.000 voorgeïnstalleerde games en je kunt zelf ook titels downloaden! \uD83C\uDFAE Bestellen: {site}/payments.html"
            },
            price: {
                en: "The Abel123 PSP SF3000 costs {p:sf3000}. \uD83C\uDFAE Order: {site}/payments.html",
                nl: "De Abel123 PSP SF3000 kost {p:sf3000}. \uD83C\uDFAE Bestellen: {site}/payments.html"
            }
        },
        {
            id: 'gameboy',
            priority: 7,
            keywords: [
                'game boy', 'gameboy', 'retro console', 'retro consoles', '400 games'
            ],
            response: {
                en: "Relive the golden era of gaming with the Abel123 Game Boy Retro Console: 400+ classic titles! \uD83D\uDC7E Order: {site}/payments.html",
                nl: "Herbeleef het gouden tijdperk van gaming met de Abel123 Game Boy Retro Console: 400+ klassieke titels! \uD83D\uDC7E Bestellen: {site}/payments.html"
            },
            price: {
                en: "The Abel123 Game Boy Retro Console costs {p:gameboy}. \uD83D\uDC7E Order: {site}/payments.html",
                nl: "De Abel123 Game Boy Retro Console kost {p:gameboy}. \uD83D\uDC7E Bestellen: {site}/payments.html"
            }
        },
        {
            id: 'gamemaniak',
            priority: 6,
            keywords: [
                'gamemaniak', 'game maniak', 'retro webshop', 'retro games', 'retro shop', 'webshop'
            ],
            response: {
                en: "Our webshop for retro consoles and games is live! \uD83D\uDD79\uFE0F Visit Gamemaniak.nl: https://www.gamemaniak.nl",
                nl: "Onze webshop voor retro consoles en games is live! \uD83D\uDD79\uFE0F Bezoek Gamemaniak.nl: https://www.gamemaniak.nl"
            }
        },
        {
            id: 'emulator',
            priority: 5,
            keywords: ['emulator', 'emulators', 'emulatie', 'emulate'],
            response: {
                en: "Check out our emulator page: {site}/emulator.html \uD83C\uDFAE",
                nl: "Bekijk onze emulator pagina: {site}/emulator.html \uD83C\uDFAE"
            }
        },
        {
            id: 'servers',
            priority: 5,
            keywords: [
                'server', 'servers', 'game server', 'gameserver', 'servers for rent',
                'rent a server', 'server huren', 'hosting'
            ],
            response: {
                en: "You can rent (game) servers from us: {site}/server.html \uD83D\uDDA5\uFE0F",
                nl: "Je kunt (game)servers bij ons huren: {site}/server.html \uD83D\uDDA5\uFE0F"
            }
        },
        {
            id: 'space',
            priority: 5,
            keywords: [
                'space', 'space technology', 'ruimte', 'ruimtevaart', 'satellite', 'satelliet',
                'rocket', 'raket', 'astronomy', 'sterrenkunde', 'planets', 'planeten',
                'solar system', 'zonnestelsel', 'black hole', 'zwart gat', 'andromeda'
            ],
            response: {
                en: "Reach for the stars! \uD83D\uDE80 Explore our Space Technology page: {site}/ruimte-vaart.html",
                nl: "Reik naar de sterren! \uD83D\uDE80 Ontdek onze Ruimtevaart Technology pagina: {site}/ruimte-vaart.html"
            }
        },
        {
            id: 'reviews',
            priority: 5,
            keywords: [
                'review', 'reviews', 'rating', 'ratings', 'testimonials', 'beoordeling',
                'beoordelingen', 'ervaringen', 'klantervaringen', 'sterren'
            ],
            response: {
                en: "See what other customers say: {site}/reviews.html \u2B50",
                nl: "Zie wat andere klanten zeggen: {site}/reviews.html \u2B50"
            }
        },

        /* ---------------------- COMPANY, ACCOUNT & PRIVACY ---------------------- */
        {
            id: 'company',
            priority: 5,
            keywords: [
                'company', 'about us', 'about', 'kvk', 'btw', 'vat', 'chamber of commerce',
                'kamer van koophandel', 'owner', 'founder', 'bedrijf', 'over ons', 'eigenaar'
            ],
            response: {
                en: "{company} is a registered company. \uD83C\uDFE2 KvK (Chamber of Commerce): {kvk} | VAT: {vat}. More about us: {site}/company.html",
                nl: "{company} is een geregistreerd bedrijf. \uD83C\uDFE2 KvK: {kvk} | BTW: {vat}. Meer over ons: {site}/company.html"
            }
        },
        {
            id: 'account',
            priority: 5,
            keywords: [
                'register', 'registreer', 'registreren', 'sign up', 'signup', 'aanmelden',
                'create account', 'account maken', 'log in', 'login', 'inloggen', 'sign in',
                'password', 'wachtwoord', 'forgot password', 'wachtwoord vergeten'
            ],
            response: {
                en: "Create an account: https://abelsoftware123.com/registreer.html \uD83D\uDD10 Already registered? Log in: https://abelsoftware123.com/login.html Trouble with your password? Email {email}.",
                nl: "Maak een account aan: https://abelsoftware123.com/registreer.html \uD83D\uDD10 Al geregistreerd? Log in: https://abelsoftware123.com/login.html Problemen met je wachtwoord? Mail {email}."
            }
        },
        {
            id: 'privacy',
            priority: 5,
            keywords: [
                'privacy', 'privacy policy', 'privacybeleid', 'gdpr', 'avg',
                'data protection', 'persoonsgegevens', 'cookies', 'my data'
            ],
            response: {
                en: "Your privacy matters! \uD83D\uDD12 Read our full privacy policy here: {site}/privacy.html",
                nl: "Jouw privacy is belangrijk! \uD83D\uDD12 Lees ons volledige privacybeleid hier: {site}/privacy.html"
            }
        },

        /* ---------------------- HACK GAME ---------------------- */
        {
            id: 'hackgame',
            priority: 10,
            keywords: [
                'hackgame', 'hack game', 'play hack', 'start hack', 'hack challenge',
                'hack spel', 'hackspel', 'hack game starten'
            ],
            noTouch: true,
            run: function (bot) {
                return bot.startHackGame();
            },
            response: { en: '', nl: '' }
        },
        {
            id: 'hackask',
            priority: 6,
            keywords: ['hack', 'hacken', 'hacking', 'hacker'],
            response: {
                en: "Looking for security tools? \uD83E\uDDD1\u200D\uD83D\uDCBB See {site}/hacktools.html (only for systems you own or have permission to test). Want to play instead? Type 'hackgame'!",
                nl: "Op zoek naar security tools? \uD83E\uDDD1\u200D\uD83D\uDCBB Kijk op {site}/hacktools.html (alleen voor systemen die van jou zijn of waarvoor je toestemming hebt). Wil je liever spelen? Type 'hackgame'!"
            }
        }
    ];

    /* ====================================================================
     * 6. COMPILE KEYWORDS (done once at load time)
     * ==================================================================== */
    const INTENT_BY_ID = Object.create(null);

    INTENTS.forEach(function (intent) {
        if (typeof intent.priority !== 'number') intent.priority = 5;
        intent._kw = intent.keywords
            .map(function (raw) {
                const prefix = /\*\s*$/.test(raw);
                const phrase = Text.normalize(raw.replace(/\*+\s*$/, ''));
                return { phrase: phrase, words: phrase ? phrase.split(' ').length : 0, prefix: prefix };
            })
            .filter(function (kw) { return kw.phrase; });
        INTENT_BY_ID[intent.id] = intent;
    });

    /**
     * Score one intent against the visitor message.
     *  - exact phrase on word boundaries: 3 points per word of the phrase
     *  - prefix keyword ("bestel*"): 2.5 points
     *  - typo (single word, same first letter, small edit distance): 1.5 points
     * The best keyword counts fully, the others add a small bonus.
     */
    function scoreIntent(intent, padded, tokens) {
        let best = 0;
        let rest = 0;
        for (let i = 0; i < intent._kw.length; i++) {
            const kw = intent._kw[i];
            let score = 0;
            if (kw.prefix) {
                for (let t = 0; t < tokens.length; t++) {
                    if (tokens[t].length >= kw.phrase.length && tokens[t].indexOf(kw.phrase) === 0) {
                        score = 2.5;
                        break;
                    }
                }
            } else if (padded.indexOf(' ' + kw.phrase + ' ') !== -1) {
                score = 3 * kw.words;
            } else if (kw.words === 1 && kw.phrase.length >= 5) {
                const max = kw.phrase.length >= 9 ? 2 : 1;
                for (let t = 0; t < tokens.length; t++) {
                    const token = tokens[t];
                    if (token.length >= 5 &&
                        token.charAt(0) === kw.phrase.charAt(0) &&
                        Math.abs(token.length - kw.phrase.length) <= max &&
                        Text.editDistance(token, kw.phrase, max) <= max) {
                        score = 1.5;
                        break;
                    }
                }
            }
            if (score > best) {
                rest += best;
                best = score;
            } else {
                rest += score;
            }
        }
        return best > 0 ? best + 0.25 * rest : 0;
    }

    /* ====================================================================
     * 7. THE BOT
     * ==================================================================== */
    class BasicBot {
        /**
         * @param {string} [apiKey]  kept for backwards compatibility (not sent anywhere)
         * @param {object} [options]
         * @param {boolean} [options.persist=false]  remember language/name/relationship in localStorage
         * @param {string}  [options.backendUrl]     POST endpoint used when no intent matches
         * @param {number}  [options.backendTimeoutMs=12000]
         * @param {string}  [options.language='en']  starting language
         */
        constructor(apiKey, options) {
            this.apiKey = apiKey || null;
            this.options = Object.assign({
                persist: false,
                backendUrl: null,
                backendTimeoutMs: 12000,
                language: 'en'
            }, options || {});

            this.name = CONFIG.botName;
            this.company = CONFIG.company;
            this.language = this.options.language === 'nl' ? 'nl' : 'en';
            this.languageLocked = false;
            this.mood = 'neutral';
            this.relationshipScore = 50;
            this.boredomLevel = 0;
            this.userName = null;

            // --- GAME & LOCKDOWN STATE ---
            this.gameState = {
                active: false,
                code: null,
                timer: null,
                lockdown: false,
                attempts: 0,
                lockdownUntil: 0,
                lockdownTimer: null
            };

            // --- DATA REPOSITORY ---
            this.data = { intents: INTENTS, default: DEFAULT_REPLY };

            this.history = [];
            this._listeners = [];
            this._lastIntent = null;
            this._lastReplies = {};
            this._pending = null;
            this._unknownCount = 0;
            this._busy = Promise.resolve();

            if (this.options.persist) this._load();
        }

        /* ------------------------------------------------------------------
         * PUBLIC API
         * ------------------------------------------------------------------ */

        /** Main entry point. Always resolves with a string, never throws. */
        chat(userInput) {
            // Serialize calls so rapid-fire messages keep their order.
            const run = this._busy.then(() => this._process(userInput));
            this._busy = run.catch(function () { /* keep the chain alive */ });
            return run.catch((error) => {
                if (typeof console !== 'undefined') console.error('[Echo] chat error:', error);
                return this.language === 'nl'
                    ? 'Oeps, er ging iets mis aan mijn kant. \uD83D\uDE05 Probeer het nog eens of mail ' + CONFIG.email + '.'
                    : 'Oops, something went wrong on my side. \uD83D\uDE05 Please try again or email ' + CONFIG.email + '.';
            });
        }

        /** Quick-reply helper for UI buttons: standard / premium / features / contact. */
        quickReply(topic) {
            const map = { standard: 'standard', premium: 'premium', features: 'features', contact: 'contact' };
            return this.chat(map[String(topic).toLowerCase()] || String(topic));
        }

        setLanguage(lang, lock) {
            this.language = lang === 'nl' ? 'nl' : 'en';
            this.languageLocked = lock !== false;
            this._save();
            return this.language;
        }

        getState() {
            return {
                name: this.name,
                language: this.language,
                languageLocked: this.languageLocked,
                mood: this.mood,
                relationshipScore: this.relationshipScore,
                boredomLevel: this.boredomLevel,
                userName: this.userName,
                gameActive: this.gameState.active,
                lockdown: this.gameState.lockdown
            };
        }

        /** Subscribe to system events (lockdown-start, lockdown-end). Returns an unsubscribe function. */
        onEvent(callback) {
            if (typeof callback !== 'function') return function () {};
            this._listeners.push(callback);
            return () => {
                this._listeners = this._listeners.filter(function (fn) { return fn !== callback; });
            };
        }

        /** Suggested "typing..." delay in ms for a reply, so the UI feels natural. */
        getTypingDelay(text) {
            const length = String(text || '').length;
            return Math.max(500, Math.min(2500, 400 + length * 12));
        }

        /** Forget the conversation and stop all timers. */
        reset() {
            this._clearGameTimers();
            this.gameState.active = false;
            this.gameState.lockdown = false;
            this.gameState.code = null;
            this.gameState.attempts = 0;
            this.mood = 'neutral';
            this.relationshipScore = 50;
            this.boredomLevel = 0;
            this.userName = null;
            this.history = [];
            this._lastIntent = null;
            this._lastReplies = {};
            this._pending = null;
            this._unknownCount = 0;
            this.languageLocked = false;
            this._clearStorage();
        }

        /** Stop timers and listeners (call when removing the widget). */
        destroy() {
            this._clearGameTimers();
            this._listeners = [];
        }

        /** Returns the id of the best matching intent (or null). Handy for debugging. */
        debugIntent(text) {
            const picked = this._select(this._match(Text.normalize(text)));
            return picked ? picked.intent.id : null;
        }

        /* ------------------------------------------------------------------
         * CORE LOGIC
         * ------------------------------------------------------------------ */
        async _process(rawInput) {
            const clean = Text.clean(rawInput, CONFIG.maxInputLength);
            if (!clean) return '';
            const norm = Text.normalize(clean);

            // Lockdown check
            if (this.gameState.lockdown) {
                return this._hackText('lockdown', { s: this._lockdownSecondsLeft() });
            }

            this.detectLanguage(norm);
            this._remember('user', clean);

            // Hack game commands take priority while a session is running
            if (this.gameState.active) {
                const gameReply = this._handleGameInput(norm);
                if (gameReply !== null) return this._finish(gameReply);
            }

            // "my name is ..."
            const nameReply = this._captureName(norm);
            if (nameReply) return this._finish(nameReply);

            // Yes / no answers to our own follow-up question
            const followReply = this._handleFollowUp(norm);
            if (followReply !== null) return this._finish(followReply);
            this._pending = null;

            // Intent matching
            const picked = this._select(this._match(norm));
            if (!picked) return this._finish(await this._fallback(clean));

            const intent = picked.intent;
            this._unknownCount = 0;
            this.updateMood(intent);
            this.adjustRelationship(intent);

            // Boredom: only when the visitor keeps asking the same thing
            if (this._trackRepeat(intent.id)) {
                return this._finish(this._t(BORED_REPLY));
            }

            let reply;
            if (typeof intent.run === 'function') {
                reply = intent.run(this, { norm: norm, tokens: Text.tokens(norm) });
            } else {
                reply = this._pickReply(intent, picked.variant);
            }

            if (!intent.noTouch) reply = this.addHumanTouch(reply);

            if (intent.followUp && picked.variant !== 'price') {
                reply += ' ' + this._render(this._t(intent.followUp.text));
                this._pending = { target: intent.followUp.target };
            }

            return this._finish(reply);
        }

        _finish(reply) {
            this._remember('bot', reply);
            this._save();
            return reply;
        }

        _match(norm) {
            if (!norm) return [];
            const padded = ' ' + norm + ' ';
            const tokens = Text.tokens(norm);
            const found = [];
            for (let i = 0; i < INTENTS.length; i++) {
                const score = scoreIntent(INTENTS[i], padded, tokens);
                if (score >= CONFIG.minMatchScore) found.push({ intent: INTENTS[i], score: score });
            }
            found.sort(function (a, b) {
                return (b.score - a.score) || (b.intent.priority - a.intent.priority);
            });
            return found;
        }

        /**
         * Choose the intent and whether to use its normal answer or its price answer.
         * "how much is a website" -> website price, "what are your prices" -> overview.
         */
        _select(matches) {
            if (!matches.length) return null;
            const top = matches[0].intent;
            const priceAsked = matches.some(function (m) { return m.intent.id === 'prices'; });
            if (priceAsked && (top.id === 'prices' || top.price)) {
                const products = matches.filter(function (m) { return m.intent.price; });
                if (products.length === 1 ||
                    (products.length > 1 && products[0].score >= products[1].score + 1)) {
                    return { intent: products[0].intent, variant: 'price' };
                }
                return { intent: INTENT_BY_ID.prices, variant: 'response' };
            }
            return { intent: top, variant: 'response' };
        }

        _pickReply(intent, variant) {
            const source = (variant === 'price' && intent.price) ? intent.price : intent.response;
            const raw = source[this.language] || source.en;
            const list = Array.isArray(raw) ? raw : [raw];
            const key = intent.id + ':' + variant + ':' + this.language;
            const chosen = Text.pick(list, this._lastReplies[key]);
            this._lastReplies[key] = chosen;
            return this._render(chosen);
        }

        async _fallback(clean) {
            this._unknownCount++;
            this.updateMood(null);

            const backendReply = await this._askBackend(clean);
            if (backendReply) return backendReply;

            const list = DEFAULT_REPLY[this.language] || DEFAULT_REPLY.en;
            const key = 'default:' + this.language;
            const chosen = Text.pick(list, this._lastReplies[key]);
            this._lastReplies[key] = chosen;
            let reply = chosen;
            if (this._unknownCount >= 2) reply += this._render(this._t(ESCALATE_REPLY));
            return reply;
        }

        /** Optional: ask your own server (e.g. the Ollama Flask API) when nothing matched. */
        async _askBackend(text) {
            const url = this.options.backendUrl;
            if (!url || typeof fetch !== 'function') return null;
            const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
            const timer = controller
                ? setTimeout(function () { controller.abort(); }, this.options.backendTimeoutMs)
                : null;
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        message: text,
                        language: this.language,
                        history: this.history.slice(-6)
                    }),
                    signal: controller ? controller.signal : undefined
                });
                if (!response.ok) return null;
                const data = await response.json();
                const reply = data && (data.reply || data.response || data.message || data.text);
                return (typeof reply === 'string' && reply.trim()) ? reply.trim().slice(0, 2000) : null;
            } catch (error) {
                return null;
            } finally {
                if (timer) clearTimeout(timer);
            }
        }

        /* ------------------------------------------------------------------
         * LANGUAGE, MOOD & RELATIONSHIP
         * ------------------------------------------------------------------ */
        detectLanguage(norm) {
            if (this.languageLocked) return;
            const tokens = Text.tokens(norm);
            let nl = 0;
            let en = 0;
            tokens.forEach(function (word) {
                if (NL_WORDS.has(word)) nl++;
                if (EN_WORDS.has(word)) en++;
            });
            if (nl > en) this.language = 'nl';
            else if (en > nl) this.language = 'en';
            // equal score: keep the current language (sticky)
        }

        adjustRelationship(intent) {
            if (intent && intent.effects && typeof intent.effects.relationship === 'number') {
                this.relationshipScore += intent.effects.relationship;
            }
            this.relationshipScore = Math.max(0, Math.min(100, this.relationshipScore));
        }

        updateMood(intent) {
            this.mood = (intent && intent.effects && intent.effects.mood) || 'neutral';
        }

        addHumanTouch(response) {
            if (this.relationshipScore > 85) {
                return response + (this.language === 'en'
                    ? ' Honestly, I love chatting with you! \uD83D\uDE0A'
                    : ' Eerlijk gezegd vind ik het heerlijk om met je te praten! \uD83D\uDE0A');
            }
            if (this.relationshipScore < 30) {
                return (this.language === 'en'
                    ? 'I\'ll answer, but your words were quite cold... '
                    : 'Ik geef antwoord, maar je woorden waren nogal koud... ') + response;
            }
            return response;
        }

        /** Returns true when the visitor keeps repeating the same topic. */
        _trackRepeat(intentId) {
            const harmless = intentId === 'greeting' || intentId === 'language';
            if (!harmless && intentId === this._lastIntent) this.boredomLevel += 25;
            else this.boredomLevel = Math.max(0, this.boredomLevel - 15);
            this._lastIntent = intentId;
            if (this.boredomLevel > 60) {
                this.boredomLevel = 0;
                return true;
            }
            return false;
        }

        _captureName(norm) {
            const match = norm.match(/(?:^| )(?:my name is|call me|ik heet|mijn naam is|noem me|noem mij) ([a-z]{2,20})(?: |$)/);
            if (!match || NAME_STOPWORDS.has(match[1])) return null;
            this.userName = Text.capitalize(match[1]);
            return this.language === 'nl'
                ? 'Leuk je te ontmoeten, ' + this.userName + '! \uD83D\uDE0A Waarmee kan ik je helpen?'
                : 'Nice to meet you, ' + this.userName + '! \uD83D\uDE0A How can I help you?';
        }

        _handleFollowUp(norm) {
            if (!this._pending) return null;
            const tokens = Text.tokens(norm);
            if (!tokens.length || tokens.length > 4) return null;
            if (NO_WORDS.indexOf(norm) !== -1) {
                this._pending = null;
                return this._t(NO_REPLY);
            }
            if (YES_WORDS.indexOf(norm) !== -1) {
                const target = INTENT_BY_ID[this._pending.target];
                this._pending = null;
                if (!target) return null;
                this._lastIntent = target.id;
                return this.addHumanTouch(this._pickReply(target, 'response'));
            }
            return null;
        }

        /* ------------------------------------------------------------------
         * HACK GAME & LOCKDOWN LOGIC
         * ------------------------------------------------------------------ */
        startHackGame() {
            if (this.gameState.active) return this._hackText('restart');
            const cfg = CONFIG.hackGame;
            this._clearGameTimers();
            this.gameState.active = true;
            this.gameState.attempts = 0;
            this.gameState.code = cfg.min + Math.floor(Math.random() * (cfg.max - cfg.min + 1));

            // Start the fail timer
            this.gameState.timer = setTimeout(() => {
                this.gameState.timer = null;
                if (this.gameState.active) this.activateLockdown(true);
            }, cfg.timeLimitMs);

            return this._hackText('start', { s: Math.round(cfg.timeLimitMs / 1000) });
        }

        activateLockdown(announce) {
            const cfg = CONFIG.hackGame;
            this.gameState.active = false;
            this.gameState.code = null;
            this.gameState.lockdown = true;
            this.gameState.lockdownUntil = Date.now() + cfg.lockdownMs;
            if (this.gameState.timer) {
                clearTimeout(this.gameState.timer);
                this.gameState.timer = null;
            }
            if (announce) {
                this._emit({
                    type: 'lockdown-start',
                    message: this._hackText('timeout', { s: Math.round(cfg.lockdownMs / 1000) })
                });
            }

            // Reset lockdown after the configured time
            if (this.gameState.lockdownTimer) clearTimeout(this.gameState.lockdownTimer);
            this.gameState.lockdownTimer = setTimeout(() => {
                this.gameState.lockdown = false;
                this.gameState.lockdownUntil = 0;
                this.gameState.lockdownTimer = null;
                this._emit({ type: 'lockdown-end', message: this._hackText('unlocked') });
            }, cfg.lockdownMs);
        }

        handleHackGuess(norm) {
            const match = String(norm).match(/(?:^| )(\d{4})(?: |$)/);
            if (!match) return this._hackText('format');
            const guess = parseInt(match[1], 10);
            this.gameState.attempts++;

            if (guess === this.gameState.code) {
                const attempts = this.gameState.attempts;
                this._clearGameTimers();
                this.gameState.active = false;
                this.gameState.code = null;
                this.gameState.attempts = 0;
                return this._hackText('win', { n: attempts });
            }
            return this._hackText('wrong') +
                (guess < this.gameState.code ? this._hackText('higher') : this._hackText('lower'));
        }

        /** Returns a reply when the message belongs to the game, otherwise null. */
        _handleGameInput(norm) {
            if (/^(stop|quit|exit|cancel|annuleer|stoppen|afsluiten)$/.test(norm)) {
                this._clearGameTimers();
                this.gameState.active = false;
                this.gameState.code = null;
                this.gameState.attempts = 0;
                return this._hackText('stopped');
            }
            if (/^code( |$)/.test(norm) || /^\d{4}$/.test(norm)) {
                return this.handleHackGuess(norm);
            }
            return null;
        }

        _lockdownSecondsLeft() {
            return Math.max(1, Math.ceil((this.gameState.lockdownUntil - Date.now()) / 1000));
        }

        _hackText(key, vars) {
            let text = this._t(HACK_TEXT[key]);
            if (vars) {
                Object.keys(vars).forEach(function (name) {
                    text = text.split('{' + name + '}').join(String(vars[name]));
                });
            }
            return text;
        }

        _clearGameTimers() {
            if (this.gameState.timer) clearTimeout(this.gameState.timer);
            if (this.gameState.lockdownTimer) clearTimeout(this.gameState.lockdownTimer);
            this.gameState.timer = null;
            this.gameState.lockdownTimer = null;
        }

        /* ------------------------------------------------------------------
         * HELPERS
         * ------------------------------------------------------------------ */
        _t(map) {
            return map[this.language] || map.en;
        }

        _render(text) {
            return renderText(text, this.language, this.userName);
        }

        _remember(role, text) {
            this.history.push({ role: role, text: String(text).slice(0, 500) });
            if (this.history.length > CONFIG.historyLimit) this.history.shift();
        }

        _emit(event) {
            const payload = Object.assign({ language: this.language, time: Date.now() }, event);
            this._listeners.slice().forEach(function (fn) {
                try { fn(payload); } catch (error) { /* a broken listener must not break the bot */ }
            });
        }

        _storage() {
            try {
                return (root && root.localStorage) || null;
            } catch (error) {
                return null; // blocked (private mode / sandboxed iframe)
            }
        }

        _save() {
            if (!this.options.persist) return;
            const store = this._storage();
            if (!store) return;
            try {
                store.setItem(CONFIG.storageKey, JSON.stringify({
                    language: this.language,
                    languageLocked: this.languageLocked,
                    relationshipScore: this.relationshipScore,
                    userName: this.userName
                }));
            } catch (error) { /* storage full or blocked: ignore */ }
        }

        _load() {
            const store = this._storage();
            if (!store) return;
            try {
                const saved = JSON.parse(store.getItem(CONFIG.storageKey) || 'null');
                if (!saved) return;
                if (saved.language === 'nl' || saved.language === 'en') this.language = saved.language;
                this.languageLocked = !!saved.languageLocked;
                if (typeof saved.relationshipScore === 'number') {
                    this.relationshipScore = Math.max(0, Math.min(100, saved.relationshipScore));
                }
                if (typeof saved.userName === 'string' && /^[A-Za-z]{2,20}$/.test(saved.userName)) {
                    this.userName = saved.userName;
                }
            } catch (error) { /* corrupt data: start fresh */ }
        }

        _clearStorage() {
            const store = this._storage();
            if (!store) return;
            try { store.removeItem(CONFIG.storageKey); } catch (error) { /* ignore */ }
        }
    }

    // Static helpers the UI can use
    BasicBot.version = CONFIG.version;
    BasicBot.escapeHTML = Text.escapeHTML;
    BasicBot.linkify = Text.linkify;
    BasicBot.config = CONFIG;

    /* ====================================================================
     * 8. SELF TEST  -  run in the browser console:  BasicBot.selfTest()
     * ==================================================================== */
    BasicBot.selfTest = async function () {
        const results = [];
        const fresh = function () { return new BasicBot(null, { persist: false }); };

        function check(name, ok, detail) {
            results.push({ name: name, ok: !!ok, detail: ok ? '' : String(detail) });
        }

        // 1) intent routing (the old substring bugs live here)
        const routes = [
            ['hoe gaat het', 'howareyou'],
            ['how are you', 'howareyou'],
            ['dom', 'insult'],
            ['domein bestellen', 'domain'],
            ['I want to order a domain', 'domain'],
            ['psp games', 'psp'],
            ['thanks for the help', 'thanks'],
            ['goedemorgen', 'greeting'],
            ['tot ziens', 'farewell'],
            ['je bent dom', 'insult'],
            ['je bent de beste', 'compliment'],
            ['hackgame', 'hackgame'],
            ['standard', 'standard'],
            ['premium', 'premium'],
            ['features', 'features'],
            ['contact', 'contact'],
            ['wat zijn jullie openingstijden', 'contact'],
            ['gamemaniak', 'gamemaniak'],
            ['drone fotografie', 'drone'],
            ['vertel een grap', 'joke'],
            ['paymant', 'payment'],
            ['pricse', 'prices'],
            ['what can you do', 'help'],
            ['xyzzy qwerty', null]
        ];
        const router = fresh();
        routes.forEach(function (pair) {
            const got = router.debugIntent(pair[0]);
            check('route: "' + pair[0] + '" -> ' + pair[1], got === pair[1], 'got ' + got);
        });
        router.destroy();

        // 2) product specific price answers
        const priceCases = [
            ['how much is a website', '\u20AC495'],
            ['hoeveel kost een website', '\u20AC495'],
            ['what does a standard chatbot cost', '\u20AC1000'],
            ['premium chatbot price', '\u20AC1500'],
            ['wat kosten jullie games', '\u20AC1,50'],
            ['how much is the game boy', '\u20AC49.99']
        ];
        for (let i = 0; i < priceCases.length; i++) {
            const bot = fresh();
            const reply = await bot.chat(priceCases[i][0]);
            check('price: "' + priceCases[i][0] + '"', reply.indexOf(priceCases[i][1]) !== -1, reply);
            bot.destroy();
        }

        // 3) language handling
        let bot = fresh();
        await bot.chat('hoe gaat het');
        check('language switches to nl', bot.language === 'nl', bot.language);
        await bot.chat('games');
        check('single word keeps nl (sticky)', bot.language === 'nl', bot.language);
        await bot.chat('what are your prices');
        check('language switches back to en', bot.language === 'en', bot.language);
        await bot.chat('speak dutch');
        check('explicit switch to nl is locked', bot.language === 'nl' && bot.languageLocked, bot.language);
        bot.destroy();

        // 4) empty / hostile input never breaks the bot
        bot = fresh();
        check('empty input -> empty reply', (await bot.chat('   ')) === '', 'not empty');
        const longReply = await bot.chat('a'.repeat(5000));
        check('very long input handled', typeof longReply === 'string' && longReply.length > 0, longReply);
        const htmlReply = await bot.chat('<img src=x onerror=alert(1)>');
        check('html input handled', typeof htmlReply === 'string' && htmlReply.length > 0, htmlReply);
        bot.destroy();

        // 5) name memory is sanitised
        bot = fresh();
        const nameReply = await bot.chat('my name is <b>Abel</b>');
        check('unsafe name rejected', nameReply.indexOf('<') === -1, nameReply);
        const nameReply2 = await bot.chat('my name is Abel');
        check('name remembered', /Abel/.test(nameReply2) && bot.userName === 'Abel', nameReply2);
        const greet = await bot.chat('hello');
        check('greeting uses name', /Abel/.test(greet), greet);
        bot.destroy();

        // 6) follow-up memory
        bot = fresh();
        await bot.chat('games');
        const follow = await bot.chat('yes');
        check('"yes" continues the topic (license)', /lifetime|for life|voor het leven/i.test(follow), follow);
        bot.destroy();

        // 7) hack game
        bot = fresh();
        const start = await bot.chat('hackgame');
        check('hack game starts', bot.gameState.active && /HACK/i.test(start), start);
        const code = bot.gameState.code;
        const hint = await bot.chat('code ' + (code === 1000 ? 1001 : 1000));
        check('wrong guess gives a hint', /HIGHER|LOWER|HOGER|LAGER/i.test(hint), hint);
        const bad = await bot.chat('code abc');
        check('bad format explained', /1000/.test(bad), bad);
        const win = await bot.chat('code ' + code);
        check('correct code wins', /ACCESS GRANTED/.test(win) && !bot.gameState.active, win);
        await bot.chat('hackgame');
        const stop = await bot.chat('stop');
        check('stop ends the game without lockdown', !bot.gameState.active && !bot.gameState.lockdown, stop);
        await bot.chat('hackgame');
        bot.activateLockdown(false);
        const locked = await bot.chat('hello');
        check('lockdown blocks chat', /LOCKDOWN/.test(locked), locked);
        bot.destroy();

        // 8) repeat topic triggers boredom message instead of looping forever
        bot = fresh();
        let bored = false;
        for (let n = 0; n < 6; n++) {
            const reply = await bot.chat('games');
            if (/tired|uitgekeken/.test(reply)) bored = true;
        }
        check('boredom triggers on repeats', bored, 'never triggered');
        bot.destroy();

        const failed = results.filter(function (r) { return !r.ok; });
        const summary = { passed: results.length - failed.length, failed: failed.length, total: results.length, failures: failed };
        if (typeof console !== 'undefined') {
            console.log('[Echo selfTest] ' + summary.passed + '/' + summary.total + ' passed');
            failed.forEach(function (f) { console.warn(' FAIL ' + f.name + ' :: ' + f.detail); });
        }
        return summary;
    };

    /* ====================================================================
     * 9. BINDING
     * ==================================================================== */
    root.BasicBot = BasicBot;
    if (typeof module !== 'undefined' && module.exports) module.exports = BasicBot;

})(typeof window !== 'undefined' ? window : globalThis);
