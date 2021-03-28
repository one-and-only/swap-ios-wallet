import * as React from 'react';
import {View, Text, StyleSheet, Dimensions, TouchableOpacity,} from 'react-native';

const {width, height} = Dimensions.get('window');

export default class SwapWelcome extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={{backgroundColor: '#052344', flex: 1}}>
                <View>
                    <Text style={{color: 'white'}}>Some text to show that the page exists.</Text>
                </View>
            </View>
        );
    }
}
