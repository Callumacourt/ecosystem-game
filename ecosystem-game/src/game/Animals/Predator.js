import Creature from "./Creature";
import Helpers from "./Helpers";

export default class Predator extends Creature {
    constructor(location = []) {
        super('predator', 100, 100, 100, 100, 5, location[0], location[1]); 
        // Modify hunger and satiety mechanics for predators
        this.hungerDecreaseRate = 0.05; // Much slower hunger decrease
        this.maxHunger = 200; // Higher max hunger
        this.reproductionHungerThreshold = 150; // Higher threshold for reproduction
    }
    
    // Override the parent class's decreaseHunger method
    decreaseHunger() {
        this.hunger -= this.hungerDecreaseRate;
        if (this.hunger < 0) {
            this.receiveDamage(1); // Less damage when hungry
        }
    }
    
    attack(targetCreature) {
        if (targetCreature instanceof Creature) {
            // Calculate distance between predator and prey
            const distance = Helpers.calculateDistance(targetCreature, this);
            if (distance > 5) { // If not close enough, return
                return;
            }
        
            // Deal damage to the target creature (prey)
            targetCreature.receiveDamage(this.baseDamage);

            // If the prey's health reaches 0, eat it
            if (targetCreature.health <= 0) {
                this.eat(targetCreature);
                console.log('Predator hunger after eating: ', this.hunger);
                console.log('Predator health: ', this.health);

                this.isPursuingFood = false;
                this.targetFood = null;
            }
        }
    }

    // Eat method to handle the predator consuming the prey
    eat(targetCreature) {
        // Increase hunger more significantly when eating prey
        this.hunger = Math.min(this.hunger + (targetCreature.calories * 2), this.maxHunger);
        this.health = Math.min(this.health + (targetCreature.calories / 2), 100);
        this.energy = Math.min(this.energy + (targetCreature.calories / 2), 100);
    }

    // Override reproduction to use predator-specific thresholds
    reproduce(Ecosystem) {
        // Predator-specific reproduction conditions
        const currentTime = Ecosystem.time;
        const timeSinceLastReproduction = currentTime - this.lastReproductionTime;
        
        if (
            this.age > 5 && 
            this.hunger > this.reproductionHungerThreshold && 
            timeSinceLastReproduction > this.reproductionCooldown
        ) {
            return super.reproduce(Ecosystem);
        }
        
        return null;
    }
}