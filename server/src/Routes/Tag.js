import Express, { Router } from 'express';
import Tag from './../Controllers/Tag';
const router = Router();


router.post('/', Tag.create);

export default router;