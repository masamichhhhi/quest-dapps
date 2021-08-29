const EVMRevert = require("openzeppelin-solidity/test/helpers/EVMRevert");
const expectEvent = require("openzeppelin-solidity/test/helpers/expectEvent");

const BigNumber = web3.utils.BN;

const should = require("chai")
  .use(require("chai-as-promised"))
  .use(require("chai-bignumber")(BigNumber))
  .should();

const RoomFactory = artifacts.require("./RoomFactory.sol");

contract(
  "RoomFactory",
  ([factoryOwner, roomOwner1, roomOwner2, roomOwner3, ...accounts]) => {
    describe("as an instance", () => {
      beforeEach(async function () {
        this.roomFactory = await RoomFactory.new({ from: factoryOwner });
      });

      it("should exist", function () {
        this.roomFactory.should.exist;
      });

      describe("createRoom", function () {
        const amount = web3.utils.toWei("1", "ether");

        it("should create a room", async function () {
          const { logs } = await this.roomFactory.createRoom({
            from: roomOwner1,
            value: amount,
          });
          const event = await expectEvent.inLogs(logs, "RoomCreated");

          const factoryBalance = await web3.eth.getBalance(
            this.roomFactory.address
          );
          const roomBalance = await web3.eth.getBalance(event.args._room);

          factoryBalance.should.be.equal("0");
          roomBalance.should.be.equal(amount);
        });

        it("only the factory owner can pause createRoom", async function () {
          await this.roomFactory
            .pause({ from: roomOwner1 })
            .should.be.rejectedWith(EVMRevert);
          await this.roomFactory.pause({ from: factoryOwner }).should.be
            .fulfilled;
        });
      });
    });
  }
);
