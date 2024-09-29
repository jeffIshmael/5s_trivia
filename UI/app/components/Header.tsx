import Link from "next/link";
import React, { useEffect, useState } from "react";
import { TriviaAbi, TriviaContractAddress } from "../Blockchain/Contracts";
import { useConnect, useReadContract, useAccount } from "wagmi";
import { injected } from "wagmi/connectors";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Header = () => {
  const { connect } = useConnect();
  const { address, isConnected } = useAccount();
  const { data } = useReadContract({
    address: TriviaContractAddress,
    abi: TriviaAbi,
    functionName: "getUserBalance",
    args: [address],
  });

  const balance = data as BigInt;

  useEffect(() => {
    if (window.ethereum && !isConnected) {
      connect({ connector: injected() });
    }
  }, []);

  return (
    <div>
      {isConnected && (
        <div className=" flex  md:hidden justify-center">
          <ConnectButton accountStatus="address" />
        </div>
      )}
      <Link href="/">
        <header className="flex justify-between items-center p-4 bg-teal-500 text-white">
          <div className="text-2xl font-bold">
            {" "}
            <span className="text-4xl">5</span>sTrivia
          </div>
          <div className="hidden md:block">
            <ConnectButton />
          </div>

          {isConnected ? (
            <div className="text-lg text-gray-700 bg-teal-200 px-2 py-1 flex flex-col-2 space-x-2 rounded">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6"
              >
                <path
                  fillRule="evenodd"
                  d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 0 1 .75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 0 1 9.75 22.5a.75.75 0 0 1-.75-.75v-4.131A15.838 15.838 0 0 1 6.382 15H2.25a.75.75 0 0 1-.75-.75 6.75 6.75 0 0 1 7.815-6.666ZM15 6.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z"
                  clipRule="evenodd"
                />
                <path d="M5.26 17.242a.75.75 0 1 0-.897-1.203 5.243 5.243 0 0 0-2.05 5.022.75.75 0 0 0 .625.627 5.243 5.243 0 0 0 5.022-2.051.75.75 0 1 0-1.202-.897 3.744 3.744 0 0 1-3.008 1.51c0-1.23.592-2.323 1.51-3.008Z" />
              </svg>
              
              <div>{Number(balance) / 10 ** 18} TRIVS</div>
            </div>
          ) : (
            <div className="md:hidden">
              <ConnectButton />
            </div>
          )}
        </header>
      </Link>
    </div>
  );
};

export default Header;
