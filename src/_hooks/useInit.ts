import { useAppDispatch } from '@_store';
import { setChainArr, setCurrentChain } from '@_store/features/chainIdSlice';
import { ChainItem } from '@_types';

export default function useInit(chainArr: ChainItem[], currentChain: Chain) {
  const dispatch = useAppDispatch();
  dispatch(setChainArr(chainArr));
  dispatch(setCurrentChain(currentChain));
}
