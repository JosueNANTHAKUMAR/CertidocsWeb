// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract SignatureRegistry {
    struct SignatureData {
        address signer;
        bytes32 messageHash; // Hash du message, pas le message lui-même
        uint256 expiration;
        address[] authorizedRecipients;
    }

    mapping(bytes32 => SignatureData) public signatures;

    event SignatureStored(
        bytes32 indexed signatureId
    );

    function storeSignature(
        bytes32 _messageHash,
        uint256 _expiration,
        address[] memory _authorizedRecipients,
        bytes memory _signature,
        uint256 _timestamp 
    ) external {
        address recoveredSigner = recoverSigner(_messageHash, _signature);
        require(recoveredSigner == msg.sender, "Invalid signature");

        bytes32 signatureId = keccak256(
            abi.encodePacked(msg.sender, _messageHash, _timestamp)
        );

        signatures[signatureId] = SignatureData({
            signer: recoveredSigner,
            messageHash: _messageHash,
            expiration: _expiration,
            authorizedRecipients: _authorizedRecipients
        });

        emit SignatureStored(signatureId);
    }

    function verifySignature(
        bytes32 _signatureId,
        address _recipient,
        bytes32 _messageHash
    ) external view returns (bool, address, address, bytes32, bytes32) {
        SignatureData memory data = signatures[_signatureId];

        // check if the recipient is authorized
        bool isAuthorized = false;
        for (uint256 i = 0; i < data.authorizedRecipients.length; i++) {
            if (data.authorizedRecipients[i] == _recipient) {
                isAuthorized = true;
                break;
            }
        }

        if (!isAuthorized) {
            return (false, data.signer, data.signer, data.messageHash, _messageHash);
        }

        bool isValid =(data.messageHash == _messageHash) &&
                    (block.timestamp <= data.expiration);

        return (isValid, data.signer, data.signer, data.messageHash, _messageHash);
    }
    
    function recoverSigner(bytes32 _messageHash, bytes memory _signature)
        internal
        pure
        returns (address)
    {
        require(_signature.length == 65, "Signature invalide");

        bytes32 r;
        bytes32 s;
        uint8 v;
        assembly {
            r := mload(add(_signature, 32))
            s := mload(add(_signature, 64))
            v := byte(0, mload(add(_signature, 96)))
        }

        // Ethereum Signed Message Hash (même format qu'Ethers.js)
        bytes32 ethSignedMessageHash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", _messageHash)
        );

        return ecrecover(ethSignedMessageHash, v, r, s);
    }
}
