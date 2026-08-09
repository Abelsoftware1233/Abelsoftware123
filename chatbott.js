/**
 * chatbot.js
 * -------------------------------------------------------------------------
 * Tweetalige (Nederlands/Engels) chatbot met:
 *   1. Voorgeprogrammeerde ("canned") antwoorden voor veelvoorkomende situaties,
 *      geschreven met empathie, menselijke warmte en een klein stukje redenering
 *      (dus niet alleen een kaal zinnetje, maar ook "waarom" erbij).
 *   2. Een kennisbank van alle pagina's/diensten van abelsoftware123.com, zodat
 *      bezoekers op elke pagina kunnen vragen "wat doet deze pagina/dienst?"
 *      en een feitelijk, tweetalig antwoord krijgen (client stuurt "pageId" mee).
 *   3. Een fallback naar de Anthropic Claude API voor alle overige vragen,
 *      zodat de bot letterlijk alles kan beantwoorden — met de sitekennis als
 *      systeemcontext, zodat ook open vragen over diensten correct zijn.
 *
 * Gebruik:
 *   1. npm install
 *   2. Kopieer .env.example naar .env en vul ANTHROPIC_API_KEY in
 *   3. npm start
 *   4. Open http://localhost:3000 in je browser (simpele test-UI wordt geserveerd)
 *      of POST naar http://localhost:3000/api/chat met { "message": "..." }
 * -------------------------------------------------------------------------
 */

require('dotenv').config();
const express = require('express');
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');

// ---------------------------------------------------------------------------
// 1. Configuratie & setup
// ---------------------------------------------------------------------------

const PORT = process.env.PORT || 3000;
const MODEL = process.env.CLAUDE_MODEL || 'claude-sonnet-4-6';

if (!process.env.ANTHROPIC_API_KEY) {
  console.warn(
    '\n⚠️  Waarschuwing: geen ANTHROPIC_API_KEY gevonden in .env.\n' +
    '   De voorgeprogrammeerde antwoorden werken nog wel, maar open vragen ' +
    'kunnen niet door Claude beantwoord worden totdat je een geldige key instelt.\n' +
    '⚠️  Warning: no ANTHROPIC_API_KEY found in .env.\n' +
    '   Canned responses will still work, but open-ended questions cannot be ' +
    'answered by Claude until you set a valid key.\n'
  );
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY, // wordt automatisch uit .env gelezen
});

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Expliciete route voor de root, zodat http://localhost:3000/ altijd de
// chatbot-interface toont (het bestand heet chatbot.html, niet index.html,
// om naamconflicten met andere pagina's/scripts op de klantsite te voorkomen).
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'chatbot.html'));
});

// In-memory gespreksgeschiedenis per sessie (simpel, voor demo-doeleinden)
// Voor productie: vervang door een echte database/session store.
const conversations = new Map();

// ---------------------------------------------------------------------------
// 2. Taalherkenning (eenvoudig, op basis van veelgebruikte woorden)
// ---------------------------------------------------------------------------

function detectLanguage(text) {
  const nlWoorden = [
    'ik', 'jij', 'je', 'ben', 'niet', 'goed', 'slecht', 'hallo', 'hoi',
    'bedankt', 'dank', 'help', 'hulp', 'alsjeblieft', 'graag', 'waarom',
    'hoe', 'wat', 'wanneer', 'kun', 'kan', 'wil', 'moet', 'verdrietig',
    'blij', 'boos', 'moe', 'dag', 'morgen', 'avond'
  ];
  const enWoorden = [
    'i', 'you', 'am', 'not', 'good', 'bad', 'hello', 'hi', 'thanks',
    'thank', 'help', 'please', 'why', 'how', 'what', 'when', 'can',
    'could', 'want', 'must', 'sad', 'happy', 'angry', 'tired', 'day',
    'morning', 'evening', 'the', 'about', 'tell', 'me', 'all', 'services',
    'this', 'page', 'does', 'do', 'is', 'are', 'your', 'offer', 'price',
    'cost', 'need', 'explain', 'info', 'information'
  ];

  const lower = text.toLowerCase();
  const woorden = lower.split(/\W+/).filter(Boolean);

  let nlScore = 0;
  let enScore = 0;

  for (const w of woorden) {
    if (nlWoorden.includes(w)) nlScore++;
    if (enWoorden.includes(w)) enScore++;
  }

  // Bij gelijkspel of onduidelijkheid: default naar Nederlands,
  // omdat dit script primair voor een NL/EN doelgroep is opgezet.
  return enScore > nlScore ? 'en' : 'nl';
}

