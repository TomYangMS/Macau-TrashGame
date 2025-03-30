const categories = [
    { 
        type: 'metal', 
        name: '金屬類', 
        image: 'metal.png',
        items: ['metal1.png', 'metal2.png']
    },
    { 
        type: 'plastic', 
        name: '塑料類', 
        image: 'plastic.png',
        items: ['plastic1.png', 'plastic2.png']
    },
    { 
        type: 'general', 
        name: '一般垃圾', 
        image: 'general.png',
        items: ['general1.png', 'general2.png']
    },
    { 
        type: 'electronic', 
        name: '電子設備', 
        image: 'electronic.png',
        items: ['electronic1.png', 'electronic2.png']
    },
    { 
        type: 'glass', 
        name: '玻璃類', 
        image: 'glass.png',
        items: ['glass1.png', 'glass2.png']
    },
    { 
        type: 'food', 
        name: '廚餘類', 
        image: 'food.png',
        items: ['food1.png', 'food2.png']
    },
    { 
        type: 'paper', 
        name: '紙類', 
        image: 'paper.png',
        items: ['paper1.png', 'paper2.png']
    },
    { 
        type: 'cloth', 
        name: '舊衣類', 
        image: 'cloth.png',
        items: ['cloth1.png', 'cloth2.png']
    }
];

let score = 0;
let timeLeft = 30;
let timer;
let isPlaying = false;

// 初始化事件
document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('restartBtn').addEventListener('click', restartGame);

function startGame() {
    if(isPlaying) return;
    isPlaying = true;

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
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').textContent = timeLeft;
        if(timeLeft <= 0) endGame();
    }, 1000);

    // 啟用拖拽事件
    addDragEvents();
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
    div.draggable = true;
    div.innerHTML = `<img src="images/items/${randomItem.item}" alt="垃圾">`;
    container.appendChild(div);
}

function addDragEvents() {
    document.getElementById('itemContainer').addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', e.target.parentElement.getAttribute('data-type'));
    });

    document.querySelectorAll('.bin').forEach(bin => {
        bin.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        bin.addEventListener('drop', (e) => {
            e.preventDefault();
            const itemType = e.dataTransfer.getData('text/plain');
            const binType = bin.getAttribute('data-type');

            if(itemType === binType) {
                score += 10;
            } else {
                score -= 20;
            }

            document.getElementById('score').textContent = score;

            // 生成新物品
            generateRandomItem();
        });
    });
}

function endGame() {
    clearInterval(timer);
    isPlaying = false;
    alert(`時間到！最終得分：${score}`);
    restartGame();
}

function restartGame() {
    clearInterval(timer);
    document.getElementById('startPage').classList.remove('hidden');
    document.getElementById('gamePage').classList.add('hidden');
    document.getElementById('itemContainer').innerHTML = '';
    document.getElementById('binsContainer').innerHTML = '';
}