const knex = require("../database/connection");
const bcrypt = require("bcrypt");
const secret = require('../middlewere/screct');

class User {

    async findAll() {
        try {
            let result = await knex.select(['id', 'email', 'role', 'name']).table('users');
            return result;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    async findById(id) {
        try {
            let result = await knex.select(['id', 'email', 'role', 'name']).where({'id': id}).table('users');
            if (result.length > 0) {
                return result[0];
            } else {
                return undefined;
            }
        } catch (error) {
            console.log(error);
            return undefined;
        } 
    }

    async findUserByEmail(email) {
        try {
            let result = await knex.select(['id', 'email', 'password','role', 'name']).where({'email': email}).table('users');
            if (result.length > 0) {
                return result[0];
            } else {
                return undefined;
            }
        } catch (error) {
            console.log(error);
            return undefined;
        } 
    }


    async new(email, name, password) {
        try {
            let hash = await bcrypt.hash(password + '', secret.salt);
            await knex.insert( {email, name, password: hash, role: 0}).table('users');
        } catch(err) {
            console.log(err);
        }
    }

    async findByEmail(email) {
        try {
            let user = await knex.select(['email', 'password']).from('users').where({email: email});
            console.log(user);
            
            return user.length > 0;

        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async update(id, email, nome, role) {
        let user = await this.findById(id);

        if (user != undefined) {

            let editUser = {};

            if (email != user.email) {
                let result = await this.findByEmail(email);
                if (result == false) {
                    editUser.email = email;
                } else {
                    return {status: false, error: "O email já está em uso!"};
                }
            }

            if (nome != undefined) {
                editUser.name = nome;
            }

            if (role != undefined){
                editUser.role = role;
            }

            try {
                await knex.update(editUser).where({'id': id}).table("users");
                return {status: true}
            } catch (error) {
                return {status: false, 'error': error};
            }
            

        } else {
            return {status: false, error: "O usuário não existe!"};
        }
    }

    async delete(id) {
        let user = await this.findById(id);

        if (user != undefined) {

            try {
                await knex.delete().where({'id': id}).table('users');
            } catch (error) {
                return {status: false, error};
            }

        } else {
            return {status: false, error: "O usuário não existe!"}
        }
    }

    async changePassword(newPassword, id, token) {
        let hash = await bcrypt.hash(newPassword, 10);

        try {
            await knex.update({'password': hash}).where({'id': id}).table('users');
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
}

module.exports = new User();
