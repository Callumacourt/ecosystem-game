export default class Helpers {
        constructor () {
            this.calculateDistance;
        }

        calculateDistance(target) {
            let dx = target.location[0] - this.location[0];
            let dy = target.location[1] - this.location[1];
            return Math.sqrt(dx * dx + dy * dy);
        }
    };