import multer from 'multer';
import { Upload } from './../Configs';
let myUpload = multer({ dest: Upload.profile.dest }).single('avatar');

class UploadController {

    /**
     * @api {post} /api/v1/upload Upload image
     * @apiGroup Media
     * @apiPermission auth
     * @apiParam {File} avatar Image file
     * @apiSuccess {String} url Image url
     * @apiVersion 1.0.0
     */
    upload(req, res) {
        myUpload(req, res, function (err) {
            if (err) {
                // An error occurred when uploading
                return res.status(400).send(err);
            }
            const app_url = process.env.APP_URL || '';
            const url = `${app_url + Upload.profile.link + req.file.filename}`;
            return res.json({ url: url })
        })
    }
}

export default new UploadController();