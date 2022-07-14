# HashTimeLock Dapp

##Information:
#### HTLC-hardhat:
* Details: contract based on hardhat to develop contract in ethereum
```
test: npx hardhat test
deploy: npx hardhat run scripts/deploy.js --network ropsten
```
* Docs:
1. HTLC-hardhat/contracts: HashTimeLock Contract, with solidity
2. HTLC-hardhat/scripts: develoy script
3. HTLC-hardhat/test: test case

#### HLTC-dapp:
* Details: web-page based on vue, connect metamask as wallet provider.
```
run: npm run start
```
* Docs:
1. HLTC-dapp/src: Front page.
2. HLTC-dapp/contract: HTLC contract incloude for web3.js

* notes:
Hash of 0x42 is 0x1114e8440f8d4bdd0537a45f44fc2d03d003c1e196ed86fbabc52e4140c34a66
#### example of dapp
![image](http://github.com/ly574605863/HTLC-Project/blob/main/doc/HTLC-dapp.png)
![image](http://github.com/ly574605863/HTLC-Project/blob/main/doc/HTLC-dapp-createHTLC.png)

## What is HTLC
A Hash Time Lock contract (HTLC) is essentially a type of payment in which two people agree to a financial arrangement where one party will pay the other party a certain amount of cryptocurrencies, such as Bitcoin or Bytom assets. However, because these contracts are Time Locked, the receiving party only has a certain amount of time to accept the payment, otherwise the money can be returned to the sender.

## How do HTLC work
For example, Alice uses one BTC to swap Bob's 20 eth processes as follows:

1. Alice randomly constructs a string **s** and calculates its hash **H = hash (s)**;

2. The contract that Alice sends **h** to Bob;

3. Alice locks one of her BTC assets, sets a **longer locking time T1**, and sets a condition for obtaining the BTC: whoever can provide the original value of H, which is s, can get the BTC, if time 

4. Bob observed that a BTC was locked in Alice's contract, and then bob locked his 20 eth assets, and set a **relatively short locking time T2, T2 < T1**. Bob also set the same acquisition conditions (whoever provides the original value s of H can obtain 20 ETH);

5. Alice sent her **originally generated string s** to Bob's contract and got 20 eth;

6. Bob observed **Alice's original s value** in step 5, and successfully obtained a BTC by sending it to Alice's contract; So far, Alice and Bob have completed the exchange of assets.

* Notes:
+ the most import thing is that user can only refund their assets after endtime. And in Alice's HTLC contract, the endtime is longer than bob's, in this way, alice can not refund his token before bob withdraw.