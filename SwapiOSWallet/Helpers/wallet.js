//import { Settings } from "react-native";
import { add } from 'react-native-reanimated';
import * as Settings from '../Helpers/settings';

export const currentBlockHeight = () => {
    var height = 0;
    // add height request here
    return height;
}

export const openWallet = () =>  {

    var addressPromise = Settings.select('walletAddress');
    var viewKeyPromise = Settings.select('viewKey');

    Promise.all([addressPromise, viewKeyPromise]).then((wallet) => {
        var data = '{"withCredentials":true,"address":"' + wallet[0] + '","view_key":"' + wallet[1] + '","create_account":true,"generated_locally":false}';
        fetch(
            "https://swap-wallet.servehttp.com/api/login",
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                redirect: 'follow',
                body: data
            }
        ).then(response => response.json())
         .then((jsonResponse) => {
             console.log(jsonResponse);
            switch (jsonResponse.status) {
                case "success":
                    Settings.insert('defaultPage', 'Wallet Home');
                    console.log('noice');
                    break;
                case "error":
                    alert("Login Error. Check your address and private key");
                    break;
            }
         }).catch(err => console.log("Error" + err));
    });
}
