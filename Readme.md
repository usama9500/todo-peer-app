# P2P Collaborative ToDo App

![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?logo=node.js)
![Autobase](https://img.shields.io/badge/Autobase-Holepunch-blue)
![Blind%20Pairing](https://img.shields.io/badge/Blind%20Pairing-P2P%20Security-orange)
![Pear%20Runtime](https://img.shields.io/badge/Pear%20Runtime-Decentralized-lightgrey)

A minimal **peer-to-peer ToDo list** app built with [Autobase](https://github.com/holepunchto/autobase), [Blind Pairing](https://github.com/holepunchto/blind-pairing), and [Corestore](https://github.com/holepunchto/corestore), running on the [Pear Runtime](https://docs.pears.com/).

This application allows **two users to collaborate** on a task list in real time — without any server — by pairing over a decentralized P2P network using secure invites.

---

## Features

* Create and share a ToDo list across peers
* Real-time syncing using Autobase view
* Mark tasks as done (replicated across peers)
* Secure pairing with invite-based blind connection
* CLI-based task management

---

## Setting Up

To set up the project manually:

1. Create a new project folder:

   ```bash
   mkdir todo-peer-app && cd todo-peer-app
   ```

2. Initialize a Node.js project:

   ```bash
   npm init -y
   ```

3. Install required packages:

   ```bash
   npm install autobase corestore hyperswarm blind-pairing readline b4a
   ```

4. **Add Source Files in `src/`**

Create the folder and files:

```bash
mkdir src
touch src/index.js src/pairing.js src/view.js
```

* `index.js`: CLI entry point that handles commands like `add`, `done`, `list`, etc., and interacts with Autobase.
* `pairing.js`: Handles blind pairing logic. Generates invites (`--invite`) or joins via provided invite string.
* `view.js`: Manages the Autobase view using event sourcing (`task`, `markDone`). Defines `apply()`, `open()`, and `close()` functions.

> These files define the app’s logic for pairing, syncing tasks, and CLI interaction. You'll find detailed examples in the `docs/` folder or the repo reference.

---

## Running the App

Open two terminals.

### Terminal 1 (Inviter)

```bash
node src/index.js --store=store-a --invite
```

* Generates and prints a pairing invite
* Starts a shared Autobase
* Allows writing tasks to the shared log

---

### Terminal 2 (Invitee)

Use the invite printed above:

```bash
node src/index.js --store=store-b 'invite:BASE64_STRING_HERE'
```

* Connects securely to the inviter
* Syncs and participates in the shared ToDo list

---

## CLI Commands (Inside App Prompt)

| Command        | Description                          |
| -------------- | ------------------------------------ |
| `add <task>`   | Adds a new task                      |
| `done <index>` | Marks the task at that index as done |
| `list`         | Displays current ToDo list           |
| `history`      | Shows raw log entries (JSON)         |
| `clear`        | Clears the terminal                  |
| `exit`         | Exits the application                |

---

## Folder Structure

```
todo-peer-app/
├── src/
│   ├── index.js         # CLI command interface
│   ├── pairing.js       # Blind pairing logic
│   ├── view.js          # Autobase view & apply logic
├── docs/                # Documentation files
├── package.json         # Dependencies and metadata
└── README.md            # Project overview
```

---

## Documentation
* `docs/walkthrough.md` – Step by step walkthrough
* `docs/architecture.md` – System architecture
* `docs/functions_refenrence.md` – Function descriptions

---

## 🧪 Sample Interaction

```
📝 > add Clean the room
📝 > done 0
📝 > list

📋 ToDo List:
0. ✅ Clean the room
```

---

## Built With

* [Node.js](https://nodejs.org)
* [Autobase](https://github.com/holepunchto/autobase)
* [Blind Pairing](https://github.com/holepunchto/blind-pairing)
* [Corestore](https://github.com/holepunchto/corestore)
* [Hyperswarm](https://github.com/holepunchto/hyperswarm)
* [Pear Runtime](https://docs.pears.com/)
