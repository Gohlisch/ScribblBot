import Discord = require('discord.js');
import {credentials} from "./credentials";
import {Channel, GuildChannel, Message} from "discord.js";
import {settings} from "./settings";
import {repository} from "./repository";
import {HELP_MESSAGE} from "./consts";

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
    const appendix: string = words.length > 1 ? ` and ${words.length-1} other word(s)`: '';

    repository.add(words,
        (bool: boolean) => bool ?
            msg.reply(`I added "${words[0]}"${appendix}\n`)
            : msg.reply(`I couldn't add "${words[0]}"${appendix}. Sorry 😔\n`
        )
    );
}

function removeWord(msg: Message): void {
    const words: string[] = findWords(msg.content.valueOf());
    const appendix: string = words.length > 1 ? ` and ${words.length-1} other word(s)`: '';

    repository.remove(words, (bool: boolean) => bool ?
        msg.reply(`I removed "${words[0]}"${appendix}\n`)
        : msg.reply(`I couldn't remove "${words[0]}"${appendix}. Sorry 😔\n`
        ))
}

function lookUpWord(msg: Message): void {
    const words: string[] = findWords(msg.content.valueOf());
    repository.select(words, (foundWords)=>msg.reply(`I've found the following words: ${foundWords}.\n`));
}

function executeCommand(msg: Message): void {
    const words: string[] = findWords(msg.content.valueOf());

    switch(words[0].trim()) {
        case("show"):
            showWords(msg); break;
        case("list"):
            listWords(msg); break;
        default:
            msg.reply(HELP_MESSAGE);
            break;
    }
}

function showWords(msg: Message) {
    repository.selectAll((words) => {
        let listedWords: string = '';

        words.forEach(word => listedWords = `${listedWords}${word}, `);

        msg.reply(listedWords.slice(0, listedWords.length - 2));
    });
}

function listWords(msg: Message) {
    repository.selectAll((words) => {
        let listedWords: string = '';

        words.forEach(word => listedWords = `${listedWords}\n${word}`);

        msg.reply(listedWords);
    });
}

function findWords(text: string): string[] {
    return text.slice(1, text.length).split('\n');
}
