const express = require("express")
const app = express();
const router = express.Router();
const HomeController = require("../controllers/HomeController");
const UserController = require("../controllers/UserController")


router.get('/', HomeController.index);
router.post('/users', UserController.create);
router.get('/users', UserController.index);
router.get('/users/:id', UserController.findUserById);
router.put('/users', UserController.edit);
router.delete('/users/:id', UserController.delete);
router.post('/recoverpassword', UserController.recoverPassword);
router.post('/changepassword', UserController.changePassword);

module.exports = router;
