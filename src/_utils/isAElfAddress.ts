import AElf from 'aelf-sdk';
export const isAElfAddress = (address: string) => {
  if (!address) {
    return false;
  }
  try {
    AElf.utils.decodeAddressRep(address);
    return true;
  } catch (e) {
    return false;
  }
};

export const isTxHash = (id: string) => {
  if (!id) return false;

  const isTxId = [64];
  const { length } = id;
  return isTxId.includes(length);
};
