# 5sTrivia Frontend Documentation

## Overview
5sTrivia is a trivia platform where users answer a set of questions within a limited time frame to earn TRIVS tokens as rewards. This documentation focuses on the frontend, outlining how questions are fetched, displayed, and answered, along with the reward system for correct answers. It also explains how the application integrates with Web3 to reward users using blockchain functionality.

## Technology Stack
- **React.js (TypeScript):** For building a dynamic and responsive user interface.
- **Next.js (14.2.6):** Server-side rendering framework to improve performance and scalability.
- **Tailwind CSS:** Utility-first CSS framework for styling.
- **Wagmi.js:** Library to interact with Ethereum and EVM-compatible blockchains.
- **Sonner.js:** For in-app notification handling.
- **Open Trivia DB:** API for fetching trivia questions.
- **LocalStorage API:** To persist user data, such as participation status.

## Installation and Setup

### Prerequisites
Ensure you have **Node.js** installed.

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/jeffIshmael/5s_trivia
   cd 5s_trivia/UI
   ```
2. Install dependencies:

    ```bash
    npm install
    ```

3. Run the application:

    ```bash
    npm run dev
    ```

## Project Structure
   
    5s_trivia/
    ├── UI/
    │   ├── app/
    │   │   ├── components/
    │   │   │   ├── Header.tsx
    │   │   │   ├── Timer.tsx
    │   │   │   ├── Reward.tsx
    │   │   │   └── Questions.tsx
    │   │   ├── Blockchain/
    │   │   │   └── Contracts.tsx
    │   └── Providers/
    │       └── BlockchainProviders.tsx


**Components:** Reusable UI elements like Header, Timer, Reward, and Questions.
**Blockchain Integration:** Contains logic for interacting with smart contracts, handling blockchain configuration.

## Core Features and Functionalities
1. ### Fetching Trivia Questions
5sTrivia platform is fetching questions from open-trivia DB API which is a free to use, user-contributed trivia question database. At the moment of writing this, 5sTrivia fetches on random topics with every fetch.
The API is called using a retry mechanism to handle rate-limiting errors.

```typescript

    const categories: CategoryResolvable[] = [
    "General Knowledge",
    "Animals",
    "Vehicles",
    "History",
    "Politics",
  ];

  //Using retry mechanism to overcome the retry errors  
  async function fetchQuestionsWithRetry(
    options: any,
    retries : number ,
    delay: number 
  ) {
    try {
      return await getQuestions(options);
    } catch (error: any) {
      if (retries > 0 && error.status === 429) {
        console.error(Retrying... attempts left: ${retries});
        await new Promise((res) => setTimeout(res, delay));
        return fetchQuestionsWithRetry(options, retries - 1, delay * 2);
      } else {
        throw new Error("Failed to fetch questions after multiple retries.");
      }
    }
  }

  // function to get a random value from an array
  const getRandomValueFromArray = (
    array: (string | number)[]
  ): string | number => {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  };

  const value = getRandomValueFromArray(categories) as CategoryResolvable;

  const result = await fetchQuestionsWithRetry({
            amount: 5,
            category: value,
            difficulty: "easy",
          },5, 1000);

The returned result is an object that has the following amog others;
    interface Question {
  question: string;
  allAnswers: string[];
  correctAnswer: string;
}
```

2. ### Timer and Answering System
The timer ensures the user answers within the allocated time (50 seconds). When time runs out, a flag (isTimeout) is set.

``` typescript

const [timeLeft, setTimeLeft] = useState(50);
const [isTimeout, setIsTimeout] = useState(false);

useEffect(() => {
  const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
  return () => clearTimeout(timer);
}, [timeLeft]);
```

For each answer, the platform checks correctness, updating the score accordingly:

```typescript
const handleAnswerClick = (answer: string) => {
  if (answer === questions[currentQuestionIndex].correctAnswer.toLowerCase()) {
    setScore(score + 1);
  }
  if (currentQuestionIndex < questions.length - 1) {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  } else {
    setShowResult(true);
  }
};
```
3. ### Reward System
Once all questions are answered correctly, the user is rewarded with TRIVS tokens via a smart contract. 
After the user has claimed the reward we update the localstorage with the current date and the user participation in order to prevent the user from claiming multiple times.

``` typescript
const reward = async () => {
  if (isConnected) {
    const tx = await writeContractAsync({
      address: TriviaContractAddress,
      abi: TriviaAbi,
      functionName: "rewardUser",
      args: [address],
    });

    if (tx) {
      toast("Claim successful");
      localStorage.setItem(PARTICIPATION_KEY, JSON.stringify({ date: getCurrentDate(), correct: true }));
      setHasParticipated(true);
    } else {
      toast("Claim failed");
    }
  } else {
    toast("Connect wallet to claim reward");
    connect({ connector: injected() });
  }
};
```
4. ### Participation Status Check
Before rendering questions, the platform verifies if the user has already participated by checking the data stored in LocalStorage.

``` typescript

const getCurrentDate = () => {
  const date = new Date();
  return date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
};


const participationData = localStorage.getItem(PARTICIPATION_KEY);
if (participationData) {
  const { date, correct } = JSON.parse(participationData);
  if (date === getCurrentDate() && correct) {
    setHasParticipated(true);
  }
}
```
## Future Enhancements
**Category Selection:** Users will be able to choose trivia categories of their choice.
