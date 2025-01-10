export class Button {
    constructor(dopamineManager) {
        this.dopamineManager = dopamineManager;
        this.element = this.createButton();
        this.dopaminePerClick = 1;
    }

    createButton() {
        const button = document.createElement('button');
        button.textContent = 'Press Me';
        button.className = 'game-button';
        button.addEventListener('click', () => this.onClick());
        document.body.appendChild(button);
        return button;
    }

    onClick() {
        this.dopamineManager.addDopamine(this.dopaminePerClick);
    }
}
