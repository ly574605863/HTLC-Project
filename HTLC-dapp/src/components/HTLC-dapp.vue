<template>
  <div class="casino">
    <h1>Welcome to the HTLC</h1>

    <p class="address">Address：{{myAddress}}</p>
    <p>Balance：{{accountBalance}} ETH</p>
    <p>Please input the secret hash</p>
    <p><input v-model="secretHash" placeholder="secretHash"></p>
    <p>Please input the amount you want to swap</p>
    <p><input v-model="amount" placeholder="amount"></p>
    <p>Please confirm the your address</p>
    <p><input v-model="sender" placeholder="sender"></p>
    <p>Please confirm the recipient address</p>
    <p><input v-model="recipient" placeholder="recipient"></p>
    <p>Please confirm the endtime you can refund</p>
    <p><input v-model="endtime" placeholder="endtime"></p>
    <p>Sender Create HTLC</p>
    <p><button @click="createHTLC" class="button">Create-HTLC</button></p>
    <p>receipent withdraw HTLC</p>
    <p><input v-model="HTLCIdWithdraw" placeholder="HTLCID"></p>
    <p><input v-model="preImage" placeholder="preImage"></p>
    <p><button @click="withdraw" class="button">WithDraw-HTLC</button></p>
    <p>sender refund HTLC</p>
    <p><input v-model="HTLCIdRefund" placeholder="HTLCID"></p>
    <p><button @click="refund" class="button">Refund-HTLC</button></p>

    <div class="event" v-if="winEvent">
      <p>Lucky number is {{luckyNum}}</p>
      <p v-if="winEvent._status" class="green">
        Excellent!!! Get {{winEvent._amount}} ETH
      </p>
      <p v-else class="red">
        OH NO ~ Try again
      </p>
    </div>
  </div>
</template>
<script>
import Web3 from 'web3'
import abi from 'ethereumjs-abi'
import EthereumTx from 'ethereumjs-tx'
import { toNum } from '../util'
import { ABI, contractAddr } from '../contract/info'

