import * as React from "react";
import { Dimensions, View } from "react-native";
import * as Progress from "react-native-progress";
import { logActionError, logAppLaunch } from "../Helpers/analytics";

import * as Settings from "../Helpers/settings";

const { width, height } = Dimensions.get("window");
const widthScale = width / 375;

export default class SwapLoadingScreen extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		Settings.select("defaultPage").then(defaultPage => {
			if (defaultPage != null) {
				defaultPage == "Wallet Home" ? logAppLaunch(true) : logAppLaunch(false);
				this.props.navigation.navigate(defaultPage);
			} else {
				logAppLaunch(false);
				this.props.navigation.navigate("Home");
			}
		}).catch((error) => {
			console.log(error);
			logActionError("Select Default Page", error);
			this.props.navigation.navigate("Home");
		});
	}

	// normalize the input so that it scales evenly across devices
	normalize(pre) {
		return Math.floor(pre * widthScale);
	}

	render() {
		return (
			<View style={{ backgroundColor: "#052344", paddingBottom: height * 0.5, }}>
				<Progress.CircleSnail size={this.normalize(300)} indeterminate={true} color={["#22b6f2", "#a260f8"]} indeterminateAnimationDuration='500' style={{ marginTop: height * 0.2 }} />
			</View>
		);
	}
}