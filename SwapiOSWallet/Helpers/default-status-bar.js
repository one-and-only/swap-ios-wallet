import { StatusBar } from "react-native";


export default function DefaultStatusBar() {
    return (
        <StatusBar animated={true} hidden={false} backgroundColor="#052344" barStyle="light-content" showHideTransition="fade" />
    )
}