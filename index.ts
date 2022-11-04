var readline = require('readline');

class Money {
    name: string; // name of the money instance
    amount: number; // quantity of bills or coins
    value: number; // actual currency value
    balance: number; // final product of amount and value

    constructor(name: string, amount: number = 0, value: number = 0) {
        this.name = name;
        this.amount = amount;
        this.value = value;
        this.balance = amount * value
    }
    updateBalance() {
        this.balance = this.amount * this.value
        // console.log(this.name, 'new balance:', this.balance)
        // console.log(this.name, 'new amount:', this.amount)
        return this.balance
    }
    debit(quantity: number) {
        this.amount = this.amount - quantity;
        this.updateBalance()
        return this
    }
}

class Register {
    wallet: Money[]; // collection of money instances to be used at checkout payment
    balance: number;

    constructor(wallet: Money[]) {
        this.wallet = wallet
        this.balance = 0
        console.log(`\n***** Auto Register Started *****\n\n`)
    }
    updateBalance() {
        this.balance = this.wallet.map(a => a.balance).reduce((a, b) => a + b)
        return this.balance
    }
    changeDue(cost: number, given: number) {
        const owed = given - cost
        if (owed < 0) {
            console.log('\nThe value given is unsuficient for this purchase!')
            return 'The value given is unsuficient for this purchase!'
        }
        console.log('\nTask 1 => changeDue function results\n')
        console.log(`Balance: $${this.updateBalance().toFixed(2)}`)
        console.log(`Purchase: $${cost.toFixed(2)}`)
        console.log(`Accepted: $${given.toFixed(2)}`)
        console.log(`Change: $${owed.toFixed(2)}\n`)
        
        return this.pickDenominations(owed)
    }
    pickDenominations(owed: number) {
        console.log('Task 2 => pickDenominations function results\n')

        // Sorting our Money instanecs so we make sure to use higher bills first
        const sortedWallet = this.wallet.sort((a, b) => a.value + b.value);

        // Sum all money used from the wallet
        const result = sortedWallet.map(money => {
            if (owed > money.value) {
                const moneyQuantity = Math.trunc(owed / money.value) // example: Math.trunc(5.35/5) = 1 
                const moneyAmount = moneyQuantity * money.value
                console.log(`${moneyQuantity} X ${money.name}: $${moneyAmount.toFixed(2)}`)

                // Subtract money used from the owed value
                owed -= moneyAmount
                // update Money class
                money.debit(moneyQuantity)
                // update Register class
                this.updateBalance()

                return moneyQuantity * money.value
            }
            return 0
        }).reduce((a, b) => a + b)

        console.log(`\nTotal Change is: $${result.toFixed(2)}`)
        console.log(`Balance: $${this.updateBalance().toFixed(2)}\n`)
    }
}

let registerWallet: Money[] = [
    new Money('Ten Dollar Bills', 1, 10),
    new Money('Five Dollar Bills', 2, 5),
    new Money('One Dollar Bills', 5, 1),
    new Money('Quarters', 4, 0.25),
    new Money('Dimes', 20, 0.1),
    new Money('Nickels', 20, 0.05),
    new Money('Pennies', 100, 0.01),
]

const register = new Register(registerWallet)

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

console.log('Assignment suggestions: Purchase $4.63, Payment: $10\n')

// readline module provides an interface for reading data from a Readable stream 
rl.question("How much is the purchase? ", (cost: number) => {
    rl.question("How much are you paying? ", (given: number) => {
        register.changeDue(Number(cost), Number(given))
        rl.close()
    })
});

rl.on('close', function () {
    console.log('\n***** Closing Register. Bye bye! *****\n');
    process.exit(0);
});



