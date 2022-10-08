import { Command } from "../command";
import { Logger } from "../logger";
import { chat } from "../main";

class Members extends Command {
    public name = "members";
    public description = "Show all members online in the room";

    execute(): void {
        Logger.info(`Members online (${chat.members.length}): ${chat.members.join(', ')}`);
    }
}

export default Members;