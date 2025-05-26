import Hyperswarm from 'hyperswarm'
import BlindPairing from 'blind-pairing'
import { createInvite } from 'blind-pairing-core'

export async function setupPairing (store) {
  const core = store.get({ name: 'main' })
  await core.ready()
  const key = core.key

  const { invite, publicKey, discoveryKey } = createInvite(key)
  const isInviter = process.argv.includes('--invite')
  const swarm = new Hyperswarm()

  if (isInviter) {
    const base64Invite = Buffer.from(JSON.stringify(invite)).toString('base64')
    console.log('📨 Share this base64 invite:')
    console.log('invite:' + base64Invite)

    const a = new BlindPairing(swarm)
    const m = a.addMember({
      discoveryKey,
      async onadd (candidate) {
        candidate.open(publicKey)
        candidate.confirm({ key })
      }
    })
    await m.flushed()
  } else {
    const raw = process.argv.find(arg => arg.startsWith('invite:'))
    const base64 = raw.replace('invite:', '')
    const jsonStr = Buffer.from(base64, 'base64').toString()
    const parsed = JSON.parse(jsonStr)
    const invite = Buffer.from(parsed.data)

    const userData = Buffer.from('User B')

    const b = new BlindPairing(swarm)
    const c = b.addCandidate({
      invite,
      userData,
      async onadd (result) {
        console.log('✅ Joined shared base!')
      }
    })
    await c.pairing
  }

  return { key, isInviter }
}
