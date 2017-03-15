import Express from 'express';

import { Hospital } from './../Controllers';

const Router = Express.Router();

Router.get('/', Hospital.list);
Router.post('/', Hospital.create);

export default Router;