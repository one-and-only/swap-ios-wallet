import { select } from "./settings";

export const walletSynced = async () => {
	const address = await select("walletAddress");
	const viewKey = await select("viewKey_sec");

	try {
		const addressTXs = await fetch("https://wallet.getswap.eu/api/get_address_txs", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				address: address,
				view_key: viewKey,
			}),
		});
		const addressTXsJSON = await addressTXs.json();
		if (addressTXsJSON.blockchain_height == addressTXsJSON.scanned_block_height) {
			return true;
		} else {
			return false;
		}
	} catch (e) {
		return false;
	}
};