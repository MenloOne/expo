pragma solidity ^0.4.13;

library SafeMath {

  /**
  * @dev Multiplies two numbers, throws on overflow.
  */
  function mul(uint256 _a, uint256 _b) internal pure returns (uint256 c) {
    // Gas optimization: this is cheaper than asserting 'a' not being zero, but the
    // benefit is lost if 'b' is also tested.
    // See: https://github.com/OpenZeppelin/openzeppelin-solidity/pull/522
    if (_a == 0) {
      return 0;
    }

    c = _a * _b;
    assert(c / _a == _b);
    return c;
  }

  /**
  * @dev Integer division of two numbers, truncating the quotient.
  */
  function div(uint256 _a, uint256 _b) internal pure returns (uint256) {
    // assert(_b > 0); // Solidity automatically throws when dividing by 0
    // uint256 c = _a / _b;
    // assert(_a == _b * c + _a % _b); // There is no case in which this doesn't hold
    return _a / _b;
  }

  /**
  * @dev Subtracts two numbers, throws on overflow (i.e. if subtrahend is greater than minuend).
  */
  function sub(uint256 _a, uint256 _b) internal pure returns (uint256) {
    assert(_b <= _a);
    return _a - _b;
  }

  /**
  * @dev Adds two numbers, throws on overflow.
  */
  function add(uint256 _a, uint256 _b) internal pure returns (uint256 c) {
    c = _a + _b;
    assert(c >= _a);
    return c;
  }
}

contract Ownable {
  address public owner;


  event OwnershipRenounced(address indexed previousOwner);
  event OwnershipTransferred(
    address indexed previousOwner,
    address indexed newOwner
  );


  /**
   * @dev The Ownable constructor sets the original `owner` of the contract to the sender
   * account.
   */
  constructor() public {
    owner = msg.sender;
  }

  /**
   * @dev Throws if called by any account other than the owner.
   */
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  /**
   * @dev Allows the current owner to relinquish control of the contract.
   * @notice Renouncing to ownership will leave the contract without an owner.
   * It will not be possible to call the functions with the `onlyOwner`
   * modifier anymore.
   */
  function renounceOwnership() public onlyOwner {
    emit OwnershipRenounced(owner);
    owner = address(0);
  }

  /**
   * @dev Allows the current owner to transfer control of the contract to a newOwner.
   * @param _newOwner The address to transfer ownership to.
   */
  function transferOwnership(address _newOwner) public onlyOwner {
    _transferOwnership(_newOwner);
  }

  /**
   * @dev Transfers control of the contract to a newOwner.
   * @param _newOwner The address to transfer ownership to.
   */
  function _transferOwnership(address _newOwner) internal {
    require(_newOwner != address(0));
    emit OwnershipTransferred(owner, _newOwner);
    owner = _newOwner;
  }
}

contract Pausable is Ownable {
  event Pause();
  event Unpause();

  bool public paused = false;


  /**
   * @dev Modifier to make a function callable only when the contract is not paused.
   */
  modifier whenNotPaused() {
    require(!paused);
    _;
  }

  /**
   * @dev Modifier to make a function callable only when the contract is paused.
   */
  modifier whenPaused() {
    require(paused);
    _;
  }

  /**
   * @dev called by the owner to pause, triggers stopped state
   */
  function pause() public onlyOwner whenNotPaused {
    paused = true;
    emit Pause();
  }

  /**
   * @dev called by the owner to unpause, returns to normal state
   */
  function unpause() public onlyOwner whenPaused {
    paused = false;
    emit Unpause();
  }
}

contract CanReclaimToken is Ownable {
  using SafeERC20 for ERC20Basic;

  /**
   * @dev Reclaim all ERC20Basic compatible tokens
   * @param _token ERC20Basic The address of the token contract
   */
  function reclaimToken(ERC20Basic _token) external onlyOwner {
    uint256 balance = _token.balanceOf(this);
    _token.safeTransfer(owner, balance);
  }

}

contract ERC20Basic {
  function totalSupply() public view returns (uint256);
  function balanceOf(address _who) public view returns (uint256);
  function transfer(address _to, uint256 _value) public returns (bool);
  event Transfer(address indexed from, address indexed to, uint256 value);
}

