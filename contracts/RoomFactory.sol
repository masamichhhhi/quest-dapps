pragma solidity ^0.4.24;

// import "../node_modules/openzeppelin-solidity/contracts/lifecycle/Pausable.sol";
// import "../node_modules/openzeppelin-solidity/contracts/lifecycle/Destructible.sol";
import "./Pausable.sol";
import "./Destructible.sol";
import "./Room.sol";

contract RoomFactory is Destructible, Pausable {
  event RoomCreated(
    address indexed _creator,
    address _room,
    uint256 _depositedValue
  );

  function createRoom() external payable whenNotPaused {
    address newRoom = (new Room).value(msg.value)(msg.sender);
    emit RoomCreated(msg.sender, newRoom, msg.value);
  }
}
