export class SuccessResponse {
    /**
     * @param {number} status_code - The HTTP status code of the successful response
     * @param {string} message - A message providing additional information about the response
     * @param {*} data - The actual data returned in the response (or null)
     */
    constructor(status_code, message, data) {
      this.status_code = status_code;
      this.success = true;
      this.message = message;
      this.data = data;
    }
  }
  