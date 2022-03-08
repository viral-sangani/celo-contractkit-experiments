import { useContractKit } from "@celo-tools/use-contractkit";
import { CeloContract, StableToken } from "@celo/contractkit";
import BigNumber from "bignumber.js";
import React, { useEffect } from "react";
import Web3 from "web3";
import { BalanceType } from "../pages";
import { TextField } from "./TextField";

interface Props {
  balances?: BalanceType;
  fetchData: () => Promise<void>;
}

const Swap: React.FC<Props> = ({ balances, fetchData }) => {
  const { getConnectedKit } = useContractKit();
  const [leftVal, setLeftVal] = React.useState("CELO");
  const [rightVal, setRightVal] = React.useState("cUSD");
  const [exchangeRate, setExchangeRate] = React.useState("");
  const [exchangedValue, setExchangedValue] = React.useState("");
  const [loadingEstimate, setLoadingEstimate] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [loadingCurrentEstimates, setLoadingCurrentEstimates] =
    React.useState(false);
  const [value, setValue] = React.useState("");

  const getEstimate = async (left: string, val = "") => {
    const kit = await getConnectedKit();
    const exchange = await kit.contracts.getExchange();
    const one = kit.web3.utils.toWei("1", "ether");
    if (!val) {
      setLoadingEstimate(true);
      if (left == "cUSD") {
        // Left token is a Stable coin
        let cUSDcontract = await kit.contracts.getStableToken(StableToken.cUSD);
        const amount = await exchange.quoteStableSell(one);
        setExchangeRate(
          `1 cUSD = ${parseFloat(
            kit.web3.utils.fromWei(amount.toString())
          ).toFixed(3)} CELO`
        );
      } else {
        // Left token is a Celo coin
        const amount = await exchange.quoteGoldSell(one);
        setExchangeRate(
          `1 CELO = ${parseFloat(
            kit.web3.utils.fromWei(amount.toString())
          ).toFixed(3)} cUSD`
        );
      }
      setExchangedValue("");
      setValue("");
      setLoadingEstimate(false);
    }
    if (val !== "" && val !== "0") {
      setLoadingCurrentEstimates(true);
      const amountToExchange = kit.web3.utils.toWei(val, "ether");
      if (left == "CELO") {
        const usdAmount = await exchange.quoteGoldSell(amountToExchange);
        setExchangedValue(
          `${val} CELO = ${parseFloat(
            kit.web3.utils.fromWei(usdAmount.toString())
          ).toFixed(3)} cUSD`
        );
      } else {
        const celoAmount = await exchange.quoteStableSell(amountToExchange);
        setExchangedValue(
          `${val} cUSD = ${parseFloat(
            kit.web3.utils.fromWei(celoAmount.toString())
          ).toFixed(3)} CELO`
        );
      }
      setLoadingCurrentEstimates(false);
    }
  };

  const exchangeToken = async () => {
    try {
      setLoading(true);
      const kit = await getConnectedKit();
      kit.setFeeCurrency(CeloContract.StableToken);
      const exchange = await kit.contracts.getExchange();
      const amountToExchange = kit.web3.utils.toWei(value, "ether");
      console.log(
        "1 :>> ",
        parseFloat(Web3.utils.fromWei(balances.CELO.toString())).toFixed(2)
      );
      console.log("2 :>> ", value);
      if (
        leftVal == "CELO" &&
        new BigNumber(amountToExchange).lte(balances.CELO)
      ) {
        const goldToken = await kit.contracts.getGoldToken();
        const approveTx = await goldToken
          .approve(exchange.address, amountToExchange)
          .send();
        const approveReceipt = await approveTx.waitReceipt();

        const usdAmount = await exchange.quoteGoldSell(amountToExchange);
        const sellTx = await exchange
          .sellGold(amountToExchange, usdAmount)
          .send();
        const sellReceipt = await sellTx.waitReceipt();
      } else if (new BigNumber(amountToExchange).lte(balances.cUSD)) {
        const stableToken = await kit.contracts.getStableToken();
        const approveTx = await stableToken
          .approve(exchange.address, amountToExchange)
          .send();
        const approveReceipt = await approveTx.waitReceipt();
        const goldAmount = await exchange.quoteStableSell(amountToExchange);
        const sellTx = await exchange
          .sellStable(amountToExchange, goldAmount)
          .send();
        const sellReceipt = await sellTx.waitReceipt();
      }
      setLoading(false);
      fetchData();
      setValue("");
      setExchangedValue("");
    } catch (e) {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEstimate(leftVal);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col items-center w-full border rounded-xl shadow-sm py-5 px-8 max-w-4xl mt-8">
      <div>
        <div
          onClick={() => {
            console.log("leftVal :>> ", leftVal);
            console.log("rightVal :>>", rightVal);
            var temp = leftVal;
            setLeftVal(rightVal);
            setRightVal(temp);
            getEstimate(rightVal);
          }}
          className="w-60 flex px-4 py-2 rounded-2xl flex-row justify-center items-center space-x-8 text-blue-600 hover:text-white font-bold border-2 border-blue-600 hover:bg-blue-600 cursor-pointer"
        >
          <span>{leftVal}</span>
          <RightIcon />
          <span>{rightVal}</span>
        </div>
      </div>

      <div className="flex flex-col items-start mt-5 self-start font-bold">
        {loadingEstimate ? (
          <div className="w-60 h-12 bg-gray-200 rounded-xl" />
        ) : (
          <>
            <span className="text-base font-normal">Exchange Rate </span>
            <span className="text-lg">{exchangeRate}</span>
          </>
        )}
      </div>

      <div className="w-full flex flex-col items-start mt-8 self-start font-bold">
        <span className="inline-flex items-center text-sm mb-2 font-normal">
          Exchange{" "}
          <span
            onClick={() => {}}
            className="cursor-pointer ml-1 font-bold text-blue-500 underline"
          >
            MAX
          </span>
        </span>
        <TextField
          value={value}
          onChange={(val) => {
            console.log("val.target.value", val.target.value);
            getEstimate(leftVal, val.target.value);
            setValue(val.target.value);
          }}
          type="text"
          placeholder={`Exchange ${leftVal} for ${rightVal}`}
        />
        {loadingCurrentEstimates ? (
          <div className="mt-2 w-52 h-6 bg-gray-200 rounded-xl" />
        ) : (
          <span className="mt-1 ml-2 text-sm">{exchangedValue}</span>
        )}
        {loading ? (
          <span>Loading...</span>
        ) : (
          <button
            onClick={() => {
              exchangeToken();
            }}
            className="bg-blue-100 hover:bg-blue-200 font-bold text-blue-500 px-8 py-2 rounded-md mt-2 self-center"
          >
            Swap
          </button>
        )}
      </div>
    </div>
  );
};

export default Swap;

function RightIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17 8l4 4m0 0l-4 4m4-4H3"
      />
    </svg>
  );
}
