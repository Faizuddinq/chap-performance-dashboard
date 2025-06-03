class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(
    statusCode: number,
    message: string,
    isOperational = true,
    stack = ''
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

class BadRequestError extends ApiError {
  constructor(message = 'Bad Request') {
    super(400, message);
  }
}

class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized') {
    super(401, message);
  }
}

class ForbiddenError extends ApiError {
  constructor(message = 'Forbidden') {
    super(403, message);
  }
}

class NotFoundError extends ApiError {
  constructor(message = 'Not Found') {
    super(404, message);
  }
}

class ConflictError extends ApiError {
  constructor(message = 'Conflict') {
    super(409, message);
  }
}

class ValidationError extends ApiError {
  errors: Record<string, string[]>;

  constructor(errors: Record<string, string[]>) {
    super(422, 'Validation failed');
    this.errors = errors;
  }
}

class TooManyRequestsError extends ApiError {
  constructor(message = 'Too many requests, please try again later.') {
    super(429, message);
  }
}

class InternalServerError extends ApiError {
  constructor(message = 'Internal Server Error') {
    super(500, message, false);
  }
}

export {
  ApiError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  ValidationError,
  TooManyRequestsError,
  InternalServerError,
};
