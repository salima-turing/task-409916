class ObjectPool {
    constructor() {
        this.pool = {};
        this.referenceCount = {};
        this.usageHistory = {}; // New: Object to track usage history
    }

    acquire(key) {
        const now = Date.now();
        if (this.pool[key]) {
            this.referenceCount[key]++;
            if (!this.usageHistory[key]) {
                this.usageHistory[key] = [];
            }
            this.usageHistory[key].push({ accessTime: now, references: this.referenceCount[key] });
            return this.pool[key];
        } else {
            // ... (Same as before)
            // Create a new object if it doesn't exist in the pool
            const newObject = { id: key, data: {}, references: 0 }; // Example object
            this.pool[key] = newObject;
            this.referenceCount[key] = 1; // Start with one reference
            return newObject;
        }
    }

    release(key) {
        // ... (Same as before)
        if (this.pool[key]) {
            this.referenceCount[key]--;
            if (this.referenceCount[key] <= 0) {
                // If no references, clean up the object
                console.log(`Cleaning up object with key: ${key}`);
                delete this.pool[key];
                delete this.referenceCount[key];
            }
        }
    }

    getPoolStatus() {
        // ... (Same as before)
        return {
            pool: Object.keys(this.pool),
            references: this.referenceCount,
        };
    }

    getUsageHistory() {
        return this.usageHistory;
    }
}

function predictiveRecycle(objectPool) {
    const currentTime = Date.now();
    const history = objectPool.getUsageHistory();

    for (const key in history) {
        const lastAccess = history[key][history[key].length - 1].accessTime;

        if (currentTime - lastAccess >= 5000) { // Predict recycle if no access in 5 seconds
            console.log(`Predictive recycling object: ${key}`);
            if (objectPool.referenceCount[key] <= 0) {
                objectPool.release(key);
            }
        }
    }
}

const objectPool = new ObjectPool();

function simulateUsage() {
    // Acquire and release objects in a microservice-like manner
    const obj1 = objectPool.acquire('sensorData1');
    objectPool.release('sensorData1');

    const obj2 = objectPool.acquire('sensorData2');
    setTimeout(() => {
        objectPool.release('sensorData2');
    }, 2000); // Simulate a delay in releasing obj2

    setTimeout(() => {
        predictiveRecycle(objectPool);
        console.log('Current pool status after predictive recycling:');
        console.log(objectPool.getPoolStatus());
    }, 6000); // Run predictive recycling after 6 seconds
}

simulateUsage();
