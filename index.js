const TelegramApi = require('node-telegram-bot-api')
const { againOptions, gameOptions } = require('./options')

const token = '1844788409:AAFbDtwZ4eSEjjf0ofszAvqwne5bOpkadJc'

const bot = new TelegramApi(token, {
  polling: true
})

const chats = {}

bot.setMyCommands([
  { command: '/start', description: 'привіт' },
  { command: '/info', description: 'інформація' },
  { command: '/game', description: 'грати' }
])

const startGame = async (chatId) => {
  await bot.sendMessage(chatId, `Я придумав цифру від 0 - 9`)
  const randomNum = Math.floor(Math.random() * 10)
  chats[chatId] = randomNum
  await bot.sendMessage(chatId, 'Відгадай', gameOptions)
}

const start = () => {
  bot.on('message', async (msg) => {
    const text = msg.text
    const chatId = msg.chat.id

    if (text === '/start') {
      await bot.sendSticker(
        chatId,
        'https://tlgrm.ru/_/stickers/848/be3/848be3f5-be18-426f-8d6a-18ff7f5224cb/9.webp'
      )
      return await bot.sendMessage(chatId, 'Привіт в телеграм боті')
    }

    if (text === '/info') {
      await bot.sendSticker(
        chatId,
        'https://tlgrm.ru/_/stickers/848/be3/848be3f5-be18-426f-8d6a-18ff7f5224cb/4.webp'
      )
      return await bot.sendMessage(
        chatId,
        `Тебе звати ${msg.from.first_name} ${msg.from.last_name}`
      )
    }

    if (text === '/game') {
      return startGame(chatId)
    }

    return bot.sendMessage(chatId, 'Я тебе не розумію ')
  })
  bot.on('callback_query', async (msg) => {
    const data = msg.data
    const chatId = msg.message.chat.id

    if (data === '/again') {
      return startGame(chatId)
    }

    if (data == chats[chatId]) {
      await bot.sendSticker(
        chatId,
        'https://tlgrm.ru/_/stickers/848/be3/848be3f5-be18-426f-8d6a-18ff7f5224cb/8.webp'
      )
      return bot.sendMessage(chatId, 'Ти вгадав!', againOptions)
    } else {
      await bot.sendSticker(
        chatId,
        'https://tlgrm.ru/_/stickers/848/be3/848be3f5-be18-426f-8d6a-18ff7f5224cb/6.webp'
      )
      return bot.sendMessage(
        chatId,
        `Нєа! ${chats[chatId]}`,
        againOptions
      )
    }
  })
}

start()
