import { expect } from "chai";
import { ethers } from "hardhat";
import { PadelBooking } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

const balance = async (address: string) => {
  const ownerBalance = await ethers.provider.getBalance(address);
  return ownerBalance;
};

describe("PadelBooking", function () {
  let owner: SignerWithAddress;
  let player1: SignerWithAddress;
  let player2: SignerWithAddress;
  let player3: SignerWithAddress;

  beforeEach(async function () {
    [owner, player1, player2, player3] = await ethers.getSigners();
  });

  let contract: PadelBooking;
  before(async () => {
    const yourContractFactory = await ethers.getContractFactory("PadelBooking");
    contract = (await yourContractFactory.deploy()) as PadelBooking;
    await contract.deployed();
  });

  describe("Deployment", function () {
    it("Should have single player after deployment", async function () {
      expect((await contract.getPlayers()).length).to.equal(1);
    });

    it("should allow booking a court with four players", async () => {
      const beforeBalance = await balance(owner.address);

      // Book the court with four players
      const fees = ethers.utils.parseEther("0.1");
      const accounts = [player1, player2, player3];
      for (const player of accounts) {
        const contractWithPlayer = await contract.connect(player);
        await contractWithPlayer.bookCourt({
          value: fees,
        });
      }

      // Check that the booking was successful
      const players = await contract.getPlayers();
      expect(players.length).to.equal(4);

      const ownerBalance = await ethers.provider.getBalance(owner.address);
      const balanceDiffWei = ownerBalance.sub(beforeBalance);
      const balanceEth = ethers.utils.formatEther(balanceDiffWei);
      expect(balanceEth).to.equal("0.3");
    });
  });
});
