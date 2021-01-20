module.exports = class InvalidEventTypeError extends Error {
  constructor(eventType) {
    super(`Invalid event type ${eventType}`);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidEventTypeError);
    }

    this.name = "InvalidEventTypeError";
  }
};
