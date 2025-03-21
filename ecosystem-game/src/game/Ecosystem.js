import Herbivore from "./Animals/Herbivore";

export default class Ecosystem { 
    constructor () {
    this.plants = [];
    this.creatures = [];
    }

    addPlant(plant) {
        this.plants.push(plant);
    }

    addCreature(creature) {
        this.creatures.push(creature)
    } 

    onDeath(type) {
        if (type instanceof Plant) {
            let index = this.plants.indexOf(type);
            if (index !== -1) {
                this.plants.splice(index, 1);
            }
        } else if (type instanceof Herbivore || type instanceof Predator) {
            let index = this.creatures.indexOf(type);
            if (index !== -1) {
                this.creatures.splice(index, 1);
            }
        }
    }

    initialiseCreatures() {
        this.creatures.forEach(creature => {
            creature.onDeathCallback = this.onDeath.bind(this);
        })

        this.plants.forEach(plant => {
            plant.onDeathCallback = this.onDeath.bind(this);
        })
        }
    }
