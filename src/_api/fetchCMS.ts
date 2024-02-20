export async function fetchCMS() {
  // const result = await request.cms.networkList();
  // return result?.data;
  return {
    chainArr: ['AELF', 'tDVV'],
    currentChain: 'AELF',
    mainNetUrl: 'https://explorer.aelf.io',
    sideNetUrl: 'https://explorer-test.aelf.io',
  };
}
