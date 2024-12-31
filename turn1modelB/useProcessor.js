const {useProcessor} = require('./sensorDataProcessor');


// Define the data to be processed
const inputData = [1, 2, 3, 4];

// Define the transformation logic
const options = {
    transform: (data) => data.map((x) => x * 2), // Example: double each value
};

// Use the processor
useProcessor(inputData, options);

// If you need to observe processed data, consider modifying the useProcessor function
// to return the result or expose it via an event.
