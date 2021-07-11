export class Question {
    static create(question) {
        return fetch('https://question-app-5dd38-default-rtdb.europe-west1.firebasedatabase.app/questions.json', {
            method: 'POST',
            body: JSON.stringify(question),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(res => {
                question.id = res.name;
                return question;
            })
            .then(addToLocalStorage)
            .then(Question.renderList);
    }

    static fetch(token) {
        if  (!token) {
            return Promise.resolve('<p class="error">You don`t have a token</p>')
        }
        return fetch(`https://question-app-5dd38-default-rtdb.europe-west1.firebasedatabase.app/questions.json?auth=${token}`)
            .then(res => res.json())
            .then(response => {
                if (response && response.error) {
                    return `<p class="error">${response.error}</p>`;
                }
                return response ? Object.keys(response).map(key => ({
                    ...response[key],
                    id: key
                })) : [];
            });
    }

    static renderList() {
        const questions = getQuestionsFromLocalStorage();

        const html = questions.length
            ? questions.map(toCard).join('')
            : `<div class="mui--text-headline">You haven't ask anything yet</div>`

        const list = document.getElementById('list');
        list.innerHTML = html;
    }

    static listToHTML (questions) {
        return questions.length
            ? `<ol>${questions.map(q => `<li>${q.text}</li>`).join('')}</ol>`
            : '<p>No questions yet</p>';
    }
}

function addToLocalStorage(question) {
    const all = getQuestionsFromLocalStorage();
    all.push(question);
    localStorage.setItem('questions', JSON.stringify(all));
}

function getQuestionsFromLocalStorage() {
    return JSON.parse(localStorage.getItem('questions') || '[]');
}

function toCard(question) {
    return `
    <div class="mui--text-black-54">
        ${new Date(question.date).toLocaleDateString()}
        ${new Date(question.date).toLocaleTimeString()}
    </div>
    <div>
        ${question.text}
    </div>
    <br>
`
}