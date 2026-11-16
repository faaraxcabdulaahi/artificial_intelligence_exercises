
import OpenAI from "openai";
import "dotenv/config";
import fs from "fs";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

// 1. Validate API key
const API = process.env.OPENAI_API_KEY;

if (!API) {
  console.error("Error: OPENAI_API_KEY is missing from .env");
  process.exit(1);
}

// 2. Initialize OpenAI
const OPENAI = new OpenAI({ apiKey: API });

// 3. Configuration
const MODEL = "gpt-image-2";
const SIZE = ["1024x1024", "1536x1024", "1024x1536"];
const STYLE = ["vivid", "natural"];
const QUALITY = "medium";

// 4. Get user input
const rl = readline.createInterface({ input, output });
const PROMPT = await rl.question("Enter image theme: ");
rl.close();

// 5. Create images folder
if (!fs.existsSync("images")) {
  fs.mkdirSync("images");
}

// 6. Generate images
let count = 0;

for (const size of SIZE) {
  for (const style of STYLE) {
    count++;

    const response = await OPENAI.images.generate({
      model: MODEL,
      prompt: `${PROMPT}, ${style} style`,
      size: size,
      quality: QUALITY,
    });

    // 7. Save image
    const imageBase64 = response.data[0].b64_json;
    const buffer = Buffer.from(imageBase64, "base64");

    const fileName = `image-${count}.png`;

    fs.writeFileSync(`images/${fileName}`, buffer);

    // 8. Save metadata
    fs.writeFileSync(
      `images/image-${count}.json`,
      JSON.stringify({ prompt: PROMPT, model: MODEL, size, style, quality: QUALITY }, null, 2)
    );

    console.log(`Image saved: ${fileName}`);
  }
}

// 9. Create gallery
let gallery = "<h1>Image Gallery</h1>";

for (let i = 1; i <= count; i++) {
  gallery += `<img src="image-${i}.png" width="300">`;
}

fs.writeFileSync("images/gallery.html", gallery);

console.log("All images generated successfully!");
