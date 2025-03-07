// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SendReceiveETH {
    address public admin;

    event SentETH(address indexed from, address indexed to, uint256 amount);

    constructor(address _admin) {
        admin = _admin; // Assign the specified admin address
    }

    // User sends exactly 0.01 ETH to the admin (Contract holds it)
    function sendETH() external payable {
        require(msg.value == 0.01 ether, "Must send exactly 0.01 ETH");
        emit SentETH(msg.sender, address(this), msg.value);
    }

    // Admin sends exactly 0.01 ETH to a user
    function sendETHtoUser(address payable user) external {
        require(msg.sender == admin, "Only admin can send ETH");
    require(address(this).balance >= 0.01 ether, "Not enough ETH in contract");

    user.transfer(0.01 ether);
    emit SentETH(address(this), user, 0.01 ether); // Log transfer from contract to user
    }

    // Allow contract to receive ETH
    receive() external payable {}
}