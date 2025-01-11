import { Powerup } from './Powerup.js';

export class EnergyDrinkPowerup extends Powerup {
  constructor(dopamineManager) {
    super(
      "Energy Drink", 
      10, 
      "Double your dopamine per click!",
      "⚡" // Icon for energy drink
    );
    
    this.dopamineManager = dopamineManager;
    this.element.addEventListener('click', () => this.tryPurchase());
  }

  tryPurchase() {
    if (!this.purchased && this.dopamineManager.spendDopamine(this.cost)) {
      this.onPurchase();
      this.applyEffect();
      // Tell PowerupBar to remove this powerup
      this.dopamineManager.powerupBar.removePowerup(this);
    }
  }

  applyEffect() {
    const button = this.dopamineManager.button;
    if (button) {
      button.dopaminePerClick = 2;
    }
  }
}
