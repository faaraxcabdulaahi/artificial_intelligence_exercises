import OpenAI from "openai";
import "dotenv/config";
import fs from "fs/promises";

const API = process.env.OPENAI_API_KEY;

if (!API) {
  console.error("Error: OPENAI_API_KEY is missing from .env");
  process.exit(1);
}

const OPENAI = new OpenAI({ apiKey: API });
const MODEL = "gpt-4o-mini-tts";
const OUTPUT_DIR = "audio";
const MP3 = "mp3";

const speakers = [
  {
    name: "Speaker 1",
    voice: "shimmer",
    input:
      "Maanta oo Khamiis ah waxaan wax ka baranayaa madasha Dugsiiye e-learning. Aad ayaan ugu faraxsanahay inaan aqoon cusub kororsado!",
    instructions:
      "Speak in a very happy, excited, and cheerful tone. Sound energetic, natural, and enthusiastic.",
    filename: "speaker-1-shimmer.mp3",
  },

  {
    name: "Speaker 2",
    voice: "onyx",
    input:
      "Taasi waa wax aad u wanaagsan! Maxaad maanta baranaysaa? Waxaan rajeynayaa inaad wax badan ka faa'iidaysato.",
    instructions:
      "Speak in a curious, friendly, and encouraging tone. Use a warm, natural conversational style.",
    filename: "speaker-2-onyx.mp3",
  },
  {
    name: "Speaker 3",
    voice: "coral",
    input:
      "Runtii waxbarashadu waa furaha guusha. Qof kasta oo doonaya inuu horumar gaaro waa inuu waqtigiisa ka faa'iidaystaa.",
    instructions:
      "Speak in a serious, motivational, and inspiring tone. Sound confident and passionate, with natural pauses.",
    filename: "speaker-3-coral.mp3",
  },
];

const generateSpeechAudio = async () => {
  try {
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    for (const speaker of speakers) {
      console.log(`Generating audio for ${speaker.name}...`);

      const audio = await OPENAI.audio.speech.create({
        model: MODEL,
        voice: speaker.voice,
        input: speaker.input,
        instructions: speaker.instructions,
        response_format: MP3,
      });

      const buffer = Buffer.from(await audio.arrayBuffer());
      const outputPath = `${OUTPUT_DIR}/${speaker.filename}`;

      await fs.writeFile(outputPath, buffer);

      console.log(`Successfully saved: ${outputPath}`);
    }

    console.log(`\nAll speaker audio files generated!`);
  } catch (error) {
    console.error(`Text-to-Speech Error:`, error.message);
  }
};

generateSpeechAudio();
