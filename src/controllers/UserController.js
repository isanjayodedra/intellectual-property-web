const httpStatus = require('http-status');
const AuthService = require('../service/AuthService');
const TokenService = require('../service/TokenService');
const UserService = require('../service/UserService');
const logger = require('../config/logger');
const { tokenTypes } = require('../config/tokens');
const { saveDeduplicatedFile } = require('../middleware/upload');

class UserController {
    constructor() {
        this.userService = new UserService();
        this.tokenService = new TokenService();
        this.authService = new AuthService();
    }
   update = async (req, res) => {
    try {
      let userData = req.body;

      // Handle file upload (S3 or local)
      if (req.file && req.file.location) {
        userData.image = req.file.location;
      } else if (req.file) {
        const imagePath = await saveDeduplicatedFile(req.file);
        userData.image = imagePath;
      }

      const { response, statusCode } = await this.userService.updateUser(req.user.id, userData);
      return res.status(statusCode).json(response);
    } catch (err) {
      logger.error(err);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
    }
  };
}
module.exports = UserController;