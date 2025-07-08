const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const UserDao = require('../dao/UserDao');
const responseHandler = require('../helper/responseHandler');
const logger = require('../config/logger');
const { userConstant } = require('../config/constant');
const UserResponseHelper = require('../helper/UserResponseHelper');

class UserService {
    constructor() {
        this.userDao = new UserDao();
    }

    /**
     * Create a user
     * @param {Object} userBody
     * @returns {Object}
     */
    createUser = async (userBody) => {
        try {
            let message = 'Successfully Registered the account! Please Verify your email.';
            if (await this.userDao.isEmailExists(userBody.email)) {
                return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Email already taken');
            }
            const uuid = uuidv4();
            userBody.username = userBody.username;
            userBody.language_code = userBody.language_code;
            userBody.role_id = userBody.role_id;
            userBody.email = userBody.email.toLowerCase();
            userBody.password = bcrypt.hashSync(userBody.password, 8);
            userBody.uuid = uuid;
            userBody.status = userConstant.STATUS_ACTIVE;
            userBody.email_verified = userConstant.EMAIL_VERIFIED_FALSE;

            let userData = await this.userDao.create(userBody);

            if (!userData) {
                message = 'Registration Failed! Please Try again.';
                return responseHandler.returnError(httpStatus.BAD_REQUEST, message);
            }
          
            const result = await this.userDao.findById(userData.id);
            
            return responseHandler.returnSuccess(httpStatus.CREATED, message, UserResponseHelper.formatUser(result));
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Something went wrong!');
        }
    };

    /**
     * Update user
     * @param {Object} userBody
     * @returns {Object}
     */
    async updateUser(id, userBody) {
        try {
            const user = await this.userDao.findByPk(id);
            if (!user) {
            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'User not Found!!');
            }
            if (userBody.password && userBody.old_password) {
                const isPasswordValid = await bcrypt.compare(userBody.old_password, user.password);
                if (!isPasswordValid) {
                    return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Wrong old Password!');
                }
                userBody.password = bcrypt.hashSync(userBody.password, 8);
            }else{
                userBody.password = user.password;
            }

            await this.userDao.updateById(userBody, id);
            const result = await this.userDao.findById(id); // ensure we return updated user with relations

            return responseHandler.returnSuccess(httpStatus.OK, 'User updated', UserResponseHelper.formatUser(result));
        } catch (e) {
            logger.error(e);
            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Failed to update user');
        }
        }
    updateUserOld = async (id, userBody) => {
        let user = await this.userDao.findByPk(id);
        if (!user) return responseHandler.returnError(httpStatus.BAD_REQUEST, 'User not Found!!');
        if(userBody.password && userBody.old_password ){
            const isPasswordValid = await bcrypt.compare(userBody.old_password, user.password);
            if (!isPasswordValid) {
                const message = 'Wrong old Password!';
                return responseHandler.returnError(httpStatus.BAD_REQUEST, message);
            }
            userBody.password = bcrypt.hashSync(userBody.password, 8)
        }
        const result = await this.userDao.updateById(userBody, id)
        user = user.toJSON();
        delete user.password;
        return { ...user, ...userBody };
      };

    /**
     * Get user
     * @param {String} email
     * @returns {Object}
     */

    isEmailExists = async (email) => {
        const message = 'Email found!';
        if (!(await this.userDao.isEmailExists(email))) {
            return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Email not Found!!');
        }
        return responseHandler.returnSuccess(httpStatus.OK, message);
    };

    getUserByUuid = async (uuid) => {
        return this.userDao.findOneByWhere({ uuid });
    };

    getUserById = async (id) => {
        return this.userDao.getUserById(id );
    };

    changePassword = async (data, uuid) => {
        let message = 'password update Successful';
        let statusCode = httpStatus.OK;
        let user = await this.userDao.findOneByWhere({ uuid });

        if (!user) {
            return responseHandler.returnError(httpStatus.NOT_FOUND, 'User Not found!');
        }

        if (data.password !== data.confirm_password) {
            return responseHandler.returnError(
                httpStatus.BAD_REQUEST,
                'Confirm password not matched',
            );
        }

        const isPasswordValid = await bcrypt.compare(data.old_password, user.password);
        user = user.toJSON();
        delete user.password;
        if (!isPasswordValid) {
            statusCode = httpStatus.BAD_REQUEST;
            message = 'Wrong old Password!';
            return responseHandler.returnError(statusCode, message);
        }
        const updateUser = await this.userDao.updateWhere(
            { password: bcrypt.hashSync(data.password, 8) },
            { uuid },
        );

        if (updateUser) {
            return responseHandler.returnSuccess(
                httpStatus.OK,
                'Password updated Successfully!',
                {},
            );
        }

        return responseHandler.returnError(httpStatus.BAD_REQUEST, 'Password Update Failed!');
    };

    updateUserStatus = async (userId, status) => {
    try {
        const updatedUser = await this.userDao.updateUser(userId, { status });

        return responseHandler.returnSuccess(
            httpStatus.OK,
            `User status updated to ${status === 1 ? 'active' : 'inactive'}`,
            UserResponseHelper.formatUser(updatedUser)
        );
        } catch (err) {
        logger.error(err);
        return responseHandler.returnError(
            httpStatus.BAD_REQUEST,
            'Failed to update user status'
        );
        }
    };
}

module.exports = UserService;