export default {
  created() {
    this.getWeb3()
    this.setContract()
  },
  mounted() {
    this.$nextTick(function() {
      this.checkCasinoBalance()
      let time = setInterval(() => {
        // if (this.flag === true) { clearInterval(time) }
        this.getAccount()
      }, 1000)
    })


  },
  data() {
    return {
      //web3
      web3: undefined,
      isMetamask: false,
      network: '',

      //contract data
      ABI: null,
      contractAddr: '',
      //contract instance
      casinoContract: undefined,
      casino: undefined,
      secretHash:'',
      amount: '',
      sender: '',
      recipient: '',
      endtime: '',
      HTLCIdWithdraw: '',
      preImage: '',
      HTLCIdRefund: '',
      myAddress: '',
      myPrivateKey: '',
      odds: null,
      amount: 0.001,
      pending: false,
      winEvent: null,
      showEnv: false,
      accountBalance: null,
      contractBalance: 0,
      chooseNum: null,
      isChooseNum: false,
      Numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      tx: null,

    }
  },
  methods: {
    getWeb3() {
      this.ABI = ABI
      this.contractAddr = contractAddr
      // Modern dapp browsers...
      if (window.ethereum) {
        window.web3 = new Web3(ethereum);
        try {
          // Request account access if needed
          ethereum.enable();
          // Acccounts now exposed
          this.isMetamask = true
        } catch (error) {
          // User denied account access...
          this.isMetamask = false
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        window.web3 = new Web3(web3.currentProvider);
        // Acccounts always exposed
        this.isMetamask = true
      }
      // Non-dapp browsers...
      else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
        this.isMetamask = false
      }

      console.log('Get Web3!')
      this.showNetwork()
    },
    showNetwork() {
      const NETWORKS = {
        '1': 'Main Net',
        '2': 'Deprecated Morden test network',
        '3': 'Ropsten test network',
        '4': 'Rinkeby test network',
        '42': 'Kovan test network',
        '4447': 'Truffle Develop Network',
        '5777': 'Ganache Blockchain'
      }
      var version = window.web3.version.network;
      this.network = NETWORKS[version]
    },
    setContract() {
      this.casinoContract = window.web3.eth.contract(this.ABI);
      this.casino = this.casinoContract.at(this.contractAddr);
      console.log('Set Contract!')
    },

    createHTLC() {
      if (this.amount > 0) {
        this.winEvent = null
        this.pending = true
        if (this.isMetamask) {
          this.casino.fund(this.secretHash,this.recipient,this.myAddress,this.endtime, {
            gas: 300000, //Gas Limit 300000
            gasPrice: window.web3.toWei('0.000000001', 'ether'), // 1 Gwei
            value: window.web3.toWei(this.amount, 'ether'),
            from: window.web3.eth.coinbase
          }, (err, result, data) => {
            if (err) {
              this.pending = false
              console.error(err)
            } else {
              this.tx = result
              // watch event
              let fund = this.casino.log_fund()
              fund.watch((err, result) => {
                if (err) {
                  this.pending = false
                  console.error(err)
                } else {
                  console.log(toNum(result.args.locked_contract_id))
                  alert("create HTLC success, id is " + toNum(result.args.locked_contract_id).toString());
                  // stop watch
                  fund.stopWatching();
                }
              })
            }
          })
        } else {
          alert('Please log in to Metamask')
        }
      }
    },

    withdraw() {
      if (this.accountBalance > 0) {
        this.winEvent = null
        this.pending = true
        if (this.isMetamask) {
          this.casino.withdraw(this.HTLCIdWithdraw,this.preImage, {
            gas: 300000, //Gas Limit 300000
            gasPrice: window.web3.toWei('0.000000001', 'ether'), // 1 Gwei
            from: window.web3.eth.coinbase
          }, (err, result, data) => {
            if (err) {
              this.pending = false
              console.error(err)
            } else {
              this.tx = result
              // watch event
              let log_withdraw = this.casino.log_withdraw()
              log_withdraw.watch((err, result) => {
                if (err) {
                  this.pending = false
                  console.error(err)
                } else {
                  console.log(toNum(result.args.locked_contract_id))
                  alert("witchdraw HTLC success, id is " + toNum(result.args.locked_contract_id).toString());
                  // stop watch
                  log_withdraw.stopWatching();
                }
              })
            }
          })
        } else {
          alert('Please log in to Metamask')
        }
      }
    },
    refund() {
      if (this.accountBalance > 0) {
        this.winEvent = null
        this.pending = true
        if (this.isMetamask) {
          this.casino.refund(this.HTLCIdWithdraw, {
            gas: 300000, //Gas Limit 300000
              gasPrice: window.web3.toWei('0.000000001', 'ether'), // 1 Gwei
              from: window.web3.eth.coinbase
          }, (err, result, data) => {
            if (err) {
              this.pending = false
              console.error(err)
            } else {
              this.tx = result
              // watch event
              let log_refund = this.casino.log_refund()
              log_refund.watch((err, result) => {
                if (err) {
                  this.pending = false
                  console.error(err)
                } else {
                  console.log(toNum(result.args.locked_contract_id))
                  alert("refund HTLC success, id is " + toNum(result.args.locked_contract_id).toString());
                  // stop watch
                  log_refund.stopWatching();
                }
              })
            }
          })
        } else {
          alert('Please log in to Metamask')
        }
      }
    },

    getNonce() {
      return new Promise((resolve, reject) => {
        window.web3.eth.getTransactionCount(this.myAddress, (error, result) => {
          if (!error) {
            let nonce = '0x' + result.toString(16)
            resolve(nonce)
          } else {
            console.error(error);

          }
        })

      })
    },

    checkNetwork() {
      this.showEnv ? this.showEnv = false : this.showEnv = true
    },

    getAccount() {
      if (this.isMetamask) {
        //set account
        window.web3.eth.accounts[0] ? this.myAddress = window.web3.eth.accounts[0] : alert('Please log in to Metamask')
      } else {
        window.web3.eth.accounts[0] = this.myAddress
      }

      window.web3.eth.getBalance(this.myAddress, (error, result) => {
        if (!error) {
          this.accountBalance = toNum(result) / Math.pow(10, 18);
        } else {
          console.error(error);
        }
      });
    },

    checkCasinoBalance() {
      window.web3.eth.getBalance(this.contractAddr, (error, result) => {
        if (!error) {
          this.contractBalance = toNum(result) / Math.pow(10, 18);
        } else {
          console.error(error);
        }
      });
    }
  }
}

</script>
<style scoped>
body {
  color: #444;
}

input{
  outline-style: none ;
  border: 1px solid #ccc;
  border-radius: 3px;
  padding: 14px 14px;
  width: 620px;
  font-size: 24px;
}
ul {
  padding: 0;

  list-style-type: none;
}

.button {
  background-color: #4CAF50; /* Green */
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
}

.block-number {
  display: flex;

  margin: 0 auto;

  justify-content: center;
  flex-wrap: wrap;
}

.block-number li {
  margin-right: 20px;
  margin-bottom: 20px;
  padding: 20px;

  cursor: pointer;

  color: #bbb6b6;
  border: 1px solid #bbb6b6;
  border-radius: 50%;
  background-color: #fff;

  width: 6%;

  text-align: center;
}

.block-number li:hover {
  color: white;
  border: 1px solid rgb(244, 198, 20);
  background-color: rgb(244, 198, 20);
  box-shadow: 0 0 rgb(244, 198, 20);
}

.block-number li:active {
  opacity: .7;
}

.casino {
  margin: 0 auto;
  max-width: 1000px;
  margin-top: 50px;

  text-align: center;
}

.networkBtn,
.network {
  position: absolute;
  right: 10px;
}

.network {
  top: 75px;
}

.network p {
  margin: 0;
}

.loader {
  width: 150px;
}

.address {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.green {
  color: green;
}

.red {
  color: red;
}

</style>
