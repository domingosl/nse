const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TELEGRAM_BOT_TOKEN;

let bot;

module.exports.listen = () => {

    bot = new TelegramBot(token, {polling: true});

    bot.on('message', (msg) => {

        if(!msg.text || !/^\/start/.test(msg.text))
            return;

        bot.sendMessage(msg.chat.id,"Hello!, use this code in your NSE node to finalize the configuration: " + msg.chat.id);

    });

}

module.exports.sendMessage = (chatId, msg) => {

    if(!bot)
        return;

    bot.sendMessage(chatId, msg);
}

//https://t.me/NearSmartEventsBot?start=P1UyytRFK1jK