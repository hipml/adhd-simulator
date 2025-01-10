export class DopamineManager {
    constructor(powerupBar) {
        this.current = 0;
        this.total = 0;
        this.currentDisplay = document.getElementById('current-dopamine');
        this.totalDisplay = document.getElementById('total-dopamine');
        this.onDopamineGained = null;
        this.onDopamineUpdate = null;
        this.powerupBar = powerupBar;
        this.button = null;
    }

    setButton(button) {
        this.button = button;
    }

    addDopamine(amount) {
        this.current += amount;
        this.total += amount;
        this.updateDisplay();

        if (this.onDopamineGained) {
            this.onDopamineGained(amount);
        }

        if (this.onDopamineUpdate) {
            this.onDopamineUpdate(this.current);
        }

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
            
            return true;
        }
        return false;
    }

    updateDisplay() {
        this.currentDisplay.textContent = this.current;
        this.totalDisplay.textContent = this.total;
    }
}
