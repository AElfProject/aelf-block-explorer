export const setContractWithName = (name: string, contract: any) => ({
  type: "SET_CONTRACT_WITH_NAME",
  payload: { name, contract },
});
