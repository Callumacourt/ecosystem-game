import { expect, test, beforeEach } from "vitest";
import Creature from "../src/game/Animals/Creature";

let creature;

beforeEach(() => {
    creature = new Creature();
})

test("Health should decrement on attack recieved", () => {
    creature.receiveDamage(10);
    expect(creature.health).toBe(90);
})

test("Energy and health should increase on eating", () => {
    // Decrement both stats by 20
    creature.decreaseEnergy(20);
    creature.receiveDamage(20);

    creature.eat(20, 20);
    expect(creature.health).toBe(100);
    expect(creature.energy).toBe(100);

    // Test that weight is gained in energy surplus

    expect(creature.weight).toBe(0);
    creature.eat(60, 60);
    expect(creature.weight).toBeGreaterThan(0);
})

test("Creature moves towards target", () => {
    creature.location = [0, 0];
    creature.moveTowards([10, 0]);

    expect(creature.location[0]).toBeGreaterThan(0);
    expect(creature.location[0]).toBeLessThanOrEqual(5); // Speed is 5
    expect(creature.location[1]).toBe(0); // Shouldn't move in y direction
});
