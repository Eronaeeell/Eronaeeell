// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {SendReceiveETH} from "src/SendReceiveETH.sol"; // Fixed import path

contract DeployScript is Script {
    function run() external {
        vm.startBroadcast(); // Starts the deployment using the private key
        
        address admin = vm.addr(vm.envUint("PRIVATE_KEY")); // Use Foundry's environment variable for admin address
        
        SendReceiveETH sendEth = new SendReceiveETH(admin); // Pass the admin address
        console.log("Contract deployed at:", address(sendEth));
        console.log("Admin address:", admin);

        vm.stopBroadcast(); // Stops the deployment script
    }
}
