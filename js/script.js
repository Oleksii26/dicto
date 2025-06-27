const dictionary = {};
const apiBase = "https://sub.eco-product.in.ua"; // Ваш піддомен

// Завантаження слів з сервера
async function loadFromServer() {
    try {
        const res = await fetch(`${apiBase}/loadT.php`);
        const data = await res.json();
        
        for (const letter in data) {
            dictionary[letter] = data[letter];
        }
        renderWords();
    } catch (error) {
        console.error("Помилка завантаження з сервера:", error);
    }
}

// Збереження слова на сервер
async function saveToServer() {
    try {
        const response = await fetch(`${apiBase}/saveT.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dictionary)           
            
        });

        const result = await response.json();
        if (result.success) {
            console.log("Словник успішно збережено.");
        } else {
            console.error("Помилка збереження:", result.error || result);
        }
    } catch (error) {
        console.error("Помилка збереження на сервер:", error);
    }
}


// Створення розділів A–Z
const alphabetDiv = document.getElementById('alphabet');
for (let i = 65; i <= 90; i++) {
    const letter = String.fromCharCode(i);
    dictionary[letter] = [];
    const section = document.createElement('div');
    section.className = 'letter-section';
    section.id = `section-${letter}`;
    section.innerHTML = `<h3>${letter}</h3><div class="words"></div>`;
    alphabetDiv.appendChild(section);
}

// Додавання слова
function addWord() {
    const wordInput = document.getElementById("search");
    const word = wordInput.value.trim();
    if (!word) return;

    const translation = prompt("Введіть переклад слова:");
    if (!translation) return;

    const firstLetter = word[0].toUpperCase();
    if (!dictionary[firstLetter]) {
        alert("Неправильна літера. Використовуйте латинський алфавіт.");
        return;
    }

    dictionary[firstLetter].push({ word, translation });

    saveToServer().then(() => {
        // Очищаємо поле пошуку
        wordInput.value = "";

        // Після збереження — оновити з сервера
        loadFromServer();
    });
}


// Вивід слів
function renderWords(filter = "") {
    for (const letter in dictionary) {
        const section = document.querySelector(`#section-${letter} .words`);
        const btn = document.querySelector('.btn')
        section.innerHTML = "";
        dictionary[letter]
            .filter(entry => entry.word.toLowerCase().includes(filter.toLowerCase()))
            .sort((a, b) => a.word.localeCompare(b.word))
            .forEach(entry => {
                const div = document.createElement('div');
                div.className = 'word';
                div.innerHTML = `<strong>${entry.word}</strong> — <span class='trans'>${entry.translation}</span>`;
                section.appendChild(div);       
                const words = document.querySelectorAll('.trans')
                btn.addEventListener('click', () => {
                    btn.style.backgroundColor = "rgb(190, 187, 187)";
                    words.forEach(word => {
                        word.classList.add('unshow')
                    })
                })
                
            });
    }
}

// Живий пошук
document.getElementById('search').addEventListener('input', (e) => {
    renderWords(e.target.value);
});

// Прив'язка кнопки
document.getElementById('save-btn').addEventListener('click', addWord);

// Ініціалізація
loadFromServer();


