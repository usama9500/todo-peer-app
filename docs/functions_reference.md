# Full Function Reference – ToDo App

This document captures all significant functions from the application’s `src/` folder. It includes core logic for task synchronization, pairing, and view updates.

---

## `src/view.js`

### `apply(nodes, view, host)`

Processes updates from all writers and applies them to the shared view.

**Parameters:**

* `nodes`: List of new messages (blocks) from all writers
* `view`: The local Hypercore view where the current task state is stored
* `host`: Used for side effects like adding writers

**Supported events:**

* `{ task: <text> }` → Adds new task
* `{ markDone: <index> }` → Marks task at given index as done
* `{ echo: <value> }` → Adds a debug echo
* `{ gets: [...] }` → Responds with selected past entries
* `{ add: <key> }` → Dynamically adds a new writer to Autobase

---

### `open(store)`

Initializes and returns the `view` Hypercore from the given Corestore.

**Example:**

```js
const core = store.get('view');
```

---

### `close(view)`

Closes the view Hypercore gracefully.

---

## `src/pairing.js`

### `setupPairing(store, inviteString = null)`

Handles blind pairing using `blind-pairing`. Joins or creates a shared Autobase between two peers.

* If **no invite string** is provided:

  * Generates a new invite and prints it
  * Creates Autobase and enables write access
* If **invite is provided**:

  * Decodes and connects as a candidate
  * Waits for confirmation and joins the shared base

**Returns:**

```js
{
  base,          // Autobase instance
  writable,      // true if this peer can write
  inviteString   // only defined for the inviter
}
```

---

## `src/index.js`

### `appendTask(base, text)`

Appends a new task to Autobase in JSON format.

```js
await base.append(JSON.stringify({ task: text }));
```

---

### `markTaskDone(base, index)`

Appends a `{ markDone: <index> }` event to mark a task as completed.

---

### `printTasks(view)`

Reads the view line-by-line and prints tasks to the console.

Displays:

* ✅ if task is completed
* ⬜ if task is pending

---

### `printHistory(view)`

Prints all raw entries (JSON) from the view for debugging or inspection.

---

### `exitApp(view)`

Closes the view cleanly and exits the app using `process.exit()`.

---

### `readCommand(line, base, view)`

Handles CLI input from users. Dispatches commands to appropriate handlers.

**Supported Commands:**

* `add <task>` → adds a task
* `done <index>` → marks a task done
* `list` → prints current tasks
* `history` → shows raw JSON events
* `clear` → clears screen
* `exit` → exits app