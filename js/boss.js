import {
    BOSS_MOVE_SPEED,
    BOSS_MOVE_TIME,
    BOSS_STAY_TIME,
    TEXT_COLOR_WHITE,
    FONT_FAMILY,
    FONT_SIZE_SMALL,
    FONT_WEIGHT_BOLD,
    TIMER_INTERVAL,
} from './constants.js';
import { app, bossHP } from './game.js';

export let boss;
let bossHPText;
let bossDirection = 1;
let bossTimer = 0;

export async function createBoss() {
    await PIXI.Assets.load('assets/sprites/boss.png');
    boss = PIXI.Sprite.from('assets/sprites/boss.png');
    boss.x = app.screen.width / 2;
    boss.y = 150;
    boss.width = 300;
    boss.height = boss.width * (boss.texture.height / boss.texture.width);
    app.stage.addChild(boss);

    bossHPText = new PIXI.Text({
        text: `${bossHP} / 4`,
        style: {
            fontFamily: FONT_FAMILY,
            fontSize: FONT_SIZE_SMALL,
            fill: TEXT_COLOR_WHITE,
            fontWeight: FONT_WEIGHT_BOLD,
        }
    });
    bossHPText.x = boss.x + (boss.width / 2) - (bossHPText.width / 2);
    bossHPText.y = boss.y - boss.height / 2;
    app.stage.addChild(bossHPText);
}

export function updateBoss() {
    if (boss) {
        bossTimer += TIMER_INTERVAL;

        if (bossTimer < BOSS_STAY_TIME) {
            return;
        }

        if (bossTimer < BOSS_STAY_TIME + BOSS_MOVE_TIME) {
            boss.x += bossDirection * BOSS_MOVE_SPEED;

            if (boss.x < 0 || boss.x + boss.width > app.canvas.width) {
                bossDirection *= -1;
            }
        } else {
            bossTimer = 0;
        }

        if (bossHPText) {
            bossHPText.x = boss.x + (boss.width / 2) - (bossHPText.width / 2);
        }
    }
}

export function updateBossHPBar() {
    bossHPText.text = `${bossHP} / 4`;

    if (bossHP <= 0) {
        app.stage.removeChild(boss);
        app.stage.removeChild(bossHPText);
    }
}
