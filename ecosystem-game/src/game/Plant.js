import LifeForm from './Animals/LifeForm';

export default class Plant extends LifeForm {
    constructor(calories, growthTime, size, x, y, callback) {
        super();
        this.onDeathCallBack = callback;
        this.calories = calories;
        this.growthTime = growthTime;
        this.size = size;
        this.maxSize = 5;  
        this.location = [x, y];
    }

    grow() {
        if (this.size < this.maxSize) { 
            this.size += 1;
            this.calories += 5;  // More size = more calories
        }
    }

    beEaten() {
        if (this.size > 0) {
            this.size -= 1;
            this.calories -= 5;  // Remove one square's worth of food
        }

        if (this.size === 0) {
            this.die();
        }
    }
}
