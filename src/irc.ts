import * as Bancho from "bancho.js";
import * as Discord from "discord.js"
import { Lobby } from "./utils/types";
import 'dotenv/config';

const client = new Bancho.BanchoClient({username: process.env.BANCHO_IRC_USERNAME ?? "", password: process.env.BANCHO_IRC_PASSWORD ?? "", apiKey: process.env.OSU_API_KEY ?? ""});

client.connect();

function getMapID(lobby: Bancho.BanchoMultiplayerChannel) {
    const map = lobby.lobby.beatmapId;
    if(!map) return "there's no map going on";
    return `${lobby.lobby.beatmap.artist} - ${lobby.lobby.beatmap.title} [${map}]`;
}

const linkDiscordOsu = async ({thread, lobby, user}: Lobby) => {
    thread.createMessageCollector({
        filter: msg => msg.author.id === user.id,
        dispose: true
    }).on('collect', async msg => {
        let send: boolean = true;
        if(msg.content.startsWith("!getMapId")) {
            msg.reply(getMapID(lobby));
            send = false;
        }
        if(msg.content.startsWith("!mp close")) {
            const output = Discord.cleanContent(msg.content, msg.channel)
            .replace(/<a?(:[^: \n\r\t]+:)\d+>/g, (found, text) => text);
            await lobby.sendMessage(output);
            send = false;
        }
        const output = Discord.cleanContent(msg.content, msg.channel)
            .replace(/<a?(:[^: \n\r\t]+:)\d+>/g, (found, text) => text);
        if(send) await lobby.sendMessage(`<${msg.author.username}>: ${output}`);
    })

    lobby.on('message', async msg => {
        if(msg.self) return;
        const name = msg.user.username ?? msg.user.ircUsername;
        const content = msg.message;
        const output = `\`${name}\`: ${content.replace(/[`*_<~|>]/g, found => '\\' + found)}`
            .replace(/https?:\/\/[^ \n\r\t]+/g, found => `<${found}>`);

        await thread.send({
            content: output,
            allowedMentions: { users: [], roles: [], repliedUser: false}
        });
    });
}

module.exports.mpJoin = async (msg: Discord.Message, user: Discord.User, mpName: string) => {
    const lobby = await (client.getChannel(mpName) as Bancho.BanchoMultiplayerChannel);
    await lobby.join();
    const thread = await (msg.channel as Discord.TextChannel).threads.create({
        name: `MATCH NAME: ${mpName}`,
        startMessage: msg
    });
    linkDiscordOsu({thread, lobby, user});
}

module.exports.mpMake = async (msg: Discord.Message, user: Discord.User, mpName: string) => {
    const lobby = await client.createLobby(mpName);
    const channel = (msg.channel as Discord.TextChannel)
    const thread = await channel.threads.create({
      name: `MATCH NAME: ${mpName}`,
      startMessage: msg
    });
    linkDiscordOsu({thread, lobby, user});
}