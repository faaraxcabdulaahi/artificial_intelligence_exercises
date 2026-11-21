# OpenAI Image Generation with Node.js

This project uses the OpenAI JavaScript SDK to generate an image and
save it as a PNG file on your computer.

## 1. Complete code

Save the following code in `Image.js`:

``` javascript
import OpenAI from "openai";
import "dotenv/config";
import fs from "fs";

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
const PROMPT = "A man reading a book";
const SIZE = "1024x1024";

// 4. Generate image
const response = await OPENAI.images.generate({
  model: MODEL,
  prompt: PROMPT,
  size: SIZE,
});

// 5. Create images folder
if (!fs.existsSync("images")) {
  fs.mkdirSync("images");
}

// 6. Save image to file
const imageBase64 = response.data[0].b64_json;
const buffer = Buffer.from(imageBase64, "base64");
fs.writeFileSync("images/openai-city.png", buffer);

console.log("Image generated successfully!");
console.log("Image saved as: images/openai-city.png");
```

## 2. Project setup

Install the required packages:

``` bash
npm install openai dotenv
```

Create a `.env` file in the project root:

``` env
OPENAI_API_KEY=your_api_key_here
```

Keep your API key private. Do not commit the `.env` file to a public
repository. Add it to `.gitignore`:

``` gitignore
.env
node_modules/
```

If you use ES module `import` syntax in Node.js, ensure your
`package.json` includes:

``` json
{
  "type": "module",
  "scripts": {
    "dev": "node Image.js"
  }
}
```

Run the application:

``` bash
npm run dev
```

The generated image will be saved to `images/openai-city.png`.

## 3. Understanding the code

### 3.1 Importing modules

``` javascript
import OpenAI from "openai";
import "dotenv/config";
import fs from "fs";
```

An `import` makes functionality from another module or package available
in your file.

-   **`openai`**: The OpenAI JavaScript SDK. It lets your application
    call OpenAI APIs.
-   **`dotenv/config`**: Loads variables from your `.env` file into
    `process.env`.
-   **`fs`**: Node.js File System module. It provides methods for
    working with files and directories.

### 3.2 Validating the API key

``` javascript
const API = process.env.OPENAI_API_KEY;

if (!API) {
  console.error("Error: OPENAI_API_KEY is missing from .env");
  process.exit(1);
}
```

-   **`const`** declares a variable that cannot be reassigned.
-   **`process.env`** contains environment variables available to the
    Node.js process.
-   **`process.env.OPENAI_API_KEY`** reads the API key loaded from
    `.env`.
-   **`if`** runs its block only when its condition is true.
-   **`!API`** checks whether `API` is falsy, such as when it is missing
    or an empty string.
-   **`console.error()`** prints an error message.
-   **`process.exit(1)`** stops the application with a non-zero exit
    code, conventionally indicating an error.

The application checks for the key before making an API request.

### 3.3 Initializing the OpenAI client

``` javascript
const OPENAI = new OpenAI({ apiKey: API });
```

`OpenAI` is a class provided by the SDK. The `new` keyword creates an
instance of that class.

The object `{ apiKey: API }` is configuration passed to the client. The
client uses this API key to authenticate requests.

### 3.4 Configuration

``` javascript
const MODEL = "gpt-image-2";
const PROMPT = "A man reading a book";
const SIZE = "1024x1024";
```

These constants hold the settings for image generation:

  Variable   Purpose
  ---------- -----------------------------------------------------
  `MODEL`    Selects the image-generation model.
  `PROMPT`   Describes the image you want the model to generate.
  `SIZE`     Specifies the requested image dimensions.

A **prompt** is the instruction or description sent to the AI model. You
can change it to request a different image.

### 3.5 Generating the image

``` javascript
const response = await OPENAI.images.generate({
  model: MODEL,
  prompt: PROMPT,
  size: SIZE,
});
```

This sends an image-generation request to the OpenAI API.

-   **`OPENAI`** is the client instance.
-   **`images.generate()`** is the SDK method used to request image
    generation.
-   The object passed to the method contains the model, prompt, and
    size.
-   **`response`** stores the result returned by the API.

The method is asynchronous and returns a Promise. **`await`** pauses
execution of the surrounding async operation until the Promise settles.
Because this file uses top-level `await`, it must run as an ES module.

### 3.6 Creating the images folder

``` javascript
if (!fs.existsSync("images")) {
  fs.mkdirSync("images");
}
```

This checks whether a folder named `images` exists.

-   **`fs.existsSync("images")`** returns `true` if the path exists and
    `false` otherwise.
-   **`!`** reverses the Boolean result.
-   **`fs.mkdirSync("images")`** creates the directory if it does not
    exist.
