export default class LoginException extends Error {
    /**
     * Constructs the LoginException class
     * @param {String} message an error message
     * @constructor
     */
    constructor(message) {
        super(message);
        // properly capture stack trace in Node.js
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
    }
};