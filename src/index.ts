import * as Discord from "discord.js"
import { GatewayIntentBits } from "discord.js";
const irc = require('./irc');
import 'dotenv/config';

const client = new Discord.Client({ intents: [GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
], partials: [Discord.Partials.Channel, Discord.Partials.Message]});

client.once("ready", () => {
    console.log(client.user?.username + " is active on the net!");
})

client.on('messageCreate', async message => {
    if(!message.guild) return;
    if(message.author.bot) return;
    if(!message.content.startsWith("!")) return;
    
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

client.login(process.env.DISCORD_BOT_TOKEN);