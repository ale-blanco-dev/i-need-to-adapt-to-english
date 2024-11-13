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


exports.saveWords = onRequest((req, res) => {
    cors(req, res, async () => {
        try {
            if (req.method !== 'POST' || !req.body || Object.keys(req.body).length === 0) {
                return res.status(400).json({ message: 'No se recibieron datos válidos' });
            }

            const dataWord = req.body;
            const writeResult = await getFirestore()
                .collection("words_in_english_learned")
                .add(dataWord);

            res.status(200).json({ message: 'Datos guardados correctamente', id: writeResult.id });
        } catch (error) {
            console.error('Error al guardar los datos:', error);
            res.status(500).json({ message: 'Error al guardar los datos' });
        }
    });
});

exports.getWords = onRequest((req, res) => {
    cors(req, res, async () => {
        try {
            if (req.method !== 'GET') {
                return res.status(400).json({ message: 'Método no soportado, debe ser GET' });
            }

            const wordsSnapshot = await getFirestore()
                .collection("words_in_english_learned")
                .get();
            const wordsList = wordsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            res.status(200).json({ words: wordsList });
        } catch (error) {
            console.error('Error al obtener los datos:', error);
            res.status(500).json({ message: 'Error al obtener los datos' });
        }
    });
});

exports.traduce = onRequest(async (req, res) => {
    cors(req, res, async () => {
        try {
            if (req.method !== 'POST' || !req.body.message) {
                return res.status(400).json({ error: 'Invalid request' });
            }
            const user_message = req.body.message;
            const openaiResponse = await openai.createChatCompletion({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: 'Traduce o define la siguiente palabra o frase según su contexto. Si está en inglés, tradúcela al español; si está en español, al inglés. Proporciona otras posibles definiciones o traducciones según el contexto, sin usar introducciones innecesarias.' },
                    { role: 'user', content: user_message }
                ],
                max_tokens: 100,
            });
            const assistant_reply = openaiResponse.data.choices[0]?.message?.content || 'No content';
            return res.status(200).json({ reply: assistant_reply });
        } catch {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    });
});

exports.isThePhraseContainAWord = onRequest(async (req, res) => {
    cors(req, res, async () => {
        try {
            if (req.method !== 'POST' || !req.body.message || !req.body.word) {
                return res.status(400).json({ error: 'Invalid request' });
            }

            const userPhraseMessage = req.body.message;
            const userWordMessage = req.body.word;
            const systemMessage = `Valida si la frase: '${userPhraseMessage}' contiene la(s) palabra(s): '${userWordMessage}'. Asegúrate de que sea gramaticalmente correcta y sin errores ortográficos. Si es necesario, corrige la frase y tradúcela, añadiendo la traducción entre paréntesis. Evita introducciones innecesarias.`;

            const openaiResponse = await openai.createChatCompletion({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: systemMessage },
                    { role: 'user', content: userPhraseMessage }
                ],
                max_tokens: 100,
            });

            const assistant_reply = openaiResponse.data.choices[0]?.message?.content || 'No content';

            return res.status(200).json({ reply: assistant_reply });
        } catch (error) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    });
});

exports.validateQuestion = onRequest(async (req, res) => {
    cors(req, res, async () => {
        try {
            if (req.method !== 'POST' || !req.body.message) {
                return res.status(400).json({ error: 'Invalid request' });
            }

            const userQuestionMessage = req.body.message;
            const systemMessage = `Resuelve todas mis dudas sobre el aprendizaje del inglés, incluyendo gramática, ortografía, significado de palabras y expresiones. También ofrece consejos sobre las mejores maneras de aprender el idioma de manera efectiva y mejorar mi comprensión en diferentes contextos.`;
            const openaiResponse = await openai.createChatCompletion({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: systemMessage },
                    { role: 'user', content: userQuestionMessage }
                ],
                max_tokens: 300,
            });
            const assistant_reply = openaiResponse.data.choices[0]?.message?.content || 'No content';
            return res.status(200).json({ reply: assistant_reply });
        } catch (error) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    });
});

//Forms

exports.isSentenceCorrectGrammar = onRequest(async (req, res) => {
    cors(req, res, async () => {
        try {            
            const userQuestionPhrase = req.body.message;
            const systemPhraseValidate = 'Correct the sentence for grammar and spelling. If the sentence is correct, reply with two point - espace - zero, like this : 0. Provide the corrected sentence and count all errors (grammar and spelling) accurately in the format: corrected sentence : number';
            const openaiResponse = await openai.createChatCompletion({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: systemPhraseValidate },
                    { role: 'user', content: userQuestionPhrase }
                ],
                max_tokens: 100
            }); 
            const assistant_reply = openaiResponse.data.choices[0]?.message?.content || 'No content';
            return res.status(200).json({ reply: assistant_reply });
        } catch (error) {
            const errorMessage = error.message ? error.message : 'Internal Server Error';
            return res.status(500).json({ error: errorMessage });
        }
    });
});

exports.createStory = onRequest(async (req, res) =>{
    cors(req, res, async() =>{
        try{
            if (req.method !== 'GET') {
                return res.status(400).json({ message: 'Método no soportado, debe ser GET' });
            }
            const openaiResponse = await openai.createChatCompletion({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: 'You are a master storyteller, adept at crafting engaging and concise narratives. Your expertise shines particularly with short texts with max 50 words.' },
                    { role: 'user', content: 'Tell me a brief story in English, with perfect grammar and spelling. The story should be no longer than 50 tokens.' }
                ],
                max_tokens: 100
            });
            const assistant_story = openaiResponse.data.choices[0]?.message?.content;
            return res.status(200).json({ reply: assistant_story })
        } catch (error){
            res.status(500).json({ message: 'Error al obtener los datos' });
        }
    });
});

exports.isHowFeelTodayOk = onRequest(async (req, res) =>{
    cors(req, res, async() =>{
        try{
            userHowFeel = req.body.message;
            const openaiResponse = await openai.createChatCompletion({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: 'As an expert English teacher, correct grammar and spelling, and assess the users proficiency level (A1, A2, A3, A4). Provide concise feedback.' },
                    { role: 'user', content: userHowFeel }
                ],
                max_tokens: 100
            })
            const assistant_howFeel = openaiResponse.data.choices[0]?.message?.content || 'No content';
            return res.status(200).json({ reply: assistant_howFeel })
        }catch(error){
            const errorMessage = error.message ? error.message : 'Internal Server Error';
            return res.status(500).json({ error: errorMessage });
        }
    })
})

exports.saveWords = onRequest((req, res) => {
    cors(req, res, async () => {
        try {
            if (req.method !== 'POST' || !req.body || Object.keys(req.body).length === 0) {
                return res.status(400).json({ message: 'No se recibieron datos válidos' });
            }

            const dataWord = req.body;
            const writeResult = await getFirestore()
                .collection("words_in_english_learned")
                .add(dataWord);

            res.status(200).json({ message: 'Datos guardados correctamente', id: writeResult.id });
        } catch (error) {
            console.error('Error al guardar los datos:', error);
            res.status(500).json({ message: 'Error al guardar los datos' });
        }
    });
});

exports.resultsFormTotalLevelEnglish = onRequest((req, res) =>{
    cors(req, res, async () =>{
        try{
            const dataWord = req.body;
            const resultTotal = await getFirestore()
                .collection("resultsTotalForm")
                .add(dataWord);

                res.status(200).json({ message: 'Datos guardados correctamente', id: resultTotal.id });

        }catch (error){
            console.error('Error al guardar los datos:', error);
            res.status(500).json({ message: 'Error al guardar los datos' });
        }
    })
})