contract BasicToken is ERC20Basic {
  using SafeMath for uint256;

  mapping(address => uint256) internal balances;

  uint256 internal totalSupply_;

  /**
  * @dev Total number of tokens in existence
  */
  function totalSupply() public view returns (uint256) {
    return totalSupply_;
  }

  /**
  * @dev Transfer token for a specified address
  * @param _to The address to transfer to.
  * @param _value The amount to be transferred.
  */
  function transfer(address _to, uint256 _value) public returns (bool) {
    require(_value <= balances[msg.sender]);
    require(_to != address(0));

    balances[msg.sender] = balances[msg.sender].sub(_value);
    balances[_to] = balances[_to].add(_value);
    emit Transfer(msg.sender, _to, _value);
    return true;
  }

  /**
  * @dev Gets the balance of the specified address.
  * @param _owner The address to query the the balance of.
  * @return An uint256 representing the amount owned by the passed address.
  */
  function balanceOf(address _owner) public view returns (uint256) {
    return balances[_owner];
  }

}

contract BurnableToken is BasicToken {

  event Burn(address indexed burner, uint256 value);

  /**
   * @dev Burns a specific amount of tokens.
   * @param _value The amount of token to be burned.
   */
  function burn(uint256 _value) public {
    _burn(msg.sender, _value);
  }

  function _burn(address _who, uint256 _value) internal {
    require(_value <= balances[_who]);
    // no need to require value <= totalSupply, since that would imply the
    // sender's balance is greater than the totalSupply, which *should* be an assertion failure

    balances[_who] = balances[_who].sub(_value);
    totalSupply_ = totalSupply_.sub(_value);
    emit Burn(_who, _value);
    emit Transfer(_who, address(0), _value);
  }
}

contract ERC20 is ERC20Basic {
  function allowance(address _owner, address _spender)
    public view returns (uint256);

  function transferFrom(address _from, address _to, uint256 _value)
    public returns (bool);

  function approve(address _spender, uint256 _value) public returns (bool);
  event Approval(
    address indexed owner,
    address indexed spender,
    uint256 value
  );
}

library SafeERC20 {
  function safeTransfer(
    ERC20Basic _token,
    address _to,
    uint256 _value
  )
    internal
  {
    require(_token.transfer(_to, _value));
  }

  function safeTransferFrom(
    ERC20 _token,
    address _from,
    address _to,
    uint256 _value
  )
    internal
  {
    require(_token.transferFrom(_from, _to, _value));
  }

  function safeApprove(
    ERC20 _token,
    address _spender,
    uint256 _value
  )
    internal
  {
    require(_token.approve(_spender, _value));
  }
}

