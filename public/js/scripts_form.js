document.addEventListener("DOMContentLoaded", () => {
    displayDate();
    handleResponsiveChanges();
});

function toggleMenu() {
    const form = document.getElementById("additionalForm");
    const menu = document.getElementById("menu");
    const menuIcon = document.querySelector(".menu-icon");

    menu.classList.toggle('show');
    form.classList.remove('show');

    menuIcon.style.color = menu.classList.contains('show') ? '#fff' : '#6f42c1';
}


function handleResponsiveChanges() {
    const form = document.getElementById("additionalForm");
    const menu = document.getElementById("menu");

    function toggleVisibility() {
        const isSmallScreen = window.matchMedia("(max-width: 1024px)").matches;
        form.classList.toggle('show', !isSmallScreen); // Show form if not on small screen
        menu.classList.toggle('show', isSmallScreen); // Show menu if on small screen
    }

    toggleVisibility();

    window.addEventListener('resize', toggleVisibility);
}

function displayDate() {
    const formattedDate = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = formattedDate;
}

const ul = document.getElementById("tagList"),
    input = document.getElementById("tagInput");

let tags = [];

function createTag() {
    ul.querySelectorAll("li").forEach(li => li.remove());
    tags.slice().reverse().forEach(tag => {
        let liTag = `<li>${tag} <i class="uit uit-multiply" onclick="removeTag('${tag}')"></i></li>`;
        ul.insertAdjacentHTML("afterbegin", liTag);
    });
}

function removeTag(tag) {
    tags = tags.filter(t => t !== tag);
    createTag();
}

function addTag(e) {
    if (e.key === "Enter" || e.key === ",") {
        let tag = e.target.value.trim().replace(",", "");
        if (tag && !tags.includes(tag)) {
            tags.push(tag);
            createTag();
        }
        e.target.value = "";
    }
}

input.addEventListener("keyup", addTag);


let pointsWords;
let pointsPhrase;
let levelEnglish;

function validateNewWords() {
    const wordCount = parseInt(document.getElementById("newWords").value, 10);
    const resultsNewWords = document.getElementById('resultsNewWords');

    let pointsWords;

    if (wordCount < 7) {
        pointsWords = 0;
    } else if (wordCount <= 15) {
        pointsWords = 1;
    } else if (wordCount <= 22) {
        pointsWords = 2;
    } else if (wordCount <= 29) {
        pointsWords = 3;
    } else if (wordCount >= 30) {
        pointsWords = 4;
    }
    resultsNewWords.innerText = pointsWords > 0 ? `${pointsWords} punto${pointsWords > 1 ? 's' : ''}` : "";
}

validateNewWords();

function SaveNewWords() {
    const listWords = document.getElementById("tagList");
    const tagsWord = Array.from(listWords.getElementsByTagName("li")).map(li => li.textContent.trim());

    const wordSaveEnglish = { wordsLearned: tagsWord };

    fetch('https://savewords-lkdliiflpq-uc.a.run.app', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(wordSaveEnglish),
    })
        .then(response => response.json())
        .then(dataWord => {
            document.getElementById('SaveWords').innerText = 'Datos guardados correctamente';
            console.log('Success: ', dataWord);
        })
        .catch(error => {
            document.getElementById('SaveWords').innerText = 'Error al guardar los datos';
            console.error('Error: ', error);
        });
}

document.getElementById('submitBtn').addEventListener('click', SaveNewWords);


function validatePhrase() {
    const phrase = document.getElementById("phrase").value;
    const resultsPhrase = document.getElementById('resultsPhrase');
    fetch('/validate-phrase', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            'message': phrase
        })
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
        .then(data => {
            if (data.error) {
                throw new Error(data.error);
            }
            document.getElementById('resultsPhrase').innerText = data.reply;
            const resultsText = document.getElementById('resultsPhrase').innerText;
            const match = resultsText.match(/:\s*(\d+)$/);

            if (match) {
                const number = parseInt(match[1], 10);
                console.log('Número extraído:', number);

                pointsPhrase = number >= 8 ? 0 :
                    number >= 6 ? 1 :
                        number >= 4 ? 2 :
                            number >= 2 ? 3 : 4;

                console.log('Puntos asignados:', pointsPhrase);
                document.getElementById('resultsPoints').innerText = "Points: " + pointsPhrase;
            } else {
                console.log('No se encontró un número después de los dos puntos.');
                pointsPhrase = 0;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('resultsPhrase').innerText = 'Ocurrió un error. Inténtalo de nuevo.';
        });
};
document.getElementById('validatePhraseBtn').addEventListener('click', validatePhrase);

async function getStory() {
    try {
        const response = await fetch('/generate_text');
        const data = await response.json();
        document.getElementById('story').innerText = data.story;
    } catch (error) {
        console.error('Error fetching the story:', error);
    }
}
window.onload = getStory;

let pointsComprehension;

function validateComprehension() {
    const comprehensionLevel = parseInt(document.getElementById("comprehensionLevel").value, 10);
    const results = document.getElementById('ValidateOptions');

    switch (comprehensionLevel) {
        case 1: pointsComprehension = 0; break;
        case 2: pointsComprehension = 1; break;
        case 3: pointsComprehension = 2; break;
        case 4: pointsComprehension = 3; break;
        case 5: pointsComprehension = 4; break;
        default: pointsComprehension = ""; break;
    }

    results.innerText = pointsComprehension !== "" ? `${pointsComprehension} punto${pointsComprehension > 1 ? 's' : ''}` : "Seleccione un nivel de comprensión.";
}


function validateErrorCorrection() {
    const correction = document.getElementById("errorCorrection").value;
    const resultsCorrection = document.getElementById('resultsErrorCorrection');
    fetch('/validate-mental-health', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            'message': correction
        })
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
        .then(data => {
            if (data.error) {
                throw new Error(data.error);
            }
            resultsCorrection.innerText = data.reply;
            const resultsText = resultsCorrection.innerText;
            const match = resultsText.match(/:\s*(\d+)$/);

            if (match) {
                const numberCorrection = parseInt(match[1], 10);
                console.log('Número extraído:', numberCorrection);
            } else {
                console.log('No se encontró un número después de los dos puntos.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            resultsCorrection.innerText = 'Ocurrió un error. Inténtalo de nuevo.';
        });
}

document.getElementById('validateMentalHealth').addEventListener('click', validateErrorCorrection);

document.getElementById('additionalForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const totalPoints = (pointsWords || 0) + (pointsPhrase || 0) + (pointsComprehension || 0);
    const averagePoints = totalPoints / 4;

    if (averagePoints < 1) {
        levelEnglish = 'A1';
    } else if (averagePoints < 2) {
        levelEnglish = 'A2';
    } else if (averagePoints < 3) {
        levelEnglish = 'B1';
    } else {
        levelEnglish = 'B2';
    }

    console.log('Nivel de inglés:', levelEnglish);

    const formData = {
        date: document.getElementById('date').value,
        level: levelEnglish
    };

    fetch('/submit-form', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            document.getElementById('response').innerText = 'Datos guardados correctamente. El día de hoy fuiste un nive: ' + levelEnglish;
        })
        .catch((error) => {
            console.error('Error:', error);
            document.getElementById('response').innerText = 'Error al guardar los datos';
        });
});
