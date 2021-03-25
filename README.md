# Swap iOS Wallet
iOS Wallet for Swap, made by Revvz (me, but on Discord).

## Setting Up Code Workspace

1. Install **[Node.js](https://nodejs.org/en/)**
2. Go to the Mac App Store and install **[XCode](https://developer.apple.com/xcode/)**
3. Install the XCode Command Line Developer Tools. *After* installing XCode, open up a Terminal Emulator and run `xcode-select --install`
4. Clone this repository: `git clone https://github.com/one-and-only/swap-ios-wallet.git`
5. Open a Terminal Emulator, and `cd` into the folder you stored this repository.
6. using npm, run `npm install`. This installs all dependencies needed by the core project, such as **[CocoaPods](https://cocoapods.org/)**
7. The above command should have installed CocoaPods. With this installed, run `pod install`. This will install all required Pod dependencies needed to run development versions of the iOS wallet.
8. **You're Done! 🎉**

## Running Development Versions of Swap iOS Wallet

1. Refer to **[Setting Up Code Workspace](#setting-up-code-workspace)** and do all the steps there.
2. Open the `SwapiOSWallet.xcworkspace` file using XCode. It is stored in `SwapiOSWallet/ios`, relative to the repository's residing folder.
3. Choose the scheme (AKA the phone and iOS version you want to simulate) from the top left, and hit the *Run* button (looks like a play button), which is located to the left of the scheme selection.
4. **Your app should build, and then subsequently launch! 🎉**