contract StandardToken is ERC20, BasicToken {

  mapping (address => mapping (address => uint256)) internal allowed;


  /**
   * @dev Transfer tokens from one address to another
   * @param _from address The address which you want to send tokens from
   * @param _to address The address which you want to transfer to
   * @param _value uint256 the amount of tokens to be transferred
   */
  function transferFrom(
    address _from,
    address _to,
    uint256 _value
  )
    public
    returns (bool)
  {
    require(_value <= balances[_from]);
    require(_value <= allowed[_from][msg.sender]);
    require(_to != address(0));

    balances[_from] = balances[_from].sub(_value);
    balances[_to] = balances[_to].add(_value);
    allowed[_from][msg.sender] = allowed[_from][msg.sender].sub(_value);
    emit Transfer(_from, _to, _value);
    return true;
  }

  /**
   * @dev Approve the passed address to spend the specified amount of tokens on behalf of msg.sender.
   * Beware that changing an allowance with this method brings the risk that someone may use both the old
   * and the new allowance by unfortunate transaction ordering. One possible solution to mitigate this
   * race condition is to first reduce the spender's allowance to 0 and set the desired value afterwards:
   * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
   * @param _spender The address which will spend the funds.
   * @param _value The amount of tokens to be spent.
   */
  function approve(address _spender, uint256 _value) public returns (bool) {
    allowed[msg.sender][_spender] = _value;
    emit Approval(msg.sender, _spender, _value);
    return true;
  }

  /**
   * @dev Function to check the amount of tokens that an owner allowed to a spender.
   * @param _owner address The address which owns the funds.
   * @param _spender address The address which will spend the funds.
   * @return A uint256 specifying the amount of tokens still available for the spender.
   */
  function allowance(
    address _owner,
    address _spender
   )
    public
    view
    returns (uint256)
  {
    return allowed[_owner][_spender];
  }

  /**
   * @dev Increase the amount of tokens that an owner allowed to a spender.
   * approve should be called when allowed[_spender] == 0. To increment
   * allowed value is better to use this function to avoid 2 calls (and wait until
   * the first transaction is mined)
   * From MonolithDAO Token.sol
   * @param _spender The address which will spend the funds.
   * @param _addedValue The amount of tokens to increase the allowance by.
   */
  function increaseApproval(
    address _spender,
    uint256 _addedValue
  )
    public
    returns (bool)
  {
    allowed[msg.sender][_spender] = (
      allowed[msg.sender][_spender].add(_addedValue));
    emit Approval(msg.sender, _spender, allowed[msg.sender][_spender]);
    return true;
  }

  /**
   * @dev Decrease the amount of tokens that an owner allowed to a spender.
   * approve should be called when allowed[_spender] == 0. To decrement
   * allowed value is better to use this function to avoid 2 calls (and wait until
   * the first transaction is mined)
   * From MonolithDAO Token.sol
   * @param _spender The address which will spend the funds.
   * @param _subtractedValue The amount of tokens to decrease the allowance by.
   */
  function decreaseApproval(
    address _spender,
    uint256 _subtractedValue
  )
    public
    returns (bool)
  {
    uint256 oldValue = allowed[msg.sender][_spender];
    if (_subtractedValue >= oldValue) {
      allowed[msg.sender][_spender] = 0;
    } else {
      allowed[msg.sender][_spender] = oldValue.sub(_subtractedValue);
    }
    emit Approval(msg.sender, _spender, allowed[msg.sender][_spender]);
    return true;
  }

}

contract PausableToken is StandardToken, Pausable {

  function transfer(
    address _to,
    uint256 _value
  )
    public
    whenNotPaused
    returns (bool)
  {
    return super.transfer(_to, _value);
  }

  function transferFrom(
    address _from,
    address _to,
    uint256 _value
  )
    public
    whenNotPaused
    returns (bool)
  {
    return super.transferFrom(_from, _to, _value);
  }

  function approve(
    address _spender,
    uint256 _value
  )
    public
    whenNotPaused
    returns (bool)
  {
    return super.approve(_spender, _value);
  }

  function increaseApproval(
    address _spender,
    uint _addedValue
  )
    public
    whenNotPaused
    returns (bool success)
  {
    return super.increaseApproval(_spender, _addedValue);
  }

  function decreaseApproval(
    address _spender,
    uint _subtractedValue
  )
    public
    whenNotPaused
    returns (bool success)
  {
    return super.decreaseApproval(_spender, _subtractedValue);
  }
}

