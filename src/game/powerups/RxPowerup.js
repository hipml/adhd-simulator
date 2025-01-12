import { Powerup } from './Powerup.js';

export class RxPowerup extends Powerup {
  constructor(dopamineManager) {
    super(
      "Rx",
      100,
      "Prescription medication doubles ALL dopamine gains!",
      "💊"
    );
    
    this.dopamineManager = dopamineManager;
    this.element.addEventListener('click', () => {
      console.log('Rx powerup clicked!');
      console.log('Cost:', this.cost);
      this.tryPurchase();
    });
  }

  tryPurchase() {
    if (!this.purchased && this.dopamineManager.spendDopamine(this.cost)) {
      console.log('Rx powerup purchased!');
      this.purchased = true;
      this.applyEffect();
      this.dopamineManager.powerupBar.removePowerup(this);
      return true;
    }
    return false;
  }

  update(currentDopamine) {
    // Call parent update method to handle affordability classes
    super.update(currentDopamine);
    
    if (!this.purchased) {
      const remainingDopamine = Math.max(0, this.cost - currentDopamine);
      if (remainingDopamine > 0) {
        this.updateDescription(`Prescription medication doubles ALL dopamine gains! (Need ${remainingDopamine} more dopamine)`);
      } else {
        this.updateDescription("Prescription medication doubles ALL dopamine gains! (Click to purchase!)");
      }
    }
  }

  applyEffect() {
    // Add a multiplier to the dopamine manager
    this.dopamineManager.addDopamineMultiplier(2);
  }
}
