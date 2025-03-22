import { expect, test, beforeEach } from "vitest";
import Plant from "../src/game/Enviroment/Plant";

let plant;

beforeEach(() => {
    plant = new Plant(50, 10, 3, 100, 100, () => {});
})

test("Plant should reduce size when eaten", () => {
    plant.beEaten();
    expect(plant.size).toBe(2);
});

test("Plant should increase size & calories when growing - up to max size", () => {
    plant.grow();
    expect(plant.size).toBe(4)
    expect(plant.calories).toBe(55);
    // Reaches max size here
    plant.grow();
    // Tries to go past max size
    plant.grow();
    // Should have stopped at 5
    expect(plant.size).toBe(5);
    expect(plant.calories).toBe(60);
})
