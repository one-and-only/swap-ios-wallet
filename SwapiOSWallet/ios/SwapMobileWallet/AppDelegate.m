#import "AppDelegate.h"
#import <Firebase.h>

#if RCT_DEV
#import <React/RCTDevLoadingView.h>
#endif

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

#ifdef FB_SONARKIT_ENABLED
#import <FlipperKit/FlipperClient.h>
#import <FlipperKitLayoutPlugin/FlipperKitLayoutPlugin.h>
#import <FlipperKitUserDefaultsPlugin/FKUserDefaultsPlugin.h>
#import <FlipperKitNetworkPlugin/FlipperKitNetworkPlugin.h>
#import <SKIOSNetworkPlugin/SKIOSNetworkAdapter.h>
#import <FlipperKitReactPlugin/FlipperKitReactPlugin.h>

static void InitializeFlipper(UIApplication *application) {
  FlipperClient *client = [FlipperClient sharedClient];
  SKDescriptorMapper *layoutDescriptorMapper = [[SKDescriptorMapper alloc] initWithDefaults];
  [client addPlugin:[[FlipperKitLayoutPlugin alloc] initWithRootNode:application withDescriptorMapper:layoutDescriptorMapper]];
  [client addPlugin:[[FKUserDefaultsPlugin alloc] initWithSuiteName:nil]];
  [client addPlugin:[FlipperKitReactPlugin new]];
  [client addPlugin:[[FlipperKitNetworkPlugin alloc] initWithNetworkAdapter:[SKIOSNetworkAdapter new]]];
  [client start];
}
#endif

/**
 Deletes all Keychain items accessible by this app if this is the first time the user launches the app
 This should not be an issue on Android, as encrypted Shared Preferences clears when the user uninstalls the app
 */
static void ClearKeychainIfNecessary() {
    // Checks wether or not this is the first time the app is run
    if ([[NSUserDefaults standardUserDefaults] boolForKey:@"HAS_RUN_BEFORE"] == NO) {
        // Set the appropriate value so we don't clear next time the app is launched
        [[NSUserDefaults standardUserDefaults] setBool:YES forKey:@"HAS_RUN_BEFORE"];

        NSArray *secItemClasses = @[
            (__bridge id)kSecClassGenericPassword,
            (__bridge id)kSecClassInternetPassword,
            (__bridge id)kSecClassCertificate,
            (__bridge id)kSecClassKey,
            (__bridge id)kSecClassIdentity
        ];

        // Maps through all Keychain classes and deletes all items that match
        for (id secItemClass in secItemClasses) {
            NSDictionary *spec = @{(__bridge id)kSecClass: secItemClass};
            SecItemDelete((__bridge CFDictionaryRef)spec);
        }
    }
}

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [FIRApp configure];
  #ifdef FB_SONARKIT_ENABLED
    InitializeFlipper(application);
  #endif
  
  // Clear the keychain if app has launched for the first time
  ClearKeychainIfNecessary();
  
  /**
   Set the bundle location as an NSString
   If the app is of type DEBUG, then the location should be the URL that the bundler is listening on
   if the app is of type RELEASE, then the location should be the relative file path of the bundle inside the app binary (main.jsbundle)
   */
  NSString* bundleLocation;
  #if DEBUG
    bundleLocation = @"http://localhost:8081/index.bundle?platform=ios";
  #else
    bundleLocation = @"main.jsbundle";
  #endif
  
  
  // In this case, index.bundle matches the index.js file that contains your component code
  NSURL *jsCodeLocation = [NSURL URLWithString:bundleLocation];

  RCTBridge *bridge = [[RCTBridge alloc] initWithBundleURL:jsCodeLocation
                                              moduleProvider:nil
                                               launchOptions:launchOptions];
  #if RCT_DEV
    [bridge moduleForClass:[RCTDevLoadingView class]];
  #endif
    RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                     moduleName:@"SwapMobileWallet"
                                              initialProperties:nil];

  if (@available(iOS 13.0, *)) {
      rootView.backgroundColor = [UIColor systemBackgroundColor];
  } else {
      rootView.backgroundColor = [UIColor whiteColor];
  }

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
