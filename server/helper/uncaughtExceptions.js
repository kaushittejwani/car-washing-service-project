import Config from 'config';
import mailNotifier from './mailer';
import logger from './logger';

export class UncaughtException {
    constructor() {
        if (process.env.NODE_ENV === 'production') {
            process.on('uncaughtException', function (er) {
                console.error('=>>>>>>>>>>>>>>>', er.stack);
                const mailOptions = {
                    from: Config.get('mailFrom'),
                    to: Config.get('adminEmail'),
                    subject: `PRODUCTION | ERROR | ${er.message}`,
                    text: er.stack,
                };
                mailNotifier.transporter.sendMail(mailOptions, (err, info) => {
                    if (err) {
                        logger.error(`Production | UncaughtException | Mailer Failed ==>>> ${err}`);
                    }
                    logger.info(`Production | UncaughtException ==>>> ${info}`);
                    process.exit(1);
                });
            });
        }
    }
}
export default new UncaughtException();