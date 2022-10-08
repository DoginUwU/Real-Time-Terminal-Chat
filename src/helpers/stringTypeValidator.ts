import { Logger } from "../logger";

const stringTypeValidator = (value: string, type: string): string => {
    value = value.trim().replace(/[^\w\s]/gi, '');

    if (!value.length) {
        Logger.error(`You must enter a valid ${type}!`);
        process.exit(0);
    }

    return value;
}

export { stringTypeValidator };