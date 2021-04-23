// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity 0.8.4;

interface ICrowdfundFactory {
    function mediaAddress() external returns (address);

    function wethAddress() external returns (address);

    function logic() external returns (address);

    // ERC20 data.
    function parameters()
        external
        returns (
            address payable operator,
            uint256 fundingCap,
            uint256 operatorPercent,
            string memory name,
            string memory symbol
        );
}

/**
 * @title CrowdfundProxy
 * @author MirrorXYZ
 */
contract CrowdfundStorage {
    // The two states that this contract can exist in. "FUNDING" allows
    // contributors to add funds.
    enum Status {FUNDING, TRADING}

    // ============ Constants ============

    // The factor by which ETH contributions will multiply into crowdfund tokens.
    uint16 internal constant TOKEN_SCALE = 1000;
    uint256 internal constant REENTRANCY_NOT_ENTERED = 1;
    uint256 internal constant REENTRANCY_ENTERED = 2;
    uint8 public constant decimals = 18;

    // ============ Immutable Storage ============

    // The operator has a special role to control NFT sale and change contract status.
    address payable public operator;
    // We add a hard cap to prevent raising more funds than deemed reasonable.
    uint256 public fundingCap;
    // The operator takes some equity in the tokens, represented by this percent.
    uint256 public operatorPercent;
    string public symbol;
    string public name;

    // ============ Mutable Storage ============

    // Represents the current state of the campaign.
    Status public status;
    uint256 internal reentrancy_status;

    // ============ Mutable ERC20 Attributes ============

    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    mapping(address => uint256) public nonces;

    // ============ Delegation logic ============
    address public logic;
}
