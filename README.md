# 🚀 Buildathon: Make Wednesdays Great Again

**Masters' Union · For AI Developers · Winner gets Rs. 25,000**

> **Every team must build in a fork of this repository.** Projects not built in a fork of this repo won't be judged.

| | |
|---|---|
| **Date** | Wednesday, 18 November 2026 |
| **Hacking** | **3:00 PM – 7:00 PM IST** (code freeze at 7:00 PM sharp) |
| **Venue** | CDS Audi, 8th floor |
| **Prize** | Rs. 25,000 to the winning team |
| **Register your fork** | 👉 **[https://forms.gle/ZJUYKwTYjsMsVB2b9](https://forms.gle/ZJUYKwTYjsMsVB2b9)** (**deadline 3:30 PM IST**) |
| **Final submission** | Your fork as it stands at **7:00 PM IST**. There's nothing else to submit. |

> 🤖 **Using an AI coding agent?** Point it at [`AGENTS.md`](AGENTS.md). It has the full event brief, tracks, judging and rules in a form agents can read directly. Claude Code loads it automatically through `CLAUDE.md`, and Codex reads `AGENTS.md` natively.

---

## 🎯 Pick one build track

| # | Track | Brief |
|---|---|---|
| **01** | **Build for the Physical World** | Make a real-world task easier, faster or more reliable. Show it in a realistic scenario. |
| **02** | **Build for AI Agents** | Find something an agent struggles with. Build the tool that fixes it, then demo the agent using it. |
| **03** | **Build in Your Area of Expertise** | Pick a field you know firsthand. Ship a working product that improves how people handle it today. |

## ⚖️ How you'll be judged (each criterion is ⅓ of your score)

| Criterion | The question judges ask |
|---|---|
| **Working product** | Does it do what you say it does? Show the core workflow in your demo. |
| **Problem insight** | Who faces this problem, and why does it happen? |
| **Depth of execution** | How well did you solve the hardest part of the build? |

---

## Why fork this repo?

Everyone starts from the same commit (the **genesis commit**) at the same time. Organizers can then check that:
- all code was written **during** the Buildathon and not brought in from an earlier project,
- teams commit steadily instead of pasting in one huge AI-generated dump at the end,
- every repo stays public and visible while you build.

The organizers track every fork automatically: commits, timing and activity. Read [RULES.md](RULES.md) before you write any code.

---

## ✅ Setup (about 5 minutes, do it at 3:00 PM)

**In short:** fork → register your fork in the form **by 3:30 PM** → build → push before 7:00 PM.

### 1. Fork this repo
Click **Fork** (top right). On the fork screen:
- **Owner:** one team member's personal account. Only **one fork per team**.
- **Repository name:** `buildathon-<team-name>`, for example `buildathon-byte-bandits`
- Click **Create fork**.

> ⚠️ Don't download a ZIP or copy the files into a new repo. **It has to be a real GitHub fork**, or the tracker can't see you.

### 2. Keep it public
Forks of a public repo are public. **Don't make it private, archive it, or delete it** until judging is over.

### 3. Add your teammates
In your fork: **Settings → Collaborators → Add people**. Add each teammate's GitHub account so their commits count toward the team.

### 4. Enable Actions
Open the **Actions** tab of your fork and click **"I understand my workflows, go ahead and enable them"**. This runs the automatic check on every push.

### 5. Make your registration commit (your first commit)
Fill in [`team.json`](team.json). `track` must be one of `physical-world`, `ai-agents` or `area-of-expertise`. Then:

```bash
git clone https://github.com/<your-username>/buildathon-<team-name>.git
cd buildathon-<team-name>
# edit team.json
git add team.json
git commit -m "register: <team name>"
git push
```

The **Hackathon check** in the Actions tab should go green ✅. If it's red, open the run to see what's wrong in `team.json`.

### 6. Register your fork (deadline: 3:30 PM IST)
👉 **[https://forms.gle/ZJUYKwTYjsMsVB2b9](https://forms.gle/ZJUYKwTYjsMsVB2b9)**

It's a 4-question Google Form: team name, fork link, track, team members. It connects your repo to the organizers' live tracker.

- Fill it in **once per team**, right after forking, and **no later than 3:30 PM IST**. **Teams that don't register can't be tracked.**
- Paste your **fork's** URL (`https://github.com/<you>/buildathon-<team-name>`), not this starter repo's.
- Need to change something? Use the **"Edit your response"** link on the confirmation page. Don't fill it in twice.
- **Final submission is automatic.** Whatever is pushed to your fork at 7:00 PM IST is what gets judged.

---

## 🛠 While you build (3:00 – 7:00 PM)

- Put your code anywhere in the repo (`app/`, `src/`, `frontend/`, `backend/`…). There's no required layout.
- **Commit early, commit often**, at least every 30 minutes of real work, with messages that say what changed.
- **Push regularly.** Commits you never push don't exist to the tracker.
- AI coding tools (Claude Code, Codex, Cursor, Copilot…) are **allowed and encouraged**. Keep `AGENTS.md` and `CLAUDE.md` in the repo; they keep your agent within the rules.
- Before 7:00 PM, replace the "Your project" section below with your project's README.

## 🧊 Code freeze: 7:00 PM IST

At 7:00 PM the tracker takes a snapshot of every fork. **Commits pushed after code freeze are ignored.** Judges look at your last commit before 7:00 PM.

## ❌ Things that get you flagged

- Rewriting history (`git push --force`, rebasing away the genesis commit, squashing everything into one commit)
- Commits dated before 3:00 PM
- One or two giant commits containing most of the project
- A repo that isn't a fork of this one, or that's private or deleted

See [RULES.md](RULES.md) for the full list.

---

## Your project

### DealLens AI — Underwrite property deals with evidence, not hype

**Team:** DealLens (Chinmay Patidar — @chinmaypatidar25)  
**Track:** Build in Your Area of Expertise (`area-of-expertise`)

**Problem:** First-time and independent real-estate investors often rely on broker-advertised yields, incomplete listings and uncertain expense assumptions. A property can be pitched as an "8% ROI" opportunity even when its stated rent supports only a 3.75% gross rental yield. Existing research workflows split the listing, spreadsheet calculations, and legal due-diligence checklist across different tools.

**What we built:** A working property deal analyzer that accepts property details or pasted listing text, optionally uses an OpenAI model to extract the facts, calculates returns from explicit financial inputs, compares claimed versus calculated gross yields, runs conservative/base/upside scenarios, highlights document gaps, and exports a preliminary investor memo. Two clearly labeled illustrative sample deals are included so judges can test the workflow without an API key.

**Hardest part:** Keeping AI-extracted claims separate from deterministic financial calculations. All annual rental yields, vacancy adjustments, ownership expenses and scenario returns are calculated in JavaScript from user-visible inputs. The model only extracts facts. Missing data remains missing; RERA, ownership and approvals are never treated as independently verified.

### Run locally

**Windows one-click launch:** Open the cloned repository folder in File Explorer and double-click `Start-DealLens.bat`. The launcher checks Node.js, installs dependencies if necessary, finds an available port, waits for `/api/health` to respond, and opens the URL in your normal Windows browser. Leave the new server terminal open while presenting.

**Manual alternative:**

```bash
npm install
npm run dev
```

If you edited this project on GitHub after cloning it, run `git pull origin main` first to receive the latest code.

**Important:** `localhost` is accessible only on the computer running Next.js. Do not open the link inside ChatGPT's remote/in-app browser: use your Windows Chrome or Edge browser. If the terminal shows port 3001 or another port, use the actual URL printed in the terminal. You can check that the app server is alive at `http://127.0.0.1:3000/api/health` (adjust the port if needed).

**Troubleshooting:** If the one-click launcher shows an error, leave the console open and inspect its message. Install Node.js 20.9+ LTS if `node` or `npm` cannot be found. Run `npm test` and `npm run build` for additional validation. `Start-DealLens.ps1` is the PowerShell implementation invoked by the .bat file.

Open [http://localhost:3000](http://localhost:3000). No API key is required to run the sample analysis or use the basic listing text extractor.

To enable OpenAI fact extraction, copy `.env.example` to `.env.local`, set `OPENAI_API_KEY`, and restart the dev server. The key is only used on the server.

### Agent capabilities

**Ask your investment analyst** is a tool-using property research agent integrated into the dashboard. It offers financial underwriting, rental stress testing and yield/document auditing. With `OPENAI_API_KEY` configured, an OpenAI model selects and calls the server-side tools. Without it, a labeled demo mode executes the same deterministic tools and gives an evidence-aware summary. No live comps or independent title/approval/RERA verification is performed. Expand **What the agent checked** to inspect tool results. Run `npm test` to verify the formulas and agent tool behavior.

### Demo (90 seconds)

1. Click **Residential apartment** in the sidebar. It has an illustrative ₹80 lakh asking price, ₹25,000 monthly rent, and **8% advertised yield**.
2. Show that the app calculates a **3.75% gross rental yield**, a 4.25 percentage-point mismatch, and a lower net yield after user-entered expenses and vacancy.
3. Explain the difference between **claims**, **calculated facts**, and **unverified documents**.
4. Switch to **Industrial warehouse** to show a contrasting scenario, and tweak rent or price to recalculate.
5. Export the memo, or paste a listing to extract values for review before calculating.

### Technical stack

- Next.js App Router / React with a custom responsive CSS interface
- `lib/analyze.js`: deterministic rental underwriting, red flags, scenarios
- `app/api/extract/route.js`: server-side optional OpenAI extraction, regex fallback
- `app/page.jsx`: property intake, report, demo scenarios and memo export

### Limitations / honest disclosures

- No live property market comps or automatic registry verification; users must supply assumptions and verify all documents independently.
- This is **not** professional investment, legal, tax, or financial advice.
- The listing uploader supports `.txt` and `.md` documents; paste extracted PDF text manually.
- Returns exclude loan servicing, income tax, capital gains, appreciation and transaction-specific taxes beyond entered costs.
- Sample properties are illustrative; they are not verified live listings.

