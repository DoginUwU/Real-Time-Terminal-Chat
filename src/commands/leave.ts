import { Command } from "../command";
import { Logger } from "../logger";
import { init } from "../main";

class Leave extends Command {
    public name = "leave";
    public description = "Leave the room";

    execute(): void {
        Logger.info("Leaving room...");
        init();
    }
}

export default Leave;