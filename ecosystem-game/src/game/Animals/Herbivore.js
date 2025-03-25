import Creature from "./Creature";
import Plant from "../Enviroment/Plant";
import Helpers from "./Helpers";

export default class Herbivore extends Creature {

    constructor(location = []) {
        super();
        this.location = location;
        this.calories = 200;
        this.type = 'herbivore';
        this.speed = 10;
    }

    flee(predator) {
        let dx = this.location[0] - predator.location[0];
        let dy = this.location[1] - predator.location[1];
        let distance = Math.sqrt(dx * dx + dy * dy);
    
        if (distance < 50) {  
            let energyFactor = Math.max(this.energy / 100, 0.3);  
            let fleeSpeed = this.speed * energyFactor;  

            let randomAngle = (Math.random() - 0.5) * Math.PI / 2; 
            let newDx = Math.cos(randomAngle) * dx - Math.sin(randomAngle) * dy;
            let newDy = Math.sin(randomAngle) * dx + Math.cos(randomAngle) * dy;
    
            this.location[0] += (newDx / distance) * fleeSpeed;
            this.location[1] += (newDy / distance) * fleeSpeed;
            this.hunger -= 2;
            this.energy -= 5;
        }
    }
    
}
