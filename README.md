Binance Smart Chain Wallet Management Program 🚀

This program allows you to generate, manage, and interact with Binance Smart Chain (BSC) wallets 🪙💰. You can generate a new wallet 🆕, check your balance 💸, send BNB 💸, and receive BNB 📥.

Requirements 📋
🟢 Node.js
🟢 Web3.js

Installation 🛠️
1️⃣ Clone or download the repository.
2️⃣ Install dependencies by running npm install.
3️⃣ Create a new file named wallet.json.
4️⃣ Run the program using node index.js.

Usage 📝
The program accepts the following commands:

🔹 gen: Generate a new BSC wallet. Pass in the name of the wallet as an argument.
Copy code
node index.js gen mywallet

🔹 send: Send BNB from one wallet to another. Pass in the name of the sender wallet, the recipient address, and the amount of BNB to send as arguments.
Copy code
node index.js send mywallet 0x1234567890123456789012345678901234567890 1

🔹 rec: Receive BNB by displaying the wallet address of the specified wallet name. Pass in the name of the wallet as an argument.
Copy code
node index.js rec mywallet

🔹 bal: Check the BNB balance of a wallet. Pass in the name of the wallet as an argument.
Copy code
node index.js bal mywallet
