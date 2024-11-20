let step = "circle";
let spanWho = document.getElementById('spanWho');
let isGameOver = false; // Флаг состояния игры
let winner = "";

const who = () => {
    if (step === 'circle') {
        step = 'krest';
        spanWho.innerText = 'X (cross)';
    } else {
        step = 'circle';
        spanWho.innerText = 'O (circle)';
    }
};

let blockItem = document.querySelectorAll('.blockItem');
let counter = 0;

blockItem.forEach((item, index) => {
    item.addEventListener('click', () => {
        if (!isGameOver && !item.classList.contains('circle') && !item.classList.contains('krest')) {
            item.classList.add(step);
            item.innerText = step === 'krest' ? "X" : "O";
            counter++;
            checkWin(); // Проверяем, завершилась ли игра
            if (!isGameOver) {
                who();
                if (step === 'krest') minimaxMove(); // Только если игра продолжается
            }
        }
    });
});

const winPatterns = [
    [0, 1, 2],
    [0, 4, 8],
    [2, 4, 6],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8]
];

const checkWin = () => {
    if (checkVictory('krest')) endGame('X (cross)');
    else if (checkVictory('circle')) endGame('O (circle)');
    else if (counter >= 9) endGame('Draw'); // Проверка на ничью
};

const checkVictory = (player) => {
    return winPatterns.some(pattern => 
        pattern.every(index => blockItem[index].classList.contains(player))
    );
};

let minimaxMove = () => {
    if (isGameOver) return; // Проверка: если игра окончена, ИИ не делает ход

    let bestScore = -Infinity;
    let move = null;
    blockItem.forEach((item, index) => {
        if (!item.classList.contains('circle') && !item.classList.contains('krest')) {
            item.classList.add('krest'); // Симуляция хода X
            let score = minimax(0, false);
            item.classList.remove('krest');
            item.innerText = '';
            if (score > bestScore) {
                bestScore = score;
                move = index;
            }
        }
    });
    if (move !== null) {
        blockItem[move].classList.add('krest');
        blockItem[move].innerText = 'X';
        counter++;
        checkWin(); // Проверяем, завершилась ли игра после хода ИИ
        if (!isGameOver) who();
    }
};

let minimax = (depth, isMaximizing) => {
    if (checkVictory('krest')) return 10 - depth;
    if (checkVictory('circle')) return depth - 10;
    if (counter >= 9) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        blockItem.forEach((item, index) => {
            if (!item.classList.contains('circle') && !item.classList.contains('krest')) {
                item.classList.add('krest'); // Симуляция хода X
                counter++;
                let score = minimax(depth + 1, false);
                item.classList.remove('krest');
                item.innerText = '';
                counter--;
                bestScore = Math.max(score, bestScore);
            }
        });
        return bestScore;
    } else {
        let bestScore = Infinity;
        blockItem.forEach((item, index) => {
            if (!item.classList.contains('circle') && !item.classList.contains('krest')) {
                item.classList.add('circle'); // Симуляция хода O
                counter++;
                let score = minimax(depth + 1, true);
                item.classList.remove('circle');
                item.innerText = '';
                counter--;
                bestScore = Math.min(score, bestScore);
            }
        });
        return bestScore;
    }
};

let blockWinner = document.getElementById('blockWinner');
let blockDraw = document.getElementById('blockDraw'); // Элемент для ничьей
let spanWin = document.getElementById('spanWin');
let btnNewGame = document.getElementById('btnNewGame');
let btnNewGameDraw = document.getElementById('btnNewGameDraw'); // Кнопка для нового игрового процесса
let blockArea = document.getElementById('blockArea');

let endGame = (result) => {
    isGameOver = true; // Устанавливаем флаг окончания игры
    blockArea.style.pointerEvents = 'none';
    
    if (result === 'Draw') {
        blockDraw.style.display = 'flex'; // Показываем сообщение о ничьей
    } else {
        blockWinner.style.display = 'flex'; // Показываем сообщение о победе
        spanWin.innerText = result;
    }
};

btnNewGame.addEventListener('click', () => {
    document.location.reload();
});

btnNewGameDraw.addEventListener('click', () => {
    document.location.reload(); // Новый старт игры при ничьей
});