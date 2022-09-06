// SPDX-License-Identifier: MIT

pragma solidity 0.8.15;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract SlotManager is OwnableUpgradeable {

    // Slot number for mapping is calculated by keccak256("Budaghyan")
    bytes32 public constant MAPPING_SLOT_NUMBER = 0x51f5ddb27aabaa95d67747e18560df08cd7e0856378de3bc28dab9f58bb5e7d5;

    uint256 public firstSlot;

    modifier validSlot(uint256 _slotNumber, uint256 _lastSlotNumber) {
        require(_slotNumber <= _lastSlotNumber, "ProxyContract: This slot is already available");
        _;
    }

    function swapValuesAtSlots(uint256 _slot1, uint256 _slot2) external {
        _swapValues(_slot1, _slot2);
    }

    function addVaribaleAtSlot(
        uint256 _slotNumber, 
        uint256 _lastSlotNumber
    ) 
    external 
    validSlot(_slotNumber, _lastSlotNumber)
    {
        require(!_unmovable(_slotNumber), "ProxyContract: Variable can not be added inplace of unmovable one");
        _moveSlotTo(int256(_lastSlotNumber + 1), int256(_slotNumber));
    }

    function removeVariableAtSlot(
        uint256 _slotNumber, 
        uint256 _lastSlotNumber
    ) 
    external 
    validSlot(_slotNumber, _lastSlotNumber)
    {
        _moveSlotTo(int256(_slotNumber), int256(_lastSlotNumber));
        _resetSlot(_lastSlotNumber);
    }

    function moveVariableToSlot(
        uint256 _currentSlotNumber,
        uint256 _newSlotNumber
    )
    external
    {   
        require(!_unmovable(_currentSlotNumber), "SlotManager: You can not move this variable");
        require(!_unmovable(_newSlotNumber), "SlotManager: You can not move to this variable's slot");
        _moveSlotTo(int256(_currentSlotNumber), int256(_newSlotNumber));
    }

    function updateSlotMovability(uint256 _slotNumber, bool _isUnmovable) external {
        _updateSlot(_slotNumber, _isUnmovable);
    }

    function isUnmovable(uint256 _slotNumber) external view returns(bool) {
        return _unmovable(_slotNumber);
    }

    function getValueAtSlot(uint256 _slotNumber) external view returns(uint256) {
        return _valueAt(_slotNumber);
    }

    function getFirstElementRealSlot() external pure returns(uint256) {
        return _firstSlot();
    }

    function _moveSlotTo(int256 _currentSlot, int256 _newSlot) private {
        int256 step = _currentSlot < _newSlot ? int256(1) : -1;
        int256 currentSlot = _currentSlot;
        int256 nextSwapSlot = _currentSlot + step;
        while(currentSlot != _newSlot) {
            if(!_unmovable(uint256(nextSwapSlot))){
                _swapValues(uint256(currentSlot), uint256(nextSwapSlot));
                currentSlot = nextSwapSlot;
            }
            nextSwapSlot += step;
        }
    }

    function _swapValues(uint256 _slot1, uint256 _slot2) private {
        uint256 realSlot1 = _firstSlot() + _slot1;
        uint256 realSlot2 = _firstSlot() + _slot2;
        assembly {
            let value1 := sload(realSlot1)
            sstore(realSlot1, sload(realSlot2))
            sstore(realSlot2, value1)
        }
    }

    function _resetSlot(uint256 _slotNumber) private {
        uint256 realSlot = _firstSlot() + _slotNumber;
        assembly {
            sstore(realSlot, 0)
        }
    }

    function _updateSlot(uint256 _slotNumber, bool _isUnmovable) private {
        uint256 realSlot = _firstSlot() + _slotNumber;
        bytes32 slot = _getSlotInMapping(realSlot);
        assembly{
            sstore(slot, _isUnmovable)
        }
    }

    function _valueAt(uint256 _slotNumber) private view returns(uint256 value) {
        uint256 realSlot = _firstSlot() + _slotNumber;
        assembly {
            value := sload(realSlot)
        }
    }

    function _unmovable(uint256 _slotNumber) private view returns(bool unmovable) {
        uint256 realSlot = _firstSlot() + _slotNumber;
        bytes32 slot = _getSlotInMapping(realSlot);
        assembly {
            unmovable := sload(slot)
        }
    }

    function _getSlotInMapping(uint256 _slotNumber) private pure returns(bytes32 slot) {
        slot = keccak256(bytes.concat(bytes32(_slotNumber), MAPPING_SLOT_NUMBER));
    }

    function _firstSlot() private pure returns(uint256 value) {
        assembly {
            value := firstSlot.slot
        }
    }

}
