"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Bancho = __importStar(require("bancho.js"));
const Discord = __importStar(require("discord.js"));
const client = new Bancho.BanchoClient({ username: 'Rotherex', password: '5ea97054', apiKey: "175fafdafc6f87d1cb779ece02ef04bbc35d3313" });
client.connect();
const linkDiscordOsu = (thread, lobby, user) => __awaiter(void 0, void 0, void 0, function* () {
    thread.createMessageCollector({
        filter: msg => msg.author.id === user.id,
        dispose: true
    }).on('collect', (msg) => __awaiter(void 0, void 0, void 0, function* () {
        const output = Discord.cleanContent(msg.content, msg.channel)
            .replace(/<a?(:[^: \n\r\t]+:)\d+>/g, (found, text) => text);
        yield lobby.sendMessage(output);
    }));
    lobby.on('message', (msg) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (msg.self)
            return;
        const name = (_a = msg.user.username) !== null && _a !== void 0 ? _a : msg.user.ircUsername;
        const content = msg.message;
        const output = `\`${name}\`: ${content.replace(/[`*_<~|>]/g, found => '\\' + found)}`
            .replace(/https?:\/\/[^ \n\r\t]+/g, found => `<${found}>`);
        if (content === "!mp close")
            thread.setArchived(true, "match closed");
        yield thread.send({
            content: output,
            allowedMentions: { users: [], roles: [], repliedUser: false }
        });
    }));
});
module.exports.mpMake = (msg, user, mpName) => __awaiter(void 0, void 0, void 0, function* () {
    const mpLobby = yield client.createLobby(mpName);
    const channel = msg.channel;
    const thread = yield channel.threads.create({
        name: `MATCH: ${mpLobby}`,
        startMessage: msg
    });
    linkDiscordOsu(thread, mpLobby, user);
});
