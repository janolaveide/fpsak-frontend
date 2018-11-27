/* @flow */
/**
 * EventType
 *
 * Interne hendelser i en request-prosess. Kan kobles til eksterne hendelser
 * via @see NotificationMapper.
 */
const EventType = {
  REQUEST_STARTED: 'REQUEST_STARTED',
  REQUEST_FINISHED: 'REQUEST_FINISHED',
  REQUEST_ERROR: 'REQUEST_ERROR',
  STATUS_REQUEST_STARTED: 'STATUS_REQUEST_STARTED',
  STATUS_REQUEST_FINISHED: 'STATUS_REQUEST_FINISHED',
  UPDATE_POLLING_MESSAGE: 'UPDATE_POLLING_MESSAGE',
};

export default EventType;
