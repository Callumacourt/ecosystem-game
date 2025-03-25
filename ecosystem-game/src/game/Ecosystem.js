import Creature from "./Animals/Creature";
import Helpers from "./Animals/Helpers";
import Predator from "./Animals/Predator";
import Herbivore from "./Animals/Herbivore";
import Plant from "./Enviroment/Plant";
import Grid from "./Grid";

export default class Ecosystem {
    constructor() {
        this.plants = [];
        this.creatures = [];
        this.grid = new Grid();  
        this.time = 0;
    }

    addPlant(plant) {
        this.plants.push(plant);
        this.grid.addToGrid(plant); 
    }

    addCreature(creature) {
        this.creatures.push(creature);
        this.grid.addToGrid(creature);  
    }

    onDeath(entity) {
        if (entity instanceof Plant) {
            let index = this.plants.indexOf(entity);
            this.plants.splice(index, 1);
        } else if (entity instanceof Creature) {
            this.creatures = this.creatures.filter(c => c !== entity);
        }
        this.grid.removeFromGrid(entity)
    }

    initialiseCreatures() {
        this.creatures.forEach(creature => {
            creature.onDeathCallback = this.onDeath.bind(this);
        });

        this.plants.forEach(plant => {
            plant.onDeathCallback = this.onDeath.bind(this);
        });
    }

    passTime (entity) {
        if (entity instanceof Creature) {
            entity.age += 0.2;
            entity.decreaseHunger();
            entity.decreaseThirst();
        }
        else {
            entity.age += 0.1;
        }
    }

    // fetches and assigns a target food
    getFood(creature) {
        // If already pursuing food, do nothing
        if (creature.isPursuingFood) {
            return null;
        }
    
        // Search for food
        let nearby = this.grid.getNearbyEntities(creature.location[0], creature.location[1], 500);
    
        if (nearby.length === 0) {
            creature.moveRandomly();
            return null;
        }
        
        // Filter food based on creature type
        let foodSource = creature.type === "herbivore" 
            ? nearby.filter(e => e instanceof Plant) 
            : nearby.filter(e => e.type === "herbivore");
    
        let closestFood = creature.getClosest(foodSource);
        
        if (closestFood) {
            creature.isPursuingFood = true;
            creature.targetFood = closestFood;
            console.log(`${creature.type} is now targeting food at ${closestFood.location}`);
            return closestFood;
        }
    
        return null;
    }
    
    updateEcosystem() {
        this.time += 0.2;
        this.creatures.forEach(creature => {
            this.passTime(creature)
            if (creature.health > 80 && creature.hunger > 50) {
                creature.readyToReproduce = true;
                creature.reproduce(this);
            } else {
                creature.readyToReproduce = false;
            }
            if (creature instanceof Herbivore) {
                let predatorsNearby = this.creatures.filter(c => c instanceof Predator && Helpers.calculateDistance(creature, c) < 50);
                if (predatorsNearby.length > 0) {
                    creature.flee(predatorsNearby[0]);  // Flee from the closest predator
                    creature.isPursuingFood = false;
                } else {
                    creature.update();
                }
            }
    
            creature.moveRandomly(this.grid.width, this.grid.height);
    
            if (creature.health < 0) {
                this.grid.removeFromGrid(creature);
                return;
            }
    
            // Existing food pursuit logic...
            if (creature.hunger < 70) {
                if (!creature.targetFood) {
                    this.getFood(creature);
                }
    
                if (creature.targetFood) {
                    creature.moveTowards(creature.targetFood.location);
    
                    if (Helpers.calculateDistance(creature, creature.targetFood) < 3) {
                        if (creature instanceof Predator) {
                            creature.attack(creature.targetFood);
                        } else {
                            creature.eat(creature.targetFood)
                            creature.targetFood = null;
                            creature.isPursuingFood = false;
                        }
                    }
                }
            }
        });
    
        this.plants.forEach(plant => {
            this.passTime(plant);
        });
    
        this.grid.updateGrid(this.creatures.concat(this.plants));
    }
}