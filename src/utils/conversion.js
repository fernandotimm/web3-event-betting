import bs58 from 'bs58';

function buf2hex(buffer) { // buffer is an ArrayBuffer
  return [...new Uint8Array(buffer)]
      .map(x => x.toString(16))
      .join('');
}

function hex2buf(hex) {
	const buffer = new ArrayBuffer(hex.length / 2);
	const array = new Uint8Array(buffer);
	let k = 0;
	for (let i = 0; i < hex.length; i +=2 ) {
		array[k] = parseInt(hex[i] + hex[i+1], 16);
		k++;
	}

	return array;
}

// Return bytes32 hex string from base58 encoded ipfs hash,
// stripping leading 2 bytes from 34 byte IPFS hash
// Assume IPFS defaults: function:0x12=sha2, size:0x20=256 bits
// E.g. "QmNSUYVKDSvPUnRLKmuxk9diJ6yS96r1TrAXzjTiBcCLAL" -->
// "0x017dfd85d4f6cb4dcd715a88101f7b1f06cd1e009b2327a0809d01eb9c91f231"

const getBytes32FromIpfsHash = (ipfsListing) => {
  const decoded = bs58.decode(ipfsListing).slice(2);
  const hexValue = buf2hex(decoded);
  return `0x${hexValue}`;
}

// Return base58 encoded ipfs hash from bytes32 hex string,
// E.g. "0x017dfd85d4f6cb4dcd715a88101f7b1f06cd1e009b2327a0809d01eb9c91f231"
// --> "QmNSUYVKDSvPUnRLKmuxk9diJ6yS96r1TrAXzjTiBcCLAL"

const getIpfsHashFromBytes32 = (bytes32Hex) => {
  // Add our default ipfs values for first 2 bytes:
  // function:0x12=sha2, size:0x20=256 bits
  // and cut off leading "0x"
  const hashHex = "1220" + bytes32Hex.slice(2)
  const hashBytes = hex2buf(hashHex);
  const hashStr = bs58.encode(hashBytes)
  return hashStr
}

export {
  getBytes32FromIpfsHash,
  getIpfsHashFromBytes32,
}