-   **`Sync`** indicates that the operation is synchronous: Node.js
    completes it before moving to the next statement.

This ensures that the destination folder exists before the image is
written.

### 3.7 Getting the generated image data

``` javascript
const imageBase64 = response.data[0].b64_json;
```

The response contains a `data` array with generated image results.

-   **`response.data`** accesses the array of image results.
-   **`[0]`** selects the first result. JavaScript arrays use zero-based
    indexing.
-   **`b64_json`** contains the generated image encoded as a Base64
    string.

Base64 is an encoding format that represents binary data as text. The
image data must be decoded before it can be written as a normal PNG
file.

### 3.8 Converting Base64 to a Buffer

``` javascript
const buffer = Buffer.from(imageBase64, "base64");
```

A **Buffer** is a Node.js object used to handle binary data.

-   **`Buffer.from()`** creates a Buffer from the supplied data.
-   **`imageBase64`** is the encoded image string.
-   **`"base64"`** tells Node.js to decode that string from Base64.

The resulting `buffer` contains the image's binary data.

### 3.9 Saving the image

``` javascript
fs.writeFileSync("images/openai-city.png", buffer);
```

`fs.writeFileSync()` writes data to a file.

-   **`"images/openai-city.png"`** is the destination path and filename.
-   **`buffer`** is the binary image data to write.
-   **`writeFileSync()`** performs the operation synchronously.

After this line succeeds, the PNG file is saved on your computer.

### 3.10 Printing messages

``` javascript
console.log("Image generated successfully!");
console.log("Image saved as: images/openai-city.png");
```

`console.log()` prints messages to the terminal. These messages tell you
that the program reached the success messages and show the file path.

## 4. How the application works

The overall process is:

1.  Load the OpenAI SDK and Node.js modules.
2.  Load the API key from `.env`.
3.  Check that the API key exists.
4.  Create the OpenAI client.
5.  Set the model, prompt, and image size.
6.  Send the image-generation request.
7.  Receive the API response.
8.  Create the `images` folder if needed.
9.  Read the Base64 image data from the first result.
10. Decode the Base64 data into a Buffer.
11. Write the Buffer to a PNG file.
12. Print a success message.

## 5. Project structure

After running the application successfully, your project may look like
this:

``` text
A-PRACTICE/
├── Image.js
├── package.json
├── package-lock.json
├── .env
├── .gitignore
└── images/
    └── openai-city.png
```

Do not upload `.env` or your API key to GitHub.

## 6. Concepts covered

    \# Concept                   Example
  ---- ------------------------- ----------------------------
     1 ES Modules                `import`
     2 Third-party packages      `openai`
     3 Environment variables     `process.env`
     4 Variables                 `const`
     5 Conditional statements    `if`
     6 Logical NOT operator      `!`
     7 Process management        `process.exit()`
     8 Classes and instances     `new OpenAI()`
     9 Objects                   `{ apiKey: API }`
    10 API integration           `OPENAI.images.generate()`
    11 Configuration             `MODEL`, `PROMPT`, `SIZE`
    12 Asynchronous JavaScript   `await`
    13 Promises                  Image-generation request
    14 Arrays                    `data[0]`
    15 Object properties         `b64_json`
    16 Base64 encoding           `b64_json`
    17 Node.js Buffer            `Buffer.from()`
    18 File System               `fs`
    19 Directory checking        `existsSync()`
    20 Directory creation        `mkdirSync()`
    21 File writing              `writeFileSync()`
    22 Terminal output           `console.log()`

## 7. Knowledge check

Try answering these questions without looking at the explanations.

1.  What is the purpose of `dotenv`?
2.  What does `new OpenAI()` do?
3.  What does `await` do?
4.  What does `response.data[0]` access?
5.  Why do we use `Buffer.from(imageBase64, "base64")`?
6.  What does `fs.writeFileSync()` do?

### Short answers

1.  It loads environment variables from `.env` into `process.env`.
2.  It creates an instance of the OpenAI SDK client.
3.  It waits for a Promise to settle before continuing.
4.  It accesses the first image result in the response array.
5.  It decodes Base64 image data into a binary Buffer.
6.  It writes data to a file synchronously.

## 8. Further learning

Do not just memorize the code. Practice changing the prompt,
understanding the API response, and explaining why each step is
necessary.

Useful documentation:

-   [OpenAI Image Generation
    Guide](https://platform.openai.com/docs/guides/image-generation)
-   [OpenAI Node.js SDK](https://github.com/openai/openai-node)
-   [Node.js File System Documentation](https://nodejs.org/api/fs.html)
-   [Node.js Buffer Documentation](https://nodejs.org/api/buffer.html)
-   [Node.js Environment
    Variables](https://nodejs.org/api/environment_variables.html)