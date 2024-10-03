import React, { useState } from "react";
import { useAccount, useConnect, useWriteContract } from "wagmi";
import { TriviaAbi, TriviaContractAddress } from "../Blockchain/Contracts";
// import { connect } from 'wagmi/actions';
import { injected } from "wagmi/connectors";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const DAILY_QUESTION_KEY = "daily_question";
const PARTICIPATION_KEY = "participation";

const getCurrentDate = () => {
  const date = new Date();
  return date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
};

const Reward = () => {
  const { connect } = useConnect();
  const [hasClaimed, setHasClaimed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { address, isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const router = useRouter();

  const reward = async () => {
    if (!isConnected) {
      toast.error("please connect wallet");
      connect({ connector: injected() });
      return;
    }
    setLoading(true);

    try {
      const tx = await writeContractAsync({
        address: TriviaContractAddress,
        abi: TriviaAbi,
        functionName: "rewardUser",
        args: [address],
      });
      console.log(tx);
      if (tx) {
        toast.success("claimed successfully");
        localStorage.setItem(
          PARTICIPATION_KEY,
          JSON.stringify({ date: getCurrentDate(), correct: true })
        );
        setHasClaimed(true);
        router.refresh();
      } else {
        toast.error("unable to claim");
      }
    } catch (error) {
      toast.error("make sure wallet is connected.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {hasClaimed ? (
        <div>
          <p className="text-center text-lg text-teal-400 mt-4 ">Successfully claimed!</p>
        </div>
      ): (
        <button
          onClick={reward}
          disabled={loading}
          className={`px-4 py-2 bg-teal-500 text-white rounded mt-4 hover:bg-teal-700  ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Claiming..." : "Claim Reward"}
        </button>
      )}
    </div>
  );
};

export default Reward;
