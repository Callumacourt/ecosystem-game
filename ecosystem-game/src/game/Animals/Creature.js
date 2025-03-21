export default class Creature extends lifeForm {
    constructor(type, health = 100, energy = 100, hunger = 100, thirst = 100, speed = 5, x, y) {
        this.type = type;
        this.health = health;
        this.energy = energy;
        this.hunger = hunger;
        this.thirst = thirst;
        this.age = 0;
        this.speed = speed;
        this.baseDamage = type === "predator" ? 10 : 0;
        this.location = [x, y];
        this.bodyparts = [];
        this.weight = 0;
        this.readyToReproduce = false;
    }

    receiveDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.die();  
        }
    }

    moveTowards(targetX, targetY) {
        let dx = targetX - this.location[0];
        let dy = targetY - this.location[1];
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > 0) {
            this.location[0] += (dx / distance) * this.speed;
            this.location[1] += (dy / distance) * this.speed;
        }
    }

    eat(energyInc, healthInc) {
        this.energy += energyInc;
        this.health += healthInc;

        // Increase weight if in energy surplus
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

    decreaseEnergy(amount) {
        this.energy -= amount;
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

    getClosest(objs) {
        let closest = null;
        let minDist = Infinity;
        for (let obj of objs) {
            let dist = Math.hypot(obj.x - this.location[0], obj.y - this.location[1]);
            if (dist < minDist) {
                minDist = dist;
                closest = obj;
            }
        }
        return closest;
    }

    findFood(foodType) {
        let closestFood = this.getClosest(foodType);
        if (closestFood) {
            this.moveTowards(closestFood.x, closestFood.y);
        }
    }

}
