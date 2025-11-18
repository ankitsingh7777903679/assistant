import cors from 'cors';
import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv'
dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_API_BASE_URL,

});

const app = express();
const PORT = 4000;
app.use(express.json());
app.use(cors());
const SYSTEM_PROMPT = `You are an AI agent who solves user queries and gives answer `;

app.get('/', (req, resp) => {
    resp.send('Hello World');
});

app.post('/chat',async (req, resp) => {
    // todo
    const messages = req.body.messages || undefined;

    if (!messages) {
        return resp.status(400).json(
            {
                message: "Messages are required"
            }
        );
    }

    try {
        const response = await openai.chat.completions.create(
            {
                model: 'gpt-4o-mini',
                messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
            }
        )
        resp.status(200).json({
            message: response.choices[0].message,
        })
    } catch (error) {
        console.log(error);
        resp.status(500).json({ error: 'Failed to generate response' });
    }
});

app.listen(PORT, (): void => {
    console.log(`Server is running on port ${PORT}`);
});