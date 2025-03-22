import { expect, test, beforeEach, vi } from "vitest";
import Ecosystem from "../src/game/Ecosystem";
import Plant from "../src/game/Enviroment/Plant";
import Predator from "../src/game/Animals/Predator";
import Herbivore from "../src/game/Animals/Herbivore";
import Helpers from "../src/game/Animals/Helpers";

let plant, predator, herbivore, ecosystem, plantKey, predatorKey, herbivoreKey;

beforeEach(() => {
    // Initialize ecosystem
    ecosystem = new Ecosystem();

    // Create entities
    plant = new Plant(50, 10, 3, 20, 20);
    predator = new Predator([30, 30]); 
    herbivore = new Herbivore([40, 40]); 

    // Add entities to the ecosystem
    ecosystem.addPlant(plant);
    ecosystem.addCreature(predator);
    ecosystem.addCreature(herbivore);
    
    // Store their grid keys
    plantKey = ecosystem.grid.getGridKey(plant.location[0], plant.location[1]);
    predatorKey = ecosystem.grid.getGridKey(predator.location[0], predator.location[1]);
    herbivoreKey = ecosystem.grid.getGridKey(herbivore.location[0], herbivore.location[1]);

    // Initialize creatures after adding them to the ecosystem
    ecosystem.initialiseCreatures();
});

test("Ecosystem & grid correctly instantiate creatures and plants", () => {
    // Verify entities exist in the ecosystem
    expect(ecosystem.plants).toContain(plant);
    expect(ecosystem.creatures).toContain(predator);
    expect(ecosystem.creatures).toContain(herbivore);

    // Ensure the grid has the correct keys
    expect(ecosystem.grid.gridMap.has(plantKey)).toBe(true);
    expect(ecosystem.grid.gridMap.has(predatorKey)).toBe(true);
    expect(ecosystem.grid.gridMap.has(herbivoreKey)).toBe(true);
});

test("Dead plants are removed from the ecosystem and grid", () => {
    // Confirm plant exists before removal
    expect(ecosystem.plants).toContain(plant);

    // Trigger plant's death
    plant.size = 1;
    plant.beEaten();

    // Ensure plant is removed from the ecosystem
    expect(ecosystem.plants).not.toContain(plant);
    
    // Ensure the plant is also removed from the grid
    let cellContents = ecosystem.grid.gridMap.get(plantKey) || [];
    expect(cellContents).not.toContain(plant);
});

test("Dead creatures are removed from the ecosystem and grid", () => {
    // Confirm creatures exist before removal
    expect(ecosystem.creatures).toContain(predator);
    expect(ecosystem.creatures).toContain(herbivore);

    // Trigger death for both creatures
    predator.receiveDamage(200);
    herbivore.receiveDamage(200);

    // Ensure creatures are removed from the ecosystem
    expect(ecosystem.creatures).not.toContain(predator);
    expect(ecosystem.creatures).not.toContain(herbivore);

    // Ensure creatures are also removed from the grid
    let predatorCellContents = ecosystem.grid.gridMap.get(predatorKey) || [];
    let herbivoreCellContents = ecosystem.grid.gridMap.get(herbivoreKey) || [];

    expect(predatorCellContents).not.toContain(predator);
    expect(herbivoreCellContents).not.toContain(herbivore);
});

// New tests for ecosystem behaviors

test("passTime increases age and affects hunger/thirst for creatures", () => {
    const initialAge = predator.age;
    const initialHunger = predator.hunger;
    const initialThirst = predator.thirst;
    
    ecosystem.passTime(predator);
    
    expect(predator.age).toBeGreaterThan(initialAge);
    expect(predator.hunger).toBeLessThan(initialHunger);
    expect(predator.thirst).toBeLessThan(initialThirst);
});

test("passTime increases age for plants", () => {
    const initialAge = plant.age;
    
    ecosystem.passTime(plant);
    
    expect(plant.age).toBeGreaterThan(initialAge);
});

test("getFood assigns food target to hungry creatures", () => {
    // Mock the Grid.getNearbyEntities method
    ecosystem.grid.getNearbyEntities = vi.fn().mockReturnValue([plant]);
    
    // Mock the Creature.getClosest method
    herbivore.getClosest = vi.fn().mockReturnValue(plant);
    
    // Set hunger to make creature search for food
    herbivore.hunger = 40;
    herbivore.isPursuingFood = false;
    
    ecosystem.getFood();
    
    expect(herbivore.isPursuingFood).toBe(true);
    expect(herbivore.targetFood).toBe(plant);
});

test("updateEcosystem causes hungry creatures to seek food", () => {
    // Spy on the getFood method
    const getFood = vi.spyOn(ecosystem, 'getFood');
    
    // Make creature hungry
    herbivore.hunger = 50;
    
    // Mock the creature methods
    herbivore.moveTowards = vi.fn();
    
    // Run the ecosystem update
    ecosystem.updateEcosystem();
    
    // Verify getFood was called
    expect(getFood).toHaveBeenCalled();
});

test("Predators attack herbivores when in range", () => {
    // Mock the distance calculation to be within attack range
    vi.spyOn(Helpers, 'calculateDistance').mockReturnValue(3);
    
    // Set up predator with a target
    predator.hunger = 40;
    predator.isPursuingFood = true;
    predator.targetFood = herbivore;
    predator.attack = vi.fn();
    predator.moveTowards = vi.fn();
    
    // Run the ecosystem update
    ecosystem.updateEcosystem();
    
    // Verify predator attacked
    expect(predator.attack).toHaveBeenCalledWith(herbivore);
});

test("Herbivores eat plants when in range", () => {
    // Mock the distance calculation to be within eating range
    vi.spyOn(Helpers, 'calculateDistance').mockReturnValue(3);
    
    // Set up herbivore with a target
    herbivore.hunger = 40;
    herbivore.isPursuingFood = true;
    herbivore.targetFood = plant;
    herbivore.eat = vi.fn();
    herbivore.moveTowards = vi.fn();
    
    // Run the ecosystem update
    ecosystem.updateEcosystem();
    
    // Verify herbivore ate
    expect(herbivore.eat).toHaveBeenCalledWith(plant.calories);
});

test("Grid is updated after ecosystem update", () => {
    // Spy on the grid update method
    const updateGrid = vi.spyOn(ecosystem.grid, 'updateGrid');
    
    // Run the ecosystem update
    ecosystem.updateEcosystem();
    
    // Verify grid was updated with all entities
    expect(updateGrid).toHaveBeenCalledWith(ecosystem.creatures.concat(ecosystem.plants));
});