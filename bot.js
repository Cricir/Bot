/**
* @file
* Este módulo implementa un bot de Telegram que puede interactuar con los usuarios de varias maneras.
* El bot puede responder a comandos específicos como '/start', '/clima', '/guardar' y '/recuperar'.
* También puede manejar la recepción de imágenes.
*
* @requires node-telegram-bot-api
* @requires axios
* @requires nedb
*/

/**
* @description Módulo para interactuar con la API de Telegram.
*/
const TelegramBot = require('node-telegram-bot-api');

/**
* @description Módulo para interactuar con la base de datos SQLite.
*/
const sqlite3 = require('sqlite3');

// Sustituye 'TOKEN' por el token que obtuviste de BotFather
const token = '6576605066:AAHBeNphptyNUC__QYPwYqsVxOAMUGMnvqg';

// Crea un nuevo bot
const bot = new TelegramBot(token, { polling: true });

/**
* Responde al comando '/start' con un mensaje de bienvenida y un teclado personalizado.
* @param {Object} msg - El objeto de mensaje recibido.
*/
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const options = {
        reply_markup: {
            keyboard: [
                ['🌤️ Clima', '💾 Guardar'],
                ['🔄 Recuperar']
            ],
            resize_keyboard: true,
            one_time_keyboard: true
        }
    };
    bot.sendMessage(chatId, 'Hola, soy un bot de Telegram!', options);
});

/**
* Maneja el evento de recepción de imágenes.
* @param {Object} msg - El objeto de mensaje recibido.
*/
bot.on('photo', (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, '¡Bonita imagen!');
});

const axios = require('axios');

const api_key = 'ab926ae7c724437426c28dbf2bf11078';

/**
* Maneja el comando '/clima' para obtener el clima de una ciudad.
* @param {Object} msg - El objeto de mensaje recibido.
* @param {Array} match - Los resultados de la coincidencia de la expresión regular.
*/
bot.onText(/\/clima (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const ciudad = match[1];

    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${api_key}`);
        const clima = response.data;
        bot.sendMessage(chatId, `El clima actual en ${ciudad} es: ${clima.weather[0].description}`);
    } catch (error) {
        console.error('Error al obtener el clima:', error);
        bot.sendMessage(chatId, 'Lo siento, no pude obtener el clima en este momento.');
    }
});

/**
* Explica cómo utilizar el comando '/clima'.
* @param {Object} msg - El objeto de mensaje recibido.
*/
bot.onText(/\/clima/, (msg) => {
    const chatId = msg.chat.id;
    const message = `
Para obtener el clima de una ciudad, simplemente escribe /clima seguido del nombre de la ciudad.

Por ejemplo:
/clima Nueva York
/clima Madrid
/clima Londres

¡Espero que esta información te sea útil!
`;
    bot.sendMessage(chatId, message);
});

const Datastore = require('nedb');

/**
* @description Base de datos para almacenar datos.
*/
const db = new Datastore({ filename: 'BaseDatos.db', autoload: true });

/**
* Maneja el comando '/guardar' para almacenar datos en la base de datos.
* @param {Object} msg - El objeto de mensaje recibido.
* @param {Array} match - Los resultados de la coincidencia de la expresión regular.
*/
bot.onText(/\/guardar (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const data = match[1];

    // Guardar datos en la base de datos
    db.insert({ chatId, data }, (err, newDoc) => {
        if (err) {
            console.error('Error al guardar datos:', err);
            bot.sendMessage(chatId, 'Error al guardar datos.');
        } else {
            bot.sendMessage(chatId, 'Datos guardados correctamente.');
        }
    });
});

/**
* Explica cómo utilizar el comando '/clima'.
* @param {Object} msg - El objeto de mensaje recibido.
*/

bot.onText(/\/guardar/, (msg) => {
    const chatId = msg.chat.id;
    const message = `
Para guardar un mensaje en la db, simplemente escribe /mensaje seguido del nombre de la ciudad.

Por ejemplo:
/guardar comino
/guardar Pan
/guardar queso

¡Espero que esta información te sea útil!
`;
    bot.sendMessage(chatId, message);
});

/**
* Maneja el comando '/recuperar' para recuperar datos de la base de datos.
* @param {Object} msg - El objeto de mensaje recibido.
*/
bot.onText(/\/recuperar/, (msg) => {
    const chatId = msg.chat.id;

    // Recuperar datos de la base de datos
    db.find({ chatId }, (err, docs) => {
        if (err) {
            console.error('Error al recuperar datos:', err);
            bot.sendMessage(chatId, 'Error al recuperar datos.');
        } else {
            const data = docs.length > 0 ? docs[0].data : 'No hay datos guardados.';
            bot.sendMessage(chatId, 'Los datos son: ' + data);
        }
    });
});