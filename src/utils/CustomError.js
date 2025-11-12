// Custom error class that extends the built-in Error
class CustomError extends Error {
    constructor(statusCode, message) {
        super(message);// Call the parent Error constructor and set the message
        this.statusCode = statusCode;// HTTP status code (e.g., 404, 500)
        this.status = statusCode >= 400 && statusCode < 500 ? "Client Error": "Server Error";// Human-readable status based on the code
        this.data = null;              // Extra data if needed
        this.isOperationalError = true; // To distinguish from programming errors
        Error.captureStackTrace(this, this.constructor); // Capture the stack trace (optional, better debugging)
    }
}
module.exports = { CustomError };
