import * as PIXI from 'pixi.js';

export class DopaminePopup {
    constructor(app) {
        this.app = app;
        this.container = new PIXI.Container();
        app.stage.addChild(this.container);  // Add to app.stage, not this.stage
    }

    create(amount, x, y) {
        const spread = 100;
        const randomX = x + (Math.random() - 0.5) * spread;
        const randomY = y + (Math.random() - 0.5) * spread;

        const text = new PIXI.Text(amount > 0 ? `+${amount}` : amount.toString(), {
            fontFamily: 'Arial',
            fontSize: 36,
            fill: 0x00ff00,
            fontWeight: 'bold'
        });

        text.anchor.set(0.5);
        text.x = randomX;
        text.y = randomY;

        this.container.addChild(text);

        const duration = 1000;
        const startTime = Date.now();
        const startY = randomY;
        const fadeDistance = -100;
        const driftX = (Math.random() - 0.5) * 50;

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);

            text.x = randomX + (driftX * easeOut);
            text.y = startY + (fadeDistance * easeOut);
            text.alpha = 1 - easeOut;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.container.removeChild(text);
                text.destroy();
            }
        };

        animate();
    }
}
