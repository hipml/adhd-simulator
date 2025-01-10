export class Powerup {
    constructor(name, cost, description, iconText) {
        this.name = name;
        this.cost = cost;
        this.description = description;
        this.iconText = iconText;
        this.element = this.createPowerupElement();
        this.purchased = false;
    }

    createPowerupElement() {
        const container = document.createElement('div');
        container.className = 'powerup';
        
        // Create the icon
        const icon = document.createElement('div');
        icon.className = 'powerup-icon';
        icon.textContent = this.iconText;
        
        // Tooltip container
        const tooltip = document.createElement('div');
        tooltip.className = 'powerup-tooltip';
        
        const tooltipName = document.createElement('div');
        tooltipName.className = 'powerup-tooltip-name';
        tooltipName.textContent = this.name;
        
        const tooltipCost = document.createElement('div');
        tooltipCost.className = 'powerup-tooltip-cost';
        tooltipCost.textContent = `${this.cost} dopamine`;
        
        const tooltipDesc = document.createElement('div');
        tooltipDesc.className = 'powerup-tooltip-description';
        tooltipDesc.textContent = this.description;
        
        tooltip.appendChild(tooltipName);
        tooltip.appendChild(tooltipCost);
        tooltip.appendChild(tooltipDesc);
        
        container.appendChild(icon);
        container.appendChild(tooltip);
        
        return container;
    }

    update(currentDopamine) {
        if (!this.purchased) {
            if (currentDopamine >= this.cost) {
                this.element.classList.add('can-afford');
                this.element.classList.remove('cannot-afford');
            } else {
                this.element.classList.add('cannot-afford');
                this.element.classList.remove('can-afford');
            }
        }
    }

    onPurchase() {
        this.purchased = true;
        this.element.classList.add('purchased');
        this.element.classList.remove('can-afford', 'cannot-afford');
    }
}
