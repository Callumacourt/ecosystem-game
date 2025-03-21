import Creature from "./Creature";
import Helpers from "./Helpers";

export default class Predator extends Creature {
    constructor (callback) {
        this.onDeathCallBack = callback;
    }


    attack(targetCreature) {
        if (targetCreature instanceof Creature) {
            // Calculate distance between predator and prey
            const distance = Helpers.calculateDistance(targetCreature, this);
            if (distance > this.speed) { // If not close enough, return
                return;
            }

            // Deal damage to the target creature (prey)
            targetCreature.receiveDamage(this.baseDamage);

            // If the prey's health reaches 0, eat it
            if (targetCreature.health <= 0) {
                this.eat(targetCreature);
            }
        }
    }

    // Eat method to handle the predator consuming the prey
    eat(targetCreature) {
        this.hunger -= targetCreature.calories;  // Decrease hunger by the calories from prey
        this.energy += targetCreature.calories;  // Increase energy by the calories
    }

    die () {  
        if (this.onDeathCallback) {
            this.onDeathCallback(this);  
            }
    }
}
