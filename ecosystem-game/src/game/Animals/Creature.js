import LifeForm from "./LifeForm";
export default class Creature extends LifeForm {
    constructor(type, health = 100, energy = 100, hunger = 100, thirst = 100, speed = 5, x =10, y = 10) {
        super();
        this.type = type;
        this.health = health;
        this.energy = energy;
        this.hunger = hunger;
        this.thirst = thirst;
        this.age = 0;
        this.speed = speed;
        this.baseDamage = type === "predator" ? 50 : 0;
        this.location = [x, y];
        this.prevLocation = [x, y];
        this.readyToReproduce = false;
        this.targetFood = null;
        this.isPursuingFood = false;
    }

    update () {
        this.decreaseHunger();
        this.decreaseThirst();
    }

    decreaseHunger () {
        this.hunger -= 0.2;
        if (this.hunger < 0) {
            this.receiveDamage(2)
        }
    }

    decreaseThirst () {
        this.thirst -= 1;
        // if (this.thirst <= 0) this.health -= 5; // Damage if dehydrated
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
    
    moveRandomly(gridWidth, gridHeight) {
        const directions = [
            { dx: -5, dy: 0 }, // Left
            { dx: 5, dy: 0 },  // Right
            { dx: 0, dy: -5 }, // Up
            { dx: 0, dy: 5 }   // Down
        ];
   
        // Shuffle directions randomly
        const randomDirection = directions[Math.floor(Math.random() * directions.length)];
   
        // Calculate new position
        const newX = this.location[0] + randomDirection.dx;
        const newY = this.location[1] + randomDirection.dy;
   
        // Ensure movement stays within bounds
        if (newX >= 0 && newX < gridWidth && newY >= 0 && newY < gridHeight) {
            this.location = [newX, newY]; // Update location directly
            this.hunger -= 1;  // Decrease hunger for the movement
        }
    }

    eat (targetFood) {
        targetFood.beEaten();
        this.hunger += this.targetFood.calories;
        this.health += this.targetFood.calories;
    }

    drink() {
        this.thirst = Math.max(this.thirst - 100, 0);
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
