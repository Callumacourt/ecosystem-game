export default class Helpers {
    static calculateDistance(start, target) {
        let dx = target.location[0] - start.location[0];
        let dy = target.location[1] - start.location[1];
        return Math.sqrt(dx * dx + dy * dy);
    }
}
