// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract QuizToken is ERC20, Ownable {
    using SafeMath for uint256;

    uint256 public rewardAmount = 50 * 10 ** 18;
    address public owner;

    mapping(address => uint256) public userStreak;
    event QuizCompleted(address indexed user, uint256 tokensAwarded);

    constructor() ERC20("QuizToken", "QUIZ") {
        owner = msg.sender;
    }

    // Function to reward users after they answer all questions correctly
    function rewardUser(address user) public onlyOwner {
        require(userStreak[user] > 0, "User has not completed the quiz");
        _mint(user, rewardAmount);
        emit QuizCompleted(user, rewardAmount);
    }

    // Function to allow users to spend tokens to retake the quiz
    function spendTokensForRetake() public {
        require(
            balanceOf(msg.sender) >= rewardAmount.div(2),
            "Insufficient tokens"
        );
        _burn(msg.sender, rewardAmount.div(2));
        userStreak[msg.sender] = 0; // Reset user streak
    }

    // Function to set the reward amount
    function setRewardAmount(uint256 _rewardAmount) public onlyOwner {
        rewardAmount = _rewardAmount;
    }

    // Function to get the user's current token balance
    function getUserBalance(address user) external view returns (uint256) {
        return balanceOf(user);
    }

    // Function to transfer ownership
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "New owner is the zero address");
        owner = newOwner;
    }

    // Function to reset user streak
    function resetUserStreak(address user) public onlyOwner {
        userStreak[user] = 0;
    }

    // Modifier for onlyOwner
    modifier onlyOwner() {
        require(msg.sender == owner, "only owner can perform this.");
        _;
    }
}
