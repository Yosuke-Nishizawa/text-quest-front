export default [
  "event Received(address,address,uint256,bytes)",
  "event TransactionExecuted(address indexed,uint256 indexed,bytes)",
  "function executeCall(address,uint256,bytes) payable returns (bytes)",
  "function isValidSignature(bytes32,bytes) view returns (bytes4)",
  "function nonce() view returns (uint256)",
  "function onERC721Received(address,address,uint256,bytes) returns (bytes4)",
  "function owner() view returns (address)",
  "function supportsInterface(bytes4) pure returns (bool)",
  "function token() view returns (uint256, address, uint256)",
];
