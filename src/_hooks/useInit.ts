import { useAppDispatch } from '@_store';
import { setChainArr, setCurrentChain } from '@_store/features/chainIdSlice';

export default function useInit(chainArr: Chain[], currentChain: Chain) {
  const dispatch = useAppDispatch();
  console.log('useInit--');
  dispatch(setChainArr(chainArr));
  dispatch(setCurrentChain(currentChain));
}
