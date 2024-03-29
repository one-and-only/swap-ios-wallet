# Swap iOS Wallet
iOS Wallet for Swap, made by Revvz (me, but on Discord).

## WARNING: Since I now have an M1 Mac, compiling on an Intel Mac may no longer work. It should, but I make no guarantees

## Setting up React Native Development Environment

1. [Install Homebrew](https://docs.brew.sh/Installation)
1. Open a terminal and run `brew install node watchman npm`
1. Install CocoaPods by running `sudo gem install cocoapods`

## Setting Up Code Workspace

*NOTE:* Before continuing, make sure you've done everything in the [previous section](#setting-up-react-native-development-environment)
1. Go to the Mac App Store and install **[XCode](https://developer.apple.com/xcode/)**
1. Install the XCode Command Line Developer Tools. *After* installing XCode, open up a Terminal Emulator and run `xcode-select --install`
1. Clone this repository: `git clone https://github.com/one-and-only/swap-ios-wallet.git`
1. Open a Terminal Emulator, and `cd` into the folder you stored this repository and `cd` once more into `SwapiOSWallet`.
1. using npm, run `npm install`. This installs all dependencies needed by the core project
1. Link everything required for the app using `npx react-native link`. This copies over certain resources required for the app to compile/run.
1. The above command should have installed CocoaPods. With this installed, run `cd ios && pod install`. This will install all required Pod dependencies needed to run development versions of the iOS wallet.
1. **You're Done! 🎉**

## Setting Up Analytics Collection

*NOTE:* Analytics collection is being handled by Firebase. Before continuing, make sure you've done everything in the [previous section](#setting-up-code-workspace)
You will need a `google-services.json` file for analytics on Android and a `GoogleService-Info.plist`.

1. Consult [Download Firebase config file or object](https://support.google.com/firebase/answer/7015592?hl=en#zippy=%2Cin-this-article)
1. For iOS/iPadOS App, scroll to `Get config file for your iOS app` and follow the instructions
    1. *NOTE:*  `GoogleService-Info.plist` should be placed in `<repo-dir>/ios/` and added to XCode, if it isn't done automatically.
1. For Android, scroll to `Get config file for your Android app` and follow the instructions
    1. *NOTE:* `google-services.json` should be placed in `<repo-dir>/android/app/` and added to Android Studio, if it isn't done automatically.

## Running Development Versions of Swap iOS Wallet

*NOTE:* Before continuing, make sure you've done everything in the [previous section](#setting-up-analytics-collection)
1. Open the `SwapiOSWallet.xcworkspace` file using XCode. It is stored in `SwapiOSWallet/ios`, relative to the repository's residing folder.
1. Choose the scheme (AKA the phone and iOS version you want to simulate) from the top left, and hit the *Run* button (looks like a play button), which is located to the left of the scheme selection.
1. **Your app should build, and then subsequently launch! 🎉**

*NOTE:* You will be unable to build a valid signed *Release* build of the app, since the keystore (Android) or the signing configuration (iOS/iPadOS) is not provided in this repository. The repository author is the only person allowed to build and publish app updates.

## Running on an M1 Mac
1. Do everything in [Setting Up Code Workspace](#setting-up-code-workspace) up to step 5. IT IS IMPORTANT YOU DON'T DO ANYTHING AFTER THAT STEP.
1. In a terminal, run `sudo gem install ffi`
1. Since CocoaPods only works on Intel Macs, you will either need to run the entire terminal with Rosetta 2 and then run `cd ios && pod install`, or install pods using `cd ios && arch -x86_64 pod install`
1. Now you may proceed to [Running Development Versions of Swap iOS Wallet](#running-development-versions-of-swap-ios-wallet)

## NOTE About My Unverified Commits
A lot of my commits are now showing up as `Unverified`. This is because my previous GPG key got wiped from my machine and I didn't have a backup. The key has `NOT` been compromised as far as I am aware, but I don't have access to it anymore. Thus, I removed it. Any commits with the GPG Key ID of `EB2D38C332D61F26` should be considered `Verified`. Thank you for your understanding.
