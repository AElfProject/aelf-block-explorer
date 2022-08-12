/* eslint-disable react/react-in-jsx-scope */
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getOriginProposedContractInputHash } from '../../common/util.proposed';
import { getContractAddress, getTxResult } from '../../common/utils';
import CopylistItem from '../../components/CopylistItem';
import { getDeserializeLog } from './utils';

export const useCallbackAssem = () => {
  const common = useSelector((state) => state.common);
  const {
    wallet,
  } = common;
  // eslint-disable-next-line no-return-await
  const contractSend = useCallback(async (action, params, isOriginResult) => {
    const result = await wallet.invoke({
      contractAddress: getContractAddress('Genesis'),
      param: params,
      contractMethod: action,
    });
    if (isOriginResult) return result;
    if (result && +result.error === 0 || !result.error) {
      return result;
    }
    throw new Error((result.errorMessage || {}).message || 'Send transaction failed');
  }, [wallet]);

  return useMemo(() => ({
    contractSend,
  }), [contractSend]);
};

export const useReleaseApprovedContractAction = () => {
  const proposalSelect = useSelector((state) => state.proposalSelect);
  const common = useSelector((state) => state.common);
  const { contractSend } = useCallbackAssem();
  const {
    aelf,
  } = common;
  return useCallback(async (contract) => {
    const { contractMethod, proposalId } = contract;
    const proposalItem = proposalSelect.list.find((item) => item.proposalId === proposalId);
    if (!proposalItem) throw new Error('Please check if the proposalId is valid');
    const res = await getDeserializeLog(aelf, proposalItem.createTxId, 'ContractProposed');
    const { proposedContractInputHash } = res ?? {};
    if (!proposedContractInputHash) throw new Error('Please check if the proposalId is valid');
    const param = {
      proposalId,
      proposedContractInputHash,
    };
    const result = await contractSend(contractMethod, param, true);
    let isError = false;
    if (!(result && +result.error === 0 || !result.error)) {
      isError = true;
      throw new Error((result.errorMessage || {}).message || 'Send transaction failed');
    }
    const Log = await getDeserializeLog(
      aelf,
      result?.TransactionId || result?.result?.TransactionId || '',
      'ProposalCreated',
    );
    const { proposalId: newProposalId } = Log ?? '';
    return {
      visible: true,
      title: !isError ? 'Proposal is created！' : 'Proposal failed to be created！',
      children: (
        <>
          {!isError && newProposalId
            ? (
              <CopylistItem
                label="Proposal ID："
                value={newProposalId ?? ''}
                href={`/proposalsDetail/${newProposalId}`}
              />
            ) : 'This may be due to the failure in transaction which can be viewed via Transaction ID:'}
          <CopylistItem
            label="Transaction ID："
            isParentHref
            value={result?.TransactionId || result?.result?.TransactionId || ''}
            href={`/tx/${result?.TransactionId || result?.result?.TransactionId || ''}`}
          />
        </>),
    };
  }, [proposalSelect]);
};

export const useReleaseCodeCheckedContractAction = () => {
  const proposalSelect = useSelector((state) => state.proposalSelect);
  const common = useSelector((state) => state.common);
  const { contractSend } = useCallbackAssem();
  const {
    aelf,
  } = common;
  return useCallback(async (contract) => {
    const { contractMethod, proposalId } = contract;
    const proposalItem = proposalSelect.list.find((item) => item.proposalId === proposalId);
    if (!proposalItem) throw new Error('Please check if the proposalId is valid');
    const proposedContractInputHash = await getOriginProposedContractInputHash({ txId: proposalItem.createTxId });
    if (!proposedContractInputHash) throw new Error('Please check if the proposalId is valid');
    const param = {
      proposalId,
      proposedContractInputHash,
    };

    const result = await contractSend(contractMethod, param, true);
    let isError = false;
    if (!(result && +result.error === 0 || !result.error)) {
      isError = true;
      throw new Error((result.errorMessage || {}).message || 'Send transaction failed');
    }
    const txResult = await getTxResult(aelf, result?.TransactionId || result?.result?.TransactionId || '');

    if (!txResult) {
      throw Error('Can not get transaction result.');
    }

    if (txResult.Status.toLowerCase() === 'mined') {
      isError = false;
    } else {
      isError = true;
    }

    return {
      visible: true,
      title: !isError ? 'Proposal is created！' : 'Proposal failed to be created！',
      children: (
        <>
          <CopylistItem
            label="Transaction ID："
            isParentHref
            value={(result?.TransactionId || result?.result?.TransactionId || '')}
            href={`/tx/${result?.TransactionId || result?.result?.TransactionId || ''}`}
          />
        </>),
    };
  }, [proposalSelect]);
};
