import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import OpenAI from "openai";
import "dotenv/config";

import prompts from "./prompts.json";

const SERVER_PORT = 3000;
const GRAPHDB_ENDPOINT = "http://localhost:7200/repositories/superside";

const app = express();
const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});
const driver =

app.use(bodyParser.json());
app.use(cors());

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  try {
    await openai.chat.completions.create({
      messages: [
        {"role": "system", "content": prompts.system.emailType},
        {"role": "user", "content": message}
      ],
      model: "gpt-4o-mini",
      temperature: 0.0,
    }).then(response => res.status(200).json({ response: response.choices[0].message.content }))
  } catch (error) {
    console.error(error);
    res.status(500).json({ response: "Sorry, I am not able to respond right now." });
    return;
  }
})

app.listen(3000, () => {
  console.log("Server is runnning on", SERVER_PORT);
})
