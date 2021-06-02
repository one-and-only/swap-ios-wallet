# Swap iOS Wallet
iOS Wallet for Swap, made by Revvz (me, but on Discord).

## Setting up React Native Development Environment

1. [Install Homebrew](https://docs.brew.sh/Installation)
1. Open a terminal and run `brew install node watchman`
1. Install CocoaPods by running `sudo gem install cocoapods`

## Setting Up Code Workspace

*NOTE:* Before continuing, make sure you've done everything in the [previous section](#setting-up-react-native-development-environment)
1. If running the command `node --help` in a terminal says that the command is not found, [install Node.js using the install files.](https://nodejs.org/en/)
1. Go to the Mac App Store and install **[XCode](https://developer.apple.com/xcode/)**
1. Install the XCode Command Line Developer Tools. *After* installing XCode, open up a Terminal Emulator and run `xcode-select --install`
1. Clone this repository: `git clone https://github.com/one-and-only/swap-ios-wallet.git`
1. Open a Terminal Emulator, and `cd` into the folder you stored this repository and `cd` once more into `SwapiOSWallet`.
1. using npm, run `npm install`. This installs all dependencies needed by the core project, such as **[CocoaPods](https://cocoapods.org/)**
1. The above command should have installed CocoaPods. With this installed, run `pod install`. This will install all required Pod dependencies needed to run development versions of the iOS wallet.
1. **You're Done! 🎉**

## Running Development Versions of Swap iOS Wallet

*NOTE:* Before continuing, make sure you've done everything in the [previous section](#setting-up-code-workspace)
1. Open the `SwapiOSWallet.xcworkspace` file using XCode. It is stored in `SwapiOSWallet/ios`, relative to the repository's residing folder.
1. Choose the scheme (AKA the phone and iOS version you want to simulate) from the top left, and hit the *Run* button (looks like a play button), which is located to the left of the scheme selection.
1. **Your app should build, and then subsequently launch! 🎉**
