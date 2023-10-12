import EventEmitter from 'events';
import { EVENT_TYPE } from './event';

const eventBus = new EventEmitter();

export {
  eventBus,
  EVENT_TYPE
}
