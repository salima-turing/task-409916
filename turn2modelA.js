class PredictiveObjectPool {
    constructor(cleanupThreshold) {
        this.pool = {};
        this.accessTimestamps = {};
        this.cleanupThreshold = cleanupThreshold; // Time threshold for cleaning up unused objects
    }

    acquire(key) {
        if (this.pool[key]) {  // If object exists in the pool
            this.accessTimestamps[key] = Date.now(); // Update access timestamp
            return this.pool[key];
        } else {  // If it's a new object
            const newObject = { id: key, data: {}, lastUsed: Date.now() };
            this.pool[key] = newObject;
            this.accessTimestamps[key] = Date.now(); // Set initial access time
            return newObject;
        }
    }

    release(key) {
        if (this.pool[key]) {
            // Increase logic for tracking if needed
            console.log(`Releasing object with key: ${key}`);
            this.cleanupIfNeeded(key);
        }
    }

    cleanupIfNeeded(key) {
        const lastUsed = this.accessTimestamps[key];
        const elapsedTime = Date.now() - lastUsed;

        if (elapsedTime > this.cleanupThreshold) {
            console.log(`Removing object with key: ${key} after ${elapsedTime}ms`);
            delete this.pool[key];  // Clean up the object
            delete this.accessTimestamps[key]; // Remove access timestamp
        }
    }

    predictedCleanup() {
        const now = Date.now();
        for (const key in this.pool) {
            const lastUsed = this.accessTimestamps[key];
            const elapsedTime = now - lastUsed;

            // If the object hasn't been used over the threshold, remove it
            if (elapsedTime > this.cleanupThreshold) {
                console.log(`Predictive cleanup: Removing object with key: ${key} after ${elapsedTime}ms`);
                delete this.pool[key];
                delete this.accessTimestamps[key];
            }
        }
    }

    simulate() {
        this.predictedCleanup();  // Call this periodically to check for unused objects
    }

    getPoolStatus() {
        return {
            pool: Object.keys(this.pool),
            accessTimestamps: this.accessTimestamps,
        };
    }
}

// Example usage
const objectPool = new PredictiveObjectPool(5000); // Cleanup after 5 seconds of inactivity

// Acquire some objects
const obj1 = objectPool.acquire('sensor1');
setTimeout(() => objectPool.release('sensor1'), 2000); // Release after 2 seconds

const obj2 = objectPool.acquire('sensor2');
setTimeout(() => objectPool.release('sensor2'), 6000); // Release after 6 seconds (should trigger cleanup)

// Simulate periodic cleanup checks
setInterval(() => {
    console.log('Running predictive cleanup checks...');
    objectPool.simulate();
    console.log(objectPool.getPoolStatus());
}, 3000); // Check every 3 seconds
