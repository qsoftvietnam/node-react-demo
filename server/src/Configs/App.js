import fs from 'fs';
import path from 'path';

const accessLogStream = fs.createWriteStream(path.join(process.cwd(), '/logs/access.log'), { flags: 'a' });

let port = process.env.DEV_PORT || 3001;
switch (process.env.NODE_ENV) {
    case 'production':
        port = process.env.PORT || 8080;
        break;
    default:
        break;
}
export default {
    port: port,
    logs: {
        stream: accessLogStream
    }
}