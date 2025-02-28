export class ErrorResponse extends Error {
    constructor(status_code, reason, message) {
      super(message);
      this.status_code = status_code;
      this.success = false;
      this.reason = reason;
      this.message = message;
    }
    toJSON() {
      return {
        status_code: this.status_code,
        success: this.success,
        reason: this.reason,
        message: this.message,
      };
    }
  }
  
  export const responseErrorHandler = (err, _, res, next) => {
    if (err instanceof ErrorResponse) {
      res.status(err.status_code).json(err.toJSON());
    } else {
      res.status(500).json(
        new ErrorResponse(
          500,
          "server_error",
          `INTERNAL SERVER ERROR... ${err.message}`
        )
      );
    }
    return next();
  };
  