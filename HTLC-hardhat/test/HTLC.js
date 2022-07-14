const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

const secret = "0x42";

describe("fund", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshopt in every test.

  async function senderFund() {

    const secretHash = ethers.utils.soliditySha256(["string"],[secret]);
    await console.log(secretHash);
    const endTime = 7 * 24 * 60 * 60 + Math.ceil(new Date().valueOf()/1000);
    // Contracts are deployed using the first signer/account by default
    const [sender, recipient] = await ethers.getSigners();
    let recipientAddr = await recipient.getAddress();
    let senderAddr = await sender.getAddress();
    let overrides = {
      value: ethers.utils.parseEther('1')
    };
    let value = overrides.value;
    const Lock = await ethers.getContractFactory("HTLC");
    const lock = await Lock.deploy();
    await lock.fund(secretHash, recipientAddr, senderAddr, endTime, overrides);
    const locked_contract_id = 1;
    return { lock, locked_contract_id, secretHash, recipientAddr, senderAddr, endTime, value};
  }

  describe("SenderFund", function () {
    it("Should set the right params", async function () {
      const { lock, locked_contract_id, secretHash, recipientAddr, senderAddr, endTime, value } = await loadFixture(senderFund);
      const res =  await lock.get_locked_contract(locked_contract_id)
      expect(res[1]).to.equal(secretHash);
      expect(res[2]).to.equal(recipientAddr);
      expect(res[3]).to.equal(senderAddr);
      expect(res[4]).to.equal(endTime);
      expect(res[5]).to.equal(value);
    });
  });

  describe("WithDraw", function () {
    it("recipient can with draw with righ preimage", async function () {
      const { lock, locked_contract_id, secretHash, recipientAddr, senderAddr, endTime, value } = await loadFixture(senderFund);
      const [sender, recipient] = await ethers.getSigners();
      const balanceOfRecipientBefore = await ethers.provider.getBalance(recipientAddr);
      await lock.connect(recipient).withdraw(locked_contract_id, secret);
      const balanceOfRecipientAfter = await ethers.provider.getBalance(recipientAddr);
      const res =  await lock.get_locked_contract(locked_contract_id);
      let amount = ethers.utils.formatEther(value.toString())
      // because of gas , balance of  recipient will low than before withdraw plus deposit
      expect(balanceOfRecipientAfter > balanceOfRecipientBefore).to.equal(true);
    });

    it("Should set the right params", async function () {
      const { lock, locked_contract_id, secretHash, recipientAddr, senderAddr, endTime, value } = await loadFixture(senderFund);
      const [sender, recipient] = await ethers.getSigners();
      await lock.connect(recipient).withdraw(locked_contract_id, secret);
      const res =  await lock.get_locked_contract(locked_contract_id)
      expect(res[8]).to.equal(secret);
    });
  });

  describe("refund", function () {
    it("sender cannot refund before endtime", async function () {
      const secretHash = ethers.utils.soliditySha256(["string"],[secret]);
      const endTime = 24 * 60 * 60 + Math.ceil(new Date().valueOf()/1000) ;
      // Contracts are deployed using the first signer/account by default
      const [sender, recipient] = await ethers.getSigners();
      let recipientAddr = await recipient.getAddress();
      let senderAddr = await sender.getAddress();
      let overrides = {
        value: ethers.utils.parseEther('1')
      };
      let value = overrides.value;
      const Lock = await ethers.getContractFactory("HTLC");
      const lock = await Lock.deploy();
      await lock.fund(secretHash, recipientAddr, senderAddr, endTime, overrides);
      const locked_contract_id = 1;
      await expect(
          lock.connect(sender).refund(locked_contract_id)
      ).to.be.revertedWith("endtime not yet passed");
    });

    it("sender can refund after endtime", async function () {
      const secretHash = ethers.utils.soliditySha256(["string"],[secret]);
      const endTime = 10 + Math.ceil(new Date().valueOf()/1000);
      // Contracts are deployed using the first signer/account by default
      const [sender, recipient] = await ethers.getSigners();
      let recipientAddr = await recipient.getAddress();
      let senderAddr = await sender.getAddress();
      let overrides = {
        value: ethers.utils.parseEther('1')
      };
      let value = overrides.value;
      const Lock = await ethers.getContractFactory("HTLC");
      const lock = await Lock.deploy();
      await lock.fund(secretHash, recipientAddr, senderAddr, endTime, overrides);
      await console.log(endTime)
      const locked_contract_id = 1;
      function sleep(millisecond) {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve()
          }, millisecond)
        })
      }
      await sleep(5000);
      await lock.connect(sender).refund(locked_contract_id);
    });
  });

});