// ---------------------------------------------------------------------------
// 3. Kennisbank van abelsoftware123.com — per pagina/dienst
//    Elke pagina van de site krijgt hier een eigen "kaart" met wat die
//    dienst doet, tweetalig. Dit wordt gebruikt om:
//      a) meteen te antwoorden op "wat doet deze pagina/dienst?"
//      b) als context aan Claude mee te geven, zodat ook open vragen over
//         een dienst correct en op maat beantwoord worden.
//    Let op: aanvalsgerichte tools (DDoS, spyware, password-cracking als
//    bestelbaar product) zijn hier bewust NIET in opgenomen — de bot
//    promoot of legt zulke functionaliteit niet uit, ook al staat het
//    op de originele pagina.
// ---------------------------------------------------------------------------

const siteKnowledge = {
  home: {
    title: 'Home',
    url: 'https://abelsoftware123.com/index.html',
    nl: 'De homepage van Abelsoftware123, een Nederlands (Zwolle) bedrijf voor AI-software en development. Hier zie je een overzicht van alle diensten: dronefotografie, chatbots op maat, AI-software, cybersecurity-auditingtools, websites & apps, domeinregistratie, een bedrijfssoftware-suite, een emulator, music studio-software, gameservers en meer.',
    en: 'The homepage of Abelsoftware123, a Dutch (Zwolle-based) AI software and development company. It gives an overview of all services: drone photography, custom chatbots, AI software, cybersecurity auditing tools, websites & apps, domain registration, a business software suite, an emulator, music studio software, game servers and more.'
  },
  drone: {
    title: 'Drone Fotografie / Drone Photography',
    url: 'https://abelsoftware123.com/drone.html',
    nl: 'Professionele 4K-luchtfotografie voor jachten, panden en evenementen, uitgevoerd door een gecertificeerde piloot met een officieel EU A1/A3-vliegbewijs. Vanaf €200 (incl. btw). Flexibele planning voor het beste licht en snel inzetbaar. Offerte via e-mail.',
    en: 'Professional 4K aerial photography for yachts, properties and events, carried out by a certified pilot with an official EU A1/A3 drone license. Starting at €200 (VAT included). Flexible scheduling for the best light and available on short notice. Quotes via email.'
  },
  chatbot: {
    title: 'Order Chatbot',
    url: 'https://abelsoftware123.com/chatbot.html',
    nl: 'Op maat gemaakte chatbots voor bedrijven, in twee niveaus: een Standard Chatbot (€1000) met keyword-gebaseerde automatisering, volledige site-integratie en tweetalig (NL/EN) beheer; en een Premium AI Chatbot (€1500) met zelfstandige redeneerlogica, een "empathy engine", zelflerend vermogen en geavanceerde contextherkenning. Bestellen via e-mail.',
    en: 'Custom-built chatbots for businesses, in two tiers: a Standard Chatbot (€1000) with keyword-based automation, full website integration and bilingual (NL/EN) management; and a Premium AI Chatbot (€1500) with autonomous reasoning logic, a "human empathy engine", self-learning capability and advanced context recognition. Order via email.'
  },
  advertising: {
    title: 'Advertising',
    url: 'https://abelsoftware123.com/advertentie.html',
    nl: 'De pagina voor advertentie- en marketingdiensten van Abelsoftware123. Voor exacte tarieven en mogelijkheden is het beste om even contact op te nemen via e-mail, zodat je een aanbod op maat krijgt.',
    en: "Abelsoftware123's page for advertising and marketing services. For exact rates and options, it's best to reach out via email so you get a tailored offer."
  },
  company: {
    title: 'Company / Bedrijfsinfo',
    url: 'https://abelsoftware123.com/company.html',
    nl: 'Abelsoftware123 bestaat sinds 2024, is gevestigd in Zwolle (Overijssel, Nederland) en bedient klanten wereldwijd. De missie is hoogwaardige AI-software (met focus op DJI-dronetechnologie), games, Android-apps, custom websites, cybersecuritytools, een emulator, AI music studio, een apps maker, chatbots, gameservers en domeindiensten te leveren. KvK-nummer 42090960, BTW-nummer NL 005488351B30. Er worden ook cursussen Ethical Hacking en Cyber Defence Security aangeboden.',
    en: 'Abelsoftware123 was founded in 2024, is based in Zwolle (Overijssel, Netherlands) and serves clients worldwide. Its mission is delivering high-quality AI software (with a focus on DJI drone tech), games, Android apps, custom websites, cybersecurity tools, an emulator, an AI music studio, an apps maker, chatbots, game servers and domain services. Chamber of Commerce (KvK) number 42090960, VAT number NL 005488351B30. Ethical Hacking and Cyber Defence Security courses are also offered.'
  },
  payments: {
    title: 'Payments/Betalingen Games & Apps',
    url: 'https://abelsoftware123.com/payments.html',
    nl: 'De betaalpagina waar je games, apps en producten van Abelsoftware123 kunt afrekenen. Geaccepteerde betaalmethoden zijn Wero (voorheen iDEAL), PayPal, Visa, Mastercard en Google Pay. Hier vind je onder meer de Abel123 PSP Gaming Portable (€149,99) en andere games/apps.',
    en: "The payments page where you can check out games, apps and products from Abelsoftware123. Accepted payment methods are Wero (formerly iDEAL), PayPal, Visa, Mastercard and Google Pay. This includes the Abel123 PSP Gaming Portable (€149.99) and other games/apps."
  },
  apps: {
    title: 'Apps List/Lijst',
    url: 'https://abelsoftware123.com/apps.html',
    nl: 'Een overzicht van de 2025-2026 collectie games en software van Abelsoftware123: het eigen Abel123-merk (zoals de Emulator, AI Music Studio, Apps Maker, Bulk Mail-software, netwerk- en securitytools voor legitiem gebruik zoals audits, en NIS2-auditsoftware), de WMWario Happy World game-serie en losse arcade/entertainment games zoals Moon Climb Spacer en SlotMoji.',
    en: "An overview of Abelsoftware123's 2025-2026 collection of games and software: the in-house Abel123 brand (such as the Emulator, AI Music Studio, Apps Maker, bulk mail software, network and security tools for legitimate use like audits, and NIS2 audit software), the WMWario Happy World game series, and standalone arcade/entertainment games such as Moon Climb Spacer and SlotMoji."
  },
  hacktools: {
    title: 'Cybersecurity & Offensive Security',
    url: 'https://abelsoftware123.com/hacktools.html',
    nl: 'Een pagina met resources voor ethical hacking en security-auditing, bedoeld voor legale en ethische doeleinden zoals geautoriseerde security-audits en academisch onderzoek. Erkende categorieën zijn onder meer netwerkscanning (zoals Nmap), webbeveiliging/pentesting (zoals Burp Suite en OWASP ZAP), en het Metasploit-framework voor penetratietesten. Ik kan hier alleen in algemene, educatieve termen over praten en help niet met het bestellen of instrueren van aanvalsgerichte tools zoals DDoS-software, spyware of tools om wachtwoorden van anderen te kraken.',
    en: 'A page with resources for ethical hacking and security auditing, intended for legal and ethical purposes such as authorized security audits and academic research. Recognized categories include network scanning (such as Nmap), web security/pentesting (such as Burp Suite and OWASP ZAP), and the Metasploit framework for penetration testing. I can only speak about this in general, educational terms and won\'t help order or use attack-oriented tools such as DDoS software, spyware, or tools for cracking other people\'s passwords.'
  },
  ai: {
    title: 'AI Software',
    url: 'https://abelsoftware123.com/ai.html',
    nl: 'Overzicht van de AI-producten: Abel123 AI (machine learning met chatfunctie, beeldgenerator en gezichtsherkenning, licentie €150-€850), VetPulse AI (een AI-triagemodule voor huisdieren met symptoomchecker, beeldanalyse en automatische SOAP-verslagen — ter ondersteuning, geen vervanging van een dierenarts), AI Face Recognition (voor security/identificatiedoeleinden, compatibel met Kali Linux/Android/Python3, met lokale database voor privacy) en AI Drone Swarm (gedecentraliseerde aansturing van meerdere drones als één geheel). Ook maatwerk AI-ontwikkeling is mogelijk.',
    en: 'Overview of the AI products: Abel123 AI (machine learning with chat function, image generator and face recognition, license €150-€850), VetPulse AI (an AI triage module for pets with a symptom checker, image analysis and auto-generated SOAP notes — supportive only, not a replacement for a licensed vet), AI Face Recognition (for security/identification purposes, compatible with Kali Linux/Android/Python3, with a local database for privacy) and AI Drone Swarm (decentralized coordination of multiple drones acting as one unit). Custom AI development is also available.'
  },
  website: {
    title: 'Order Website',
    url: 'https://abelsoftware123.com/website.html',
    nl: 'Custom websites en apps, van simpele landingspagina\'s tot complexe webshops, met moderne UX/UI-design en full-stack ontwikkeling (React, Vue.js, Node.js, Python, MongoDB, PostgreSQL e.a.). Prijzen voor websites/apps beginnen vanaf €200. Ook beschikbaar: Abel123 Appsmaker (Chromebook-editie) om zelf Android-apps te bouwen, voor €49,99 eenmalig.',
    en: "Custom websites and apps, from simple landing pages to complex webshops, with modern UX/UI design and full-stack development (React, Vue.js, Node.js, Python, MongoDB, PostgreSQL and more). Websites/apps start at €200. Also available: Abel123 Appsmaker (Chromebook edition) to build your own Android apps, for a one-time €49.99."
  },
  domain: {
    title: 'Order Domain',
    url: 'https://abelsoftware123.com/domain.html',
    nl: 'Domeinregistratie en -beheer: advies bij het kiezen van een domeinnaam, snelle registratie voor alle extensies (.com, .net, .org etc.), professionele hosting, custom e-mailadressen op je eigen domein (jij@jouwdomein.com), DNS-beheer en SSL-certificaten. Aanvragen via e-mail of de betaalpagina.',
    en: 'Domain registration and management: advice on choosing a domain name, fast registration for all extensions (.com, .net, .org etc.), professional hosting, custom email addresses on your own domain (you@yourdomain.com), DNS management and SSL certificates. Inquire via email or the payments page.'
  },
  facturatie: {
    title: 'Business Suite',
    url: 'https://abelsoftware123.com/facturatie.html',
    nl: 'Een alles-in-één bedrijfssoftware met facturatie, CRM, urenregistratie en geautomatiseerde loonverwerking — alles in één gekoppeld platform, geschikt voor zowel zzp\'ers als grotere teams. Werkt op desktop, tablet en mobiel. De prijs hangt af van teamgrootte en gewenste modules; een offerte op maat kun je opvragen.',
    en: 'An all-in-one business platform with invoicing, CRM, time tracking and automated payroll — all connected in one system, suitable for freelancers and larger teams alike. Works on desktop, tablet and mobile. Pricing depends on team size and required modules; a tailored quote is available on request.'
  },
  emulator: {
    title: 'Emulator',
    url: 'https://abelsoftware123.com/emulator.html',
    nl: 'De Abel123 Emulator: een multi-platform emulator voor retrogaming, waarmee je klassieke games op je apparaat kunt spelen. Voor actuele prijzen kun je het beste even navragen via e-mail of de betaalpagina bekijken.',
    en: 'The Abel123 Emulator: a multi-platform emulator for retro gaming, letting you play classic games on your device. For current pricing it\'s best to check the payments page or ask via email.'
  },
  music: {
    title: 'Music Studio',
    url: 'https://abelsoftware123.com/music.html',
    nl: 'Abel123 AI Studio & Music Studio, voor Android, Windows en pc: real-time AI autotune en pitch-correctie, vocal smoothing, studio-reverb, automatische synchronisatie van beat en zang, en een master-mixer voor WAV-export. Introductieprijs €14,99, met direct volledige toegang na betaling.',
    en: 'Abel123 AI Studio & Music Studio, for Android, Windows and PC: real-time AI autotune and pitch correction, vocal smoothing, studio reverb, automatic beat/vocal synchronization, and a master mixer for WAV export. Introductory price €14.99, with immediate full access after payment.'
  },
  server: {
    title: '(Game)Servers for Rent',
    url: 'https://abelsoftware123.com/server.html',
    nl: 'Gameserver- en VPS-hosting, volledig beheerd en binnen minuten online. Plannen o.a.: Minecraft Starter (€5,99/mnd), Minecraft Pro (€8,99/mnd), FiveM/GTA RP (€19,99/mnd), Rust (€24,99/mnd), ARK: Survival (€19,99/mnd), Discord Bot Hosting (€2,99/mnd), Custom Linux VPS (€14,99/mnd) en een Dedicated Server (€49,99/mnd). Alle plannen inclusief gratis subdomein, dagelijkse back-ups, gratis DDoS-bescherming voor je eigen server en 99,9% uptime-garantie.',
    en: 'Game server and VPS hosting, fully managed and online within minutes. Plans include: Minecraft Starter (€5.99/mo), Minecraft Pro (€8.99/mo), FiveM/GTA RP (€19.99/mo), Rust (€24.99/mo), ARK: Survival (€19.99/mo), Discord Bot Hosting (€2.99/mo), Custom Linux VPS (€14.99/mo) and a Dedicated Server (€49.99/mo). All plans include a free subdomain, daily backups, free DDoS *protection* for your own server, and a 99.9% uptime guarantee.'
  },
  reviews: {
    title: 'Reviews',
    url: 'https://abelsoftware123.com/reviews.html',
    nl: 'De pagina waar klanten hun ervaringen met Abelsoftware123 kunnen delen en bekijken.',
    en: 'The page where customers can share and browse their experiences with Abelsoftware123.'
  },
  privacy: {
    title: 'Privacy Policy',
    url: 'https://abelsoftware123.com/privacy.html',
    nl: 'De privacyverklaring van Abelsoftware123, met uitleg over hoe persoonsgegevens worden verzameld, gebruikt en beschermd.',
    en: 'Abelsoftware123\'s privacy policy, explaining how personal data is collected, used and protected.'
  },
};

