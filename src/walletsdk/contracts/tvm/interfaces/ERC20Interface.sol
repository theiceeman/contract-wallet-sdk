// SPDX-License-Identifier: GPL-3.0
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
