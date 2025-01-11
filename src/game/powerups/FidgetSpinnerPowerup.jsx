import { Powerup } from './Powerup.js';
import * as PIXI from 'pixi.js';

export class FidgetSpinnerPowerup extends Powerup {
    static MAX_SPINNERS = 10;
    
    constructor(dopamineManager, app, level) {
        const cost = 15 * Math.pow(2, level - 1);  // 15, 30, 60, 120, etc.
        super(
            `Fidget Spinner ${level}`,
            cost,
            `A bouncing spinner that gives +5 dopamine on each bounce! (${level}/${FidgetSpinnerPowerup.MAX_SPINNERS})`,
            "🌀"
        );
        
        this.dopamineManager = dopamineManager;
        this.app = app;
        this.level = level;

        // Add click event listener
        this.element.addEventListener('click', () => {
            console.log(`Clicked Fidget Spinner ${this.level}`);
            this.tryPurchase();
        });
    }

    tryPurchase() {
        if (this.dopamineManager.spendDopamine(this.cost)) {
            console.log(`Purchased Fidget Spinner ${this.level}`);
            this.dopamineManager.incrementSpinnerCount();
            this.applyEffect();
            this.purchased = true;
            this.dopamineManager.powerupBar.removePowerup(this);
            return true;
        }
        return false;
    }

    createSpinner() {
        const spinner = new PIXI.Graphics();
        spinner.beginFill(0x00ff00);
        spinner.drawCircle(0, 0, 20);
        spinner.endFill();

        // Add some "arms" to make it look more like a fidget spinner
        spinner.lineStyle(4, 0x00ff00);
        for (let i = 0; i < 3; i++) {
            const angle = (i * Math.PI * 2) / 3;
            spinner.moveTo(0, 0);
            spinner.lineTo(Math.cos(angle) * 15, Math.sin(angle) * 15);
        }

        // Random starting position
        spinner.x = Math.random() * (this.app.screen.width - 40) + 20;
        spinner.y = Math.random() * (this.app.screen.height - 40) + 20;

        // Random starting direction
        const angle = Math.random() * Math.PI * 2;
        const speed = 3;
        spinner.velocity = {
            x: Math.cos(angle) * speed,
            y: Math.sin(angle) * speed
        };

        // Add rotation animation
        this.app.ticker.add(() => {
            spinner.rotation += 0.1;
        });

        return spinner;
    }

    applyEffect() {
        const spinner = this.createSpinner();
        this.app.stage.addChild(spinner);
        this.app.ticker.add(() => this.updateSpinner(spinner));
    }

    updateSpinner(spinner) {
        // Move the spinner
        spinner.x += spinner.velocity.x;
        spinner.y += spinner.velocity.y;

        // Check for collisions with screen edges
        let bounced = false;

        if (spinner.x <= 20 || spinner.x >= this.app.screen.width - 20) {
            spinner.velocity.x *= -1;
            bounced = true;
        }

        if (spinner.y <= 20 || spinner.y >= this.app.screen.height - 20) {
            spinner.velocity.y *= -1;
            bounced = true;
        }

        // Give dopamine on bounce
        if (bounced) {
            this.dopamineManager.addDopamine(5);
        }
    }
}
