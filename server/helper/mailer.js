import NodeMailer from 'nodemailer';
import SMTP from 'nodemailer-smtp-transport';
import * as Path from 'path';
import Fs from 'fs';
import Config from 'config';
import {
    htmlToText,
} from 'nodemailer-html-to-text';
import {
    getRootDir,
} from './util';

const mailFrom = Config.get('mailFrom');

export class MailNotifier {
    constructor() {
        const root = getRootDir();
        this.mailFrom = Config.get('mailFrom');
        this.transporter = NodeMailer.createTransport(SMTP(Config.get('mailCredential')));
        this.transporter.use('compile', htmlToText());
        this.forgetTemplate = this.transporter.templateSender({
            subject: 'Password Reset',
            html: Fs.readFileSync(Path.normalize(`${root}/server/templates/forget.html`)).toString(),
        }, {
            from: mailFrom,
        });
    }
}

export default new MailNotifier();
