import "dotenv/config";
import OpenAI from "openai";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";


if (!process.env.OPENAI_API_KEY) {
  console.error("Error: OPENAI_API_KEY is missing from your .env");
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const rl = readline.createInterface({
  input,
  output,
});


const writingStyles = {
  creative: {
    instructions:
      "Use engaging language, creative examples, and interesting angles.",
    temperature: 0.9,
  },

  factual: {
    instructions:
      "Use precise language, clear explanations, and avoid unsupported claims.",
    temperature: 0.2,
  },
};


const getUserTopic = async () => {
  while (true) {
    const topic = await rl.question("\nEnter your blog topic: ");

    if (topic.trim().length > 0) {
      return topic.trim();
    }

    console.log("Please enter a valid topic.");
  }
};



const getWritingStyle = async () => {
  while (true) {
    const style = await rl.question(
      "\nChoose your writing style (creative/factual): ",
    );

    const selectedStyle = style.trim().toLowerCase();

    if (writingStyles[selectedStyle]) {
      return selectedStyle;
    }

    console.log("Invalid choice. Choose creative or factual.");
  }
};



const generateOutline = async (topic, style) => {
  const selectedStyle = writingStyles[style];

  console.log("\nGenerating your blog outline...\n");

  const stream = await openai.chat.completions.create({
    model: "gpt-4.1-mini",

    messages: [
      {
        role: "system",
        content: `
          You are an expert blog content strategist.

          Create a detailed and professional blog post outline.

          Include:
          1. An engaging title
          2. An introduction
          3. Five main headings
          4. Subheadings under each main heading
          5. A conclusion

          ${selectedStyle.instructions}

          Make the outline clear and well organized.
        `,
      },

      {
        role: "user",
        content: `Create a blog post outline about: ${topic}`,
      },
    ],

    max_completion_tokens: 1500,
    temperature: selectedStyle.temperature,
    stream: true,
  });

  let fullOutline = "";

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || "";

    if (content) {
      process.stdout.write(content);
      fullOutline += content;
    }
  }

  console.log("\n\n--- Outline generation complete ---");

  return fullOutline;
};



const summarizeOutline = async (outline) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4.1-mini",

    messages: [
      {
        role: "system",
        content: "You are an expert summarizer.",
      },

      {
        role: "user",
        content: `
          Summarize the following blog outline in exactly
          two sentences.

          Outline:
          ${outline}
        `,
      },
    ],

    max_completion_tokens: 150,
  });

  return response.choices[0]?.message?.content?.trim() || "";
};


const answerQuestion = async (outline, question) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4.1-mini",

    messages: [
      {
        role: "system",
        content: `
          You are a helpful blog content assistant.

          Answer questions using the provided blog outline.

          If the answer is not available in the outline,
          explain that clearly.

          Give clear and useful answers.
        `,
      },

      {
        role: "user",
        content: `
          Blog outline:
          ${outline}

          User question:
          ${question}
        `,
      },
    ],

    max_completion_tokens: 300,
  });

  return response.choices[0]?.message?.content?.trim() || "";
};

const main = async () => {
  try {
    console.log("==================================");
    console.log("     SMART CONTENT ASSISTANT");
    console.log("==================================");
    const topic = await getUserTopic();
    const style = await getWritingStyle();
    const outline = await generateOutline(topic, style);

    if (!outline) {
      throw new Error("The model returned an empty outline.");
    }
    console.log("\n\n==================================");
    console.log("           SUMMARY");
    console.log("==================================\n");

    const summary = await summarizeOutline(outline);

    console.log(summary);
    console.log("\n\n==================================");
    console.log("       ASK FOLLOW-UP QUESTIONS");
    console.log("==================================");

    console.log("Type 'exit' to finish.");

    while (true) {
      const question = await rl.question("\nYour question: ");

      if (question.trim().toLowerCase() === "exit") {
        console.log("\nThank you for using Smart Content Assistant!");
        break;
      }

      if (!question.trim()) {
        console.log("Please enter a question.");
        continue;
      }

      console.log("\nThinking...\n");

      const answer = await answerQuestion(outline, question.trim());

      console.log("Assistant:", answer);
    }
  } catch (error) {
    console.error("\nApplication error:", error.message);
  } finally {
    rl.close();
  }
};


main();
