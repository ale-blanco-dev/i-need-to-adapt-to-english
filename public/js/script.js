function toggleMenu(linkId, menuId) {
    document.getElementById(linkId).addEventListener("click", function (event) {
        event.preventDefault();
        var menu = document.getElementById(menuId);
        menu.style.display = menu.style.display === "block" ? "none" : "block";
    });
}

function openSelectedURL(menuId) {
    document.getElementById(menuId).addEventListener("change", function () {
        var selectedURL = this.value;
        if (selectedURL) {
            if (selectedURL === "/anka") {
                window.location.href = selectedURL;
            } else {
                window.open(selectedURL, "_blank");
            }
        }
    });
}

toggleMenu("grammar-link-vocabulary", "grammar-options-vocabulary");
openSelectedURL("grammar-options-vocabulary");

toggleMenu("grammar-link-listening", "grammar-options-listening");
openSelectedURL("grammar-options-listening");

toggleMenu("grammar-link-1", "grammar-options-1");
openSelectedURL("grammar-options-1");

document.getElementById('sendButton').addEventListener('click', async (event) => {
    event.preventDefault();

    const userInput = document.getElementById('my-input').value;
    const sendButton = document.getElementById('sendButton');
    const responseElement = document.getElementById('response');
    const responseSaveElement = document.getElementById('responseSave');

    sendButton.classList.add('loading');
    sendButton.disabled = true;

    try {
        const response = await fetch('https://traduce-lkdliiflpq-uc.a.run.app', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userInput })
        });

        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        if (data.error) throw new Error(data.error);

        const traduceWord = data.reply;
        responseElement.innerText = traduceWord;
        console.log(`Palabra: ${userInput} - Traducción: ${traduceWord}`);
        const currentDateTime = new Date().toISOString();
        const wordSaveEnglish = { Fecha: currentDateTime, Palabra: userInput, Traduccion: traduceWord };

        const saveResponse = await fetch('https://savewords-lkdliiflpq-uc.a.run.app', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(wordSaveEnglish),
        });

        const dataWord = await saveResponse.json();
        responseSaveElement.innerText = 'Datos guardados.';
        console.log('Success: ', dataWord);
    } catch (error) {
        console.error('Error:', error);
        responseElement.innerText = 'Ocurrió un error. Inténtalo de nuevo.';
        responseSaveElement.innerText = 'Error. Revisa con soporte.';
    } finally {
        sendButton.classList.remove('loading');
        sendButton.disabled = false;
    }
});

document.getElementById('sendButtonPhrase').addEventListener('click', function (event) {
    event.preventDefault();
    const userInput = document.getElementById('my-input').value;
    const userInputPhrase = document.getElementById('my-input-phrase').value;
    const sendButtonPhraseButton = document.getElementById('sendButtonPhrase');
    console.log(userInputPhrase)

    sendButtonPhraseButton.classList.add('loading');
    sendButtonPhraseButton.disabled = true;

    fetch('https://isthephrasecontainaword-lkdliiflpq-uc.a.run.app', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: userInputPhrase, word: userInput })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Datos recibidos Frase:', data);
            if (data.error) {
                throw new Error(data.error);
            }
            document.getElementById('responsePhrase').innerText = data.reply;
            sendButtonPhraseButton.classList.remove('loading');
            sendButtonPhraseButton.disabled = false;
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('responsePhrase').innerText = 'Ocurrió un error. Inténtalo de nuevo.';
        });
})

document.getElementById('sendButtonQuestion').addEventListener('click', function (event) {
    event.preventDefault();
    const userInputQuestion = document.getElementById('my-input-question').value;
    const sendButtonQuestionButton = document.getElementById('sendButtonQuestion');
    console.log(userInputQuestion)

    sendButtonQuestionButton.classList.add('loading');
    sendButtonQuestionButton.disabled = true;

    fetch('https://validatequestion-lkdliiflpq-uc.a.run.app', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: userInputQuestion })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Datos recibidos Question:', data);
            if (data.error) {
                throw new Error(data.error);
            }
            document.getElementById('responseQuestion').innerText = data.reply;
            sendButtonQuestionButton.classList.remove('loading');
            sendButtonQuestionButton.disabled = false;
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('responseQuestion').innerText = 'Ocurrió un error. Inténtalo de nuevo.';
        });
})

