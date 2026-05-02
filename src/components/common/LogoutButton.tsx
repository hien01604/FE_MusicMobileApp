import React from 'react';
import {
    Pressable,
    View,
    Text,
    ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { authStyles } from '../../style/authStyles';

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
            style={authStyles.buttonWrapper}
            disabled={loading}
        >
            {({ pressed }) =>
                pressed && !loading ? (
                    <View style={authStyles.outlineButton}>
                        <Text style={authStyles.buttonText}>Logout</Text>
                    </View>
                ) : (
                    <LinearGradient
                        colors={["#FF3C57", "#eb8196"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={authStyles.gradientButton}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="white" />
                        ) : (
                            <Text style={authStyles.buttonText}>Logout</Text>
                        )}
                    </LinearGradient>
                )
            }
        </Pressable>
    );
};

export default LogoutButton;