contract MenloToken is PausableToken, BurnableToken, CanReclaimToken {

  // Token properties
  string public constant name = 'Menlo One';
  string public constant symbol = 'ONE';

  uint8 public constant decimals = 18;
  uint256 private constant token_factor = 10**uint256(decimals);

  // 1 billion ONE tokens in units divisible up to 18 decimals
  uint256 public constant INITIAL_SUPPLY    = 1000000000 * token_factor;

  uint256 public constant PUBLICSALE_SUPPLY = 354000000 * token_factor;
  uint256 public constant GROWTH_SUPPLY     = 246000000 * token_factor;
  uint256 public constant TEAM_SUPPLY       = 200000000 * token_factor;
  uint256 public constant ADVISOR_SUPPLY    = 100000000 * token_factor;
  uint256 public constant PARTNER_SUPPLY    = 100000000 * token_factor;

  /**
   * @dev Magic value to be returned upon successful reception of Menlo Tokens
   */
  bytes4 internal constant ONE_RECEIVED = 0x150b7a03;

  address public crowdsale;
  address public teamTimelock;
  address public advisorTimelock;

  modifier notInitialized(address saleAddress) {
    require(address(saleAddress) == address(0), "Expected address to be null");
    _;
  }

  constructor(address _growth, address _teamTimelock, address _advisorTimelock, address _partner) public {
    assert(INITIAL_SUPPLY > 0);
    assert((PUBLICSALE_SUPPLY + GROWTH_SUPPLY + TEAM_SUPPLY + ADVISOR_SUPPLY + PARTNER_SUPPLY) == INITIAL_SUPPLY);

    uint256 _poolTotal = GROWTH_SUPPLY + TEAM_SUPPLY + ADVISOR_SUPPLY + PARTNER_SUPPLY;
    uint256 _availableForSales = INITIAL_SUPPLY - _poolTotal;

    assert(_availableForSales == PUBLICSALE_SUPPLY);

    teamTimelock = _teamTimelock;
    advisorTimelock = _advisorTimelock;

    mint(msg.sender, _availableForSales);
    mint(_growth, GROWTH_SUPPLY);
    mint(_teamTimelock, TEAM_SUPPLY);
    mint(_advisorTimelock, ADVISOR_SUPPLY);
    mint(_partner, PARTNER_SUPPLY);

    assert(totalSupply_ == INITIAL_SUPPLY);
    pause();
  }

  function initializeCrowdsale(address _crowdsale) public onlyOwner notInitialized(crowdsale) {
    unpause();
    transfer(_crowdsale, balances[msg.sender]);  // Transfer left over balance after private presale allocations
    crowdsale = _crowdsale;
    pause();
    transferOwnership(_crowdsale);
  }

  function mint(address _to, uint256 _amount) internal {
    balances[_to] = _amount;
    totalSupply_ = totalSupply_.add(_amount);
    emit Transfer(address(0), _to, _amount);
  }

  /**
   * @dev Safely transfers the ownership of a given token ID to another address
   * If the target address is a contract, it must implement `onERC721Received`,
   * which is called upon a safe transfer, and return the magic value `bytes4(0x150b7a03)`;
   * otherwise, the transfer is reverted.
   * Requires the msg sender to be the owner, approved, or operator
   * @param _to address to receive the tokens.  Must be a MenloTokenReceiver based contract
   * @param _value uint256 number of tokens to transfer
   * @param _action uint256 action to perform in target _to contract
   * @param _data bytes data to send along with a safe transfer check
   **/
  function transferAndCall(address _to, uint256 _value, uint256 _action, bytes _data) public returns (bool) {
    if (transfer(_to, _value)) {
      require (MenloTokenReceiver(_to).onTokenReceived(msg.sender, _value, _action, _data) == ONE_RECEIVED, "Target contract onTokenReceived failed");
      return true;
    }

    return false;
  }
}

