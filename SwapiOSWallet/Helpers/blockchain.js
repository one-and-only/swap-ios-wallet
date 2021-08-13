// TODO: Implement timezone when deciding to internationalize
export const blockToDate = (blockNumber) => {
    // 15 second block time
    // 1542506905 is estimated genesis timestamp
    // javascript time is in milliseconds, so we need to multiply by 1000 to get seconds
    return new Date((blockNumber * 15 + 1542506905)*1000);
}