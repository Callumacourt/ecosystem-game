import LifeForm from "../Animals/LifeForm";

export default class Plant extends LifeForm {
    constructor(calories = 100, growthTime, size, x, y) {
        super();
        this.calories = calories;
        this.growthTime = growthTime;
        this.size = size;
        this.age = 0;
        this.maxSize = 5;  
        this.location = [x, y];
        this.prevLocation = this.location;
    }

    grow() {
        if (this.size < this.maxSize) { 
            this.size += 1;
            this.calories += 5;  // More size = more calories
        }
    }

    beEaten() {
        console.log('being eaten')
        if (this.size > 0) {
            this.size -= 1;
            this.calories -= 5;  // Remove one square's worth of food
        }

        if (this.size === 0) {
            this.die();
            console.log('dead')
        }
    }
}
