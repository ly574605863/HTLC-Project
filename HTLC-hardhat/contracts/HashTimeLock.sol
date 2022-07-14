// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

// Import this file to use console.log
import "hardhat/console.sol";

contract HTLC {
    uint locked_id;
    // each one use hash time lock to swap will new a new LockContract struct
    struct LockContract {
        bytes32 secret_hash;
        address payable recipient;
        address payable sender;
        uint256 endtime;
        uint256 amount;
        bool withdrawn;
        bool refunded;
        string preimage;
    }

    mapping (uint => LockContract) locked_contracts;

    event log_fund (
        uint indexed locked_contract_id,
        bytes32 secret_hash,
        address indexed recipient,
        address indexed sender,
        uint256 endtime,
        uint256 amount
    );
    event log_withdraw (
        uint indexed locked_contract_id
    );
    event log_refund (
        uint indexed locked_contract_id
    );

    modifier future_endtime (uint256 endtime) {
        require(endtime > block.timestamp, "endtime time must be in the future");
        _;
    }
    modifier is_locked_contract_exist (uint locked_contract_id) {
        require(have_locked_contract(locked_contract_id), "locked_contract_id does not exist");
        _;
    }
    modifier check_secret_hash_matches (uint locked_contract_id, string memory preimage) {
        require(locked_contracts[locked_contract_id].secret_hash == sha256(abi.encodePacked(preimage)), "secret hash hash does not match");
        _;
    }
    modifier withdrawable (uint locked_contract_id) {
        require(locked_contracts[locked_contract_id].recipient == msg.sender, "withdrawable: not recipient");
        require(locked_contracts[locked_contract_id].withdrawn == false, "withdrawable: already withdrawn");
        require(locked_contracts[locked_contract_id].refunded == false, "withdrawable: already refunded");
        _;
    }
    modifier refundable (uint locked_contract_id) {
        require(locked_contracts[locked_contract_id].sender == msg.sender, "refundable: not sender");
        require(locked_contracts[locked_contract_id].refunded == false, "refundable: already refunded");
        require(locked_contracts[locked_contract_id].withdrawn == false, "refundable: already withdrawn");
        require(locked_contracts[locked_contract_id].endtime <= block.timestamp, "refundable: endtime not yet passed");
        _;
    }

    /**
     * @dev Sender sets up a new Hash Time Lock Contract (HTLC) and depositing ether.
     * @dev msg.value, Amount of the ether to lock up.
     *
     * @param secret_hash A sha256 secret hash.
     * @param recipient Recipient account.
     * @param sender Sender accountn.
     * @param endtime The timestamp that the lock expires at.
     *
     * @return locked_contract_id of the new HTLC.
     */
    function fund (
        bytes32 secret_hash, address payable recipient, address payable sender, uint256 endtime
    ) payable external future_endtime (endtime) returns (uint locked_contract_id) {

        require(msg.sender == sender, "msg.sender must be same with sender address");
        uint256 amount = msg.value;
        if (have_locked_contract(locked_id+1))
            revert("this locked contract already exists");
        locked_id = locked_id+1;
        locked_contracts[locked_id] = LockContract(
            secret_hash, recipient, sender, endtime, amount, false, false, ""
        );
        emit log_fund (
            locked_id, secret_hash, recipient, sender, endtime, msg.value
        );
        return locked_id;
    }

    /**
     * @dev Called by the recipient once they know the preimage (secret key) of the secret hash.
     *
     * @param locked_contract_id of HTLC to withdraw.
     * @param preimage sha256(preimage) hash should equal the contract secret hash.
     *
     * @return bool true on success or false on failure.
     */
    function withdraw (uint locked_contract_id, string memory preimage) external is_locked_contract_exist (locked_contract_id) check_secret_hash_matches (locked_contract_id, preimage) withdrawable (locked_contract_id) returns (bool) {

        LockContract storage locked_contract = locked_contracts[locked_contract_id];
        locked_contract.preimage = preimage;
        locked_contract.withdrawn = true;
        locked_contract.recipient.transfer(locked_contract.amount);
        emit log_withdraw(
            locked_contract_id
        );
        return true;
    }

    /**
     * @dev Called by the sender if there was no withdraw and the time lock has expired.
     *
     * @param locked_contract_id of HTLC to refund.
     *
     * @return bool true on success or false on failure.
     */
    function refund (uint locked_contract_id) external is_locked_contract_exist (locked_contract_id) refundable (locked_contract_id) returns (bool) {

        LockContract storage locked_contract = locked_contracts[locked_contract_id];

        locked_contract.refunded = true;
        locked_contract.recipient.transfer(locked_contract.amount);

        emit log_refund(
            locked_contract_id
        );
        return true;
    }

    /**
     * @dev Get HTLC ERC20 contract details.
     *
     * @param locked_contract_id of HTLC ERC20 to get details.
     *
     * @return id secret_hash recipient sender endtime amount withdrawn refunded preimage locked HTLC ERC20 contract data's.
     */
    function get_locked_contract (uint locked_contract_id) public view returns (
        uint id, bytes32 secret_hash, address recipient, address sender, uint256 endtime, uint256 amount, bool withdrawn, bool refunded, string memory preimage
    ) {
        if (have_locked_contract(locked_contract_id) == false)
            return (0, 0, address(0), address(0), 0, 0, false, false, "");

        LockContract storage locked_contract = locked_contracts[locked_contract_id];

        return (
            locked_contract_id,
            locked_contract.secret_hash,
            locked_contract.recipient,
            locked_contract.sender,
            locked_contract.endtime,
            locked_contract.amount,
            locked_contract.withdrawn,
            locked_contract.refunded,
            locked_contract.preimage
        );
    }

    /**
     * @dev Is there a locked contract with HTLC contract id.
     *
     * @param locked_contract_id of HTLC to find it exists.
     *
     * @return exists boolean true or false.
     */
    function have_locked_contract(uint locked_contract_id) internal view returns (bool exists){
        exists = (locked_contracts[locked_contract_id].sender != address(0));
    }
}
