export class InternalError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InternalError";
  }
}

export class InvalidPublicKey extends InternalError {
  constructor(message: string) {
    super(message);
    this.name = "InvalidPublicKey";
  }
}

export class InvalidValueError extends InternalError {
  constructor(message: string) {
    super(message);
    this.name = "InvalidValueError";
  }
}
