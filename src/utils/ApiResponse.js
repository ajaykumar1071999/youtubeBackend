class ApiResponse {
  constructor(statusCode, message = "Success", data) {
    this.statusCode = statusCode < 400 ? 200 : 400;
    this.data = data;
    this.message = message;
    this.success = this.success;
  }
}
export { ApiResponse };
