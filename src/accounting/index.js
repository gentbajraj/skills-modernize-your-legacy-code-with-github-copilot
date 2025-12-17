/**
 * Account Management System - Node.js Implementation
 * Modernized from legacy COBOL application
 * 
 * This application maintains the original business logic:
 * - Initial balance: $1,000.00
 * - View Balance operation
 * - Credit Account operation (deposits)
 * - Debit Account operation (withdrawals with insufficient funds check)
 * - Session-based in-memory data persistence
 */

const readline = require('readline');

// Data Layer - Equivalent to DataProgram (data.cob)
class DataProgram {
    constructor() {
        // Initial balance set to $1,000.00 as per COBOL STORAGE-BALANCE
        this.storageBalance = 1000.00;
    }

    /**
     * Read operation - Returns current balance
     * @returns {number} Current account balance
     */
    read() {
        return this.storageBalance;
    }

    /**
     * Write operation - Updates stored balance
     * @param {number} balance - New balance to store
     */
    write(balance) {
        this.storageBalance = balance;
    }
}

// Business Logic Layer - Equivalent to Operations (operations.cob)
class Operations {
    constructor(dataProgram, rl) {
        this.dataProgram = dataProgram;
        this.rl = rl;
    }

    /**
     * View Balance operation - Displays current balance
     */
    async viewBalance() {
        const balance = this.dataProgram.read();
        console.log(`Current balance: ${balance.toFixed(2)}`);
    }

    /**
     * Credit Account operation - Adds funds to account
     */
    async creditAccount() {
        const amount = await this.promptForAmount('Enter credit amount: ');
        
        if (amount === null) {
            return;
        }

        const currentBalance = this.dataProgram.read();
        const newBalance = currentBalance + amount;
        
        // Check for maximum balance limit (999,999.99)
        if (newBalance > 999999.99) {
            console.log('Transaction would exceed maximum balance limit of $999,999.99');
            return;
        }

        this.dataProgram.write(newBalance);
        console.log(`Amount credited. New balance: ${newBalance.toFixed(2)}`);
    }

    /**
     * Debit Account operation - Withdraws funds from account
     * Includes insufficient funds validation as per COBOL business rules
     */
    async debitAccount() {
        const amount = await this.promptForAmount('Enter debit amount: ');
        
        if (amount === null) {
            return;
        }

        const currentBalance = this.dataProgram.read();
        
        // Business Rule: Validate sufficient funds before processing
        if (currentBalance >= amount) {
            const newBalance = currentBalance - amount;
            this.dataProgram.write(newBalance);
            console.log(`Amount debited. New balance: ${newBalance.toFixed(2)}`);
        } else {
            console.log('Insufficient funds for this debit.');
        }
    }

    /**
     * Prompts user for transaction amount with validation
     * @param {string} prompt - Prompt message to display
     * @returns {Promise<number|null>} Amount or null if invalid
     */
    async promptForAmount(prompt) {
        const input = await this.question(prompt);
        const amount = parseFloat(input);

        if (isNaN(amount) || amount <= 0) {
            console.log('Invalid amount. Please enter a positive number.');
            return null;
        }

        if (amount > 999999.99) {
            console.log('Amount exceeds maximum transaction limit of $999,999.99');
            return null;
        }

        return amount;
    }

    /**
     * Wrapper for readline question as Promise
     * @param {string} query - Question to ask
     * @returns {Promise<string>} User input
     */
    question(query) {
        return new Promise((resolve) => {
            this.rl.question(query, resolve);
        });
    }
}

// Main Program - Equivalent to MainProgram (main.cob)
class MainProgram {
    constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        this.dataProgram = new DataProgram();
        this.operations = new Operations(this.dataProgram, this.rl);
        this.continueFlag = true;
    }

    /**
     * Displays the main menu
     */
    displayMenu() {
        console.log('--------------------------------');
        console.log('Account Management System');
        console.log('1. View Balance');
        console.log('2. Credit Account');
        console.log('3. Debit Account');
        console.log('4. Exit');
        console.log('--------------------------------');
    }

    /**
     * Main application loop - Equivalent to COBOL PERFORM UNTIL loop
     */
    async run() {
        while (this.continueFlag) {
            this.displayMenu();
            
            const choice = await this.question('Enter your choice (1-4): ');
            const userChoice = parseInt(choice);

            // EVALUATE equivalent - route to appropriate operation
            switch (userChoice) {
                case 1:
                    await this.operations.viewBalance();
                    break;
                case 2:
                    await this.operations.creditAccount();
                    break;
                case 3:
                    await this.operations.debitAccount();
                    break;
                case 4:
                    this.continueFlag = false;
                    break;
                default:
                    console.log('Invalid choice, please select 1-4.');
            }
        }

        console.log('Exiting the program. Goodbye!');
        this.rl.close();
    }

    /**
     * Wrapper for readline question as Promise
     * @param {string} query - Question to ask
     * @returns {Promise<string>} User input
     */
    question(query) {
        return new Promise((resolve) => {
            this.rl.question(query, resolve);
        });
    }
}

// Application entry point
if (require.main === module) {
    const app = new MainProgram();
    app.run().catch((error) => {
        console.error('Application error:', error);
        process.exit(1);
    });
}

// Export for testing purposes
module.exports = { MainProgram, Operations, DataProgram };
