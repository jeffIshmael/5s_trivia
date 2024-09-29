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
  const [hasParticipated, setHasParticipated] = useState(false);
  const { address, isConnected } = useAccount();
  const { writeContractAsync , isPending } = useWriteContract();
  const router = useRouter();



  const reward = async () => {
    if (isConnected) {
      const tx = await writeContractAsync({
        address: TriviaContractAddress,
        abi: TriviaAbi,
        functionName: "rewardUser",
        args: [address],
      });
      console.log(tx);
      if (tx) {
        toast("claimed successfully");
       
        localStorage.setItem(
          PARTICIPATION_KEY,
          JSON.stringify({ date: getCurrentDate(), correct: true })
        );
        setHasParticipated(true);       
        router.refresh();
        
      } else {
        toast("unable to claim");
      }
    } else {
      toast("Connect wallet to claim reward");
      connect({ connector: injected() });
    }
  };

  return (
    <div>
      <button
        onClick={reward}
        className={`px-4 py-2 bg-teal-500 text-white rounded mt-4 hover:bg-teal-700  ${
          isPending ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {isPending ? "Claiming..." : "Claim Reward"}
        
      </button>
    </div>
  );
};

export default Reward;
