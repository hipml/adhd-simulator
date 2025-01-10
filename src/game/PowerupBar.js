export class PowerupBar {
    constructor() {
        this.element = this.createBar();
        this.isVisible = false;
        this.powerups = [];
    }

    createBar() {
        const bar = document.createElement('div');
        bar.className = 'powerup-bar';
        bar.style.display = 'none';
        document.body.appendChild(bar);
        return bar;
    }

    show() {
        if (!this.isVisible) {
            this.element.style.display = 'flex';
            this.isVisible = true;
        }
    }

    hide() {
        if (this.isVisible) {
            this.element.style.display = 'none';
            this.isVisible = false;
        }
    }

    hasPowerup(powerup) {
        return this.powerups.includes(powerup);
    }

    addPowerup(powerup) {
        if (!this.hasPowerup(powerup)) {
            this.powerups.push(powerup);
            this.element.appendChild(powerup.element);
        }
    }

    removePowerup(powerup) {
        const index = this.powerups.indexOf(powerup);
        if (index > -1) {
            this.powerups.splice(index, 1);
            powerup.element.remove();
        }

        // Hide the bar if no powerups left
        if (this.powerups.length === 0) {
            this.hide();
        }
    }

    update(currentDopamine) {
        // Only show if we have powerups
        if (this.powerups.length > 0 && !this.isVisible) {
            this.show();
        } else if (this.powerups.length === 0 && this.isVisible) {
            this.hide();
        }

        // Update each powerup
        this.powerups.forEach(powerup => {
            if (powerup.update) {
                powerup.update(currentDopamine);
            }
        });
    }
}
