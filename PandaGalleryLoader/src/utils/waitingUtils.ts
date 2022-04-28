import { setTimeout } from 'timers/promises';
const waitForSeconds = (seconds: number) => setTimeout(1000 * seconds, `wait for ${seconds} seconds, done`);

export {waitForSeconds}