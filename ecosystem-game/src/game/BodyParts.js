class BodyPart {
    constructor(name, requirements = [], cost, speedImpact, damageImpact, weightImpact) {
        this.name = name;
        this.requirements = requirements;
        this.cost = cost;
        this.speedImpact = speedImpact;
        this.damageImpact = damageImpact;
        this.weightImpact = weightImpact;
    }
}

const availableBodyParts = [
    new BodyPart('leg', [], 1, +1, 0, +1),
    new BodyPart('arm', [], 1, 0, +0.5, +1),
    new BodyPart('claw', ['leg', 'arm'], 0.1, 0, +0.2, 0)
];
