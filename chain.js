const SHA256 = require ("crypto-js/sha256"); //Adding sha256 library to be used for calculating hash

//Create a class to store the transaction details
class Transaction{
	constructor(from,to,amount){
		this.from=from; //Payee
        this.to=to; //Beneficiary
		this.amount=amount; //Amount to be transferred
	}
}

//New Block Details
class Block{
	constructor(transaction,previousHash=''){
		this.timestamp=Date(Date.now()).toString();  //Update the timestamp for the block
		this.transaction=transaction;  //Update transaction details
		this.previousHash=previousHash;  //Update the previous hash received
		this.hash= this.calculateHash();  //Calculate and update the current hash of the block
		this.nonce=0;  //Assign current nonce value as zero
	}

	//Function to calculate the hash
	calculateHash(){
		//We will use SHA256 Algorithm to calculate hash.
		return SHA256(this.timestamp+JSON.stringify(this.transaction)+this.previousHash+this.nonce).toString();

	}

	//Function to mine new block
	mineNewBlock(difficulty){
		while(this.hash.substring(0,difficulty) !== Array(difficulty + 1).join("0")){  //Check whether the calculated hash is valid or not
			this.nonce++;                      //Current hash is invalid, increment the nonce value and
            this.hash = this.calculateHash();  //re-calculate the hash
        }
        console.log("A new block was mined with hash "+ this.hash);
    }
}

//New Chain Creation
class BlockChain{
	constructor(){
		this.chain = [this.createGenesisBlock()];  //Update the first block in the chain as genesis block
		this.difficulty = 2;  //Update mining difficulty
		this.pendingTransactions = [];  //Initialise pending transactions as null
		this.miningReward = 10;  //Assign mining rewards
	}

	//Function to create new genesis blocks
	createGenesisBlock(){
		return new Block("This is a Genesis Block") //Create and return the genesis block
	}

	//Function to get the last update block in the chain
	getLatestBlock(){
		return this.chain[this.chain.length-1];  //Extract the last block from the array and return the same.
	}

	//Function to mine the transactions
	minePendingTransactions(minerAddress){
		let block = new Block(this.pendingTransactions, this.getLatestBlock().hash);  //Create a new block
		block.mineNewBlock(this.difficulty);  //Mine this block with the provided difficulty
		console.log("Mined New Block");
		this.chain.push(block);  //Add the new mined block to the chain
		this.pendingTransactions = [
			new Transaction(null,minerAddress,this.miningReward)  //create a new transaction for the miner
		];
	}
	 //Function to create new transactions
	createTransaction(transaction){
		this.pendingTransactions.push(transaction);  //Add a new transaction to the pending transactions chain
	}

	//Function to get the balance of a particular address 
	getBalanceOfAddress(address){
		let balance = 0;  //Initial balance is updated as zero
		for (const block of this.chain){  //Loop through all the blocks of the chain
			for (const trans of block.transaction){  //for each block loop through all the transactions
				if (trans.from === address){
					balance -= trans.amount;  //for all the transactions, when the person has transferred an amount
				}                             //deduct that amount from his current balance

				if (trans.to === address){
					balance += trans.amount;  //for all the transactions, whent the person was credited an amount
				}                             //add that amount to his current balance
			}
		}

		return balance;  //return the current balance of the particular address
	}

	//Function to check for validity of the chain
	checkBlockChainValid(){
		let length = this.chain.length;  //Get the length of the chain
		for (let i=1; i<length; i++){   //Loop through all the blocks except the genesis block
			let currentBlock = this.chain[i];  //store current block details
			let previousBlock = this.chain[i-1];  //store previous block details
			if (currentBlock.hash !== currentBlock.calculateHash()){  //calculate the hash of the current block and verify with the stored hash
				return false;    //If there is a mismatch found in the hash then return false
			}
			if(currentBlock.previousHash !== previousBlock.hash){   //verify whether the previous hash stored in the current block
																	//is same as the previous blocks calculated hash

				return false;  //If there is a mismatch found in the hash then return false
			}
		}
		return true;  //The chain is valid, return true
	}
	
}


newCoin = new BlockChain();
console.log(JSON.stringify(newCoin, null, 4))




