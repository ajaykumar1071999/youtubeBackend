class APIError  {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = "",
    // stack = ""
  ) {
    // super(stack);
    this.statusCode = statusCode;
    this.message = errors;
    this.success = false;
    this.errors = errors;
    this.data = null;
    this.message = message;
    // if (stack) {
    //   this.stack = stack;
    // } else {
    //   Error.captureStackTrace(this, this.constructor);
    // }
  }
}

export { APIError };
