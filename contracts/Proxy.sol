// SPDX-License-Identifier: MIT

pragma solidity 0.8.15;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract Proxy is OwnableUpgradeable {

    uint256 public slot1;
    uint256 public slot2;
    uint256 public slot3;
    uint256 public slot4;
    uint256 public slot5;
    uint256 public slot6;

    function initialize(
        uint256 _slot1,
        uint256 _slot2,
        uint256 _slot3,
        uint256 _slot4,
        uint256 _slot5,
        uint256 _slot6
    ) public initializer {
        slot1 = _slot1;
        slot2 = _slot2;
        slot3 = _slot3;
        slot4 = _slot4;
        slot5 = _slot5;
        slot6 = _slot6;

        __Ownable_init();
    }

    function resetValues() external {
        slot1 = 1;
        slot2 = 2;
        slot3 = 3;
        slot4 = 4;
        slot5 = 5;
        slot6 = 6;
    }

}
