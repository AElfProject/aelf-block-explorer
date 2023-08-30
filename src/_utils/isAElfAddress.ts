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
