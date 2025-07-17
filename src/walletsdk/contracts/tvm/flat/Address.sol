// SPDX-License-Identifier: GPL-3.0
// File: contracts/interfaces/ERC20Interface.sol


pragma solidity ^0.8.0;

/**
 *Contract that exposes the needed erc20 token functions
 */

abstract contract ERC20Interface {
    uint256 public decimals;

    // Send _value amount of tokens to address _to
    function transfer(address _to, uint256 _value)
        public
        virtual
        returns (bool success);

    // Get the account balance of another account with address _owner
    function balanceOf(address _owner)
        public
        view
        virtual
        returns (uint256 balance);

    function allowance(address owner, address spender)
        external
        view
        virtual
        returns (uint256);

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external virtual returns (bool);
}

// File: @uniswap/lib/contracts/libraries/TransferHelper.sol



pragma solidity >=0.6.0;

// helper methods for interacting with ERC20 tokens and sending ETH that do not consistently return true/false
library TransferHelper {
    function safeApprove(
        address token,
        address to,
        uint256 value
    ) internal {
        // bytes4(keccak256(bytes('approve(address,uint256)')));
        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(0x095ea7b3, to, value));
        require(
            success && (data.length == 0 || abi.decode(data, (bool))),
            'TransferHelper::safeApprove: approve failed'
        );
    }

    function safeTransfer(
        address token,
        address to,
        uint256 value
    ) internal {
        // bytes4(keccak256(bytes('transfer(address,uint256)')));
        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(0xa9059cbb, to, value));
        require(
            success && (data.length == 0 || abi.decode(data, (bool))),
            'TransferHelper::safeTransfer: transfer failed'
        );
    }

    function safeTransferFrom(
        address token,
        address from,
        address to,
        uint256 value
    ) internal {
        // bytes4(keccak256(bytes('transferFrom(address,address,uint256)')));
        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(0x23b872dd, from, to, value));
        require(
            success && (data.length == 0 || abi.decode(data, (bool))),
            'TransferHelper::transferFrom: transferFrom failed'
        );
    }

    function safeTransferETH(address to, uint256 value) internal {
        (bool success, ) = to.call{value: value}(new bytes(0));
        require(success, 'TransferHelper::safeTransferETH: ETH transfer failed');
    }
}

// File: contracts/Address.sol



pragma solidity ^0.8.0;



