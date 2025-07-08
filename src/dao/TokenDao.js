const responseHandler = require('../helper/responseHandler');
const httpStatus = require('http-status');
const SuperDao = require('./SuperDao');
const models = require('../models');

const Token = models.token;

class TokenDao extends SuperDao {
    constructor() {
        super(Token);
    }

    async findOne(where) {
        return Token.findOne({ where });
    }

    async saveToken(token, user_uuid, expires, type, blacklisted = false) {
        return Token.create({
        token,
        user_uuid,
        expires,
        type,
        blacklisted
        });
    }

    async remove(filter) {
        return Token.destroy({ where: filter });
    }

    async verifyToken(token, type) {
        const tokenDoc = await Token.findOne({
        where: {
            token,
            type,
            blacklisted: false,
        },
        });

        if (!tokenDoc){
            return responseHandler.returnError(httpStatus.UNAUTHORIZED, `${type} token not found or expired`);
        }
             
        
        if (tokenDoc.expires < new Date()) {
            return responseHandler.returnError(httpStatus.UNAUTHORIZED, `${type} token expired`);
        }

        return tokenDoc;
    }

    async removeTokenById(id) {
        return Token.destroy({ where: { id } });
    }
}

module.exports = TokenDao;
