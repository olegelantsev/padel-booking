pragma solidity ^0.8.0;

contract PadelBooking {
    uint public constant PRICE_PER_PLAYER = 0.1 ether;
    uint public constant MIN_PLAYERS = 4;
    uint public constant MAX_PLAYERS = 4;

    address payable public owner;
    address[] public players;
    uint public bookingTime;

    constructor() {
        owner = payable(msg.sender);
        bookingTime = block.timestamp;
        players.push(msg.sender);
    }

    function bookCourt() public payable {
        require(players.length < MAX_PLAYERS, "Maximum players reached");
        require(msg.value == PRICE_PER_PLAYER, "Price per player must be 0.1 ether");

        if (players.length == 0) {
            bookingTime = block.timestamp;
        }

        players.push(msg.sender);

        if (players.length == MIN_PLAYERS) {
            uint balance = address(this).balance;
            owner.transfer(balance);
        }
    }

    function getPlayers() public view returns (address[] memory) {
        return players;
    }
}
