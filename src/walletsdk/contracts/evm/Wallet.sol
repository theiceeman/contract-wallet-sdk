// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.20;
import "lib/v3-core/contracts/libraries/TransferHelper.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Wallet {
    event Transfer(address, uint256);
    event Flush(address from, uint256 value, bytes data);
    event TransferGasLimitChange(
        uint256 prevTransferGasLimit,
        uint256 newTransferGasLimit
    );
    event MasterChanged(
        address indexed previousMaster,
        address indexed newMaster
    );
    event OwnerChanged(address indexed previousOwner, address indexed newOwner);

    address payable public owner;
    address payable public master;
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

    modifier onlyMaster() {
        require(msg.sender == master, "Not master");
        _;
    }
    modifier onlyOwnerOrMaster() {
        require(msg.sender == owner || msg.sender == master, "Not authorized");
        _;
    }

    function init(
        address owner_,
        address master_,
        string memory name_,
        bool enableAutoFlush_
    ) external onlyUninitialized {
        owner = payable(owner_);
        master = payable(master_);
        name = name_;
        autoFlush = enableAutoFlush_;

        uint256 value = address(this).balance;

        if (value == 0 || autoFlush == false) {
            return;
        }

        (bool success, ) = master.call{value: value}("");
        require(success, "Flush failed");
        // NOTE: since we are forwarding on initialization,
        // we don't have the context of the original sender.
        // We still emit an event about the forwarding but set
        // the sender to the forwarder itself
        emit Flush(address(this), value, msg.data);
    }

    /// @dev Transfers ownership of wallet to another address.
    /// @param newOwner_ - Address ownership should be transferred to.
    /// @return Returns true if successfull; or false otherwise.
    function transferOwnership(
        address newOwner_
    ) public onlyOwner returns (bool) {
        require(owner != address(0), "Owner is required");
        emit OwnerChanged(owner, newOwner_);
        owner = payable(newOwner_);
        require(owner != address(0), "Owner is required");
        return true;
    }

    function setMaster(address newMaster_) public onlyOwner returns (bool) {
        require(newMaster_ != address(0), "Master is required");
        emit MasterChanged(master, newMaster_);
        master = payable(newMaster_);
        return true;
    }

    function _getBalance(
        address tokenContractAddress
    ) private view returns (uint256) {
        if (tokenContractAddress == address(this)) {
            return address(this).balance;
        } else {
            IERC20 instance = IERC20(tokenContractAddress);
            address address_ = address(this);
            uint256 balance_ = instance.balanceOf(address_);
            return balance_;
        }
    }

    /// @dev This returns the wallets's balance of native and erc20 assets.
    /// @param tokenContractAddress - Address of erc20 asset or enter this contract's address for its native asset balance.
    /// @return Returns balance of the asset.
    function getBalance(
        address tokenContractAddress
    ) public view onlyOwner returns (uint256) {
        return _getBalance(tokenContractAddress);
    }

    function makeTransfer(
        address _to,
        uint256 _value,
        address _tokenContractAddress
    ) private returns (bool) {
        bool sent;
        if (_tokenContractAddress != address(this)) {
            IERC20 instance = IERC20(_tokenContractAddress);
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

    /// @dev Transfers native and erc20 assets to another address.
    /// @param _to - Address to transfer assets to.
    /// @param _value - Amount to be transferred.
    /// @param _tokenContractAddress - Address of erc20 asset or enter this contract's address to transfer native asset.
    /// @return Returns true if successfull.
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

    /// @dev This initiates transfer to many address at once in a single transaction
    /// @param recipients_[] - Array of addresses to recieve assets.
    /// @param amounts_[] - Array of amounts to be sent to the recipients; respectively.
    /// @param tokenAddress_ - Address of erc20 asset or enter this contract's address to transfer native asset.
    /// @return Returns true if successfull.
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

    /// @dev Enables automatic flush of tokens to owners wallet on reception.
    /// @return Returns true if successfull.
    function enableAutoFlush() public onlyOwner returns (bool) {
        autoFlush = true;
        return true;
    }

    /// @dev Disables automatic flush of tokens to owners wallet on reception.
    /// @return Returns true if successfull.
    function disableAutoFlush() public onlyOwner returns (bool) {
        autoFlush = false;
        return true;
    }

    /// @dev Change gas limit of on chain transfer
    /// @param newTransferGasLimit - The new transfer gasLimit to be set.
    function changeTransferGasLimit(
        uint256 newTransferGasLimit
    ) external onlyOwner {
        require(newTransferGasLimit >= 2300, "Transfer gas limit too low");
        emit TransferGasLimitChange(transferGasLimit, newTransferGasLimit);
        transferGasLimit = newTransferGasLimit;
    }

    /// @dev This Flushes native assets to deployer/owner address.
    function flush() public {
        uint256 value = address(this).balance;

        if (value == 0) {
            return;
        }

        (bool success, ) = master.call{value: value}("");
        require(success, "Flush failed");
        emit Flush(msg.sender, value, msg.data);
    }

    /// @dev This flushes a single erc20 token to a deployer/owner address.
    /// @param tokenContractAddress - Address of token to be flushed.
    function flushTokens(
        address tokenContractAddress
    ) public onlyOwnerOrMaster returns (bool) {
        IERC20 instance = IERC20(tokenContractAddress);
        address forwarderAddress = address(this);
        uint256 forwarderBalance = instance.balanceOf(forwarderAddress);
        if (forwarderBalance == 0) {
            return false;
        }

        TransferHelper.safeTransfer(
            tokenContractAddress,
            master,
            forwarderBalance
        );
        return true;
    }

    /// @dev This flushes multiple erc20 tokens to a deployer/owner address.
    /// @param tokenContractAddresses - Array of asset addresses to be flushed.
    /// @return Returns true if successfull.
    function flushMultipleTokens(
        address[] calldata tokenContractAddresses
    ) external onlyOwnerOrMaster returns (bool) {
        for (uint256 i = 0; i < tokenContractAddresses.length; i++) {
            require(
                flushTokens(tokenContractAddresses[i]),
                "Something went wrong during flush"
            );
        }
        return true;
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
