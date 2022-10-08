import { Command } from "../command";
import { Logger } from "../logger";
import { commander } from "../main";

class Help extends Command {
    public name = "help";
    public description = "Show all available commands"

    execute(): void {
        Logger.info("Available commands:");
        for (const command of commander.getCommands()) {
            Logger.info(`/${command.name} - ${command.description}`);
        }
    }
}

export default Help;