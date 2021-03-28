import * as React from 'react';
import { View, Text, StyleSheet, Animated, Easing, Dimensions, TouchableOpacity, } from 'react-native';

const {width, height} = Dimensions.get('window');
const widthScale = width/375;

export default class SwapMainHome extends React.Component {

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

    // choose the language of the app
    languageClick() {
        alert('Changing the app language is not currently supported.');
    }

    // normalize the input so that it scales evenly across devices
    normalize (pre, scale) {
        return Math.floor(pre * scale);
    }

    // return the page data to display
    render() {
        // map animation 0-1 range to CSS 0-360 deg range
        const spin = this.state.spinAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg'],
        });

        return (
            <View style={[styles.flexContainer, {flex: 2, backgroundColor: '#052344'}]}>
                <View style={[styles.flexContainerChild, {flex: 2}]}>
                    <Text
                        style={{
                            color: 'white',
                            marginTop: '0%',
                            fontSize: this.normalize(14, widthScale),
                            flexWrap: 'wrap',
                            marginBottom: height * 0.05,
                            textAlign: 'center',
                            fontWeight: '700'
                        }}>
                        Welcome - Wilkommen - Bonvenon - Bienvenido - Bienvenue - Välkommen - Selemanat datang - Benvenuto - 歡迎 - Welkom - Bem Vindo - Добро пожаловать
                    </Text>
                </View>
                <View style={[styles.flexContainerChild, {flex: 5}]}>
                    <Animated.Image
                        source={require('../Resources/Images/world-flags-globe.png')}
                        style={{
                            maxWidth: this.normalize(350, widthScale),
                            maxHeight: this.normalize(344, widthScale),
                            resizeMode: 'stretch',
                            transform: [{ rotate: spin }],
                            marginBottom: height * 0.05
                        }}
                    />
                </View>
                <View style={[styles.flexContainerChild, {flexDirection: "row", flex: 1}]}>
                    <TouchableOpacity onPress={this.languageClick} style={[styles.buttonContainer, { marginRight: width * 0.05 }]}>
                        <Text style={styles.buttonText}>Language</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Welcome')} style={styles.buttonContainer}>
                        <Text style={styles.buttonText}>Continue</Text>
                    </TouchableOpacity>
                </View>
                <View style={[styles.flexContainerChild, {flex: 1}]}>
                    <Text style={{color: 'white', alignSelf: 'center', fontWeight: '700', fontSize: this.normalize(14, widthScale)}}>
                        ©2021 Swap Foundation
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
