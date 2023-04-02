pragma solidity >=0.5.0;

contract DataRW {
  string myDataHash;

  function set(string memory _myDataHash) public {
    myDataHash = _myDataHash;
  }

  function get() public view returns (string memory) {
    return myDataHash;
  }
}