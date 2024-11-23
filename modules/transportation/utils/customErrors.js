class CustomError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}

export class UnauthorizedError extends CustomError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

export class BadRequestError extends CustomError {
  constructor(message = "Bad Request") {
    super(message, 400);
  }
}

export class NotFoundError extends CustomError {
  constructor(message = "Not Found") {
    super(message, 404);
  }
}