/**
 * Bouwt een korte, feitelijke samenvatting van alle diensten — gebruikt als
 * "wat doen jullie allemaal" antwoord en als achtergrondcontext voor Claude.
 */
function buildFullOverview(lang) {
  const items = Object.values(siteKnowledge);
  const lines = items.map((item) => `• ${item.title}: ${lang === 'en' ? item.en : item.nl}`);
  const intro = lang === 'en'
    ? "Here's an overview of everything Abelsoftware123 offers:\n\n"
    : 'Hier is een overzicht van alles wat Abelsoftware123 aanbiedt:\n\n';
  return intro + lines.join('\n\n');
}

/**
 * Zoekt of een bericht vraagt naar "wat doet deze pagina/dienst".
 * pageId komt uit de client (welke pagina de bezoeker bekijkt).
 */
function matchPageQuestion(message, pageId, lang) {
  const vraagPatroon = /(\bwat\b.{0,30}\b(doet|doe|biedt|bieden|aanbieden|kan|kunnen|is dit)\b)|\bleg uit\b|\bvertel (me )?over\b|\binformatie over\b|\buitleg\b/i;
  const enVraagPatroon = /(\bwhat\b.{0,30}\b(does|do|is|offer|offers|can)\b)|\btell me about\b|\bexplain\b|\binfo(rmation)? about\b/i;

  const isPageQuestion = vraagPatroon.test(message) || enVraagPatroon.test(message);
  if (!isPageQuestion) return null;

  // Vraagt iemand naar "alles" / "everything" / "all services" -> volledig overzicht
  if (/\b(alles|alle diensten|hele website|volledig overzicht)\b/i.test(message) ||
      /\b(everything|all services|whole website|full overview)\b/i.test(message)) {
    return buildFullOverview(lang);
  }

  // Anders: als we een geldige pageId hebben, geef info over die specifieke pagina
  if (pageId && siteKnowledge[pageId]) {
    const item = siteKnowledge[pageId];
    const label = lang === 'en' ? `About "${item.title}": ` : `Over "${item.title}": `;
    return label + (lang === 'en' ? item.en : item.nl);
  }

  return null;
}

// ---------------------------------------------------------------------------
// 3b. Voorgeprogrammeerde ("canned") antwoorden
//    Elke categorie heeft: herkenningspatronen (regex) + NL en EN 