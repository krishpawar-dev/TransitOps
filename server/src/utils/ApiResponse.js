/**
 * Standard API Response wrapper — ensures consistent response shape.
 */
class ApiResponse {
  constructor(statusCode, message, data = null, pagination = null) {
    this.statusCode = statusCode;
    this.success = statusCode < 400;
    this.message = message;
    if (data !== null) this.data = data;
    if (pagination) this.pagination = pagination;
  }

  /**
   * Send the response via Express res object.
   */
  send(res) {
    return res.status(this.statusCode).json(this);
  }
}

module.exports = ApiResponse;
