import { ConfigProvider, SignIn, SignInInterface } from "@portkey/did-ui-react";
import React, { useEffect, useRef } from "react";
import { CHAIN_ID, NETWORK_TYPE } from "../../../config/config";
import { defaultCountryCodeConfig } from "../../common/constants";

ConfigProvider.setGlobalConfig({
  graphQLUrl: "/AElfIndexer_DApp/PortKeyIndexerCASchema/graphql",
  socialLogin: {
    Apple: {
      clientId: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID,
      redirectURI: process.env.NEXT_PUBLIC_APPLE_REDIRECT_URI,
    },
    Google: {
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    },
  },
  requestDefaults: {
    baseURL: "/portkey",
  },
  network: {
    defaultNetwork: NETWORK_TYPE,
    networkList: [
      {
        name: "aelf MAIN",
        walletType: "aelf",
        networkType: NETWORK_TYPE,
        isActive: true,
        apiUrl: "",
        connectUrl: "",
      },
    ],
  },
});

const SignInModal = ({ showLogin }) => {
  const signinRef = useRef<SignInInterface | null>(null);
  const setShowLogin = (show: boolean) => {
    signinRef.current?.setOpen(show);
  };
  useEffect(() => {
    setShowLogin(showLogin);
  }, [showLogin]);
  return (
    <div>
      <SignIn
        ref={(ref) => (signinRef.current = ref as SignInInterface)}
        uiType="Modal"
        phoneCountry={defaultCountryCodeConfig}
        sandboxId="portkey-ui-sandbox"
        defaultChainId={CHAIN_ID as any}
        isShowScan
        onFinish={async (wallet) => {
          //   await login(wallet);
          setShowLogin(false);
        }}
        onError={(err) => {
          console.error("onError==", err);
        }}
        onCancel={() => {
          setShowLogin(false);
        }}
      />
    </div>
  );
};
export default SignInModal;
