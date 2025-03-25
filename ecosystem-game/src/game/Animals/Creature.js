import Helpers from "./Helpers";
import LifeForm from "./LifeForm";

export default class Creature extends LifeForm {
    constructor(type, health = 100, energy = 100, hunger = 70, thirst = 100, speed = 5, x =10, y = 10) {
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
        this.lastReproductionTime = 0;
        this.reproductionCooldown = 50;
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
            this.location = [newX, newY]; 
            this.hunger -= 1;  // Decrease hunger for the movement
        }
    }

    eat (targetFood) {
        try {
            targetFood.beEaten();
            
            if (this.targetFood) {
                this.hunger += this.targetFood.calories;
                this.health = Math.min(this.health + this.targetFood.calories, 100);
            }
            
            // Reset food-related states
            this.targetFood = null;
            this.isPursuingFood = false;
        } catch (error) {
            // If food can't be eaten (already consumed), reset food-related states
            this.targetFood = null;
            this.isPursuingFood = false;
        }
    }

    drink() {
        this.thirst = Math.max(this.thirst - 100, 0);
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

     // Finds the closest mate
     seekMate (Ecosystem) {
        const mates = Ecosystem.creatures.filter((Creature) => Creature.type
         === this.type && Creature.readyToReproduce === true) 
        const closestMate = this.getClosest(mates)  
        return closestMate ? closestMate : null;
    }

    reproduce(Ecosystem) {
        // Check if creature is ready to reproduce
        const currentTime = Ecosystem.time; 

        // Check cooldown conditions
        const timeSinceLastReproduction = currentTime - this.lastReproductionTime;
        if (
            !this.readyToReproduce || 
            timeSinceLastReproduction < this.reproductionCooldown || 
            this.age < 5
        ) {
            return null;
        }

        const closestMate = this.seekMate(Ecosystem);
        
        if (closestMate && this.hunger > 80) {
            // Check distance to mate
            const distance = Helpers.calculateDistance(this, closestMate);
            
            if (distance < 2) {
                // Create new creature at average location of parents
                const newCreatureX = (this.location[0] + closestMate.location[0]) / 2;
                const newCreatureY = (this.location[1] + closestMate.location[1]) / 2;
                
                const newCreature = new Creature(
                    this.type, 
                    100,  // default health
                    100,  // default energy
                    50,   // starting hunger
                    50,   // starting thirst
                    this.speed,  
                    newCreatureX, 
                    newCreatureY
                );
                
                // Reduce hunger for both parents
                this.hunger -= 25;
                closestMate.hunger -= 25;
                
                // Reset reproduction cooldown
                this.lastReproductionTime = currentTime;
                closestMate.lastReproductionTime = currentTime;
                
                // Add new creature to ecosystem
                Ecosystem.addCreature(newCreature);
                
                return newCreature;
            } else {
                // Move towards mate if not close enough
                this.moveTowards(closestMate.location);
            }
        }
        
        return null;
    }
}
