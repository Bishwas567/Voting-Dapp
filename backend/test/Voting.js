const { expect } = require("chai");

describe("Voting Contract", function () {
  let voting;
  let admin;
  let voter;

  beforeEach(async function () {
    [admin, voter] = await ethers.getSigners();

    const Voting = await ethers.getContractFactory("Voting");
    voting = await Voting.deploy();
    await voting.waitForDeployment();
  });

  it("should allow admin to add candidates", async function () {
    await voting.addCandidate("Alice");

    const candidate = await voting.getCandidate(1);

    expect(candidate[1]).to.equal("Alice");
    expect(candidate[2]).to.equal(0);
  });

  it("should start voting after two candidates are added", async function () {
    await voting.addCandidate("Alice");
    await voting.addCandidate("Bob");

    await voting.startVoting();

    expect(await voting.votingStarted()).to.equal(true);
  });

  it("should allow a user to vote", async function () {
    await voting.addCandidate("Alice");
    await voting.addCandidate("Bob");
    await voting.startVoting();

    await voting.connect(voter).vote(1);

    const candidate = await voting.getCandidate(1);
    expect(candidate[2]).to.equal(1);
  });

  it("should prevent double voting", async function () {
    await voting.addCandidate("Alice");
    await voting.addCandidate("Bob");
    await voting.startVoting();

    await voting.connect(voter).vote(1);

    await expect(voting.connect(voter).vote(2)).to.be.revertedWith(
      "You already voted"
    );
  });
});