const User = require('../model/User');

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
        if (req.body.email == undefined) {
            res.status(400);
            res.json({err: "O email é obrigatorio"});
        }

        if (req.body.name == undefined) {
            res.status(400);
            res.json({err: "O nome é obrigatorio"});
        }

        if (req.body.password == undefined) {
            res.status(400);
            res.json({err: "O password é obrigatorio"});
        }

        let exist = await User.findByEmail(email);

        if (exist) {
            res.status(406);
            res.json({erro: 'O email já está cadastrado'});
            return;
        }

        await User.new(email, name, password);

        res.status(200);
        res.send("chegou");
    }

    async edit(req, res) {
        let {id, nome, role, email} = req.body;

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
}

module.exports = new UserController();
