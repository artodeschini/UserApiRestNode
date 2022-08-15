const express = require("express")
const app = express();
const router = express.Router();
const HomeController = require("../controllers/HomeController");
const UserController = require("../controllers/UserController");
const AdminAuth = require("../middlewere/AdminAuth");

router.get('/', HomeController.index);
router.post('/users', AdminAuth, UserController.create);
router.get('/users', AdminAuth, UserController.index);
router.get('/users/:id',AdminAuth,  UserController.findUserById);
router.put('/users', AdminAuth, UserController.edit);
router.delete('/users/:id', AdminAuth, UserController.delete);
router.post('/recoverpassword', UserController.recoverPassword);
router.post('/changepassword', UserController.changePassword);
router.post('/login', UserController.login);

module.exports = router;
