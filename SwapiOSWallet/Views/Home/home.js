import React, {Component} from 'react';
import { View, Text, StyleSheet, Animated, Easing, Dimensions, TouchableOpacity, } from 'react-native';

const {width, height} = Dimensions.get('window');

export default class SwapMainHome extends Component {

    constructor(props) {
        super(props);
        this.state = {spinAnim: new Animated.Value(0)};
    }

    componentDidMount() {
        Animated.loop(Animated.timing(
            this.state.spinAnim,
            {
                toValue: 1,
                duration: 100000,
                easing: Easing.linear,
                useNativeDriver: true,
            }
        )).start();
    }

    // continue to the next page (placeholder alert for now until navigation is complete)
    continueClick() {
        alert('you choose to continue!');
    }

    // choose the language of the app
    languageClick() {
        alert('Changing the app language is not currently supported.');
    }

    // return the page data to display
    render() {
        // map animation 0-1 range to css 0-360 deg range
        const spin = this.state.spinAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg'],
        });

        return (
            <View style={[styles.flexContainer, {flex: 1}]}>
                <View style={[styles.flexContainerChild, {flex: 3}]}>
                    <Text
                        style={{
                            color: 'white',
                            marginTop: '10%',
                            fontSize: 20,
                            marginBottom: height * 0.05,
                            textAlign: 'center'
                        }}>
                        Welcome - Wilkommen - Bonvenon - Bienvenido - Bienvenue - Välkommen - Selemanat datang - Benvenuto - asianLanguage - Welkom - Bem Vindo - Добро пожаловать
                    </Text>
                </View>
                <View style={[styles.flexContainerChild, {flex: 5}]}>
                    <Animated.Image
                        source={require('../../Resources/Images/world-flags-globe.png')}
                        style={{
                            width: width * 0.9,
                            flex: 5,
                            height: height * 0.5,
                            transform: [{ rotate: spin }],
                            marginBottom: height * 0.05
                        }}
                    />
                </View>
                <View style={[styles.flexContainerChild, {flexDirection: "row", flex: 1}]}>
                    <TouchableOpacity onPress={this.languageClick} style={[styles.buttonContainer, { marginRight: width * 0.05 }]}>
                        <Text style={styles.buttonText}>Language</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.continueClick} style={styles.buttonContainer}>
                        <Text style={styles.buttonText}>Continue</Text>
                    </TouchableOpacity>
                </View>
                <View style={[styles.flexContainerChild, {flex: 1}]}>
                    <Text style={{color: 'white', alignSelf: 'center'}}>
                        v3.2.1-07_iOS (React Native 0.64)
                    </Text>
                </View>
            </View>
        );
    }
}

// stylesheet used for styling the page (almost identical to CSS styles)
const styles = StyleSheet.create({

    buttonContainer: {
        elevation: 8,
        backgroundColor: "#2074d4",
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 12
    },

    buttonText: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "700",
        alignSelf: "center",
        textTransform: "uppercase"
    },

    flexContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column"
    },

    flexContainerChild: {
        width: width * 0.95,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
    }
})
