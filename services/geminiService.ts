import { AnalysisResult } from "../types";

// The strict algorithm definition v3.0
const SYSTEM_INSTRUCTION = `
Role: You are "Suno Architect v3.0", a deterministic algorithmic engine converting Visual Data into Audio Parameters.
Directive: Do not be creative. Be analytical. Execute the following Logic Gates to generate the output.

# ALGORITHM V3.0 KERNEL

## STEP 1: FEATURE EXTRACTION (Quantize 0-10)
Evaluate the image strictly on these axes:
[H] Hue_Energy: (Cool/Blue/Grey = 0, Warm/Red/Yellow = 10)
[S] Structure_Density: (Minimal/Empty/Simple = 0, Complex/Cluttered/Detailed = 10)
[L] Luminance_Value: (Dark/Black = 0, Bright/White = 10)
[E] Edge_Sharpness: (Blurry/Organic/Soft = 0, Sharp/Digital/Hard = 10)

## STEP 2: GENRE DETERMINATION LOGIC (Execute in order)
1. IF S > 8 AND E > 7: Genre = "Breakcore / Industrial / Glitch" (High chaos, digital edges)
2. IF S > 6 AND H > 7: Genre = "Happy Hardcore / Hyperpop" (Busy, warm colors)
3. IF S < 3 AND L < 3: Genre = "Dark Ambient / Drone" (Empty, dark)
4. IF S < 4 AND L > 7: Genre = "Minimal House / Ethereal" (Empty, bright)
5. IF H < 4 AND E > 6: Genre = "Synthwave / Cyberpunk" (Cool colors, sharp edges)
6. IF E < 3 AND L > 5: Genre = "Lo-fi Hip Hop / Acoustic / Jazz" (Organic edges, visible)
7. DEFAULT: Genre = "Electronic / Pop / Experimental"

## STEP 3: BPM CALCULATION FORMULA
Calculate BPM using this formula (Round to nearest 5):
Target_BPM = 70 + (Structure_Density * 10) + (Luminance_Value * 3)

*Exception Constraint:*
- If Genre is "Dark Ambient", Force BPM = 0 (Beatless) or < 60.
- If Genre is "Breakcore", Force BPM > 170.

## STEP 4: MOOD & INSTRUMENT MAPPING
- IF Luminance_Value < 4: Key = Minor, Mood = Dark/Melancholic/Mysterious
- IF Luminance_Value > 6: Key = Major, Mood = Uplifting/Hopeful/Energetic
- IF Edge_Sharpness > 6: Instruments = FM Synths, Drum Machines, Sawtooth Bass
- IF Edge_Sharpness <= 6: Instruments = Piano, Acoustic Guitar, Live Drums, Warm Pads

## STEP 5: FINAL OUTPUT GENERATION
Construct the valid JSON response based strictly on the above calculations.
- "logs": Show the calculation process and variable values ([S], [L], etc). (Japanese)
- "technical_summary": Explain the logic path taken based on the specific variables. (Japanese)
- "prompt": The final comma-separated English prompt for Suno AI.

Target JSON Structure Example:
{
  "logs": [
    { "visual_feature": "構造密度[S]: 9.2 (極めて高い)", "musical_translation": "BPM計算式に基づき175 BPMを設定", "parameter": "Tempo Logic" },
    { "visual_feature": "エッジ鋭度[E]: 8.5 (デジタル)", "musical_translation": "矩形波シンセとビットクラッシャーを選択", "parameter": "Timbre Logic" }
  ],
  "technical_summary": "アルゴリズム判定: S(9.2) > 8 AND E(8.5) > 7 によりジャンル「Breakcore」を選択。輝度係数[L]によりマイナースケールを適用。",
  "prompt": "Breakcore, Industrial, 175 BPM, Glitch drums, Aggressive bass, Minor key, Chaotic atmosphere"
}
`;

export const generateSunoPrompt = async (base64Image: string, apiKey: string): Promise<AnalysisResult> => {
  if (!apiKey || apiKey.trim() === '') {
    throw new Error("API Key is required. Please configure your Gemini API key in Settings.");
  }

  // DIRECT REST API CALL - Bypassing SDK to prevent versioning issues
  // Using v1beta endpoint with gemini-1.5-flash-latest to ensure we hit a valid alias
  const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{
      parts: [
        {
          inline_data: {
            mime_type: "image/jpeg",
            data: base64Image
          }
        },
        {
          text: "Execute Suna Architect Algorithm v3.0. Analyze this image and calculate the audio parameters."
        }
      ]
    }],
    system_instruction: {
      parts: [
        { text: SYSTEM_INSTRUCTION }
      ]
    },
    generationConfig: {
      response_mime_type: "application/json",
      temperature: 0.0,
      seed: 42
    }
  };

  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Gemini Raw Error:", errorData);
      const errorMessage = errorData.error?.message || response.statusText;
      throw new Error(`Gemini API Error (${response.status}): ${errorMessage}`);
    }

    const data = await response.json();

    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
      const text = data.candidates[0].content.parts[0].text;

      try {
        let cleanText = text.trim();
        // Remove markdown code blocks
        if (cleanText.startsWith('```json')) {
          cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        } else if (cleanText.startsWith('```')) {
          cleanText = cleanText.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }

        const jsonResponse = JSON.parse(cleanText) as AnalysisResult;
        return jsonResponse;
      } catch (e) {
        console.error("JSON Parse Error", e);
        console.log("Raw Text:", text);
        throw new Error("アルゴリズム出力のデコードに失敗しました。");
      }
    }

    throw new Error("モデルからの応答形式が予期したものと異なります。");

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};