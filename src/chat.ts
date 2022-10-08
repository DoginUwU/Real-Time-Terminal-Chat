import { get, ref, set, update, push, onDisconnect, onValue } from "firebase/database";
import _ from "lodash";
import { IMessage } from "./@types/message";
import { Logger } from "./logger";
import { commander, input, userCredentials } from "./main";
import { database } from "./services/firebase";


class Chat {
    public roomId: string | null;
    public members: string[] = [];
    public messages: IMessage[] = [];

    constructor(private userName: string) {
        console.clear();
    }

    public static async checkRoomId(roomId: string): Promise<boolean> { 
        const roomRef = ref(database, `rooms/${roomId}`);

        const roomDatabase = await get(roomRef);

        return roomDatabase.exists();
    }

    public joinRoom(roomId: string) {
        console.clear();
        this.roomId = roomId;
        Logger.info(`Trying to join room ${roomId}...`);

        this.initializeRoom();
    }

    public async createRoom(roomId: string) {
        console.clear();
        this.roomId = roomId;
        Logger.info(`Trying to create room ${roomId}...`);

        const roomRef = ref(database, `rooms/${roomId}`);
        
        await set(roomRef, {
            name: roomId,
            owner: userCredentials.user.uid,
            members: [this.userName],
        });
        
        Logger.success(`Room ${this.roomId} created!\n\n`);

        this.initializeRoom();
    }

    public async initializeRoom() {
        const roomRef = ref(database, `rooms/${this.roomId}`);

        const roomDatabase = await get(roomRef);
        
        const room = roomDatabase.val();

        this.members = _.get(room, 'members', []);

        Logger.success(`Welcome to the room ${this.roomId}, ${this.userName}!`);
        Logger.info(`This room has ${this.members.length} members now! Use /members to see all members.`);
        Logger.info('Type /help to see the available commands.\n\n');

        this.listenerConsole();

        await update(roomRef, {
            members: [...this.members, this.userName],
        });

        onValue(roomRef, (snapshot) => { 
            const room = snapshot.val();
            const oldMembers = _.cloneDeep(this.members);

            this.members = _.get(room, 'members', []);

            const newMembers = _.filter(_.difference(this.members, oldMembers), (member) => member !== this.userName);

            if (newMembers.length > 0) {
                Logger.info(`New members: ${newMembers.join(', ')}`);
            }

            const newMessages = _.keys(_.get(room, 'messages', [])).map((key) => {
                return {
                    ...room.messages[key],
                    id: key
                }
            });

            const finalMessages = _.filter(newMessages, (message) => !_.includes(_.map(this.messages, 'id'), message.id));

            finalMessages.forEach((message) => {
                this.addMessage(message.user, message.message);
            });

            this.messages = [...this.messages, ...finalMessages];
        });

        onDisconnect(roomRef).update({
            members: this.members.filter(member => member !== this.userName),
        })
    }
    
    public listenerConsole() {
        input.addListener('line', (line: string) => {
            if (line.startsWith('/')) { 
                const [command, ...args] = line.split(' ');
                commander.executeCommand(command, args);

                return;
            }

            this.sendMessage(line);
        });
    }

    public async sendMessage(message: string) {
        const messageRef = ref(database, `rooms/${this.roomId}/messages`);

        await push(messageRef, {
            user: this.userName,
            message,
        });
    }

    public addMessage(userName: string, message: string) {
        if(userName === this.userName) {
            Logger.success(`${userName}: ${message}`);

            return;
        }

        Logger.message(`${userName}: ${message}`);
    }
}

export { Chat };