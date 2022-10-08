const COLORS = (output: string) => ({
    red: `\x1b[31m${output}\x1b[0m`,
    green: `\x1b[32m${output}\x1b[0m`,
    cyan: `\x1b[36m${output}\x1b[0m`,
});

class Logger {
    static log(message: string): string { 
        return `[${new Date().toLocaleTimeString()}] ${message}`;
    }

    static error(message: string) {
        process.stdout.write(`${COLORS(this.log(message)).red}\n`);
    }
    static success(message: string) {
        process.stdout.write(`${COLORS(this.log(message)).green}\n`);
    }
    static info(message: string) {
        process.stdout.write(`${COLORS(this.log(message)).cyan}\n`);
    }

    static message(message: string) {
        process.stdout.write(`${this.log(message)}\n`);
    }
}

export { Logger, COLORS };