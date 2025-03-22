import Creature from "./Animals/Creature";
import Helpers from "./Animals/Helpers";
import Predator from "./Animals/Predator";
import Plant from "./Enviroment/Plant";
import Grid from "./Grid";

export default class Ecosystem {
    constructor() {
        this.plants = [];
        this.creatures = [];
        this.grid = new Grid();  
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
            entity.hunger -= 0.2
            entity.getThirsty();
        }
        else {
            entity.age += 0.1;
        }
    }

    // fetches and assigns a target food
    // needs to just correctly get the closest food
    getFood() {
        this.creatures.forEach(creature => {
            if (creature.isPursuingFood) return;  // Skip if already hunting
            
            // Search for food in a larger radius
            let nearby = this.grid.getNearbyEntities(creature.location[0], creature.location[1], 200);
            
            console.log(`${creature.type} at [${creature.location}] found ${nearby.length} nearby entities`);
            
            let foodSource = creature.type === "herbivore" 
                ? nearby.filter(e => e instanceof Plant) 
                : nearby.filter(e => e.type === "herbivore");
            
            console.log(`${creature.type} found ${foodSource.length} potential food sources`);
            
            let closestFood = creature.getClosest(foodSource);
            
            if (closestFood) {
                creature.isPursuingFood = true;
                creature.targetFood = closestFood;
                console.log(`${creature.type} is now targeting food at ${closestFood.location}`);
            }
        });
    }

    updateEcosystem() {
        this.creatures.forEach(creature => {
            this.passTime(creature);
            if (creature.hunger < 0) {
                creature.die();
                this.grid.removeFromGrid(creature)
            }
            if (creature.hunger < 40 && creature.targetFood) {
                // Move towards the target food
                console.log('calling')
                creature.moveTowards(creature.targetFood.location);
                
                // if the location is in range, then attack or eat it
                if (Helpers.calculateDistance(creature, creature.targetFood) < 5) {
                    console.log("Creature in range to eat/attack");
                    if (creature instanceof Predator) {
                        creature.attack(creature.targetFood);
                    }
                    else {
                        creature.eat(creature.targetFood.calories);
                        creature.targetFood.beEaten();
                        creature.targetFood = null;
                        creature.isPursuingFood = false;
                    }
                }
            } else if (creature.hunger < 40) {
                this.getFood();

                if(this.getFood == undefined) {
                    moveRandomly();
                }
            }
            else {
                creature.moveRandomly();
            }
        });
        
        this.plants.forEach(plant => {
            this.passTime(plant);
        });
        
        this.grid.updateGrid(this.creatures.concat(this.plants));
    }
    }