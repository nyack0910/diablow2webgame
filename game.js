// Canvasの設定
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// ゲームの設定
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

let player = {
    x: GAME_WIDTH / 2,
    y: GAME_HEIGHT / 2,
    width: 50,
    height: 50,
    speed: 5,
    color: 'blue',
    level: 1,
    experience: 0
};

let enemies = [];
let disks = [];

// ゲームループ
function gameLoop() {
    // クリア
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // プレイヤーの描画
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x - player.width / 2, player.y - player.height / 2, player.width, player.height);

    // 敵の生成と描画
    if (Math.random() < 0.02) {
        enemies.push({
            x: Math.random() * GAME_WIDTH,
            y: Math.random() * GAME_HEIGHT,
            width: 20,
            height: 20,
            speed: 1,
            color: 'red',
            health: 1
        });
    }
    enemies.forEach((enemy, index) => {
        ctx.fillStyle = enemy.color;
        ctx.fillRect(enemy.x - enemy.width / 2, enemy.y - enemy.height / 2, enemy.width, enemy.height);
        // 敵の移動
        enemy.x += enemy.speed;
        enemy.y += enemy.speed;

        // プレイヤーと敵の衝突判定
        if (checkCollision(player, enemy)) {
            enemies.splice(index, 1);
            // ディスクのドロップ
            if (Math.random() < 0.5) {
                disks.push({
                    x: enemy.x,
                    y: enemy.y,
                    width: 10,
                    height: 10,
                    color: 'yellow'
                });
            }
            player.experience += 10;
            if (player.experience >= player.level * 100) {
                player.level++;
                player.color = `hsl(${Math.random() * 360}, 70%, 50%)`;
                alert(`レベル${player.level}に上がった！`);
            }
        }
    });

    // ディスクの描画
    disks.forEach((disk, index) => {
        ctx.fillStyle = disk.color;
        ctx.fillRect(disk.x - disk.width / 2, disk.y - disk.height / 2, disk.width, disk.height);
        // プレイヤーとディスクの衝突判定
        if (checkCollision(player, disk)) {
            disks.splice(index, 1);
            // スキルやパワーの習得処理
            alert('新しいスキルを習得！');
        }
    });

    // プレイヤーの移動処理
    document.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'ArrowLeft':
                player.x = Math.max(player.width / 2, player.x - player.speed);
                break;
            case 'ArrowRight':
                player.x = Math.min(GAME_WIDTH - player.width / 2, player.x + player.speed);
                break;
            case 'ArrowUp':
                player.y = Math.max(player.height / 2, player.y - player.speed);
                break;
            case 'ArrowDown':
                player.y = Math.min(GAME_HEIGHT - player.height / 2, player.y + player.speed);
                break;
        }
    });

    // 最終ボスの生成
    if (disks.length >= 10) {
        const finalBoss = {
            x: GAME_WIDTH / 2,
            y: GAME_HEIGHT / 2,
            width: 100,
            height: 100,
            speed: 0,
            color: 'purple',
            health: 100
        };
        ctx.fillStyle = finalBoss.color;
        ctx.fillRect(finalBoss.x - finalBoss.width / 2, finalBoss.y - finalBoss.height / 2, finalBoss.width, finalBoss.height);

        // 最終ボスとの戦闘
        if (checkCollision(player, finalBoss)) {
            // ゲームクリア
            alert('ゲームクリア！');
            clearInterval(gameInterval);
        }
    }

    requestAnimationFrame(gameLoop);
}

// 衝突判定関数
function checkCollision(a, b) {
    return a.x - a.width / 2 < b.x + b.width / 2 &&
           a.x + a.width / 2 > b.x - b.width / 2 &&
           a.y - a.height / 2 < b.y + b.height / 2 &&
           a.y + a.height / 2 > b.y - b.height / 2;
}

// ゲームの開始
const gameInterval = setInterval(gameLoop, 1000 / 30);