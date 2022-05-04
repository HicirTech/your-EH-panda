import * as fs from 'fs';
import path = require('path');
import * as  util from "util"

const log_file = fs.createWriteStream(path.join(process.cwd(), 'debug.log'), { flags: 'a+' });
const log_stdout = process.stdout;

/**
 * file logging utils
 * @param msg message to log
 */
const log = (msg) => {
    log_file.write(util.format(msg) + '\n');
    log_stdout.write(util.format(msg) + '\n');
};

export { log }