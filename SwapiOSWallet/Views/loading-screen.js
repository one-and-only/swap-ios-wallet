import * as React from 'react';
import {View, Image, Dimensions,} from 'react-native';
import * as Settings from '../Helpers/settings';

const {width, height} = Dimensions.get('window');
const widthScale = width/375;

export default class SwapLoadingScreen extends React.Component {
    constructor(props) {
        super(props); 
        setTimeout(() => {
            var defaultPage = Settings.select('defaultPage');
            defaultPage.then((value) => {
                defaultPageString = value;
                if (defaultPageString != null) {
                    console.debug();
                    this.props.navigation.navigate(defaultPageString);
                } else {
                    this.props.navigation.navigate("Home");
                }
            }).catch((reason) => {
                this.props.navigation.navigate("Home");
            });
        }, 500);
    }

    // normalize the input so that it scales evenly across devices
    normalize (pre) {
        return Math.floor(pre * widthScale);
    }

    render() {
        return (
            <View style={{backgroundColor: '#052344', paddingBottom: height * 0.5,}}>
                <View style={{paddingTop: height * 0.2, paddingBottom: height * 0.125,}}></View>
                <Image
                    source={require('../Resources/Images/header-logo.png')}
                    style={{width: this.normalize(323), height: this.normalize(100), resizeMode: 'stretch', alignSelf: 'center',}}
                />
            </View>
        );
    }
}