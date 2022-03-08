import { useContractKit } from "@celo-tools/use-contractkit";
import "@celo-tools/use-contractkit/lib/styles.css";
import BigNumber from "bignumber.js";
import Img from "next/image";
import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { Navbar } from "../components/Navbar";
import Swap from "../components/Swap";

interface TokenItemProps {
  logoPath: string;
  balance: BigNumber;
  unit: string;
}

export interface BalanceType {
  CELO?: BigNumber;
  cUSD?: BigNumber;
  cEUR?: BigNumber;
  cREAL?: BigNumber;
  lockedCELO?: BigNumber;
  pending?: BigNumber;
}

function WrappedApp() {
  const { address, getConnectedKit } = useContractKit();
  const [balances, setBalances] = useState<BalanceType>();

  const fetchData = async () => {
    const kit = await getConnectedKit();
    let totalBalance = await kit.getTotalBalance(address);
    setBalances({
      CELO: totalBalance.CELO,
      cUSD: totalBalance.cUSD,
      cEUR: totalBalance.cEUR,
      cREAL: totalBalance.cREAL,
      lockedCELO: totalBalance.lockedCELO,
      pending: totalBalance.pending,
    });
  };

  useEffect(() => {
    if (address) {
      fetchData();
    }
    console.log("address :>> ", address);
  }, [address, getConnectedKit]);
  if (!balances) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <Navbar />
      {address ? (
        <main className="flex-1 max-w-5xl mx-auto pt-10">
          <div className="flex flex-col items-center">
            <p className="text-xl font-bold">Swap Celo Tokens</p>
            <div className="flex-1 w-full px-3 py-2 flex flex-row justify-around space-x-8 mt-6">
              <TokenItem
                balance={balances.CELO}
                logoPath="/celo.png"
                unit="CELO"
              />
              <TokenItem
                balance={balances.cUSD}
                logoPath="/cUSD.png"
                unit="cUSD"
              />
              <TokenItem
                balance={balances.cEUR}
                logoPath="/cEUR.png"
                unit="cEUR"
              />
            </div>
            <Swap balances={balances} fetchData={fetchData} />
          </div>
        </main>
      ) : (
        <div className="flex-1 mt-10">
          <div className="flex justify-center">
            <span className="text-center text-2xl font-bold">
              Connect wallet to use dApp
            </span>
          </div>
        </div>
      )}
    </>
  );
}
export default WrappedApp;

const TokenItem: React.FC<TokenItemProps> = ({ balance, logoPath, unit }) => {
  return (
    <div className="bg-blue-700 rounded-xl w-full py-3 px-5 text-white flex flex-col items-center justify-center">
      <Img src={logoPath} height={50} width={50} />
      <span className="pt-3 font-bold text-lg">
        {parseFloat(Web3.utils.fromWei(balance.toString())).toFixed(2)} {unit}
      </span>
      <span className="pt-0 text-xs font-light">Balance</span>
    </div>
  );
};
