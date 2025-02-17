// Inicia las funciones cuando el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {
    displayDate();
    handleResponsiveChanges();
    setupClickOutsideAndInputFocus();
    getStory(); // Asegúrate de que esta función esté definida en tu código
});

// Verifica si es un dispositivo móvil
const isMobileDevice = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

// Alternar el menú solo cuando se hace clic en el ícono
function toggleMenu() {
    const menu = document.getElementById("menu");
    const menuIcon = document.querySelector(".menu-icon");

    menu.classList.toggle('show');
    menu.style.display = menu.classList.contains('show') ? 'block' : 'none';
    document.body.style.overflow = menu.classList.contains('show') ? 'hidden' : 'auto';
    menuIcon.style.color = menu.classList.contains('show') ? '#fff' : '#6f42c1';
}

// Configuración para ocultar el menú al hacer clic fuera de él o al enfocar en un input (solo en móviles)
function setupClickOutsideAndInputFocus() {
    const menu = document.getElementById("menu");
    const menuIcon = document.querySelector(".menu-icon");

    // Ocultar menú al hacer clic fuera de él o del ícono
    document.addEventListener('click', (event) => {
        if (!menu.contains(event.target) && !menuIcon.contains(event.target)) {
            closeMenu(menu, menuIcon);
        }
    });

    // En dispositivos móviles, oculta el menú al enfocar en un input
    if (isMobileDevice) {
        document.querySelectorAll('input').forEach(input => {
            input.addEventListener('focus', () => closeMenu(menu, menuIcon));
        });
    }
}

// Función auxiliar para cerrar el menú
function closeMenu(menu, menuIcon) {
    menu.classList.remove('show');
    menu.style.display = 'none';
    document.body.style.overflow = 'auto';
    menuIcon.style.color = '#6f42c1';
}

// Función para mostrar la fecha actual en formato YYYY-MM-DD
function displayDate() {
    const formattedDate = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = formattedDate;
}

// Aquí deberías definir handleResponsiveChanges y getStory si no están aún definidas.
// function handleResponsiveChanges() { ... }
// function getStory() { ... }



let pointsWords;
let pointsPhrase;
let levelEnglish;

function validateNewWords() {
    const wordCount = parseInt(document.getElementById("newWords").value, 10);
    const resultsNewWords = document.getElementById('resultsNewWords');

    let pointsWords;

    if (wordCount <= 7) pointsWords = 0;
    else if (wordCount <= 15) pointsWords = 1;
    else if (wordCount <= 22) pointsWords = 2;
    else if (wordCount <= 29) pointsWords = 3;
    else if (wordCount >= 30) pointsWords = 4;

    resultsNewWords.innerText = pointsWords !== undefined ? `${pointsWords} punto${pointsWords !== 1 ? 's' : ''}` : "";

}

validateNewWords();

function validatePhrase() {
    const phrase = document.getElementById("phrase").value;
    const resultsPhrase = document.getElementById('resultsPhrase');
    const resultPoints = document.getElementById('resultsPoints');
    fetch('https://issentencecorrectgrammar-lkdliiflpq-uc.a.run.app', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: phrase
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            resultsPhrase.innerText = data.reply;
            const resultsText = data.reply;
            const match = resultsText.match(/:\s*(\d+)$/);
            if (match) {
                const number = parseInt(match[1], 10);
                pointsPhrase = number >= 8 ? 0 :
                    number >= 6 ? 1 :
                        number >= 4 ? 2 :
                            number >= 2 ? 3 : 4;
                resultPoints.innerText = "Points: " + pointsPhrase;
            } else {
                pointsPhrase = 0;
                resultPoints.innerText = "Ocurrio un problema. Intentalo más tarde";
            }
        })
        .catch(error => {
            document.getElementById('resultsPhrase').innerText = 'Ocurrió un error. Inténtalo de nuevo.';
        });
}

document.getElementById('validatePhraseBtn').addEventListener('click', validatePhrase);

async function getStory() {
    try {
        const response = await fetch('https://createstory-lkdliiflpq-uc.a.run.app', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        document.getElementById('story').innerText = data.reply;
    } catch (error) {
        document.getElementById('story').innerText = 'Ocurrió un error. Inténtalo de nuevo.';
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

    fetch('https://ishowfeeltodayok-lkdliiflpq-uc.a.run.app', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({ 'message': correction })
    })
        .then(response => {
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

    const formData = {
        date: document.getElementById('date').value,
        level: levelEnglish
    };

    fetch('https://resultsformtotallevelenglish-lkdliiflpq-uc.a.run.app', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            document.getElementById('response').innerText = 'Datos guardados correctamente. El día de hoy fuiste un nivel: ' + levelEnglish;
        })
        .catch((error) => {
            console.error('Error:', error);
            document.getElementById('response').innerText = 'Error al guardar los datos';
        });
});
