import { signInAnonymously, UserCredential } from 'firebase/auth';
import { createInterface } from 'node:readline/promises'
import { Chat } from './chat';
import { Commander } from './command';
import { stringTypeValidator } from './helpers/stringTypeValidator';
import { Logger } from './logger';
import { auth } from './services/firebase';

const input = createInterface({
    input: process.stdin,
    output: process.stdout,
});

const commander = new Commander();
let chat: Chat | null = null;
let userCredentials: UserCredential | null = null;

const init = async () => {
    console.clear();

    userCredentials = await signInAnonymously(auth);
    Logger.success('Connection created!\n\n');
    
    const inputNick = await input.question('What is your nick? ');
    const nick = stringTypeValidator(inputNick, 'nick');

    const inputRoomId = await input.question('What is the room ID? ');
    const roomId = stringTypeValidator(inputRoomId, 'room ID');

    chat = new Chat(nick);

    if (await Chat.checkRoomId(roomId)) {
        chat.joinRoom(roomId);
    } else {
        const answer = await input.question('Room not found, Do you want to create a new room? (y/n) ');
        if (answer.toLowerCase() !== 'y') process.exit(0);

        chat.createRoom(roomId);
    }
}

init();

export { init, input, commander, chat, userCredentials };