import { Tag } from './../Models';
import { getErrorMessage } from './Error';

class TagController {

    /**
     *
     * @param {*} req
     * @param {*} res
     */
    create(req, res) {
        let tag = new Tag(req.body);
        tag.save().then(data => {
            return res.json(data);
        }, err => {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        });
    }
}

export default new TagController();