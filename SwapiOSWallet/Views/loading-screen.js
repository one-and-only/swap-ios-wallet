import * as React from "react";
import { Dimensions, View } from "react-native";
import * as Progress from "react-native-progress";
import * as Settings from "../Helpers/settings";
import { normalize } from "../Helpers/gui";

const { width, height } = Dimensions.get("window");
const widthScale = width / 375;

export default class SwapLoadingScreen extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		Settings.select("defaultPage").then(defaultPage => {
			if (defaultPage != null) {
				this.props.navigation.navigate(defaultPage);
			} else {
				this.props.navigation.navigate("Home");
			}
		}).catch((error) => {
			console.log(error);
			this.props.navigation.navigate("Home");
		});
	}

	render() {
		return (
			<View style={{ backgroundColor: "#052344", paddingBottom: height * 0.5, }}>
				<Progress.CircleSnail size={normalize(300, widthScale)} indeterminate={true} color={["#22b6f2", "#a260f8"]} indeterminateAnimationDuration='500' style={{ marginTop: height * 0.2 }} />
			</View>
		);
	}
}