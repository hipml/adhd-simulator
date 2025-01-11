export class Powerup {
  constructor(name, cost, description, iconText) {
    this.name = name;
    this.cost = cost;
    this.description = description;
    this.iconText = iconText;
    this.element = this.createPowerupElement();
    this.purchased = false;

    // Store references to DOM elements we'll need to update
    this.tooltipCost = null;
    this.tooltipDescription = null;
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
    
    // Store reference to cost element
    this.tooltipCost = document.createElement('div');
    this.tooltipCost.className = 'powerup-tooltip-cost';
    this.tooltipCost.textContent = `${this.cost} dopamine`;
    
    // Store reference to description element
    this.tooltipDescription = document.createElement('div');
    this.tooltipDescription.className = 'powerup-tooltip-description';
    this.tooltipDescription.textContent = this.description;
    
    tooltip.appendChild(tooltipName);
    tooltip.appendChild(this.tooltipCost);
    tooltip.appendChild(this.tooltipDescription);
    
    container.appendChild(icon);
    container.appendChild(tooltip);
    
    return container;
  }

  updateDescription(newDescription) {
    this.description = newDescription;
    if (this.tooltipDescription) {
      this.tooltipDescription.textContent = newDescription;
    }
  }

  updateCost(newCost) {
    this.cost = newCost;
    if (this.tooltipCost) {
      this.tooltipCost.textContent = `${newCost} dopamine`;
    }
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
    this.element.remove();
  }
}
