export default class Grid {
    constructor(cellSize = 50, gridWidth = 1000, gridHeight = 1000) {
        this.gridMap = new Map();  // Map to hold grid cells
        this.cellSize = cellSize;  // Size of each grid cell
        this.width = gridWidth;    // Number of cells horizontally
        this.height = gridHeight;  // Number of cells vertically
    }
    // Get the grid key for a given position (x, y)
    getGridKey(x, y) {
        return `${Math.floor(x / this.cellSize)},${Math.floor(y / this.cellSize)}`;
    }

    // Add an entity to the grid at its current location
    addToGrid(entity) {
        let key = this.getGridKey(entity.location[0], entity.location[1]);
        if (!this.gridMap.has(key)) {
            this.gridMap.set(key, []);
        }
        this.gridMap.get(key).push(entity);
    }

    removeFromGrid(entity) {
        const key = this.getGridKey(entity.location[0], entity.location[1]);

        const cell = this.gridMap.get(key);
        if (cell) {
            this.gridMap.set(key, cell.filter(e => e !== entity));
        }
    }

    // Get nearby entities from the grid (including diagonal neighbors)
    getNearbyEntities(x, y, searchRadius = 100) {
        let nearby = [];
        // First get the key for the provided coordinates
        let currentKey = this.getGridKey(x, y);
        let [currentGridX, currentGridY] = currentKey.split(",").map(Number);
        
        // Determine how many grid cells to check around the current position
        const gridCellSize = 50; 
        const gridSearchRadius = Math.ceil(searchRadius / gridCellSize);
        
        // Check nearby grid cells in a radius
        for (let dx = -gridSearchRadius; dx <= gridSearchRadius; dx++) {
            for (let dy = -gridSearchRadius; dy <= gridSearchRadius; dy++) {
                let checkKey = `${currentGridX + dx},${currentGridY + dy}`;
                if (this.gridMap.has(checkKey)) {
                    // For each entity in this cell, check if it's actually within the radius
                    const cellEntities = this.gridMap.get(checkKey);
                    for (const entity of cellEntities) {
                        // Calculate actual distance to entity
                        const distance = Math.hypot(
                            entity.location[0] - x,
                            entity.location[1] - y
                        );
                        
                        // Only include entities within the specified radius
                        if (distance <= searchRadius && !(entity.location[0] === x && entity.location[1] === y)) {
                            nearby.push(entity);
                        }
                    }
                }
            }
        }
        
        return nearby;
    }

    // Update the grid after entities move
    updateGrid(entities) {
        entities.forEach(entity => {
            let oldKey = this.getGridKey(entity.prevLocation[0], entity.prevLocation[1]);
            let newKey = this.getGridKey(entity.location[0], entity.location[1]);

            // If the entity has moved, update the grid
            if (oldKey !== newKey) {
                let oldCell = this.gridMap.get(oldKey);
                if (oldCell) {
                    this.gridMap.set(oldKey, oldCell.filter(e => e !== entity));  // Remove from old cell
                }

                if (!this.gridMap.has(newKey)) {
                    this.gridMap.set(newKey, []);
                }
                this.gridMap.get(newKey).push(entity);  // Add to new cell
            }

            // Update previous location for the next update
            entity.prevLocation = [...entity.location];
        });
    }

    // Clear the grid (if needed)
    clear() {
        this.gridMap.clear();
    }
}
