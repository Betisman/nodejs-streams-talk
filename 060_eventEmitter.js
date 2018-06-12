const events = require('events');
const eventEmitter = new events.EventEmitter();
let eventListeners;

// listeners
const listener1 = () => console.log('listener1 executed.');
const listener2 = () => console.log('listener2 executed.');

// Bind the data event with the listener1 function
eventEmitter.addListener('data', listener1);

// Bind the data event with the listener2 function
eventEmitter.on('data', listener2);

eventListeners = require('events').EventEmitter.listenerCount(eventEmitter, 'data');
console.log(eventListeners + " Listener(s) listening to data event");

// Fire the data event 
eventEmitter.emit('data');

// Remove the binding of listener1 function
eventEmitter.removeListener('data', listener1);
console.log("listener1 will not listen now.");

// Fire the data event 
eventEmitter.emit('data');

eventListeners = require('events').EventEmitter.listenerCount(eventEmitter, 'data');
console.log(eventListeners + " Listener(s) listening to data event");

console.log("Program Ended.");
