// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract TimeLockedWallet {
    address public owner;
    uint256 public unlockTime;

    constructor(uint256 _unlockTime) payable {
        require(_unlockTime > block.timestamp, "Unlock time must be in the future");
        owner = msg.sender;
        unlockTime = _unlockTime;
    }

    function withdraw() public {
        require(block.timestamp >= unlockTime, "You can't withdraw yet!");
        require(msg.sender == owner, "Only the owner can withdraw!");

        payable(owner).transfer(address(this).balance);
    }

    receive() external payable {}
}
