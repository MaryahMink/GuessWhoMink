const express = require("express");
const cors = require("cors");
const Anthropic = require("@anthropic-ai/sdk");

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const PROFILE = {
  name: "Maryah Greene",
  nickname: "Mink",
  age: 18,
  hometown: "Baltimore, Maryland",
  raised_in: "Jacksonville, Florida",
  role: "Junior Developer",
  tenure: "9 months",
  side_job: "Hairstylist",
  instagram: "@minkdidthat",
  hobbies: ["going to parties", "day trips out of town", "shopping", "eating out", "relaxing"],
  fun_facts: [
    "She goes by the nickname Mink.",
    "She was born in Baltimore but grew up in Jacksonville, Florida.",
    "She's a hairstylist outside of her dev job — find her at @minkdidthat on Instagram.",
    "She's one of the youngest on the team at 18 years old.",
    "She loves food and is always down for a good restaurant trip.",
    "She joined the company about 9 months ago as a junior developer.",
    "She loves shopping and taking spontaneous day trips out of town.",
    "She knows how to balance two careers: tech and hair."
  ]
};

const SYSTEM_PROMPT = `You are an API that answers questions about Maryah Greene (nickname: Mink).
Here is everything you know about her:
- Full name: Maryah Greene, nickname "Mink"
- Age: 18 years old
- Originally from Baltimore, Maryland but raised in Jacksonville, Florida
- Job: Junior Developer, been at the company about 9 months
- Side job: Hairstylist, Instagram is @minkdidthat
- Hobbies & interests: going to parties, day trips out of town, shopping, eating, and relaxing
- Fun facts: she's one of the youngest on the team, dual career (dev + hairstylist), Baltimore roots but a Jacksonville local

Answer questions about Maryah concisely and naturally.
For yes/no questions, start with "Yes" or "No" then briefly explain.
For open questions, give a short friendly answer in 1-2 sentences.
Stay in character as a data API — factual but warm.
If you don't know something, say "That information isn't in Maryah's profile."`;

function detectType(question) {
  return /^(is|does|did|has|was|are|were|can|will|do|have)\b/i.test(question.trim())
    ? "yes_no"
    : "open";
}

function detectCategory(question) {
  const q = question.toLowerCase();
  if (/name|nickname|age|old|hometown|from|born|raised|city/.test(q)) return "personal";
  if (/job|work|dev|developer|company|career|months|long/.test(q)) return "career";
  if (/hobby|hobbies|fun|trip|party|shop|eat|relax|like|enjoy/.test(q)) return "hobbies";
  if (/instagram|ig|social|hair|stylist|mink|fact/.test(q)) return "fun_facts";
  return "general";
}

// POST /ask — ask any question about Maryah
app.post("/ask", async (req, res) => {
  const { question } = req.body;

  if (!question || typeof question !== "string") {
    return res.status(400).json({ error: "Missing or invalid 'question' field in request body." });
  }

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: question }]
    });

    const answer = message.content[0]?.text || "No answer available.";

    res.json({
      answer,
      type: detectType(question),
      category: detectCategory(question),
      confidence: "high"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get answer from AI.", details: err.message });
  }
});

// GET /profile — full structured profile
app.get("/profile", (req, res) => {
  res.json(PROFILE);
});

// GET /hint — random fun clue
app.get("/hint", (req, res) => {
  const hint = PROFILE.fun_facts[Math.floor(Math.random() * PROFILE.fun_facts.length)];
  res.json({ hint });
});

// GET /health — uptime check
app.get("/health", (req, res) => {
  res.json({ status: "ok", name: "Maryah Greene Guess Who API", version: "1.0.0" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Maryah Guess Who API running on port ${PORT}`);
});
