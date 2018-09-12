/*
    Copyright 2018 Menlo, Inc.

    Licensed under the Apache License, Version 2.0 (the “License”);
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an “AS IS” BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
pragma solidity^0.4.24;

import "menlo-token/contracts/MenloToken.sol";
import "./Redeemer.sol";



contract ForumEvents {
    // the total ordering of all events on a smart contract is defined
    // a parent of 0x0 indicates root topic
    // by convention, the bytes32 is a keccak-256 content hash
    // the multihash prefix for this is 1b,20
    event Topic(bytes32 _parentHash, bytes32 contentHash);
}


contract Forum is MenloTokenReceiver, ForumEvents, Ownable {

    uint public constant ACTION_POST     = 1;
    uint public constant ACTION_UPVOTE   = 2;
    uint public constant ACTION_DOWNVOTE = 3;

    uint256 public epochTimestamp;
    uint256 public epochPrior;
    uint256 public epochCurrent;
    mapping(uint256 => int256) public votes;
    mapping(uint256 => mapping(address => int8)) public voters;
    address[] public posters;

    uint256 public voteCost;
    uint256 public postCost;
    uint256 public nextPostCost;

    uint256 public rewardPool;
    address[5] public payouts;

    constructor(MenloToken _token, uint256 _postCost, uint256 _voteCost) public MenloTokenReceiver(_token) {
        // posters.push(0);
        // emit Topic(0, 0);

        // no author for root post 0
        voteCost = _voteCost;
        postCost = _postCost;
        nextPostCost = _postCost;
    }

    function postCount() public view returns (uint256) {
        return posters.length;
    }

    function endEpoch() external {
        require(era() >= epochTimestamp + 1 days);
        epochTimestamp = era();

        uint256[5] memory winners;
        int256[5] memory topVotes;
        // get top 5 posts
        for (uint256 i = epochCurrent; i -- > epochPrior;) {
            if (votes[i] == 0) {
                continue;
            }

            int256 current = votes[i];
            if (current > topVotes[4]) {
                // insert it

                /*
                uint8 j = 4;
                while (topVotes[j-1] < current) {
                    topVotes[j] = topVotes[j-1];
                    winners[j] = winners[j-1];
                    j--;
                    if (j == 0) {
                        break;
                    }
                }
                topVotes[j] = current;
                winners[j] = i;
                */
                // the code below is equivalent to the commented code above
                if (current > topVotes[2]) {
                    topVotes[4] = topVotes[3];
                    topVotes[3] = topVotes[2];
                    winners[4] = winners[3];
                    winners[3] = winners[2];
                    if (current > topVotes[1]) {
                        topVotes[2] = topVotes[1];
                        winners[2] = winners[1];
                        if (current > topVotes[0]) {
                            topVotes[1] = topVotes[0];
                            topVotes[0] = current;
                            winners[1] = winners[0];
                            winners[0] = i;
                        } else {
                            topVotes[1] = current;
                            winners[1] = i;
                        }
                    } else {
                        topVotes[2] = current;
                        winners[2] = i;
                    }
                } else {
                    if (current > topVotes[3]) {
                        topVotes[4] = topVotes[3];
                        topVotes[3] = current;
                        winners[4] = winners[3];
                        winners[3] = i;
                    } else {
                        topVotes[4] = current;
                        winners[4] = i;
                    }
                }
            }
            votes[i] = 0;
        }

        // write the new winners
        for (i = 0; i < 5; i++) {
            payouts[i] = posters[winners[i]];
        }

        // refresh the pool
        rewardPool = token.balanceOf(this);
        epochPrior = epochCurrent;
        epochCurrent = posters.length;
        if (nextPostCost != postCost) {
            postCost = nextPostCost;
        }
    }

    function reward(uint8 _payout) public view returns (uint256) {
        if (_payout == 0) {
            return rewardPool * 2 / 5;
        } else if (_payout == 1) {
            return rewardPool / 4;
        } else if (_payout == 2) {
            return rewardPool / 5;
        } else if (_payout == 3) {
            return rewardPool / 10;
        } else if (_payout == 4) {
            return rewardPool / 20;
        }
        return 0;
    }

    function claim(uint8 _payout) external {
        require(payouts[_payout] == msg.sender);
        payouts[_payout] = 0;
        token.transfer(msg.sender, reward(_payout));
    }

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }
    function setOwner(address _owner) external onlyOwner {
        owner = _owner;
    }

    function setNextPostCost(uint256 _nextPostCost) external onlyOwner {
        nextPostCost = _nextPostCost;
    }

    function redeem(Redeemer _redeemer) external onlyOwner returns (MenloToken) {
        require(_redeemer.from() == token);

        token.approve(_redeemer, token.balanceOf(this));
        _redeemer.redeem();
        MenloToken to = _redeemer.to();
        // tokenContract = to;
        return to;
    }

    function undo(Redeemer _redeemer) external onlyOwner returns (MenloToken) {
        require(_redeemer.to() == token);

        token.approve(_redeemer, token.balanceOf(this));
        _redeemer.undo();
        MenloToken from = _redeemer.from();
        // tokenContract = from;
        return from;
    }

    function era() internal view returns (uint256) {
        return now;
    }

    event Votes(uint256, int256);
    event MyVote(int256);

    function vote(address _voter, uint256 _offset, int8 _direction) internal {
        int8 priorVote = voters[_offset][_voter];

        require (priorVote != _direction, "Can't vote for same comment more than 1 time");

        votes[_offset] += _direction;
        voters[_offset][_voter] = priorVote + _direction;

        emit MyVote(voters[_offset][_voter]);
        emit Votes(_offset, votes[_offset]);
    }

    function pushPoster(address _poster) internal {
        posters.push(_poster);
    }

    function upvote(address _voter, uint256 _offset) internal {
        vote(_voter, _offset, 1);
    }

    function downvote(address _voter, uint256 _offset) internal {
        vote(_voter, _offset, -1);
    }

    function post(address _poster, bytes32 _parentHash, bytes32 _contentHash) internal {
        emit Topic(_parentHash, _contentHash);
        pushPoster(_poster);
        voters[posters.length][_poster] = 1;
    }

    function uintFromBytes(bytes bs)
    internal pure
    returns (uint256)
    {
        require(bs.length >= 32, "invalid conversion from bytes to uint");
        uint256 x;
        assembly {
            x := mload(add(bs, 0x20))
        }
        return x;
    }

    function addressFromBytes(bytes bs)
    internal pure
    returns (address)
    {
        require(bs.length >= 20, "invalid conversion from bytes to address");
        address x;
        assembly {
            x := mload(add(bs, 20))
        }
        return x;
    }

    function decodeUint(bytes b, uint index) internal pure returns (uint256 result, uint i) {
        uint c = 0;

        require(uint(b[index++]) == 34, "Expected \" for var"); // "

        for (i = index; i < b.length && uint(b[i]) != 34; i++) {
            c = uint(b[i]);
            if (c >= 48 && c <= 57) {
                result = result * 10 + (c - 48);
            }
        }
        i += 2;
    }

    function decodeAddress(bytes b, uint index) internal pure returns (address result, uint i) {
        uint c = 0;
        uint256 r = 0;

        require(b.length - index > 3, "Expected \"0x for var");
        require(uint(b[index++]) == 34, "Expected \" for var");  // "
        require(uint(b[index++]) == 48, "Expected 0 for var");  // 0
        require(uint(b[index++]) == 120, "Expected x for var"); // x

        for (i = index; i < b.length && uint(b[i]) != 34; i++) {
            c = uint(b[i]);

            if (c >= 48 && c <= 57) {
                r = r * 16 + (c - 48);
            } else
                if (c >= 65 && c <= 70) {
                    r = r * 16 + (c - 65 + 10);
                } else
                    if (c >= 97 && c <= 102) {
                        r = r * 16 + (c - 97 + 10);
                    }
        }
        i += 2;

        result = address(r);
    }

    function decodeBytes32(bytes b, uint index) internal pure returns (bytes32 result, uint i) {
        uint r = 0;
        uint c = 0;
        bytes32 b32;

        require(b.length - index > 3, "Expected \"0x for var");
        require(uint(b[index++]) == 34, "Expected \" for var");  // "
        require(uint(b[index++]) == 48, "Expected 0 for var");  // 0
        require(uint(b[index++]) == 120, "Expected x for var"); // x

        for (i = index; i < b.length && uint(b[i]) != 34; i++) {
            c = uint(b[i]);

            if (c >= 48 && c <= 57) {
                c = c - 48;
            } else
                if (c >= 65 && c <= 70) {
                    c = c - 65 + 10;
                } else
                    if (c >= 97 && c <= 102) {
                        c = c - 97 + 10;
                    }

            require (r <= 63, "byte32 can't be longer than 32 bytes");
            b32 |= bytes32(c & 0xF) << ((63-r++) * 4);
        }
        i += 2;

        result = b32;
    }

    function usesONE(uint256 _value, uint256 _cost) internal pure returns (bool) {
        return (_cost == _value);
    }

    function onTokenReceived(
        address _from,
        uint256 _value,
        uint256 _action,
        bytes _data
    ) public onlyTokenContract returns(bytes4) {

        uint offset;
        uint i;

        if (_action == ACTION_UPVOTE) {
            require(usesONE(_value, voteCost), "Voting tokens sent != cost");

            (offset, i) = decodeUint(_data, 1);
            upvote(_from, offset);
            return ONE_RECEIVED;
        }

        if (_action == ACTION_DOWNVOTE) {
            require(usesONE(_value, voteCost), "Voting tokens sent != cost");

            (offset, i) = decodeUint(_data, 1);
            downvote(_from, offset);
            return ONE_RECEIVED;
        }

        if (_action == ACTION_POST) {
            require(usesONE(_value, postCost), "Posting tokens sent != cost");

            bytes32 parentHash;
            bytes32 contentHash;

            (parentHash, i)  = decodeBytes32(_data, 1);
            (contentHash, i) = decodeBytes32(_data, i);

            post(_from, parentHash, contentHash);
            return ONE_RECEIVED;
        }

        return 0;
    }

}
