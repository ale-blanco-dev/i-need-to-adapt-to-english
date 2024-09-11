const { onRequest } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { Configuration, OpenAIApi } = require('openai');
const cors = require('cors')({ origin: 'https://i-need-to-adapt-to-english.web.app' });


const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

initializeApp();

exports.saveWords = onRequest(async (req, res) => {
    try {
        res.setHeader('Access-Control-Allow-Origin', 'https://i-need-to-adapt-to-english.web.app');
        res.setHeader('Access-Control-Allow-Methods', 'POST');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        const dataWord = req.body;
        const writeResult = await getFirestore()
            .collection("words_in_english_learned")
            .add({ words: dataWord });
        res.status(200).json({ message: 'Datos guardados correctamente', id: writeResult.id });
    } catch (error) {
        console.error('Error al guardar los datos:', error);
        res.status(500).json({ message: 'Error al guardar los datos' });
    }
});

exports.traduce = onRequest(async (req, res) => {
    cors(req, res, async () => {
        try {
            if (req.method !== 'POST' || !req.body.message) {
                return res.status(400).json({ error: 'Invalid request' });
            }
            const user_message = req.body.message;
            const openaiResponse = await openai.createChatCompletion({
                model: 'gpt-3.5-turbo-0125',
                messages: [
                    { role: 'system', content: 'Proporciona la traducción o definición de la siguiente palabra o frase. Si está en inglés, tradúcela al español; si está en español, tradúcela al inglés.' },
                    { role: 'user', content: user_message }
                ],
                max_tokens: 60,
            });
            const assistant_reply = openaiResponse.data.choices[0]?.message?.content || 'No content';
            return res.status(200).json({ reply: assistant_reply });
        } catch {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    });
});