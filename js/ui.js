import {
    FONT_FAMILY,
    FONT_SIZE_MEDIUM,
    FONT_SIZE_LARGE,
    TEXT_COLOR_WHITE,
    TEXT_COLOR_RED,
    TEXT_COLOR_GREEN,
    TEXT_STROKE_COLOR,
    FONT_WEIGHT_BOLD,
    FONT_STYLE_ITALIC,
    TEXT_SHADOW_COLOR,
} from './constants.js';

export function createTimerText(app, timer) {
    const timerText = new PIXI.Text({
        text: timer,
        style: {
            fontFamily: FONT_FAMILY,
            fontSize: FONT_SIZE_MEDIUM,
            fill: TEXT_COLOR_WHITE,
            stroke: { color: TEXT_STROKE_COLOR, width: 7, join: 'round' },
        }
    });
    timerText.x = app.screen.width - timerText.width - 10;
    timerText.y = 10;
    return timerText;
}

export function createBulletCountText(app, bulletCount) {
    const bulletCountText = new PIXI.Text({
        text: `bullets: ${bulletCount} / 10`,
        style: {
            fontFamily: FONT_FAMILY,
            fontSize: FONT_SIZE_MEDIUM,
            fill: TEXT_COLOR_WHITE,
            stroke: { color: TEXT_STROKE_COLOR, width: 7, join: 'round' },
        }
    });
    bulletCountText.x = 10;
    bulletCountText.y = 10;
    return bulletCountText;
}

export function showMessage(app, message, isWin = false) {
    const messageText = new PIXI.Text({
        text: message,
        style: {
            fontFamily: FONT_FAMILY,
            fontSize: FONT_SIZE_LARGE,
            fontStyle: FONT_STYLE_ITALIC,
            fill: isWin ? TEXT_COLOR_GREEN : TEXT_COLOR_RED,
            fontWeight: FONT_WEIGHT_BOLD,
            stroke: { color: TEXT_STROKE_COLOR, width: 5, join: 'round' },
            dropShadow: {
                color: TEXT_SHADOW_COLOR,
                blur: 4,
                angle: Math.PI / 6,
                distance: 6,
            },
        }
    });
    messageText.x = app.canvas.width / 2 - messageText.width / 2;
    messageText.y = app.canvas.height / 2 - messageText.height / 2;
    app.stage.addChild(messageText);
}
