const categories = [
    {
        type: 'metal',
        name: '金屬類',
        image: 'metal.png',
        items: ['metal1.png','metal2.png','metal3.png','metal4.png','metal5.png']
    },
    {
        type: 'plastic',
        name: '塑料類',
        image: 'plastic.png',
        items: ['plastic1.png', 'plastic2.png', 'plastic3.png', 'plastic4.png', 'plastic5.png']
    },
    {
        type: 'general',
        name: '一般垃圾',
        image: 'general.png',
        items: ['general1.png', 'general2.png', 'general3.png', 'general4.png', 'general5.png']
    },
    {
        type: 'electronic',
        name: '電子設備',
        image: 'electronic.png',
        items: ['electronic1.png', 'electronic2.png', 'electronic3.png', 'electronic4.png', 'electronic5.png']
    },
    {
        type: 'glass',
        name: '玻璃類',
        image: 'glass.png',
        items: ['glass1.png', 'glass2.png', 'glass3.png', 'glass4.png', 'glass5.png']
    },
    {
        type: 'food',
        name: '廚餘類',
        image: 'food.png',
        items: ['food1.png', 'food2.png', 'food3.png', 'food4.png', 'food5.png']
    },
    {
        type: 'paper',
        name: '紙類',
        image: 'paper.png',
        items: ['paper1.png', 'paper2.png', 'paper3.png', 'paper4.png', 'paper5.png']
    },
    {
        type: 'cloth',
        name: '舊衣類',
        image: 'cloth.png',
        items: ['cloth1.png', 'cloth2.png', 'cloth3.png', 'cloth4.png', 'cloth5.png']
    }
];

let score = 0;
let timeLeft = 30;
let timer;
let isPlaying = false;
let playerName = 'user';
let leaderboard = [];
// 新增：初始静音状态为true
let isMuted = true; 

// 音频元素
const correctSound = new Audio('sounds/correct.mp3');
const wrongSound = new Audio('sounds/wrong.mp3');
const gameOverSound = new Audio('sounds/game-over.mp3');
const startBGM = new Audio('sounds/bgm1.mp3');
const gameBGM = new Audio('sounds/bgm2.mp3');

startBGM.loop = true;
gameBGM.loop = true;

// 初始化事件
document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('restartBtn').addEventListener('click', restartGame);
document.getElementById('viewLeaderboardBtn').addEventListener('click', showLeaderboard);
document.getElementById('backToStartBtn').addEventListener('click', backToStart);
// 新增：获取声音控制按钮并添加点击事件
const soundToggleBtn = document.getElementById('soundToggleBtn');
soundToggleBtn.addEventListener('click', toggleSound);

function startGame() {
    if (isPlaying) return;
    isPlaying = true;

    // 停止开始页面背景音乐，播放游戏背景音乐
    startBGM.pause();
    startBGM.currentTime = 0;
    // 根据静音状态决定是否播放游戏背景音乐
    if (!isMuted) {
        gameBGM.play().catch(error => {
            console.error('播放游戏背景音乐失败:', error);
        });
    }

    // 獲取玩家名字
    playerName = document.getElementById('playerName').value || 'user';

    // 切換頁面
    document.getElementById('startPage').classList.add('hidden');
    document.getElementById('gamePage').classList.remove('hidden');

    // 重置狀態
    score = 0;
    timeLeft = 30;
    document.getElementById('score').textContent = score;
    document.getElementById('timer').textContent = timeLeft;

    // 創建垃圾桶
    createBins();

    // 生成初始卡片
    generateRandomItem();

    // 開始計時
    clearInterval(timer); // 确保清除之前的定时器
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').textContent = timeLeft;
        if (timeLeft <= 0) endGame();
    }, 1000);

    // 啟用點擊事件
    addClickEvents();
}

function createBins() {
    const container = document.getElementById('binsContainer');
    container.innerHTML = '';
    categories.forEach(category => {
        const bin = document.createElement('div');
        bin.className = 'bin';
        bin.setAttribute('data-type', category.type);
        bin.innerHTML = `
            <img src="images/bins/${category.image}" alt="${category.name}">
            <p>${category.name}</p>
        `;
        container.appendChild(bin);
    });
}

