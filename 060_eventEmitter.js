const events = require('events');
const eventEmitter = new events.EventEmitter();

eventEmitter.addListener('data', () => console.log('addListener: data'));
eventEmitter.on('data', () => console.log('on: data'));

eventEmitter.emit('data');
