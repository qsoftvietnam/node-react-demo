import { User } from './Models';
import { Database } from './Configs';
import { getErrorMessage } from './Controllers/Error';
import chalk from 'chalk';


export function seed() {
    if (Database.seed === 'true') {
        console.log(chalk.green('==========>Seed<=========='));
        const user = new User(Database.seedDb.seedUser);
        user.save().then(data => {
            console.log(chalk.green('Create User with\n username: %s\n password: %s'), data.username, Database.seedDb.seedUser.password);
        }, err => {
            console.log(chalk.red('Create user error: ' + getErrorMessage(err)));
        });

        const admin = new User(Database.seedDb.seedAdmin);
        admin.save().then(data => {
            console.log(chalk.green('Create Admin with\n username: %s\n password: %s'), data.username, Database.seedDb.seedAdmin.password);
        }, err => {
            console.log(chalk.red('Create admin error: ' + getErrorMessage(err)));
        });
    }
}