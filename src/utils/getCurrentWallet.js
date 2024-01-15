const getCurrentWallet = () => {
  let currentWallet = JSON.parse(localStorage.getItem("currentWallet"));
  if (!currentWallet || !currentWallet.publicKey) {
    currentWallet = {
      address: null,
      name: null,
      publicKey: null,
    };
  }
  return currentWallet;
};

export default getCurrentWallet;
