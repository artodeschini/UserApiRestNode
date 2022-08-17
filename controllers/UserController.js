const User = require('../model/User');
const PasswordToken = require('../model/PssswordToken');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const secret = require('../middlewere/screct'); 

class UserController {

    async index(req, res) {
        const users = await User.findAll();
        res.json(users);
    }

    async findUserById(req, res) {
        const id = req.params.id;

        let user = await User.findById(id);
        
        if (user == undefined) {
            res.status(404);
            res.json({});
        } else {
            res.status(200);
            res.json(user);
        }
    }

    async create(req, res) {
        let {email, name, password} = req.body;
        //console.log(req.body);
        if (email == undefined || email == '' || email == ' ') {
            res.status(400);
            res.json({err: "O email é obrigatorio"});
        }

        if (name == undefined || name == '' || name == ' ') {
            res.status(400);
            res.json({err: "O nome é obrigatorio"});
        }

        if (password == undefined || password == '' || password == ' ') {
            res.status(400);
            res.json({err: "O password é obrigatorio"});
        }

        let exist = await User.findByEmail(email);

        if (exist) {
            res.status(406);
            res.json({erro: 'O email já está cadastrado'});
            return;
        }

        try {
            await User.new(email, name, password);
            res.status(201);
            return;

        } catch (error) {
            console.log(error);
            res.status(500);
            res.json({msg: 'erro ao criar usuario', error });
        }        
    }

    async edit(req, res) {
        let id = req.params.id;
        let {nome, role, email} = req.body;

        let result = await User.update(id, email, nome, role);
        if (result != undefined) {
            if (result.status) {
                res.status(200);

            } else {
                res.status(406);
                res.json(result);
            }
        } else {
            res.status(406);
            res.json({"msg": 'Ocorreu um erro no servidor'});
        }
    }

    async delete(req, res) {
        let id = req.params.id;

        let result = await User.delete(id);

        if (result.status) {
            res.status(204);
            res.json({msg: 'Usuario deletado'});

        } else {
            res.status(406);
            res.json(result);
        }
    }

    async recoverPassword(req, res) {
        let email = req.body.email;

        let result = await PasswordToken.create(email);

        if (result.status) {
            res.status(200);
            res.send(result.token + '');
        } else {
            res.status(406);
            res.send(result.error);
        }
    }

    async changePassword(req, res) {
        let token = req.body.token;
        let password = req.body.password;

        let isValid = await PasswordToken.validate(token);

        if (isValid.status) {
            await User.changePassword(password, isValid.token.user_id);
            await PasswordToken.setUsed(isValid.token);
            res.status(200);
            res.send({msg: 'senha alterada'});
        } else {
            res.status(406);
            res.send({ msg: 'Token invalido'});
        }
    }

    async login(req, res) {
        // console.log(req.body);
        let {email, password} = req.body;

        const user = await User.findUserByEmail(email);

        if (user != undefined) {
            // bcrypt.compareSync(password, user.password);
            let result = await bcrypt.compareSync(password, user.password);

            if (result) {
                // let token = jwt.sign({emai: user.email, role: user.role , secret);
                jwt.sign(
                    {
                        id: user.id,
                        email: user.email,
                        nome: user.nome,
                        role: user.role
                    },
                    secret.secret,
                    {expiresIn: '1h'},
                    //{expiresIn: '1m'},
                    (error, token) => {
                        if (error) {
                            res.status(400);
                            res.send({message:"Erro ao gerar o token"});
                        } else {
                            res.status(200);
                            res.send({'token': token});
                        }
                    }
                );

                // res.status(200);
                // res.json({'token': token});

            } else {
                res.status(401);
                res.send({msg: 'login invalido'});
            }

        } else {
            
        }
    }
}

module.exports = new UserController();
