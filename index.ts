import * as crypto from 'crypto'

class Transaction{
  constructor(
    public amount: number,
    public payee: string,
    public payer: string, 
  ){}
  
  toString() {
    return JSON.stringify(this);
  }
}

const transaction = new Transaction(100, 'John Doe', 'Jane Smith');
console.log(transaction.toString()); // {"amount":100,"payee":"John Doe","payer":"Jane Smith"}
