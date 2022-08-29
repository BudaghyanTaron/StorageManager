// SPDX-License-Identifier: MIT

pragma solidity ^0.8.15;

interface IProxyAdmin {
    function upgrade(address proxy, address implementation) external;
}