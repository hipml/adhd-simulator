import * as PIXI from 'pixi.js';
import { DopamineManager } from './DopamineManager.js';
import { Button } from './Button.js';
import { DopaminePopup } from './DopaminePopup.js';
import { PowerupBar } from './PowerupBar.js';
import { EnergyDrinkPowerup } from './powerups/EnergyDrinkPowerup.js';
import { FidgetSpinnerPowerup } from './powerups/FidgetSpinnerPowerup.jsx';
import { RainPowerup } from './powerups/RainPowerup.js';

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
    
    // Create energy drink powerup
    this.energyDrinkPowerup = new EnergyDrinkPowerup(this.dopamineManager);

    // create Rain powerup
    this.rainPowerup = new RainPowerup(this.dopamineManager, this.app);
    
    // Initialize current fidget spinner powerup as null
    this.currentFidgetSpinner = null;
    
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

    // Rain visibility
    if (!this.rainPowerup.purchased) {
      if (currentDopamine >= this.rainPowerup.cost - VISIBILITY_THRESHOLD && 
          !this.powerupBar.hasPowerup(this.rainPowerup)) {
        this.powerupBar.addPowerup(this.rainPowerup);
      }
    }
    
    // Fidget Spinner visibility
    const spinnerCount = this.dopamineManager.getSpinnerCount();
    if (spinnerCount < FidgetSpinnerPowerup.MAX_SPINNERS) {
      const nextSpinnerLevel = spinnerCount + 1;
      const nextSpinnerCost = 15 * Math.pow(2, nextSpinnerLevel - 1);
      
      if (currentDopamine >= nextSpinnerCost - VISIBILITY_THRESHOLD) {
        // Only create new spinner if we don't have one or if the current one was purchased
        if (!this.currentFidgetSpinner || this.currentFidgetSpinner.purchased) {
          this.currentFidgetSpinner = new FidgetSpinnerPowerup(this.dopamineManager, this.app, nextSpinnerLevel);
          this.powerupBar.addPowerup(this.currentFidgetSpinner);
        }
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
