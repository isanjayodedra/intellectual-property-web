const httpStatus = require('http-status');
const LanguageService = require('../service/LanguageService');
const logger = require('../config/logger');

class BaseController {
    constructor() {
        this.languageService = new LanguageService();
    }

    languageRegister = async (req, res) => {
        try {
            const language = await this.languageService.createLanguage(req.body);
            const { message, data, status } = language.response;
            res.status(language.statusCode).send({ status, message, data });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

    languageList = async (req, res) => {
        try {
            const language = await this.languageService.listLanguage();
            const { status, message, data } = language.response;
            const code = language.statusCode;
            res.status(language.statusCode).send({ status, code, message, data });
        } catch (e) {
            logger.error(e);
            res.status(httpStatus.BAD_GATEWAY).send(e);
        }
    };

}

module.exports = BaseController;
