import { ContractKitProvider, NetworkNames } from "@celo-tools/use-contractkit";
import { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <ContractKitProvider
      network={{
        name: NetworkNames.Alfajores,
        rpcUrl: "https://alfajores-forno.celo-testnet.org",
        graphQl: "https://alfajores-blockscout.celo-testnet.org/graphiql",
        explorer: "https://alfajores-blockscout.celo-testnet.org",
        chainId: 44787,
      }}
      dapp={{
        name: "My awesome dApp",
        description: "My awesome description",
        url: "https://example.com",
        icon: "https://cryptologos.cc/logos/celo-celo-logo.png",
      }}
    >
      <SkeletonTheme baseColor="#202020" highlightColor="#444">
        <Component {...pageProps} />
      </SkeletonTheme>
    </ContractKitProvider>
  );
}

export default MyApp;
