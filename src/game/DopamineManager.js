export class DopamineManager extends EventTarget {
  constructor(powerupBar) {
    super(); // Initialize EventTarget
    console.log('DopamineManager constructor called');
    
    this.current = 0;
    this.total = 0;
    this.currentDisplay = document.getElementById('current-dopamine');
    this.totalDisplay = document.getElementById('total-dopamine');
    this.onDopamineGained = null;
    this.onDopamineUpdate = null;
    this.powerupBar = powerupBar;
    this.button = null;
    
    // Initialize spinner count
    this._spinnerCount = 0;
    console.log('Initial spinner count:', this._spinnerCount);
  }

  setButton(button) {
    this.button = button;
  }

  addDopamine(amount) {
    console.log('Adding dopamine:', amount);
    this.current += amount;
    this.total += amount;
    this.updateDisplay();
    
    // Legacy callbacks
    if (this.onDopamineGained) {
      this.onDopamineGained(amount);
    }
    if (this.onDopamineUpdate) {
      this.onDopamineUpdate(this.current);
    }
    
    // New event system
    console.log('Dispatching dopamineGained event');
    this.dispatchEvent(new CustomEvent('dopamineGained', { 
      detail: { amount, current: this.current, total: this.total }
    }));
    
    if (this.powerupBar) {
      this.powerupBar.update(this.current);
    }
  }

  spendDopamine(amount) {
    console.log('Attempting to spend dopamine:', amount);
    console.log('Current dopamine:', this.current);
    
    if (this.current >= amount) {
      this.current -= amount;
      this.updateDisplay();
      
      console.log('Dopamine spent successfully, new amount:', this.current);
      
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
    console.log('Not enough dopamine to spend');
    return false;
  }

  updateDisplay() {
    this.currentDisplay.textContent = this.current;
    this.totalDisplay.textContent = this.total;
  }

  setSpinnerCount(count) {
    console.log('Setting spinner count to:', count);
    this._spinnerCount = count;
    
    console.log('Dispatching spinnerCountChanged event');
    this.dispatchEvent(new CustomEvent('spinnerCountChanged', {
      detail: { count: this._spinnerCount }
    }));
  }

  incrementSpinnerCount() {
    console.log('Incrementing spinner count from:', this._spinnerCount);
    this._spinnerCount++;
    
    console.log('Dispatching spinnerCountChanged event');
    this.dispatchEvent(new CustomEvent('spinnerCountChanged', {
      detail: { count: this._spinnerCount }
    }));
    
    return this._spinnerCount;
  }

  getSpinnerCount() {
    return this._spinnerCount;
  }
}
