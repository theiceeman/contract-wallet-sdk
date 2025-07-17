// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.20;
import "./Wallet.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";

/// @title WalletFactory
/// @dev A factory contract using the factory design pattern to deploy clone wallet
/// contracts for users; cost effectively.
contract WalletFactory {
    event Cloned(string name, address indexed clone, address indexed owner, address indexed master);
    mapping(address => mapping(address => Wallet)) public addresses;

    /// @dev This deploys a proxy contract to a non coliding uniquely generated address
    /// using a salt passed to the create2 command.
    /// @param implementation - The address of the contract to be cloned.
    /// @param name - The salt used for generating the address; this has to be unique.
    /// @param enableAutoFlush - The address of the contract to be cloned & deployed.
    /// @return instance - Returns an instance of the deployed contract.
    function deployAddress(
        address implementation,
        address master,
        string memory name,
        bool enableAutoFlush
    ) public returns (address instance) {
        bytes32 salt = stringToBytes32(name, msg.sender);
        assembly {
            let ptr := mload(0x40)
            mstore(
                ptr,
                0x3d602d80600a3d3981f3363d3d373d3d3d363d73000000000000000000000000
            )
            mstore(add(ptr, 0x14), shl(0x60, implementation))
            mstore(
                add(ptr, 0x28),
                0x5af43d82803e903d91602b57fd5bf30000000000000000000000000000000000
            )
            instance := create2(0, ptr, 0x37, salt)
        }
        Wallet clonedAddress_ = Wallet(payable(instance));
        clonedAddress_.init(msg.sender, master, name, enableAutoFlush);
        addresses[msg.sender][address(clonedAddress_)] = clonedAddress_;
        emit Cloned(clonedAddress_.name(), instance, clonedAddress_.owner(), clonedAddress_.master());
        require(instance != address(0), "ERC1167: create2 failed");
    }

    /// @dev This ensures address predicted is uniquely generated using the given salt
    /// and the onwer address. This would eliminate colliding addresses.
    /// @param implementation - The address of the contract to be cloned.
    /// @param name - The users unique salt.
    /// @return Returns a unique deterministic address.
    function predictAddress(address implementation, string memory name)
        public
        view
        returns (address)
    {
        bytes32 salt = stringToBytes32(name, msg.sender);
        address predictedAddress = predictDeterministicAddress(
            implementation,
            salt,
            address(this)
        );
        return predictedAddress;
    }

    /// @dev Converts unique salt passed to it to a hex value.
    /// @param source - Users unique salt.
    /// @param sender - Address of user.
    /// @return result - Returns a hex version of the users salt.
    function stringToBytes32(string memory source, address sender)
        public
        pure
        returns (bytes32 result)
    {
        bytes memory tempEmptyStringTest = bytes(source);
        bytes memory payload = abi.encodePacked(sender, source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }

        assembly {
            result := mload(add(payload, 64))
        }
    }

    function predictDeterministicAddress(
        address implementation,
        bytes32 salt,
        address deployer
    ) internal pure returns (address predicted) {
        assembly {
            let ptr := mload(0x40)
            mstore(
                ptr,
                0x3d602d80600a3d3981f3363d3d373d3d3d363d73000000000000000000000000
            )
            mstore(add(ptr, 0x14), shl(0x60, implementation))
            mstore(
                add(ptr, 0x28),
                0x5af43d82803e903d91602b57fd5bf3ff00000000000000000000000000000000
            )
            mstore(add(ptr, 0x38), shl(0x60, deployer))
            mstore(add(ptr, 0x4c), salt)
            mstore(add(ptr, 0x6c), keccak256(ptr, 0x37))
            predicted := keccak256(add(ptr, 0x37), 0x55)
        }
    }
}