function generateRandomItem() {
    const container = document.getElementById('itemContainer');
    container.innerHTML = '';

    // 隨機選擇一個物品
    const allItems = categories.flatMap(cat =>
        cat.items.map(item => ({ item, type: cat.type }))
    );
    const randomItem = allItems[Math.floor(Math.random() * allItems.length)];

    const div = document.createElement('div');
    div.className = 'item';
    div.setAttribute('data-type', randomItem.type);
    div.innerHTML = `<img src="images/items/${randomItem.item}" alt="垃圾">`;
    container.appendChild(div);
}

function addClickEvents() {
    document.querySelectorAll('.bin').forEach(bin => {
        bin.addEventListener('click', () => {
            const item = document.querySelector('.item');
            if (item) {
                const itemType = item.getAttribute('data-type');
                const binType = bin.getAttribute('data-type');

                if (itemType === binType) {
                    score += 10;
                    // 根据静音状态决定是否播放正确音效
                    if (!isMuted) {
                        correctSound.play();
                    }
                } else {
                    score -= 20;
                    // 根据静音状态决定是否播放错误音效
                    if (!isMuted) {
                        wrongSound.play();
                    }
                }

                document.getElementById('score').textContent = score;

                // 生成新物品
                generateRandomItem();
            }
        });
    });
}

function endGame() {
    clearInterval(timer);
    isPlaying = false;
    // 停止游戏背景音乐，播放游戏结束音效
    gameBGM.pause();
    gameBGM.currentTime = 0;
    // 根据静音状态决定是否播放游戏结束音效
    if (!isMuted) {
        gameOverSound.play();
    }
    alert(`時間到！最終得分：${score}`);

    // 更新排行榜
    updateLeaderboard(playerName, score);

    // 顯示排行榜
    showLeaderboard();

    restartGame();
}

function restartGame() {
    clearInterval(timer);
    isPlaying = false; // 重置游戏状态
    document.getElementById('startPage').classList.remove('hidden');
    document.getElementById('gamePage').classList.add('hidden');
    document.getElementById('itemContainer').innerHTML = '';
    document.getElementById('binsContainer').innerHTML = '';
    // 停止游戏背景音乐，播放开始页面背景音乐
    gameBGM.pause();
    gameBGM.currentTime = 0;
    // 根据静音状态决定是否播放开始页面背景音乐
    if (!isMuted) {
        startBGM.play();
    }
}

function updateLeaderboard(name, score) {
    leaderboard.push({ name, score });
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, 10);

    // 存儲到本地存儲
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
}

function showLeaderboard() {
    // 從本地存儲獲取排行榜
    leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

    const leaderboardList = document.getElementById('leaderboardList');
    leaderboardList.innerHTML = '';

    leaderboard.forEach((entry, index) => {
        const row = document.createElement('tr');
        const rankCell = document.createElement('td');
        rankCell.textContent = index + 1;
        const nameCell = document.createElement('td');
        nameCell.textContent = entry.name;
        const scoreCell = document.createElement('td');
        scoreCell.textContent = entry.score;

        row.appendChild(rankCell);
        row.appendChild(nameCell);
        row.appendChild(scoreCell);

        leaderboardList.appendChild(row);
    });

    document.getElementById('startPage').classList.add('hidden');
    document.getElementById('gamePage').classList.add('hidden');
    document.getElementById('leaderboardPage').classList.remove('hidden');
    // 停止所有背景音乐
    startBGM.pause();
    startBGM.currentTime = 0;
    gameBGM.pause();
    gameBGM.currentTime = 0;
}

function backToStart() {
    document.getElementById('startPage').classList.remove('hidden');
    document.getElementById('gamePage').classList.add('hidden');
    document.getElementById('leaderboardPage').classList.add('hidden');
    // 停止所有背景音乐，播放开始页面背景音乐
    gameBGM.pause();
    gameBGM.currentTime = 0;
    // 根据静音状态决定是否播放开始页面背景音乐
    if (!isMuted) {
        startBGM.play();
    }
}

function toggleSound() {
    isMuted =!isMuted;
    correctSound.muted = isMuted;
    wrongSound.muted = isMuted;
    gameOverSound.muted = isMuted;
    startBGM.muted = isMuted;
    gameBGM.muted = isMuted;
    if (isMuted) {
        soundToggleBtn.textContent = '打开声音';
    } else {
        if (!isPlaying) {
            startBGM.play();
        } else {
            gameBGM.play();
        }
        soundToggleBtn.textContent = '关闭声音';
    }
}