import { Powerup } from './Powerup.js';
import * as PIXI from 'pixi.js';

export class RainPowerup extends Powerup {
    constructor(dopamineManager, app) {
        super(
            "Rain",
            50,
            "Enjoy the soothing rain while you try to focus",
            "🌧️"
        );
        
        this.dopamineManager = dopamineManager;
        this.app = app;
        this.element.addEventListener('click', () => {
            console.log('Rain powerup clicked!');
            console.log('Cost:', this.cost);
            this.tryPurchase();
        });
        
        this.raindrops = [];
        this.container = null;
        this.active = false;
        this.lastUpdate = Date.now();
        this.dopamineInterval = 1000; // 1 second
        this.rainSound = new Audio('/sounds/rain.wav');
        this.rainSound.loop = true;
    }

    tryPurchase() {
        if (!this.purchased && this.dopamineManager.spendDopamine(this.cost)) {
            console.log('Rain powerup purchased!');
            this.purchased = true;
            this.applyEffect();
            this.dopamineManager.powerupBar.removePowerup(this);
            return true;
        }
        return false;
    }

    createRaindrop() {
        const raindrop = new PIXI.Graphics();
        raindrop.beginFill(0x6BB5FF, 0.5);
        raindrop.drawRect(0, 0, 2, 15);
        raindrop.endFill();
        raindrop.x = Math.random() * window.innerWidth;
        raindrop.y = -20;
        raindrop.velocity = 7 + Math.random() * 5;
        return raindrop;
    }

    initializeRainSystem() {
        if (!this.app || !this.app.stage) {
            console.error('PIXI Application not properly initialized');
            return;
        }
        this.container = new PIXI.Container();
        this.app.stage.addChild(this.container);
        
        // Create initial raindrops
        for (let i = 0; i < 100; i++) {
            const raindrop = this.createRaindrop();
            this.raindrops.push(raindrop);
            this.container.addChild(raindrop);
        }
    }

    update(currentDopamine) {
        // Call parent update method to handle affordability classes
        super.update(currentDopamine);
        
        if (!this.purchased) {
            // Additional Rain-specific tooltip updates if needed
            const remainingDopamine = Math.max(0, this.cost - currentDopamine);
            if (remainingDopamine > 0) {
                this.updateDescription(`Enjoy the soothing rain while you try to focus (Need ${remainingDopamine} more dopamine)`);
            } else {
                this.updateDescription("Enjoy the soothing rain while you try to focus (Click to purchase!)");
            }
        }

        if (this.active) {
            // Update raindrops
            for (let i = this.raindrops.length - 1; i >= 0; i--) {
                const raindrop = this.raindrops[i];
                raindrop.y += raindrop.velocity;
                
                // If raindrop is off screen, reset it to top
                if (raindrop.y > window.innerHeight) {
                    raindrop.y = -20;
                    raindrop.x = Math.random() * window.innerWidth;
                }
            }

            // Generate passive dopamine
            const currentTime = Date.now();
            if (currentTime - this.lastUpdate >= this.dopamineInterval) {
                this.dopamineManager.addDopamine(1);
                this.lastUpdate = currentTime;
            }
        }
    }

    applyEffect() {
        this.active = true;
        this.initializeRainSystem();
        this.rainSound.play();
        
        // Add update to PIXI ticker instead of requestAnimationFrame
        this.app.ticker.add(() => this.update());
    }

    stop() {
        this.active = false;
        this.rainSound.pause();
        this.rainSound.currentTime = 0;
        if (this.container) {
            this.app.stage.removeChild(this.container);
        }
    }
}
