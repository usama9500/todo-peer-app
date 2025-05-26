import Corestore from 'corestore'
import Autobase from 'autobase'
import { open, apply } from './view.js'
import { setupPairing } from './pairing.js'

const storeName = process.argv.find(a => a.startsWith('--store='))?.split('=')[1] || 'store'
const store = new Corestore(`./${storeName}`)
await store.ready()

const { key } = await setupPairing(store)

const base = new Autobase(store.namespace(key), null, { open, apply })
await base.ready()

console.log('Autobase key:', base.key.toString('hex'))

if (!base.writable) {
  base.once('writable', () => console.log('✅ Writable'))
} else {
  console.log('✅ Writable')
}

// CLI interaction
process.stdin.on('data', async (input) => {
  const cmd = input.toString().trim()

  if (cmd.startsWith('add ')) {
    const task = cmd.slice(4)
    await base.append(JSON.stringify({ task, done: false }))
  } else if (cmd.startsWith('done ')) {
    const index = parseInt(cmd.slice(5))
    await base.append(JSON.stringify({ markDone: index }))
  } else if (cmd === 'list') {
    console.log('\n📋 ToDo List:')
    for (let i = 0; i < base.view.length; i++) {
      const item = JSON.parse(await base.view.get(i))
      console.log(i, item.done ? '✅' : '⬜', item.task || '')
    }
  }
})
