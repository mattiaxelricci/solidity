pragma solidity ^0.4.4;

import "../Utilities/SafeMath.sol";
import "./Token.sol";
import "./ERC20.sol";
import "./ERC223.sol";
import "./ERC223ReceivingContract.sol";
import "../Utilities/Addresses.sol";


contract GrindCoin is Token("GRC", "Grind Coin", 6, 1000000), ERC20, ERC223 {

  using SafeMath for uint;
  using Addresses for address;

  event Burn(address indexed burner, uint256 value);

  function GrindToken () public {
    _balanceOf[msg.sender] = _totalSupply;
  }

  function TotalSupply()
    public
    view
    returns(uint){
      return _totalSupply;
  }

  function balanceOf (address _addr)
    public
    view
    returns (uint) {
    return _balanceOf[_addr];
  }

  function transfer(address _to, uint _value)
    public
    returns (bool){
      return transfer(_to, _value, "");
    }

  function transfer(address _to, uint _value, bytes _data)
    public
    returns (bool){
      require(_value > 0);
      require(_to != address(0));
      require(_value <= _balanceOf[msg.sender]);

      if(_to.isContract()){
        ERC223ReceivingContract _contract = ERC223ReceivingContract(_to);
        _contract.tokenFallback(msg.sender, _value, _data);
      }

      _balanceOf[msg.sender] = _balanceOf[msg.sender].sub(_value);
      _balanceOf[_to] = _balanceOf[_to].add(_value);

      emit Transfer(msg.sender, _to, _value);

      return true;
  }

  function transferFrom(address _from, address _to, uint _value)
    public
    returns (bool) {
      return transferFrom(_from, _to, _value, "");
    }

    function transferFrom(address _from, address _to, uint _value, bytes _data)
      public
      returns (bool) {
        require(_value > 0);
        require(_allowances[_from][msg.sender] > 0);
        require( _balanceOf[_from] >= _value);
        require(_allowances[_from][_to] >= _value);

        _allowances[_from][msg.sender].sub(_value);

        if (_to.isContract()) {
               ERC223ReceivingContract _contract = ERC223ReceivingContract(_to);
               _contract.tokenFallback(msg.sender, _value, _data);
        }

        _balanceOf[_from] = _balanceOf[_from].sub(_value);
        _balanceOf[_to] = _balanceOf[_to].add(_value);

    emit Transfer(_from, _to, _value);

    return true;

  }


  function approve(address _spender, uint _value)
    public
    returns (bool) {
      _allowances[msg.sender][_spender] = _value;
      emit Approval( msg.sender, _spender, _value );
      return true;
  }

  function increaseApproval(address _spender, uint _addedValue) public returns (bool) {
      _allowances[msg.sender][_spender] =  _allowances[msg.sender][_spender].add(_addedValue);
      emit Approval(msg.sender, _spender, _allowances[msg.sender][_spender]);
      return true;
    }

    function decreaseApproval(address _spender, uint _subtractedValue) public returns (bool) {
        uint oldValue = _allowances[msg.sender][_spender];
        if (_subtractedValue > oldValue) {
          _allowances[msg.sender][_spender] = 0;
        } else {
          _allowances[msg.sender][_spender] = oldValue.sub(_subtractedValue);
        }
        emit Approval(msg.sender, _spender,  _allowances[msg.sender][_spender]);
        return true;
      }

      function allowance(address _owner, address _spender)
         public
         view
         returns (uint) {
           if (_allowances[_owner][_spender] < _balanceOf[_owner]) {
             return _allowances[_owner][_spender];
           }
           return _balanceOf[_owner];
     }


     function burn(uint256 _value) public {
        _burn(msg.sender, _value);
      }

      function _burn(address _who, uint256 _value) internal {
        require(_value <= _balanceOf[_who]);
        // no need to require value <= totalSupply, since that would imply the
        // sender's balance is greater than the totalSupply, which *should* be an assertion failure

        _balanceOf[_who] = _balanceOf[_who].sub(_value);
        _totalSupply = _totalSupply.sub(_value);
        emit Burn(_who, _value);
        emit Transfer(_who, address(0), _value);
      }






}
