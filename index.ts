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

class Block {
  public nounce = Math.round(Math.random() * 99999999999);
  constructor(
    public prevHash: string,
    public transaction: Transaction,
    public transferredOn = Date.now()
  ) {}

  get hash() {
    const blockString = JSON.stringify(this);
    const hash = crypto.createHash('sha256').update(blockString).end();
    return hash.digest('hex');
  }
}

class Chain {
  public static instance = new Chain();
  chain: Block[];
  constructor() {
    this.chain = [new Block('', new Transaction(1000, 'genesis', 'sumanth'))];
  }

  get lastBlock() {
    return this.chain[this.chain.length - 1];
  }

  mine(nounce: number) {
    console.log('⛏️⛏️ mining started ....');
    const tick = Date.now();
    let ans = 1;
    while (true) {
      const hash = crypto.createHash('sha256');
      hash.update((nounce + ans).toString()).end();

      let currHash = hash.digest('hex');
      if (currHash.substring(0, 4) === '7459') {
        const tock = Date.now();
        console.log(`⛏️⛏️ mining completed in ${tock - tick} milliseconds`);
        console.log(
          `⛏️⛏️ mining completed with solution: ${ans} and hash: ${currHash}`
        );
        return ans;
      }
      ans += 1;
    }
  }

  addBlock(
    transaction: Transaction,
    senderPublicKey: string,
    signature: Buffer
  ) {
    const verify = crypto.createVerify('sha256');
    verify.update(transaction.toString());

    const isValid = verify.verify(senderPublicKey, signature);

    if (isValid) {
      const newBlock = new Block(this.lastBlock.hash, transaction);
      this.mine(newBlock.nounce);
      this.chain.push(newBlock);
    }
  }
}

class wallet {
  publicKey: string;
  privateKey: string;
  constructor() {
    const keyPair = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });

    this.publicKey = keyPair.publicKey;
    this.privateKey = keyPair.privateKey;
  }

  sendMoney(amount: number, payeePublicKey: string) {
    const transaction = new Transaction(amount, this.publicKey, payeePublicKey);
    const sign = crypto.createSign('sha256');
    sign.update(transaction.toString()).end();

    const signature = sign.sign(this.privateKey);
    Chain.instance.addBlock(transaction, this.publicKey, signature);
  }
}

const sumanth = new wallet();
const tom = new wallet();
const john = new wallet();

sumanth.sendMoney(20, tom.publicKey);
tom.sendMoney(30, john.privateKey);
john.sendMoney(50, sumanth.privateKey);

console.log(Chain.instance);
