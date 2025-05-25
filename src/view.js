export function open(store) {
  return store.get('todo-view')
}

export async function apply(nodes, view, host) {
  for (const { value } of nodes) {
    const entry = JSON.parse(value)
    if (entry.markDone !== undefined) {
      const idx = entry.markDone
      if (idx < view.length) {
        const task = JSON.parse(await view.get(idx))
        task.done = true
        await view.append(JSON.stringify(task))
      }
    } else {
      await view.append(JSON.stringify(entry))
    }
  }
}
