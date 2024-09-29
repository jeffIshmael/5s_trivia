"use client";

import Image from "next/image";
import Header from "./components/Header";
import Questions from "./components/Questions";
import { useEffect, useState } from "react";
import Timer from "./components/Timer";

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen text-black bg-gray-200">
      {isMounted && (
        <div>
          <Header />
          {!isPlaying ? (
            <div className="flex flex-col items-center justify-center flex-1 px-4 text-center space-y-6">
              <h1 className="text-4xl font-bold">Welcome to 5sTrivia!</h1>
              <p className="text-lg">
                5sTrivia is a daily trivia game. You have 50 seconds to answer 5
                questions. If you answer all the questions correctly, you
                receive 50 TRIVS tokens.
              </p>
              <p className="text-lg">
                Store the rewards, Trivias will reveal their use soon.
              </p>
              <button
                onClick={handlePlay}
                className="mt-4 bg-yellow-400 text-black font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-yellow-500 transition-colors duration-200"
              >
                Play
              </button>
            </div>
          ) : (
            <Timer />
          )}
        </div>
      )}
    </div>
  );
}
