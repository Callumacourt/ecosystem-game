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
    getFood(creature) {{

            if (creature.isPursuingFood) {
                return    
            }

            // Search for food
            let nearby = this.grid.getNearbyEntities(creature.location[0], creature.location[1], 500);
        

            if (nearby.length === 0) {
                creature.moveRandomly();
            }
            
            let foodSource = creature.type === "herbivore" 
                ? nearby.filter(e => e instanceof Plant) 
                : nearby.filter(e => e.type === "herbivore");
        
            let closestFood = creature.getClosest(foodSource);
            
            if (closestFood) {
                creature.isPursuingFood = true;
                creature.targetFood = closestFood;
                console.log(`${creature.type} is now targeting food at ${closestFood.location}`);
            }
        };
    }

    updateEcosystem() {
        this.creatures.forEach(creature => {
            this.passTime(creature);
            creature.moveRandomly(this.grid.width, this.grid.height);
    
            if (creature.hunger < 0) {
                creature.die();
                this.grid.removeFromGrid(creature);
                return;
            }
    
            if (creature.hunger < 80 && creature.targetFood) {
                creature.moveTowards(creature.targetFood.location);
    
                if (Helpers.calculateDistance(creature, creature.targetFood) < 5) {
                    if (creature instanceof Predator) {
                        creature.attack(creature.targetFood);
                    } else {
                        creature.eat();
                        creature.hunger += 200;
                        creature.targetFood.beEaten();
                        creature.targetFood = null;
                        creature.isPursuingFood = false;
                    }
                }
            } else if (creature.hunger <80) {
                this.getFood(creature);
    
                if (!creature.targetFood) {
                    creature.moveRandomly(10, 10);
                }
            }
        });
    
        this.plants.forEach(plant => {
            this.passTime(plant);
        });
    
        this.grid.updateGrid(this.creatures.concat(this.plants));
    }
    }