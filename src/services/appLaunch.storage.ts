import AsyncStorage from '@react-native-async-storage/async-storage';

const HAS_OPENED_APP_KEY = 'hasOpenedApp';

export async function hasOpenedAppBefore(): Promise<boolean> {
    return (await AsyncStorage.getItem(HAS_OPENED_APP_KEY)) === 'true';
}

export async function markAppOpened(): Promise<void> {
    await AsyncStorage.setItem(HAS_OPENED_APP_KEY, 'true');
}
