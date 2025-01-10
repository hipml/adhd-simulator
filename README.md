# ADHD Simulator Game

A browser-based incremental game built with PixiJS and Vite that simulates dopamine-seeking behavior.

## Core Mechanics

### Basic Gameplay
- Central "Press Me" button generates dopamine (+1 per click)
- Tracks both current and total dopamine
- Floating "+1" animations appear on click with random spread
- PowerupBar appears when reaching specific dopamine thresholds

### Powerups

#### Energy Drink
- Cost: 10 dopamine
- Effect: Doubles dopamine per click (1 → 2)
- One-time purchase
- Appears when within 10 dopamine of cost

#### Fidget Spinner
- Base Cost: 15 dopamine (doubles with each purchase)
- Effect: Creates a bouncing ball that generates +5 dopamine on wall collisions
- Can purchase up to 10 spinners
- Each spinner operates independently
- Appears when within 10 dopamine of next purchase cost
- Visual: Green spinning triangle that bounces around screen

## Technical Structure

### Project Setup
```
adhd-simulator/
├── index.html
├── vite.config.js
├── package.json
└── src/
    ├── main.js
    ├── styles/
    │   └── main.css
    └── game/
        ├── Game.js             # Main game loop and initialization
        ├── Button.js           # Central button mechanics
        ├── DopamineManager.js  # Dopamine tracking and events
        ├── DopaminePopup.js    # Floating number animations
        ├── PowerupBar.js       # Powerup display and management
        └── powerups/
            ├── Powerup.js      # Base powerup class
            ├── EnergyDrinkPowerup.js
            └── FidgetSpinnerPowerup.js
```

### Key Classes
- `Game`: Main orchestrator, handles initialization and updates
- `DopamineManager`: Tracks dopamine amounts and triggers events
- `PowerupBar`: Manages powerup visibility and purchase opportunities
- `Powerup`: Base class for all powerups with tooltip system

### Current Issues
1. Tooltip updates not working correctly for Fidget Spinner counts

## Next Steps
Possible improvements to consider:
- Fix tooltip update system
- Add more powerups
- Implement visual effects for spinner bounces
- Add sound effects

## Setup Instructions
1. Install dependencies: `npm install`
2. Run dev server: `npm run dev`
3. Open `http://localhost:3000`
