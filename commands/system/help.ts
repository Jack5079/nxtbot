import { Message, MessageOptions } from 'discord.js'
import { Bot } from '../../utils/types'
import prefixes from '../../utils/prefixes'
import random from '../../utils/random'

function chunk (array: any[], size: number = 1): Array<any> {
  let chunk: any[] = []
  return array.reduce((acc, curr, idx, arr) => {
    chunk.push(curr)
    if (chunk.length === size) {
      acc.push(chunk)
      chunk = []
    }
    if (chunk.length > 0 && idx === arr.length - 1) {
      acc.push(chunk)
    }
    return acc
  }, [])
}
export function run (this: Bot, message: Message, args: string[]): MessageOptions {
  const page = parseInt(args.join('')) || 1
  const commands = Array.from(
    this.commands.entries(),
    ([name, { desc, aliases }]) => [name + ((aliases && aliases.length) ? ` (Aliases: ${aliases?.join(', ')})` : ''), desc || '']
  )
    .sort((a, b) => {
      return a[0].localeCompare(b[0] || '') || -1
    })
  const pages = chunk(commands, 20)
  const prefix = prefixes[message?.guild?.id || ''] || '-'
  return pages[page - 1] ? {
    embed: {
      title: `${this.user?.username || ''} Commands`,
      description: pages[page - 1].map(([name, description]: [string, string]) => `${prefix}**${name}** - ${description}`).join('\n'),
      footer: {
        iconURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/VisualEditor_-_Icon_-_Book.svg/600px-VisualEditor_-_Icon_-_Book.svg.png',
        text: `${page}/${pages.length}`
      },
      fields: [{
        name: 'Tip',
        value: random([
          'Report bugs and feature requests at ' + require('../../package.json').bugs,
          'This bot was created by ' + this.users.cache.get(process.env.OWNER || '')?.tag || 'someone'
        ])
      }]
    }
  } : {
      embed: {
        title: `${this.user?.username || ''} Commands`,
        description: 'That page does not exist.'
      }
    }
}

export const desc = 'Shows a list of all the commands and their descriptions.'
