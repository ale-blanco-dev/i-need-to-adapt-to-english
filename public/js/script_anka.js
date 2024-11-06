function toggleMenu() {
    const form = document.getElementById("additionalForm");
    const menu = document.getElementById("menu");
    const menuIcon = document.querySelector(".menu-icon");

    menu.classList.toggle('show');
    form.classList.remove('show');

    menuIcon.style.color = menu.classList.contains('show') ? '#fff' : '#6f42c1';
}

const itemsPerPage = 20;
let currentPage = 1;
let words = [];

const MAX_CHARACTERS = 20;

async function fetchWords() {
    const loader = document.querySelector('.loader');
    const container_loader = document.querySelector('.loader-container')
    const form = document.getElementById('additionalForm')
    form.style.display = 'none';

    loader.style.display = 'block';

    try {
        const response = await fetch('https://getwords-lkdliiflpq-uc.a.run.app');
        if (!response.ok) throw new Error('Error fetching words');
        const data = await response.json();
        words = data.words;

        if (words.length === 0) {
            const containerEnglish = document.getElementById('dataEnglish');
            containerEnglish.innerHTML = '<p>Disculpe. Por el momento no se ha encontrado traducciones por recordar.</p>';
        } else {
            renderPage(currentPage);
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        loader.style.display = 'none';
        form.style.display = 'block';
        container_loader.style.display = 'none';
    }

}


function renderPage(page) {
    clearWords();
    const start = (page - 1) * itemsPerPage;
    const end = Math.min(start + itemsPerPage, words.length);

    for (let i = start; i < end; i++) {
        const word = words[i].Palabra;
        const translation = words[i].Traduccion || ''; // Asegurar que la traducción nunca sea undefined
        displayWordWithToggle(word, translation);
    }

    renderPagination();
}

function clearWords() {
    const containerEnglish = document.getElementById('dataEnglish');
    containerEnglish.innerHTML = '';
}

function truncateText(text, maxLength) {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
}

function displayWordWithToggle(word, translation) {
    const container = document.createElement('div');
    container.className = 'word-container';

    const wordElement = document.createElement('p');
    let wordOriginal = truncateText(word, MAX_CHARACTERS);
    wordElement.textContent = wordOriginal;

    const toggleButton = document.createElement('span');
    toggleButton.className = 'toggle-button';
    toggleButton.textContent = 'Ver Traduccion';

    let showingTranslation = false;
    let truncatedTranslation = truncateText(translation, MAX_CHARACTERS);

    toggleButton.onclick = () => {
        if (showingTranslation) {
            wordElement.textContent = wordOriginal;
            toggleButton.textContent = 'Ver Traduccion';
        } else {
            wordElement.textContent = truncatedTranslation;
            toggleButton.textContent = 'Ver palabra original';
        }
        showingTranslation = !showingTranslation;
    };

    container.appendChild(wordElement);
    container.appendChild(toggleButton);
    document.getElementById('dataEnglish').appendChild(container);
}

function renderPagination() {
    const totalPages = Math.ceil(words.length / itemsPerPage);
    const paginationContainer = document.getElementById('pagination-controls');
    paginationContainer.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.className = 'pagination-button';

        if (i === currentPage) {
            button.classList.add("active");
        }

        button.onclick = () => {
            currentPage = i;
            const buttons = document.querySelectorAll('.pagination-button');
            buttons.forEach(btn => btn.classList.remove("active"));

            button.classList.add("active");

            renderPage(currentPage);
        };

        paginationContainer.appendChild(button);
    }
}

fetchWords();