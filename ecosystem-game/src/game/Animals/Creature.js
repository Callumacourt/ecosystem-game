import LifeForm from "./LifeForm";
export default class Creature extends LifeForm {
    constructor(type, bodyParts = [], health = 100, energy = 100, hunger = 100, thirst = 100, speed = 5, x =10, y = 10) {
        super();
        this.type = type;
        this.health = health;
        this.energy = energy;
        this.hunger = hunger;
        this.thirst = thirst;
        this.age = 0;
        this.speed = speed;
        this.baseDamage = type === "predator" ? 10 : 0;
        this.location = [x, y];
        this.prevLocation = [x, y];
        this.bodyparts = bodyParts;
        this.weight = 0;
        this.readyToReproduce = false;
        this.targetFood = null;
        this.isPursuingFood = false;
        this.instantiateWeight();
    }

    instantiateWeight () {
        this.weight += this.bodyparts.reduce((totalWeight, part) => totalWeight + part.weightImpact, 0);
    }

    receiveDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.die();  
        }
    }

    moveTowards(targetLocation) {
        let dx = targetLocation[0] - this.location[0];
        let dy = targetLocation[1] - this.location[1];
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > 0) {
            this.location[0] += (dx / distance) * this.speed;
            this.location[1] += (dy / distance) * this.speed;
            this.hunger -= 1
        }
    }

    moveRandomly () {
        this.moveTowards([10, 200])
    }

    eat(energyInc) {
        this.energy += energyInc;
        this.hunger += energyInc;
        this.health += energyInc;

        if (this.energy > 100) {
            this.weight += 0.5;
        }
    }

    getHungry() {
        // Hunger decreases faster if more limbs and more weight
        const baseHungerRate = 1;
        const limbPenalty = 0.2;
        const weightPenalty = 0.1;

        const bodyCost = this.bodyparts.length;
        const hungerModifier = baseHungerRate + (bodyCost * limbPenalty) + (this.weight * weightPenalty);

        this.hunger -= hungerModifier;
    }

    drink() {
        this.thirst = Math.max(this.thirst - 100, 0);
    }

    getThirsty() {
        this.thirst -= 1;
        if (this.thirst <= 0) this.health -= 5; // Damage if dehydrated
    }

    reproduce() {
        if (this.energy > 80 && this.health > 60) {
            this.readyToReproduce = true;
            this.energy -= 30;
        }
    }
    getClosest(entities) {
        let closest = null;
        let minDist = Infinity;
    
        for (let entity of entities) {
            let dist = Math.hypot(entity.location[0] - this.location[0], entity.location[1] - this.location[1]);
            if (dist < minDist) {
                minDist = dist;
                closest = entity;
            }
        }
        return closest;
    }    
}
