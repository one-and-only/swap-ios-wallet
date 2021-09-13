import analytics from '@react-native-firebase/analytics';
import * as Settings from './settings';

Settings.select('enableAnalytics').then(async enableAnalytics => {
    if (enableAnalytics == null) {
        analytics().setAnalyticsCollectionEnabled(true);
    } else if (enableAnalytics) {
        analytics().setAnalyticsCollectionEnabled(true);
    }
});

export const logPageView = async (pageName) => {
    await analytics().logScreenView({  screen_name: pageName, screen_class: pageName });
}

export const logActionError = async (actionName, errorMessage) => {
    await analytics().logEvent('action_error', { action_name: actionName, error_message: errorMessage });
}

export const logPerformance = async (actionName, duration) => {
    await analytics().logEvent('performance', { action_name: actionName, duration: duration });
}

export const logAppLaunch = async (hasWallet) => {
    await analytics().logEvent('app_launch', { has_wallet: hasWallet });
}
