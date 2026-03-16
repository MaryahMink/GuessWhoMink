# GuessWhoMink
# Maryah Greene — Guess Who API

A REST API powered by Claude AI that answers questions about Maryah for a Guess Who game.

---

## Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/ask` | Ask any question about Maryah (yes/no or open-ended) |
| GET | `/profile` | Returns her full structured profile as JSON |
| GET | `/hint` | Returns a random clue about her |
| GET | `/health` | Health/uptime check |

---

## Example Usage

```javascript
// Ask a question
const res = await fetch("https://YOUR-DEPLOYED-URL/ask", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ question: "Does she have a side job?" })
});
const data = await res.json();
console.log(data.answer);

// Load full profile
const profile = await fetch("https://YOUR-DEPLOYED-URL/profile").then(r => r.json());

// Get a random hint
const { hint } = await fetch("https://YOUR-DEPLOYED-URL/hint").then(r => r.json());
```

---

## Response Schema

```json
{
  "answer": "string",
  "type": "yes_no | open",
  "category": "personal | career | hobbies | fun_facts | general",
  "confidence": "high"
}
```

---

Built with Express + Anthropic Claude API.
