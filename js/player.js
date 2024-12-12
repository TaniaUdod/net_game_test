import { PLAYER_START_X, PLAYER_START_Y, PLAYER_WIDTH } from './constants.js';
import { app } from './game.js';

let player;

export async function createPlayer() {
    await PIXI.Assets.load('assets/sprites/rocket.png');
    player = PIXI.Sprite.from('assets/sprites/rocket.png');
    player.anchor.set(0.5);
    player.x = PLAYER_START_X;
    player.y = PLAYER_START_Y;
    player.width = PLAYER_WIDTH;
    player.height = player.width * (player.texture.height / player.texture.width);
    app.stage.addChild(player);
    return player;
}
