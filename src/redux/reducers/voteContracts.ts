const initialState = {
  consensusContract: null,
  dividendContract: null,
  multiTokenContract: null,
  voteContract: null,
  electionContract: null,
  profitContract: null,
};
export const handleContract = (state = initialState, { type, payload }) => {
  switch (type) {
    case "SET_CONTRACT_WITH_NAME": {
      const { name, contract } = payload;
      return {
        ...state,
        [name]: contract,
      };
    }
    default:
      return state;
  }
};