contract MenloTokenReceiver {

    /*
     * @dev Address of the MenloToken contract
     */
    MenloToken token;

    constructor(MenloToken _tokenContract) public {
        token = _tokenContract;
    }

    /**
     * @dev Magic value to be returned upon successful reception of Menlo Tokens
     */
    bytes4 internal constant ONE_RECEIVED = 0x150b7a03;

    /**
     * @dev Throws if called by any account other than the Menlo Token contract.
     */
    modifier onlyTokenContract() {
        require(msg.sender == address(token));
        _;
    }

    /**
     * @notice Handle the receipt of Menlo Tokens
     * @dev The MenloToken contract calls this function on the recipient
     * after a `transferAndCall`. This function MAY throw to revert and reject the
     * transfer. Return of other than the magic value MUST result in the
     * transaction being reverted.
     * Warning: this function must call the onlyTokenContract modifier to trust
     * the transfer took place
     * @param _from The address which previously owned the token
     * @param _value Number of tokens that were transfered
     * @param _action Used to define enumeration of possible functions to call
     * @param _data Additional data with no specified format
     * @return `bytes4(0x150b7a03)`
     */
    function onTokenReceived(
        address _from,
        uint256 _value,
        uint256 _action,
        bytes _data
    ) public /* onlyTokenContract */ returns(bytes4);
}

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
    uint public constant ACTION_UNVOTE   = 4;

    uint256 public epochTimestamp;
    uint256 public epochPrior;
    uint256 public epochCurrent;
    mapping(uint256 => int256) public votes;
    mapping(uint256 => mapping(address => int8)) voters;
    address[] public posters;

    uint256 public postCost;
    uint256 public nextPostCost;

    uint256 public rewardPool;
    address[5] public payouts;

    constructor(MenloToken _token) public MenloTokenReceiver(_token) {
        posters.push(0);
        emit Topic(0, 0);

        // no author for root post 0
        postCost = 20 * 10**18;
        nextPostCost = 20 * 10**18;
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
        // I wish we had switch()
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

    function vote(address _voter, uint256 _offset, int8 _direction) internal {
        int8 priorVote = voters[_offset][_voter];
        votes[_offset] += _direction - priorVote;
        voters[_offset][_voter] = _direction;
    }

    function pushPoster(address _poster) internal {
        posters.push(_poster);
    }

    function upvote(address _poster,uint256 _offset) internal {
        vote(_poster, _offset, 1);
    }

    function downvote(address _poster,uint256 _offset) internal {
        vote(_poster, _offset, - 1);
    }

    function unvote(address _poster, uint256 _offset) internal {
        vote(_poster, _offset, 0);
    }

    function post(bytes32 _parentHash, bytes32 _contentHash) internal {
        emit Topic(_parentHash, _contentHash);
        pushPoster(msg.sender);
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

    modifier usesONE(uint256 _value) {
        require(postCost == _value);
        _;
    }

    function decodeUint(bytes b, uint index) internal pure returns (uint256 result, uint i) {
        uint c = 0;
        for (i = index; i < b.length && c != 44; i++) {
            c = uint(b[i]);
            if (c >= 48 && c <= 57) {
                result = result * 10 + (c - 48);
            }
        }
    }

    function decodeBytes32(bytes b, uint index) internal pure returns (bytes32 result, uint i) {
        uint r = 0;
        uint c = 0;
        bytes32 b32;

        require(uint(b[index++]) == 34, "Expected \" to start bytes32");

        for (i = index; i < b.length && r < 32 && c != 34; i++) {
            c = uint(b[i]);
            b32 |= bytes32(b[i] & 0xFF) >> (r++ * 8);
        }

        result = b32;
    }

    function decodeAddress(bytes b, uint index) internal pure returns (address result, uint i) {
        uint c = 0;
        uint256 r = 0;

        require(b.length - index > 3);
        require(uint(b[index++]) == 34);  // "
        require(uint(b[index++]) == 48);  // 0
        require(uint(b[index++]) == 120); // x

        for (i = index; i < b.length && c != 44; i++) {
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

        result = address(r);
    }

    event LogBytes(bytes b);

    function onTokenReceived(
        address _from,
        uint256 _value,
        uint256 _action,
        bytes _data
    ) public onlyTokenContract usesONE(_value) returns(bytes4) {

        uint offset;
        uint i;

        if (_action == ACTION_UPVOTE) {
            (offset, i) = decodeUint(_data, 1);
            upvote(_from, offset);
            return ONE_RECEIVED;
        }

        if (_action == ACTION_DOWNVOTE) {
            (offset, i) = decodeUint(_data, 1);
            downvote(_from, offset);
            return ONE_RECEIVED;
        }

        if (_action == ACTION_UNVOTE) {
            (offset, i) = decodeUint(_data, 1);
            unvote(_from, offset);
            return ONE_RECEIVED;
        }

        if (_action == ACTION_POST) {
            bytes32 parentHash;
            bytes32 contentHash;


            (parentHash, i)  = decodeBytes32(_data, 1);
            (contentHash, i) = decodeBytes32(_data, i);

            post(parentHash, contentHash);
            return ONE_RECEIVED;
        }

        return 0;
    }

}

interface Redeemer {
    function redeem() external;
    function undo() external;
    function to() external view returns (MenloToken);
    function from() external view returns (MenloToken);
}

