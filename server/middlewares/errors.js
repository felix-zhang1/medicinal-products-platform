/**
 * errors.js
 *
 * Defines a set of custom HTTP error classes for consistent error throwing and handling
 * in the backend.
 *
 * Base class:
 *   - HttpError: extends the native Error, adding a `status` field (HTTP status code).
 *     - Supports the standard Error constructor options (e.g., `cause`) for error chaining.
 *
 * Subclasses (for common HTTP status codes):
 *   - NotFoundError (404)
 *   - BadRequestError (400)
 *   - UnauthorizedError (401)
 *   - ForbiddenError (403)
 *   - ConflictError (409)
 *   - ValidationError (422, includes an extra `details` field to hold validation error details)
 *
 * Usage:
 *   - Throw these errors in business logic or middleware, then let a centralized error
 *     handler catch them.
 *   - Frontend can use the `status` and `message` to display user-friendly messages,
 *     and leverage `details` for more precise feedback.
 *   - The `options` argument can be used to pass underlying errors (`cause`) or other
 *     metadata, useful for logging and debugging.
 */

export class HttpError extends Error {
  constructor(status, message, options) {
    super(message, options); // support cause (for future expansion)
    this.name = new.target.name; // class name is error name
    this.status = status; // HTTP status code
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, new.target);
    }
  }
}

export class NotFoundError extends HttpError {
  constructor(message = "Not Found", options) {
    super(404, message, options);
  }
}

export class BadRequestError extends HttpError {
  constructor(message = "Bad Request", options) {
    super(400, message, options);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message = "Unauthorized", options) {
    super(401, message, options);
  }
}

export class ForbiddenError extends HttpError {
  constructor(message = "Forbidden", options) {
    super(403, message, options);
  }
}

export class ConflictError extends HttpError {
  constructor(message = "Conflict", options) {
    super(409, message, options);
  }
}

export class ValidationError extends HttpError {
  constructor(details = [], message = "Validation Failed", options) {
    super(422, message, options);
    this.details = details;
  }
}