contract Address {
    event Transfer(address, uint256);
    event Flush(address from, uint256 value, bytes data);
    event TransferGasLimitChange(
        uint256 prevTransferGasLimit,
        uint256 newTransferGasLimit
    );

    address payable public owner;
    string public name;
    bool public autoFlush = false;
    uint256 public transferGasLimit;

    constructor() {
        transferGasLimit = 20000;
        emit TransferGasLimitChange(0, transferGasLimit);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Unauthorized operation");
        _;
    }

    modifier onlyUninitialized() {
        require(owner == address(0x0), "Already initialized");
        _;
    }

    function init(
        address owner_,
        string memory name_,
        bool enableAutoFlush_
    ) external onlyUninitialized {
        owner = payable(owner_);
        name = name_;
        autoFlush = enableAutoFlush_;

        uint256 value = address(this).balance;

        if (value == 0 || autoFlush == false) {
            return;
        }

        (bool success, ) = owner.call{value: value}("");
        require(success, "Flush failed");
        // NOTE: since we are forwarding on initialization,
        // we don't have the context of the original sender.
        // We still emit an event about the forwarding but set
        // the sender to the forwarder itself
        emit Flush(address(this), value, msg.data);
    }

    function transferOwnership(address newOwner_)
        public
        onlyOwner
        returns (bool)
    {
        require(owner != address(0), "Owner is required");
        owner = payable(newOwner_);
        require(owner != address(0), "Owner is required");
        return true;
    }

    function _getBalance(address tokenContractAddress)
        private
        view
        returns (uint256)
    {
        if (tokenContractAddress == address(this)) {
            return address(this).balance;
        } else {
            ERC20Interface instance = ERC20Interface(tokenContractAddress);
            address address_ = address(this);
            uint256 balance_ = instance.balanceOf(address_);
            return balance_;
        }
    }

    function getBalance(address tokenContractAddress)
        public
        view
        onlyOwner
        returns (uint256)
    {
        return _getBalance(tokenContractAddress);
    }

    function makeTransfer(
        address _to,
        uint256 _value,
        address _tokenContractAddress
    ) private returns (bool) {
        bool sent;
        if (_tokenContractAddress != address(this)) {
            ERC20Interface instance = ERC20Interface(_tokenContractAddress);
            uint256 balance = instance.balanceOf(address(this));
            if (balance < _value) {
                sent = false;
            } else {
                TransferHelper.safeTransfer(_tokenContractAddress, _to, _value);
                sent = true;
            }
        } else {
            (bool success, ) = _to.call{value: _value}("");
            sent = success;
        }

        require(sent, "Failed to transfer amount");
        emit Transfer(_to, _value);
        return sent;
    }

    function transfer(
        address _to,
        uint256 _value,
        address _tokenContractAddress
    ) external payable onlyOwner returns (bool) {
        require(
            makeTransfer(_to, _value, _tokenContractAddress),
            "Failed to transfer"
        );
        return true;
    }

    function transferToMany(
        address[] calldata recipients_,
        uint256[] calldata amounts_,
        address tokenAddress_
    ) public payable onlyOwner returns (bool) {
        require(recipients_.length != 0, "Must send to at least one person");
        require(
            recipients_.length == amounts_.length,
            "Invalid input: length of recipients not equal length of amount"
        );
        require(recipients_.length < 256, "Too many recipients");

        uint256 totalAmount = 0;
        for (uint256 i = 0; i < amounts_.length; i++) {
            totalAmount += amounts_[i];
        }

        require(
            msg.value >= totalAmount ||
                _getBalance(tokenAddress_) >= totalAmount,
            "Not enough value sent to complete transaction"
        );

        for (uint256 i = 0; i < recipients_.length; i++) {
            require(recipients_[i] != address(0), "Invalid recipient address");
            require(
                makeTransfer(recipients_[i], amounts_[i], tokenAddress_),
                "Failed to transfer"
            );
        }
        return true;
    }

    function enableAutoFlush() public onlyOwner returns (bool) {
        autoFlush = true;
        return true;
    }

    function disableAutoFlush() public onlyOwner returns (bool) {
        autoFlush = false;
        return true;
    }

    function changeTransferGasLimit(uint256 newTransferGasLimit)
        external
        onlyOwner
    {
        require(newTransferGasLimit >= 2300, "Transfer gas limit too low");
        emit TransferGasLimitChange(transferGasLimit, newTransferGasLimit);
        transferGasLimit = newTransferGasLimit;
    }

    function flush() public {
        uint256 value = address(this).balance;

        if (value == 0) {
            return;
        }

        (bool success, ) = owner.call{value: value}("");
        require(success, "Flush failed");
        emit Flush(msg.sender, value, msg.data);
    }

    function flushTokens(address tokenContractAddress) external onlyOwner {
        ERC20Interface instance = ERC20Interface(tokenContractAddress);
        address forwarderAddress = address(this);
        uint256 forwarderBalance = instance.balanceOf(forwarderAddress);
        if (forwarderBalance == 0) {
            return;
        }

        TransferHelper.safeTransfer(
            tokenContractAddress,
            owner,
            forwarderBalance
        );
    }

    function flushMultipleTokens(address[] memory tokenContractAddresses)
        external
        onlyOwner
        returns (bool)
    {
        bool success = false;
        for (uint256 i = 0; i < tokenContractAddresses.length; i++) {
            try this.flushTokens(tokenContractAddresses[i]) {
                success = true;
            } catch {
                success = false;
            }
        }
        require(success, "Something went wrong during flush");
        return success;
    }

    receive() external payable {
        if (autoFlush == true) {
            flush();
        }
    }

    fallback() external payable {
        if (autoFlush == true) {
            flush();
        }
    }
}
