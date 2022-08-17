const knex = require("../database/connection");
const User = require("./User");
const { v4: uuidv4 } = require('uuid');

class PasswordToken {
    async create(email) {
        let user = await User.findUserByEmail(email);

        if (user != undefined) {

            let token = uuidv4();

            try {
                await knex.insert({
                    'user_id': user.id,
                    'used': 0,
                    'token': token
                }).table('passwordtokens');;

                return {status: true, token};
    
            } catch (error) {
                console.log(error);
                return {status: false, error};
            }
           
        } else {
            return {status: false, error: 'O email passado nao existe no banco de dados'};
        }
    }

    async validate(token) {
        try {
            let result = await knex.select(['id','used', 'token', 'user_id']).where({'token': token}).table('passwordtokens');
            console.log(result);

            if (result.length) {
                let check = result[0];
                if (check.used == 0) {
                    return {status: true, 'token': check};
                } else {
                    return {status: false, token};
                }
            } else {
                return {status: false, token};
            }
            
        } catch (error) {
            console.log(error);
            return {status: false, token, error};
        }
    }

    async setUsed(token) {
        try {
            await knex.update({used: 1}).where({'id': token.id}).table('passwordtokens');
            return true
        } catch (error) {
            console.log(error);
            return false;
        }
    }
}

module.exports = new PasswordToken();
