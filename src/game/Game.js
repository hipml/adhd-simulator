import * as PIXI from 'pixi.js';
import { DopamineManager } from './DopamineManager.js';
import { Button } from './Button.js';
import { DopaminePopup } from './DopaminePopup.js';
import { PowerupBar } from './PowerupBar.js';
import { EnergyDrinkPowerup } from './powerups/EnergyDrinkPowerup.js';
import { FidgetSpinnerPowerup } from './powerups/FidgetSpinnerPowerup.js';

export class Game {
    constructor() {
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

        // Create powerups (but don't add them yet)
        this.energyDrinkPowerup = new EnergyDrinkPowerup(this.dopamineManager);
        this.fidgetSpinnerPowerup = new FidgetSpinnerPowerup(this.dopamineManager, this.app);

        // Set up dopamine update handler for powerup visibility
        this.dopamineManager.onDopamineUpdate = (current) => {
            this.updatePowerupVisibility(current);
        };

        // Set up dopamine gain handler for popups
        this.dopamineManager.onDopamineGained = (amount) => {
            this.showDopaminePopup(amount);
        };

        // Handle window resize
        window.addEventListener('resize', () => this.onResize());
    }

    updatePowerupVisibility(currentDopamine) {
        const VISIBILITY_THRESHOLD = 10; // Show powerups when within 10 dopamine of cost

        // Energy Drink visibility
        if (!this.energyDrinkPowerup.purchased) {
            if (currentDopamine >= this.energyDrinkPowerup.cost - VISIBILITY_THRESHOLD && 
                !this.powerupBar.hasPowerup(this.energyDrinkPowerup)) {
                this.powerupBar.addPowerup(this.energyDrinkPowerup);
            }
        }

        // Fidget Spinner visibility
        if (this.dopamineManager.spinnerCount < FidgetSpinnerPowerup.MAX_SPINNERS) {
            const spinnerCost = FidgetSpinnerPowerup.BASE_COST * Math.pow(2, this.dopamineManager.spinnerCount || 0);
            if (currentDopamine >= spinnerCost - VISIBILITY_THRESHOLD && 
                !this.powerupBar.hasPowerup(this.fidgetSpinnerPowerup)) {
                // Create a new instance each time since cost changes
                this.fidgetSpinnerPowerup = new FidgetSpinnerPowerup(this.dopamineManager, this.app);
                this.powerupBar.addPowerup(this.fidgetSpinnerPowerup);
            }
        }
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
