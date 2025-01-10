import { Powerup } from './Powerup.js';
import * as PIXI from 'pixi.js';

export class FidgetSpinnerPowerup extends Powerup {
    static MAX_SPINNERS = 10;
    static BASE_COST = 15;
    
    constructor(dopamineManager, app) {
        const currentCost = FidgetSpinnerPowerup.BASE_COST * Math.pow(2, dopamineManager.spinnerCount || 0);
        super(
            "Fidget Spinner",
            currentCost,
            "A bouncing spinner that gives +5 dopamine on each bounce!",
            "🌀"
        );
        
        this.dopamineManager = dopamineManager;
        this.app = app;
        this.spinner = null;
        this.speed = { x: 3, y: 2 };
        
        // Initialize spinner count if not exists
        if (typeof this.dopamineManager.spinnerCount === 'undefined') {
            this.dopamineManager.spinnerCount = 0;
        }
        
        // Update tooltip to show spinner count
        this.updateTooltip();
        
        this.element.addEventListener('click', () => this.tryPurchase());
    }

    updateTooltip() {
        const count = this.dopamineManager.spinnerCount;
        const remainingSpinners = FidgetSpinnerPowerup.MAX_SPINNERS - count;
        const nextCost = FidgetSpinnerPowerup.BASE_COST * Math.pow(2, count);
        
        this.updateDescription(
            `A bouncing spinner that gives +5 dopamine on each bounce! ` +
            `(${count}/${FidgetSpinnerPowerup.MAX_SPINNERS} owned)`
        );
        this.updateCost(nextCost);
    }

    tryPurchase() {
        if (this.dopamineManager.spinnerCount >= FidgetSpinnerPowerup.MAX_SPINNERS) {
            return; // Max spinners reached
        }

        if (this.dopamineManager.spendDopamine(this.cost)) {
            this.dopamineManager.spinnerCount++;
            this.applyEffect();
            
            // Update cost for next purchase
            const newCost = FidgetSpinnerPowerup.BASE_COST * Math.pow(2, this.dopamineManager.spinnerCount);
            this.updateCost(newCost);
            
            // Update tooltip
            this.updateTooltip();
            
            // Remove powerup if max count reached
            if (this.dopamineManager.spinnerCount >= FidgetSpinnerPowerup.MAX_SPINNERS) {
                this.dopamineManager.powerupBar.removePowerup(this);
            }
        }
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
        // Create and add the spinner to the stage
        const spinner = this.createSpinner();
        this.app.stage.addChild(spinner);

        // Set up the animation loop for this specific spinner
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
