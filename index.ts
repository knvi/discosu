import * as Discord from "discord.js"
import { GatewayIntentBits } from "discord.js";
const irc = require('./irc');

const client = new Discord.Client({ intents: [GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
], partials: [Discord.Partials.Channel, Discord.Partials.Message]});

client.once("ready", () => {
    console.log(client.user?.username + " is online!");
})

client.on('messageCreate', async message => {
    if(!message.guild) return;
    if(!message.content.startsWith("!")) return console.log("Middle finger gif");
    
    const args = message.content.slice('!'.length).split(/ +/);
    const command = args.shift();
    
    switch(command) {
        case 'mpMake':
            if(message.channel.isThread()) return console.log("cannot send in thread");
            const mpName: string = args.join(' ');
            if(!mpName) return console.log("Missing mp name");
            await irc.mpMake(message, message.author, mpName).catch((err: any) => console.error(err));
        default: break;
    }   
})

client.login("MTAyNjgxMDI2ODYwMjM0NzY0MA.GMaosT.JYooHqDITuYswpDS5FYTmfbMgauLOEl1kMy6Mo");