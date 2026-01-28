<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 絵Mu - Image to Music Prompt Generator

Transform images into Suno AI music prompts using advanced visual analysis powered by Google Gemini.

## 🔒 Privacy & Security

**Your API key is 100% safe:**
- Keys are stored **only in your browser's localStorage**
- Keys are **never sent to any server** except Google's Gemini API directly
- The app owner has **zero access** to your credentials
- No backend server stores or logs your key

Each user provides their own Google Gemini API key, ensuring:
- ✅ Complete privacy
- ✅ No cost to the app owner
- ✅ Full control over your own usage and billing

## 🚀 How to Use

1. Visit the deployed site: [emu.vercel.app](#) *(will be updated after deployment)*
2. Click the **Settings** icon (⚙️) in the top-right corner
3. Enter your [Google Gemini API Key](https://aistudio.google.com/app/apikey)
4. Upload an image and let the algorithm generate your music prompt!

## 🛠️ Run Locally

**Prerequisites:** Node.js 18+

1. Clone the repository:
   ```bash
   git clone https://github.com/evoliroak0901-tech/emu.git
   cd emu
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser
5. Configure your API key via the Settings modal

## 📦 Tech Stack

- **Frontend:** React + TypeScript + Vite
- **AI Engine:** Google Gemini 2.0 Flash
- **Styling:** Tailwind CSS (utility-first)
- **Deployment:** Vercel

## 🎵 About the Algorithm

絵Mu uses a deterministic algorithm (Suno Architect v3.0) that analyzes:
- Hue Energy (warm vs. cool colors)
- Structure Density (complexity)
- Luminance Value (brightness)
- Edge Sharpness (digital vs. organic)

These visual features are mathematically mapped to music parameters like BPM, genre, mood, and instrumentation.

---

**Made with ❤️ for creators who see sounds and hear colors.**
