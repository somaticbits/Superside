"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const openai_1 = __importDefault(require("openai"));
require("dotenv/config");
const prompts_json_1 = __importDefault(require("./prompts.json"));
const SERVER_PORT = 3000;
const GRAPHDB_ENDPOINT = "http://localhost:7200/repositories/superside";
const app = (0, express_1.default)();
const openai = new openai_1.default({ apiKey: process.env.OPENAI_API_KEY });
const driver = app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
app.post("/api/chat", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { message } = req.body;
    try {
        yield openai.chat.completions.create({
            messages: [
                { "role": "system", "content": prompts_json_1.default.system.emailType },
                { "role": "user", "content": message }
            ],
            model: "gpt-4o-mini",
            temperature: 0.0,
        }).then(response => res.status(200).json({ response: response.choices[0].message.content }));
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ response: "Sorry, I am not able to respond right now." });
        return;
    }
}));
app.listen(3000, () => {
    console.log("Server is runnning on", SERVER_PORT);
});
