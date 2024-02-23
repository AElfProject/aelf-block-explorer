import { useAppDispatch } from '@_store';
import { setChainArr, setdefaultChain } from '@_store/features/chainIdSlice';
import { ChainItem } from '@_types';

export default function useInit(chainArr: ChainItem[], defaultChain: Chain) {
  const dispatch = useAppDispatch();
  dispatch(setChainArr(chainArr));
  dispatch(setdefaultChain(defaultChain));
}
