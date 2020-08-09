import express from 'express';
import ClassesController from './controllers/ClassesController';
import ConnectionsController from './controllers/ConnectionsController';
import userController from './controllers/UserController';

import isAuthenticated from './middlewares/isAuthenticated';

const routes = express.Router();
const calssesController = new ClassesController();
const connectionsController = new ConnectionsController();

routes.post('/classes', isAuthenticated, calssesController.create)
routes.get('/class', isAuthenticated, calssesController.findMine)
routes.patch('/classes', isAuthenticated, calssesController.update)
routes.get('/classes', calssesController.index)

routes.post('/connections', connectionsController.create)
routes.get('/connections', connectionsController.index)

routes.post('/user', userController.create);
routes.post('/user/auth', userController.auth);
routes.post('/user/logout', userController.logout);
routes.post('/user/forgot_password', userController.forgotPassword);
routes.post('/user/reset_password', userController.resetPassword);
routes.get('/user/isAuthenticated', isAuthenticated, userController.isAuthenticated);
routes.get('/user/profile', isAuthenticated, userController.profile);
routes.patch('/user/profile', isAuthenticated, userController.editProfile);

export default routes;