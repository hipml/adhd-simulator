export class PowerupBar {
    constructor() {
        console.log("PowerupBar initializing..."); // Debug log
        this.element = this.createBar();
        this.isVisible = false;
        this.powerups = [];
    }

    createBar() {
        console.log("Creating PowerupBar element..."); // Debug log
        const bar = document.createElement('div');
        bar.className = 'powerup-bar';
        bar.style.display = 'none';
        document.body.appendChild(bar);
        return bar;
    }

    show() {
        console.log("Showing PowerupBar..."); // Debug log
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

    addPowerup(powerup) {
        console.log("Adding powerup to bar:", powerup); // Debug log
        this.powerups.push(powerup);
        this.element.appendChild(powerup.element);
    }

    update(currentDopamine) {
        // Show/hide based on dopamine threshold
        if (currentDopamine >= 3 && !this.isVisible) {
            this.show();
        } else if (currentDopamine < 3 && this.isVisible) {
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
