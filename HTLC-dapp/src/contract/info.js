export const ABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "locked_contract_id",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "secret_hash",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "endtime",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "log_fund",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "locked_contract_id",
        "type": "uint256"
      }
    ],
    "name": "log_refund",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "locked_contract_id",
        "type": "uint256"
      }
    ],
    "name": "log_withdraw",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "secret_hash",
        "type": "bytes32"
      },
      {
        "internalType": "address payable",
        "name": "recipient",
        "type": "address"
      },
      {
        "internalType": "address payable",
        "name": "sender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "endtime",
        "type": "uint256"
      }
    ],
    "name": "fund",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "locked_contract_id",
        "type": "uint256"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "locked_contract_id",
        "type": "uint256"
      }
    ],
    "name": "get_locked_contract",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "bytes32",
        "name": "secret_hash",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "endtime",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "withdrawn",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "refunded",
        "type": "bool"
      },
      {
        "internalType": "string",
        "name": "preimage",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "locked_contract_id",
        "type": "uint256"
      }
    ],
    "name": "refund",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "locked_contract_id",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "preimage",
        "type": "string"
      }
    ],
    "name": "withdraw",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]

export const contractAddr = '0x7a4deEcc30313F10B660A6733283c1c1b99F5dfe' //ropsten


