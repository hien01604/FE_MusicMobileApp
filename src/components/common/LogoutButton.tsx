import React from 'react';
import {
    Pressable,
    View,
    Text,
    ActivityIndicator,
    StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SAIRA_STENCIL_ONE_REGULAR } from '../../../utils/const';

interface LogoutButtonProps {
    onPress: () => void;
    loading?: boolean;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({
    onPress,
    loading = false,
}) => {
    return (
        <Pressable
            onPress={onPress}
            style={styles.buttonWrapper}
            disabled={loading}
        >
            {({ pressed }) =>
                pressed && !loading ? (
                    <View style={styles.outlineButton}>
                        <Text style={styles.buttonText}>Logout</Text>
                    </View>
                ) : (
                    <LinearGradient
                        colors={["#FF3C57", "#eb8196"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.gradientButton}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="white" />
                        ) : (
                            <Text style={styles.buttonText}>Logout</Text>
                        )}
                    </LinearGradient>
                )
            }
        </Pressable>
    );
};

export default LogoutButton;

const styles = StyleSheet.create({
    buttonWrapper: {
        marginTop: 20,
    },
    gradientButton: {
        minHeight: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    outlineButton: {
        minHeight: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: '#FF3C57',
        backgroundColor: 'transparent',
    },
    buttonText: {
        color: '#FFFFFF',
        fontFamily: SAIRA_STENCIL_ONE_REGULAR,
        fontSize: 17,
        fontWeight: '700',
        letterSpacing: 0,
    },
});
