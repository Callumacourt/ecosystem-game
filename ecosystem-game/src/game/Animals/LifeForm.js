export default class LifeForm {
    constructor (callback) {
        this.onDeathCallback = callback;
    }
    
    die () {  
        if (this.onDeathCallback) {
            this.onDeathCallback(this);  
            }
    }
}