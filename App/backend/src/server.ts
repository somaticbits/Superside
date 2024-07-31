import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import OpenAI from "openai";
import "dotenv/config";
import ParsingClient from 'sparql-http-client/ParsingClient.js'
import { getEmailTemplate } from "./queries.js";

import prompts from "./prompts.json" assert { type: "json" };

const SERVER_PORT = 3000;
const GRAPHDB_ENDPOINT = "http://host.docker.internal:7200/repositories/superside";

const app = express();
const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});
const client = new ParsingClient({ endpointUrl: GRAPHDB_ENDPOINT });

app.use(bodyParser.json());
app.use(cors());

app.get("/api", (req, res) => {
    res.send("Hello, world!");
});

app.post("/api/tov", async (req, res) => {
  const { message } = req.body;

  try {
    await openai.chat.completions.create({
      messages: [
        {"role": "system", "content": prompts.system.emailType},
        {"role": "user", "content": message}
      ],
      model: "gpt-4o-mini",
      temperature: 0.0,
    }).then(response => res.status(200).json({ response: response.choices[0].message.content.replace(/[^a-z0-9]/gi, '') }))
  } catch (error) {
    console.error(error);
    res.status(500).json({ response: "Sorry, I am not able to respond right now." });
    return;
  }
})

app.post("/api/email", async (req, res) => {
  const { characteristic } = req.query;
  const { message } = req.body;

  try {
      const result = await client.query.select(getEmailTemplate(characteristic as string, message as string));
      res.status(200).json({ response: result[0].emailCopy.value });
  } catch (error) {
    console.error(error);
    res.status(500).json({response: "Sorry, I am not able to respond right now."});
    return;
  }
})

app.listen(3000, () => {
  console.log("Server is runnning on port ", SERVER_PORT);
})
