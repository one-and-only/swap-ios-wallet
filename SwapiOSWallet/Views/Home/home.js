import React, { Component } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Dimensions, TouchableOpacity } from 'react-native';

const { width, height } = Dimensions.get('window')
// this is the height scale of the country globe. It helps styling across multiple devices
const globeScale = height / 300

export default class SwapMainHome extends Component {

    constructor(props) {
        super(props);
        this.state = { spinAnim: new Animated.Value(0) }
      }

    componentDidMount(){
        Animated.loop(Animated.timing(
            this.state.spinAnim,
            {
            toValue: 1,
            duration: 100000,
            easing: Easing.linear,
            useNativeDriver: true
            }
        )).start();
    }

    // continue to the next page (placeholder alert for now until navigation is complete)
    continueClick() {
        alert('you choose to continue!');
    }

    // choose the language of the app
    languageClick() {
        alert('Changing the app language is not currently supported.')
    }

    // return the page data to display
    render() {
        // map animation 0-1 range to css 0-360 deg range
        const spin = this.state.spinAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg']
        });

        // FIXME(styling): #1 Styling doesn't look similar in all devices
        return (
            <View style={{
                padding: width * 0.1
            }}>
                <View>
                    <Text
                        style={{
                            alignSelf: 'center',
                            color: 'white',
                            marginTop: '10%',
                            fontSize: 20,
                            marginBottom: height * 0.1
                        }}>
                    Welcome - Wilkommen - Bonvenon - Bienvenido - Bienvenue
                    </Text>
                </View>
                <View>
                    <Animated.Image
                        source={require('../../Resources/world-flags-globe.png')}
                        style={{
                            alignSelf: 'center',
                            width: '75%',
                            height: 225,
                            transform: [{rotate: spin}]
                        }}
                    />
                </View>
                <View style={{flexDirection: "row", marginTop: height * 0.15, marginLeft: width * 0.06}}>
                    <TouchableOpacity onPress={this.languageClick} style={[styles.buttonContainer, {marginRight: width * 0.05}]}>
                        <Text style={styles.buttonText}>Language</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.continueClick} style={styles.buttonContainer}>
                        <Text style={styles.buttonText}>Continue</Text>
                    </TouchableOpacity>
                </View>
                <View>
                    <Text
                    style={styles.versionText}>
                v3.2.1-07_iOS (React Native 0.64)
                    </Text>
                </View>
            </View>
        );
    }
}

// stylesheet used for styling the page (almost identical to CSS styles)
const styles = StyleSheet.create({

    versionText: {
        alignSelf: 'center',
        color: 'white',
        marginTop: '20%'
    },

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
      }
})
