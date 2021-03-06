import * as React from 'react';
import { Dimensions, View } from 'react-native';
import * as Progress from 'react-native-progress';

import * as Settings from '../Helpers/settings';

const {width, height} = Dimensions.get('window');
const widthScale = width/375;

export default class SwapLoadingScreen extends React.Component {
    constructor(props) {
        super(props);

        function create_wallet(props) {
            fetch('https://wallet.getswap.eu/mobileapi/create_wallet').then(response => response.json()).then(new_wallet => {
                var data = '{"address":"' + new_wallet.wallet_address + '","view_key":"' + new_wallet.viewKey + '","create_account":true,"generated_locally":true}';
                fetch(
                    "https://wallet.getswap.eu/api/login",
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: data
                    }
                ).then(response => response.json())
                    .then((jsonResponse) => {
                    switch (jsonResponse.status) {
                        case "success":
                            switch (jsonResponse.new_address) {
                                case true:
                                    Settings.insert('spendKey', new_wallet.spendKey);
                                    Settings.insert('viewKey', new_wallet.viewKey);
                                    Settings.insert('mnemonic', new_wallet.mnemonic);
                                    Settings.insert('walletAddress', new_wallet.wallet_address);
                                    Settings.insert("defaultPage", "Wallet Home");
                                    props.navigation.navigate("Wallet Home");
                                    break;
                                case false:
                                    create_wallet(); // recursion in case somehow we generated the same wallet as someone else
                                    break;
                            }
                            break;
                        case "error":
                            alert("An error occured while creating a wallet. Please try again later.");
                            Settings.select('defaultPage').then(defaultPage => props.navigation.navigate(defaultPage));
                            break;
                    }
                    }).catch(err => console.log("Error " + err));
            });
        }
        create_wallet(this.props);
    }

    // normalize the input so that it scales evenly across devices
    normalize (pre) {
        return Math.floor(pre * widthScale);
    }

    render() {
        return (
            <View style={{backgroundColor: '#052344', paddingBottom: height * 0.5,}}>
                <Progress.CircleSnail size={this.normalize(300)} indeterminate={true} color={['#22b6f2', '#a260f8']} indeterminateAnimationDuration='500' style={{marginTop: height * 0.2}}/>
            </View>
        );
    }
}