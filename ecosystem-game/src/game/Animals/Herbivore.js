import Creature from "./Creature";
import Helpers from "./Helpers";
import Plant from "../Plant";

export default class Herbivore extends Creature {

    constructor(callback) {
        super();
        this.onDeathCallback = callback;  // Callback passed from Ecosystem
    }

    eat (plant) {
        if (plant instanceof Plant) {
            const distance = Helpers.calculateDistance(plant, this);
            // Exit if not close enough
            if (distance > 0) {
                return; 
            }
            // Eat the plant, decrease hunger and gain energy
            this.hunger -= plant.calories;
            this.energy += plant.calories;
            plant.beEaten();
        }
    }

    flee () {
        // if a predator enters a certain range, then run away
    }
}
