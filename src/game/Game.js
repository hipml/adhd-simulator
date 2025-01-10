import * as PIXI from 'pixi.js';
import { DopamineManager } from './DopamineManager.js';
import { Button } from './Button.js';
import { DopaminePopup } from './DopaminePopup.js';
import { PowerupBar } from './PowerupBar.js';
import { EnergyDrinkPowerup } from './powerups/EnergyDrinkPowerup.js';

export class Game {
    constructor() {
        console.log("Game initializing..."); // Debug log
        
        this.app = new PIXI.Application({
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: 0x333333,
            resizeTo: window
        });
        document.body.appendChild(this.app.view);

        // Initialize game components
        this.dopaminePopup = new DopaminePopup(this.app);
        this.powerupBar = new PowerupBar();
        this.dopamineManager = new DopamineManager(this.powerupBar);
        this.button = new Button(this.dopamineManager);
        
        // Set button reference in dopamine manager
        this.dopamineManager.setButton(this.button);

        // Add powerups
        console.log("Adding Energy Drink powerup..."); // Debug log
        const energyDrinkPowerup = new EnergyDrinkPowerup(this.dopamineManager);
        this.powerupBar.addPowerup(energyDrinkPowerup);

        // Set up dopamine gain handler
        this.dopamineManager.onDopamineGained = (amount) => {
            this.showDopaminePopup(amount);
        };

        // Handle window resize
        window.addEventListener('resize', () => this.onResize());
    }

    showDopaminePopup(amount) {
        this.dopaminePopup.create(
            amount,
            window.innerWidth / 2,
            window.innerHeight / 2
        );
    }

    onResize() {
        this.app.renderer.resize(window.innerWidth, window.innerHeight);
    }
}
