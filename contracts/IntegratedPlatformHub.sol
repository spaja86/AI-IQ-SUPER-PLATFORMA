// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract IntegratedPlatformHub {
    struct Account {
        bool exists;
        uint256 balance;
        string currency;
    }

    struct Wallet {
        bool exists;
        bytes32 cryptoKey;
        uint256 balance;
    }

    struct TransactionRecord {
        bool exists;
        address from;
        address to;
        uint256 amount;
        bool verified;
        uint256 createdAt;
    }

    mapping(address => Account) public bankAccounts;
    mapping(address => mapping(bytes32 => Wallet)) private wallets;
    mapping(bytes32 => TransactionRecord) public transactions;
    uint256 public txNonce;

    event AccountCreated(address indexed user, uint256 balance);
    event WalletCreated(address indexed user, string crypto);
    event TransactionCompleted(address indexed from, address indexed to, uint256 amount);
    event TradeExecuted(address indexed user, string fromCurrency, string toCurrency, uint256 amount);

    function createBankAccount() external {
        require(!bankAccounts[msg.sender].exists, "Account already exists");
        bankAccounts[msg.sender] = Account({ exists: true, balance: 0, currency: "USD" });
        emit AccountCreated(msg.sender, 0);
    }

    function createWallet(string memory crypto) external {
        bytes32 key = keccak256(bytes(crypto));
        require(!wallets[msg.sender][key].exists, "Wallet already exists");
        wallets[msg.sender][key] = Wallet({ exists: true, cryptoKey: key, balance: 0 });
        emit WalletCreated(msg.sender, crypto);
    }

    function transferFunds(address to, uint256 amount) external {
        require(bankAccounts[msg.sender].exists, "Sender account missing");
        require(bankAccounts[to].exists, "Receiver account missing");
        require(bankAccounts[msg.sender].balance >= amount, "Insufficient funds");

        bankAccounts[msg.sender].balance -= amount;
        bankAccounts[to].balance += amount;

        txNonce += 1;
        bytes32 txHash = keccak256(abi.encodePacked(txNonce, block.timestamp, msg.sender, to, amount));
        transactions[txHash] = TransactionRecord({
            exists: true,
            from: msg.sender,
            to: to,
            amount: amount,
            verified: true,
            createdAt: block.timestamp
        });

        emit TransactionCompleted(msg.sender, to, amount);
    }

    function executeTrade(string memory fromCurrency, string memory toCurrency, uint256 amount) external {
        emit TradeExecuted(msg.sender, fromCurrency, toCurrency, amount);
    }

    function verifyTransaction(bytes32 txHash) external view returns (bool) {
        return transactions[txHash].verified;
    }

    function getWallet(address user, string memory crypto) external view returns (bool exists, uint256 balance) {
        bytes32 key = keccak256(bytes(crypto));
        Wallet memory wallet = wallets[user][key];
        return (wallet.exists, wallet.balance);
    }
}
