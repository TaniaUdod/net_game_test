export function setupControls(player, app, shootBullet, gameOver) {
    function onKeyDown(event) {
        if (gameOver) return;

        if (event.code === 'ArrowLeft') {
            player.x = Math.max(50, player.x - 5);
        } else if (event.code === 'ArrowRight') {
            player.x = Math.min(app.canvas.width - 50, player.x + 5);
        } else if (event.code === 'Space') {
            shootBullet();
        }
    }

    window.addEventListener('keydown', onKeyDown);

    return () => {
        window.removeEventListener('keydown', onKeyDown);
    };
}
