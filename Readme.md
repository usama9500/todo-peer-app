# 📝 Collaborative P2P ToDo App using Pear Runtime

This project is a fully functional peer-to-peer (P2P) ToDo list application built using the [Pear runtime](https://docs.pears.com/) and its key building blocks:
- **Autobase** for event sourcing and linearized shared state
- **Corestore** for managing append-only logs
- **Blind Pairing** for secure, invite-based peer sharing
- **Hyperswarm** for decentralized peer discovery

---

## What the App Does

- Allows two users to collaborate on a shared ToDo list in real-time.
- Tasks can be added or marked as done.
- Sharing is done securely using **blind pairing invites**—no central server required.
- Runs as a CLI app in the terminal using Node.js.

---

## Technologies Used

| Library         | Purpose                                                                 |
|----------------|-------------------------------------------------------------------------|
| `autobase`      | Sync shared updates from multiple users and order them consistently     |
| `corestore`     | Underlying log system for each peer's data                              |
| `blind-pairing` | Securely invite and connect peers over a DHT using invite codes         |
| `hyperswarm`    | Peer discovery and encrypted connection over HyperDHT                   |
| `rocksdb-native`| Persistent storage layer for logs and views                             |

---

## Project Structure

```
todo-peer-app/
├── src/
│   ├── index.js         # Main entry point: CLI interface, peer startup
│   ├── pairing.js       # Handles invite creation and blind pairing
│   └── view.js          # Defines how to apply and display ToDo tasks
├── docs/
│   └── walkthrough.md   # (merged below into this README)
├── README.md            # This file
└── package.json         # Project metadata and dependencies
```

---

## File-by-File Breakdown

### `src/index.js`

- **Handles CLI input**, initializes Autobase, and connects with peers.
- Parses command-line flags like `--invite`, `--store`, and `invite:base64`.
- Creates the view using `open()` from `view.js`.
- Accepts commands: `add`, `done`, and `list`.

### `src/pairing.js`

- **Handles blind pairing**.
- `--invite` → creates and prints a secure invite string.
- `'invite:...'` → joins a shared Autobase using that invite.
- Uses `BlindPairing` and `createInvite()` to handle key exchange securely.

### `src/view.js`

- Exports two important Autobase functions:
  - `open()` → returns a new Hypercore that holds the view.
  - `apply()` → processes events to update the view, such as:
    - `add`: creates a new task
    - `markDone`: updates a task as completed
- Ensures all peers get the same view even if tasks are added in different orders.

---

## How to Run the App

### Step 1: Install Dependencies

```bash
npm install
```

> Make sure you are using Node.js v18+ (tested on v23.6.0).

---

### Step 2: Start the First Peer (Inviter)

```bash
node src/index.js --store=store-a --invite
```

This will print:

```
📨 Share this invite:
invite:eyJ0eXBlIjoiQnVmZmVyIi...
Autobase key: f32bf...
✅ Writable
```

---

### Step 3: Start the Second Peer (Invitee)

Open a new terminal window and run:

```bash
node src/index.js --store=store-b 'invite:<paste_here>'
```

You’ll see:

```
✅ Joined shared base!
✅ Writable
```

---

### Step 4: Run Commands

Now that both peers are connected, type the following **inside the app terminal**, not in your shell:

```bash
add Buy groceries
add Read Autobase docs
list
done 0
list
```

Tasks will sync across both peers in real-time.

---

### Output Example:

```
📋 ToDo List:
0. ✅ Buy groceries
1. ⬜ Read Autobase docs
```

---

## Common Errors & Fixes

### `Error: While lock file: store-a/db/LOCK`

**Reason:** RocksDB cannot open the database because it's already locked.

**Fix:**
```bash
rm -rf store-a store-b
killall -9 node
```

Then restart both peers.

---

## How It Works Internally

### ➕ Adding a Task

```js
await base.append(JSON.stringify({ task: 'Buy milk' }))
```
Adds a new event block. Autobase reorders and syncs with other peers.

---

### Marking Done

```js
await base.append(JSON.stringify({ markDone: 0 }))
```
This updates the task at index 0 to be marked as completed.

---

### View Rebuilding

`apply()` in `view.js`:
```js
if (entry.markDone !== undefined) {
  const task = JSON.parse(await view.get(entry.markDone))
  task.done = true
  await view.append(JSON.stringify(task))
}
```
Autobase re-applies and reorders the logs when new data arrives.

---

## Packaging Notes

- Make sure `type: module` is set in `package.json` to use ESModules.
- Add a `.gitignore` to exclude `store-*` directories.

---

## Final Notes

- Built as a take-home project for Tether’s technical writing + Node.js assessment
- Fully tested and functional using real-world Pear SDK modules
- You can extend this with a browser UI or add offline sync

---

## 👤 Author

**Usama Ahmad**  
Technical Writer & Engineer  
[LinkedIn](https://www.linkedin.com/in/usama-ahmad-aa983759/) | [GitHub](https://github.com/usama9500)

