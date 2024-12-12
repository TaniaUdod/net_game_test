import {
    GAME_WIDTH,
    GAME_HEIGHT,
    BULLET_SPEED,
    BOSS_BULLET_SPEED,
    BOSS_HP_INITIAL,
    TIMER_INTERVAL,
    BULLET_MAX_COUNT,
    TEXT_COLOR_RED,
    TEXT_COLOR_YELLOW,
    LEVEL_TIME_LIMIT,
} from './constants.js';
import { createPlayer } from './player.js';
import { setupControls } from './controls.js';
import { checkCollision } from './collision.js';
import { createTimerText, createBulletCountText, showMessage } from './ui.js';
import { asteroids, createAsteroids, checkAsteroidCollisions } from './asteroids.js';
import { boss, createBoss, updateBoss, updateBossHPBar } from './boss.js';

export const app = new PIXI.Application();
await app.init({ width: GAME_WIDTH, height: GAME_HEIGHT })
document.body.appendChild(app.canvas);

let level = 1;
let gameOver = false;
let bullets = [];
let bossBullets = [];
let bulletCount = BULLET_MAX_COUNT;
let timer = LEVEL_TIME_LIMIT;
export let bossHP = BOSS_HP_INITIAL;

await PIXI.Assets.load('assets/background/space.jpg');
let background = PIXI.Sprite.from('assets/background/space.jpg');
background.width = app.screen.width;
background.height = app.screen.height;
app.stage.addChild(background);

const timerText = createTimerText(app, timer);
app.stage.addChild(timerText);

const bulletCountText = createBulletCountText(app, bulletCount);
app.stage.addChild(bulletCountText);

let player = await createPlayer();

function shootBullet() {
    if (gameOver) return;
    if (bulletCount > 0) {
        bulletCount--;
        let bullet = new PIXI.Graphics()
            .ellipse(0, 0, 8, 12)
            .fill({ color: TEXT_COLOR_RED, alpha: 1 })
            .stroke({ width: 2, color: TEXT_COLOR_YELLOW });
        app.stage.addChild(bullet);
        bullet.x = player.x;
        bullet.y = player.y - 75;
        bullets.push(bullet);
        bulletCountText.text = `bullets: ${bulletCount} / 10`;
    }
}

function updateBullets() {
    if (gameOver) return;

    bullets.forEach(bullet => {
        bullet.y -= BULLET_SPEED;

        if (bullet.y < 0) {
            app.stage.removeChild(bullet);
            bullets = bullets.filter(b => b !== bullet);
        } else {
            checkAsteroidCollisions(bullet);

            if (boss && checkCollision(bullet, boss)) {
                bossHP--;
                updateBossHPBar();
                app.stage.removeChild(bullet);
                bullets = bullets.filter(b => b !== bullet);

                if (bossHP <= 0) {
                    app.stage.removeChild(boss);
                    gameOver = true;
                }
            }

            bossBullets.forEach(bossBullet => {
                if (checkCollision(bullet, bossBullet)) {
                    app.stage.removeChild(bullet);
                    app.stage.removeChild(bossBullet);
                    bullets = bullets.filter(b => b !== bullet);
                    bossBullets = bossBullets.filter(b => b !== bossBullet);
                }
            });
        }
    });
}

function createBossBullet() {
    if (!gameOver && boss) {
        let bullet = new PIXI.Graphics()
            .ellipse(0, 0, 8, 20)
            .fill({ color: 0x00bd23, alpha: 1 })
            .stroke({ width: 2, color: TEXT_COLOR_YELLOW });
        bullet.x = boss.x + (boss.width / 2);
        bullet.y = boss.y + boss.height / 2;
        app.stage.addChild(bullet);
        bossBullets.push(bullet);
    }
}

function updateBossBullets() {
    bossBullets.forEach(bossBullet => {
        bossBullet.y += BOSS_BULLET_SPEED;

        if (bossBullet.y > app.canvas.height) {
            app.stage.removeChild(bossBullet);
            bossBullets = bossBullets.filter(b => b !== bossBullet);
        } else {
            if (checkCollision(bossBullet, player)) {
                showLoseMessage();
            }
        }
    });
}

app.ticker.add(() => {
    if (boss) {
        updateBoss();
    }
});

function updateGame() {
    if (gameOver) return;

    updateBullets();
    updateBossBullets();

    if (Math.floor(timer) % 2 === 0 && boss && bossBullets.length === 0) {
        createBossBullet();
    }

    if (asteroids.length === 0 && level === 1) {
        startLevel2();
    } else if (level === 2 && boss && bossHP <= 0) {
        showWinMessage();
        gameOver = true;
    }

    if (bulletCount === 0 && bullets.length === 0 && asteroids.length > 0) {
        showLoseMessage();
        gameOver = true;
    }

    if (level === 2 && bulletCount === 0 && bullets.length === 0 && boss && bossHP > 0) {
        showLoseMessage();
        gameOver = true;
    }

    if (timer > 0) {
        timer -= TIMER_INTERVAL;
    } else {
        gameOver = true;
        showLoseMessage();
    }

    timerText.text = Math.ceil(timer);
}

async function startLevel2() {
    level = 2;
    timer = LEVEL_TIME_LIMIT;
    bulletCount = BULLET_MAX_COUNT;
    bulletCountText.text = `bullets: ${bulletCount} / 10`;
    await createBoss();
    bossHP = BOSS_HP_INITIAL;
}

const removeControls = setupControls(player, app, shootBullet, gameOver);

function showWinMessage() {
    showMessage(app, "YOU WIN", true);
    gameOver = true;
    removeControls();
}

function showLoseMessage() {
    showMessage(app, "YOU LOSE", false);
    gameOver = true;
    removeControls();
}

function gameLoop() {
    if (gameOver) return;
    updateGame();
    requestAnimationFrame(gameLoop);
}

await createAsteroids();
gameLoop();
