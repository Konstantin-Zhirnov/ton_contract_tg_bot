import { Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'
import { beginCell, toNano } from 'ton-core'
import dotenv from 'dotenv'
import qs from 'qs'

dotenv.config()

const bot = new Telegraf(process.env.TG_BOT_TOKEN!)

bot.start((ctx) =>
  ctx.reply('Welcome to our Dapp!', {
    reply_markup: {
      keyboard: [['Increment by 1'], ['Deposit of 2 TON'], ['Withdrawal 1 TON']],
    },
  }),
)

bot.on(message('web_app_data'), (ctx) => ctx.reply('Great!'))

bot.hears('Increment by 1', (ctx) => {
  const msg_body = beginCell().storeUint(1, 32).storeUint(1, 32).endCell()

  let link = `https://test.tonhub.com/transfer/${process.env.SC_ADDRESS}?${qs.stringify({
    text: 'Increment counter by 1',
    amount: toNano('0.05').toString(10),
    bin: msg_body.toBoc({ idx: false }).toString('base64'),
  })}`

  ctx.reply('To increment counter by 1, please sing a transaction:', {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Sign transaction',
            url: link,
          },
        ],
      ],
    },
  })
})

bot.hears('Deposit of 2 TON', (ctx) => {
  const msg_body = beginCell().storeUint(2, 32).endCell()

  let link = `https://test.tonhub.com/transfer/${process.env.SC_ADDRESS}?${qs.stringify({
    text: 'Deposit of 2 TON',
    amount: toNano('2').toString(10),
    bin: msg_body.toBoc({ idx: false }).toString('base64'),
  })}`

  ctx.reply('To deposit 2 TON, please sing a transaction:', {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Sign transaction',
            url: link,
          },
        ],
      ],
    },
  })
})

bot.hears('Withdrawal 1 TON', (ctx) => {
  const msg_body = beginCell().storeUint(3, 32).storeCoins(toNano('1')).endCell()

  let link = `https://test.tonhub.com/transfer/${process.env.SC_ADDRESS}?${qs.stringify({
    text: 'Withdrawal 1 TON',
    amount: toNano('0.05').toString(10),
    bin: msg_body.toBoc({ idx: false }).toString('base64'),
  })}`

  ctx.reply('To withdrawal 1 TON, please sing a transaction:', {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Sign transaction',
            url: link,
          },
        ],
      ],
    },
  })
})

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
