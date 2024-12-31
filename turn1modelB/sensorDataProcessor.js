const { EventEmitter } = require('events');

class SensorDataProcessor extends EventEmitter {
    constructor(options) {
        super();
        this.options = options;
    }

    processData(data) {
        const processedData = this.options.transform(data);
        this.emit('dataProcessed', processedData);
    }

    dispose() {
        // Clean up any resources or references here
        this.removeAllListeners();
    }
}

function createProcessor(options) {
    const processor = new SensorDataProcessor(options);
    return processor;
}

function useProcessor(data, options) {
    const processor = createProcessor(options);
    processor.processData(data);

    // Once processing is complete, dispose of the processor
    processor.dispose();
    console.log("Processor disposed");
}

module.exports = { useProcessor };
