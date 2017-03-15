import Express from 'express';
import { Auth } from './../Controllers';

const Router = Express.Router();

Router.post('/login', Auth.login);
Router.post('/', Auth.register);

Router.get('/me', Auth.me);

export default Router;