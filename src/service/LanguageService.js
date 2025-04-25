const httpStatus = require('http-status');
const responseHandler = require('../helper/responseHandler');
const logger = require('../config/logger');
const { languageConstant } = require('../config/constant');
const LanguageDao = require('../dao/LanguageDao');

class LanguageService {
    constructor() {
        this.languageDao = new LanguageDao();
    }

    /**
     * Create a user
     * @param {Object} userBody
     * @returns {Object}
     */
    createLanguage = async (languageBody) => {
        try {
            let message = 'Successfully Created the language!';
            if (await this.languageDao.isLanguageExists(languageBody.code)) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Language already exists');
            }
            languageBody.code = languageBody.code;
            languageBody.name = languageBody.name;
            languageBody.status = languageConstant.STATUS_ACTIVE;

            let languageData = await this.languageDao.create(languageBody);

            if (!languageData) {
                message = 'Create Failed! Please Try again.';
                return responseHandler.returnError(httpStatus.BAD_REQUEST, message);
            }
          
            languageData = languageData.toJSON();
            
            return responseHandler.returnSuccess(httpStatus.CREATED, message, languageData);
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Something went wrong!');
        }
    };

    /**
     * Get Language
     * @param {String} code
     * @returns {Object}
     */
    listLanguage = async () => {
        let message = 'Language List Successful';
        let statusCode = httpStatus.OK;
        let languages = await this.languageDao.findAll();
        return responseHandler.returnSuccess(statusCode, message, languages); 
    };

    isLanguageExists = async (code) => {
        const message = 'Language found!';
        if (!(await this.languageDao.isLanguageExists(code))) {
            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Language not Found!!');
        }
        return responseHandler.returnSuccess(httpStatus.OK, message);
    };

    getLanguageByCode = async (code) => {
        return this.languageDao.findOneByWhere({ code });
    };

    
}

module.exports = LanguageService;
