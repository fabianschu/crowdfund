// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity 0.8.4;

/**
 * @title CrowdfundStorage
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

    // The operator has a special role to change contract status.
    address payable public operator = payable(0x9cA70B93CaE5576645F5F069524A9B9c3aef5006);
    address payable public fundingRecipient;
    // We add a hard cap to prevent raising more funds than deemed reasonable.
    uint256 public fundingCap = 100000000000000000; // 0.1 ETH;
    // The operator takes some equity in the tokens, represented by this percent.
    uint256 public operatorPercent = 0;
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

    constructor(address _fundingRecipient, string memory _symbol, string memory _name) {
        fundingRecipient = payable(_fundingRecipient);
        symbol = _symbol;
        name = _name;
    }
}
