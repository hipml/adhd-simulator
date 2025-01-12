export class DopamineManager extends EventTarget {
  constructor(powerupBar) {
    super(); // Initialize EventTarget
    
    this.current = 0;
    this.total = 0;
    this.currentDisplay = document.getElementById('current-dopamine');
    this.totalDisplay = document.getElementById('total-dopamine');
    this.onDopamineGained = null;
    this.onDopamineUpdate = null;
    this.powerupBar = powerupBar;
    this.button = null;
    this.dopamineMultiplier = 1;
    
    // Initialize spinner count
    this._spinnerCount = 0;
  }

  setButton(button) {
    this.button = button;
  }

  addDopamine(amount) {
    const multipliedAmount = Math.floor(amount * this.dopamineMultiplier);
    this.current += multipliedAmount;
    this.total += multipliedAmount;
    this.updateDisplay();
    
    // Legacy callbacks
    if (this.onDopamineGained) {
      this.onDopamineGained(multipliedAmount);
    }
    if (this.onDopamineUpdate) {
      this.onDopamineUpdate(this.current);
    }
    
    // New event system
    this.dispatchEvent(new CustomEvent('dopamineGained', { 
      detail: { amount, current: this.current, total: this.total }
    }));
    
    if (this.powerupBar) {
      this.powerupBar.update(this.current);
    }
  }

  spendDopamine(amount) {
    if (this.current >= amount) {
      this.current -= amount;
      this.updateDisplay();
      
      if (this.powerupBar) {
        this.powerupBar.update(this.current);
      }
      if (this.onDopamineUpdate) {
        this.onDopamineUpdate(this.current);
      }
      
      this.dispatchEvent(new CustomEvent('dopamineSpent', {
        detail: { amount, current: this.current }
      }));
      
      return true;
    }
    return false;
  }

  updateDisplay() {
    this.currentDisplay.textContent = this.current;
    this.totalDisplay.textContent = this.total;
  }

  setSpinnerCount(count) {
    this._spinnerCount = count;
    
    this.dispatchEvent(new CustomEvent('spinnerCountChanged', {
      detail: { count: this._spinnerCount }
    }));
  }

  incrementSpinnerCount() {
    this._spinnerCount++;
    
    this.dispatchEvent(new CustomEvent('spinnerCountChanged', {
      detail: { count: this._spinnerCount }
    }));
    
    return this._spinnerCount;
  }

  getSpinnerCount() {
    return this._spinnerCount;
  }

  addDopamineMultiplier(multiplier) {
    this.dopamineMultiplier *= multiplier;
  }
}
