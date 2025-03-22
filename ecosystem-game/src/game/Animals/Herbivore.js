import Creature from "./Creature";
import Plant from "../Enviroment/Plant";

export default class Herbivore extends Creature {

    constructor(location = []) {
        super();
        this.location = location;
        this.calories = 100;
        this.type = 'herbivore';
        this.speed = 10;
    }

    eat (plant) {
        if (plant instanceof Plant) {
            this.hunger -= plant.calories;
            this.energy += plant.calories;
            plant.beEaten();
            console.log(this.hunger);
        }
    }

    flee () {
        // if a predator enters a certain range, then run away
    }
}
