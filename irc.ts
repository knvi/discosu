import * as Bancho from "bancho.js";
import * as Discord from "discord.js"

const client = new Bancho.BanchoClient({username: 'Rotherex', password: '5ea97054', apiKey: "175fafdafc6f87d1cb779ece02ef04bbc35d3313"});

client.connect();

const linkDiscordOsu = async (thread: Discord.ThreadChannel, lobby: Bancho.BanchoMultiplayerChannel, user: Discord.User) => {
    thread.createMessageCollector({
        filter: msg => msg.author.id === user.id,
        dispose: true
    }).on('collect', async msg => {
        const output = Discord.cleanContent(msg.content, msg.channel)
            .replace(/<a?(:[^: \n\r\t]+:)\d+>/g, (found, text) => text);
        await lobby.sendMessage(output);
    })

    lobby.on('message', async msg => {
        if(msg.self) return;
        const name = msg.user.username ?? msg.user.ircUsername;
        const content = msg.message;
        const output = `\`${name}\`: ${content.replace(/[`*_<~|>]/g, found => '\\' + found)}`
            .replace(/https?:\/\/[^ \n\r\t]+/g, found => `<${found}>`);

        if(content === "!mp close") thread.setArchived(true, "match closed");
        await thread.send({
            content: output,
            allowedMentions: { users: [], roles: [], repliedUser: false}
        });
    });
}

module.exports.mpMake = async (msg: Discord.Message, user: Discord.User, mpName: string) => {
    const mpLobby = await client.createLobby(mpName);
    const channel = (msg.channel as Discord.TextChannel)
    const thread = await channel.threads.create({
      name: `MATCH: ${mpLobby}`,
      startMessage: msg
    });
    linkDiscordOsu(thread, mpLobby, user);
}