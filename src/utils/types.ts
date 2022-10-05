import { BanchoMultiplayerChannel } from "bancho.js";
import { ThreadChannel, User } from "discord.js";

export interface Lobby {
    thread: ThreadChannel,
    lobby: BanchoMultiplayerChannel,
    user: User
}