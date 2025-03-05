# BETA TEST PLAN

## 1. Essential Features for the Beta Version

| Feature Name  | Description  | Priority (High/Medium/Low) | Changes Since Tech3 |
|---------------------------|-------------|----------------|----------------------|
| WalletConnect Integration | Connects wallets via WalletConnect | High | Replacing MetaMask |
| Smart Contract Signatures | Generates and links signatures with message content | High | First implementation |
| Email Signature Generation/Verification | Complete authentication for emails (Gmail & Outlook) | High | New feature |
| PDF Signature Generation/Verification | Allows signing and verification of PDF documents | High | New feature |
| Image Signature Generation/Verification | Signature embedded into images using steganography | Medium | New feature |
| Plain Text Signature Generation/Verification | Generates a unique signature for plain text | Medium | New feature |
| Signature Generation as String or Image | Customizable signature in different formats | Medium | New feature |
| Multi-Wallet Support | Connects via multiple wallets using WalletConnect | High | Expanded compatibility |
| Customizable Signature Image | Users can select a personalized signature image | Medium | With security restrictions |
| Signature Validity Duration | Users can set a predefined validity duration for signatures | Medium | New feature |

## 2. Beta Testing Scenarios

### 2.1 User Roles

| Role Name | Description |
|------------|------------|
| User | Can connect their wallet, sign emails, documents, and verify signatures |
| Recipient | Verifies emails and documents using the verification tool |
| Malicious User | Attempts to impersonate or forge signatures |

### 2.2 Test Scenarios

#### Scenario 1: Authentication System
- **Role Involved:** User
- **Objective:** Ensure users can securely connect via WalletConnect
- **Preconditions:** The user has a compatible wallet
- **Test Steps:**
  1. Open the application
  2. Scan the QR Code with WalletConnect
  3. Approve the connection via the wallet
- **Expected Outcome:** The user successfully logs in

#### Scenario 2: Email Signature Generation
- **Role Involved:** User
- **Objective:** Ensure a user can generate an email signature
- **Preconditions:** The extension is open on the email composition page
- **Test Steps:**
  1. Open the extension after composing an email
  2. Click "Generate Signature"
  3. Choose the signature type (text or image)
  4. Set the validity duration
  5. Confirm the transaction via the connected wallet
- **Expected Outcome:** A signature is generated and can be integrated into the email

#### Scenario 3: PDF Signature Generation
- **Role Involved:** User
- **Objective:** Ensure a user can sign a PDF document
- **Preconditions:** A PDF document is available
- **Test Steps:**
  1. Open the extension
  2. Click "Generate Signature"
  3. Select "PDF"
  4. Upload the document
  5. Add recipients
  6. Confirm the transaction via the wallet
- **Expected Outcome:** The signature is added to the PDF document

#### Scenario 4: Image Signature Generation
- **Role Involved:** User
- **Objective:** Ensure a user can sign an image
- **Preconditions:** An image is available
- **Test Steps:**
  1. Open the extension
  2. Click "Generate Signature"
  3. Select "Image"
  4. Upload the image
  5. Add recipients
  6. Confirm the transaction via the wallet
- **Expected Outcome:** A signature is generated and embedded in the image via steganography

#### Scenario 5: PDF Signature Verification
- **Role Involved:** Recipient
- **Objective:** Ensure a signed document can be verified
- **Preconditions:** A signed PDF document is available
- **Test Steps:**
  1. Open the extension
  2. Click "Verify Signature"
  3. Upload the PDF document
  4. Start verification
- **Expected Outcome:** The document's integrity is confirmed

#### Scenario 6: Email Signature Verification
- **Role Involved:** Recipient
- **Objective:** Ensure a signed email can be verified
- **Preconditions:** A signed email is available
- **Test Steps:**
  1. Open the extension
  2. From the email page, click "Verify Signature"
  3. Automatic metadata verification
- **Expected Outcome:** The email's integrity is confirmed

#### Scenario 7: Image Signature Verification
- **Role Involved:** Recipient
- **Objective:** Ensure a signed image can be verified
- **Preconditions:** A signed image is available
- **Test Steps:**
  1. Open the extension
  2. Click "Verify Signature"
  3. Upload the image
  4. Start verification
- **Expected Outcome:** The image's integrity is confirmed

#### Scenario 8: Attempted Modification of a Signed Email
- **Role Involved:** Malicious User
- **Objective:** Ensure the system detects modifications after signing
- **Preconditions:** A signed email is available
- **Test Steps:**
  1. Modify the content of a signed email
  2. Reattach the original signature
  3. Send the modified email
  4. Verify the signature via the extension
- **Expected Outcome:** The user is informed that the email has been modified

## 3. Success Criteria

- **Functionality:** All essential features work without major errors.
- **Stability:** The WebApp server is stable, and the smart contract is deployed on a reliable network.
- **Security:** Sensitive data is stored securely (hashing, encryption, etc.).
- **User Experience:** The interface is intuitive and allows smooth navigation.
- **Decentralization:** All data is stored immutably on the blockchain.

## 4. Known Issues & Limitations

| Issue  | Description  | Impact | Planned Fix? |
|----------|-------------|--------|--------------------|
| No support for email attachments | Attachments must be signed separately | Medium | Yes |
| Limited image formats for signature | Only specific images can be used as signatures | High | Yes |
| Blockchain transaction fees | Signing and verification require network fees | High | Exploring optimizations |

## 5. Conclusion

CertiDocs is a document authentication solution leveraging blockchain technology to guarantee document integrity. The beta phase will allow users to test key features, such as signing and verifying emails, PDFs, images, and text.

Our priority is seamless integration into users' daily workflows. This beta phase aims to gather feedback on user experience, identify potential issues, and suggest improvements.

Key challenges include system security and stability. A security audit and extensive robustness testing are planned before large-scale deployment. We believe CertiDocs will provide an innovative and reliable document authentication solution, and we look forward to sharing it with the community.
