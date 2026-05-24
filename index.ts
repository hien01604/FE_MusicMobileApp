import { registerRootComponent } from 'expo';

import App from './App';

try {
	const TrackPlayer = require('react-native-track-player');
	TrackPlayer.registerPlaybackService(() => require('./src/services/playbackService').default);
} catch {
	// In environments without native track-player (e.g. Expo Go), skip registration.
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
