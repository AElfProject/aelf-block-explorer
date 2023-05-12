import { SignInInterface, did, DIDWalletInfo } from "@portkey/did-ui-react";
import { ChainInfo } from "@portkey/services";
import AElf from "aelf-sdk";

import { useEffect, useRef, useState } from "react";
import { CHAIN_ID } from "../../config/config";

export const KEY_NAME = "currentWallet";

const useSign = (Toast: any) => {
  const [loading, setLoading] = useState<boolean>(false);
  const chainInfoRef = useRef<ChainInfo>();
  const chainsInfoRef = useRef<ChainInfo[]>([]);
  const ToastRef = useRef<{ error: (mes: string) => void }>(null);
  const aelfRef = useRef<any>();
  const walletRef = useRef<DIDWalletInfo>();
  const showError = (message: string) => {
    ToastRef.current?.error(message);
  };

  const setWallet = (wallet) => {
    walletRef.current = wallet;
  };

  const init = async () => {
    const chainsInfo = await did.services.getChainsInfo();
    chainsInfoRef.current = chainsInfo;
    const chainInfo = chainsInfo.find((chain) => chain.chainId === CHAIN_ID);
    if (!chainInfo) {
      showError("chain is not running");
      return;
    }
    chainInfoRef.current = chainInfo;
    const aelf = new (AElf as any)(
      new (AElf as any).providers.HttpProvider(chainInfo.endPoint)
    );
    aelfRef.current = aelf;
    if (!aelf.isConnected()) {
      showError("Blockchain Node is not running.");
    }
  };

  const login = async (wallet) => {
    setLoading(true);
    if (wallet.chainId !== CHAIN_ID) {
      const caInfo = await did.didWallet.getHolderInfoByContract({
        caHash: wallet.caInfo.caHash,
        chainId: CHAIN_ID,
      });
      wallet.caInfo = {
        caAddress: caInfo.caAddress,
        caHash: caInfo.caHash,
      };
    }
    setWallet(wallet);
    did.save(wallet.pin, KEY_NAME);
    isMainChain.current = wallet.chainId !== CHAIN_ID;
    return true;
  };

  useEffect(() => {
    setLoading(true);
    init();
    if (typeof window !== undefined && window.localStorage.getItem(KEY_NAME)) {
      setEnablePlay(true);
      setStep(StepStatus.LOCK);
      // setStep(StepStatus.RAMDOM);
    } else {
      setEnablePlay(true);
      setStep(StepStatus.LOGIN);
    }
    setLoading(false);
  }, []);

  return {
    loading,
    setLoading,
    login,
  };
};
export default useSign;
