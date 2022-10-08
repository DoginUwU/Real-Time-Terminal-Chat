import fs from 'node:fs';
import path from 'node:path';
import { Logger } from './logger';

abstract class Command {
    public abstract name: string;
    public abstract description: string;

    public abstract execute(args?: string[]): void;
}

class Commander {
    private commands: Command[] = [];

    constructor() {
        this.fetchCommands();
    }

    public addCommand(command: Command) {
        this.commands.push(command);
    }

    public getCommands(): Command[] {
        return this.commands;
    }

    public getCommand(name: string): Command | undefined {
        return this.commands.find(command => command.name === name);
    }

    public executeCommand(name: string, args: string[]) {
        name = name.toLowerCase().replace('/', '');
        const command = this.getCommand(name);

        if (!command) {
            Logger.error(`Command ${name} not found!`);
            return;
        }

        command.execute(args);
    }

    public fetchCommands() {
        const files = fs.readdirSync(path.join(__dirname, 'commands'));

        for (const file of files) {
            const command = require(`./commands/${file}`).default;
            this.addCommand(new command());
        }
    }
}

export { Command, Commander };