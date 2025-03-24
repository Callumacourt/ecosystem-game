import Creature from "./Creature";
import Helpers from "./Helpers";

export default class Predator extends Creature {
    constructor(location = []) {
        // Passing 'predator' as the type to the Creature constructor
        super('predator', [], 100, 100, 100, 100, 5, location[0], location[1]); // Adjust other default values as necessary
        this.location = location;  // Set location here, as it will be passed in constructor
    }
    
    attack(targetCreature) {
        console.log('target', targetCreature);
        if (targetCreature instanceof Creature) {
            console.log('is a creature');
            // Calculate distance between predator and prey
            const distance = Helpers.calculateDistance(targetCreature, this);
            console.log('distance', distance);
            if (distance > 10) { // If not close enough, return
                return;
            }
        
            // Deal damage to the target creature (prey)
            console.log('base damage', this.baseDamage);
            targetCreature.receiveDamage(this.baseDamage);
            console.log('health after attack', targetCreature.health);

            // If the prey's health reaches 0, eat it
            if (targetCreature.health <= 0) {
                this.eat(targetCreature);
            }
        }
    }

    // Eat method to handle the predator consuming the prey
    eat(targetCreature) {
        this.hunger += targetCreature.calories;  // Decrease hunger by the calories from prey
        this.energy += targetCreature.calories;  // Increase energy by the calories
    }
}
