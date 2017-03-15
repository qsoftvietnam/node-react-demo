import Express, { Router } from 'express';
import Upload from './../Controllers/Upload';
import { AuthPolicy } from './../Policies';

const router = Router();

router.route('/')
    .post(AuthPolicy.requireLogin, Upload.upload);


export default router;