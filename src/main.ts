import Discord = require('discord.js');
import {credentials} from "./credentials";
import {Channel, GuildChannel, Message} from "discord.js";
import {settings} from "./settings";
import {repository} from "./repository";

const client = new Discord.Client();
client.login(credentials.token);

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', (msg: Message) => {
    if(isHomeChannel(msg.channel)) {
        chooseAction(msg);
    }
});

function isHomeChannel(channel: Channel): boolean {
    return (channel as GuildChannel).name === settings.homeChannelName;
}

function chooseAction(msg: Message): void {
    const actionIdentifier: string = msg.content.charAt(0);

    switch(actionIdentifier) {
        case('+'):
            addWord(msg); break;
        case('-'):
            removeWord(msg); break;
        case('?'):
            lookUpWord(msg); break;
        case('!'):
            executeCommand(msg); break;
        default:
            break;
    }
}

function addWord(msg: Message): void {
    const words: string[] = findWords(msg.content.valueOf());
    const appendix: string = words.length > 1 ? ` and ${words.length-1} other words`: '';

    repository.add(words,
        (bool: boolean) => bool ?
            msg.reply(`I added "${words[0]}"${appendix}\n`)
            : msg.reply(`I couldn't add "${words[0]}"${appendix}. Sorry 😔\n`
        )
    );
}

function removeWord(msg: Message): void {

}

function lookUpWord(msg: Message): void {
    const words: string[] = findWords(msg.content.valueOf());
    repository.doWordsExist(words, (foundWords)=>msg.reply(`I've found the following words: ${foundWords}.\n`));
}

function executeCommand(msg: Message): void {

}

function findWords(text: string): string[] {
    return text.slice(1, text.length).split('\n');
}
