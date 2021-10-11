import { select } from "./settings";

// TODO: Implement timezone when deciding to internationalize
export const blockToDate = (blockNumber) => {
    // 15 second block time
    // 1542506905 is estimated genesis timestamp
    // javascript time is in milliseconds, so we need to multiply by 1000 to get seconds
    return new Date((blockNumber * 15 + 1542506905) * 1000);
}

export const walletSynced = async () => {
    const address = await select("walletAddress");
    const viewKey = await select("viewKey_sec");

    const addressTXs = await fetch('https://wallet.getswap.eu/api/get_address_txs', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            address: address,
            view_key: viewKey,
        }),
    });
    const addressTXsJSON = await addressTXs.json();
    if (addressTXsJSON.blockchain_height == addressTXsJSON.scanned_block_height) {
        console.log("synco de mayo");
        return true;
    } else {
        console.log("no synco de mayo");
        return false;
    }
}