import { app } from './game.js';
import { ASTEROID_COUNT, ASTEROID_WIDTH } from './constants.js';
import { checkCollision } from './collision.js';

export let asteroids = [];

export async function createAsteroids() {
    await PIXI.Assets.load('assets/sprites/asteroid.png');
    for (let i = 0; i < ASTEROID_COUNT; i++) {
        let asteroid = PIXI.Sprite.from('assets/sprites/asteroid.png');
        asteroid.x = Math.random() * (app.canvas.width - asteroid.width);
        asteroid.y = Math.random() * (app.canvas.height / 2 - asteroid.height) + 50;
        asteroid.width = ASTEROID_WIDTH;
        asteroid.height = ASTEROID_WIDTH * (asteroid.texture.height / asteroid.texture.width);
        app.stage.addChild(asteroid);
        asteroids.push(asteroid);
    }
}

export function checkAsteroidCollisions(bullet) {
    asteroids.forEach(asteroid => {
        if (checkCollision(bullet, asteroid)) {
            app.stage.removeChild(bullet);
            app.stage.removeChild(asteroid);
            asteroids = asteroids.filter(a => a !== asteroid);
        }
    });
}
