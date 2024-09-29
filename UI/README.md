## 5sTRIVIA FRONTEND DOCUMENTATION

### Overview
5sTrivia is a frontend application built to provide users with a daily trivia challenge. Users have 40 seconds to answer 5 questions, earning Trivs tokens upon successful completion. The frontend manages user interactions, displays trivia questions, handles timing, and integrates with Web3 functionalities to reward users. 
The frontend  fetches trivia questions from the Open Trivia DB API. This documentation covers the essential and complex parts of the frontend, focusing on the logic for fetching, rendering, and interacting with trivia questions from specified categories.

### Technology Stack
**React.js (with TypeScript):** For building dynamic and responsive user interfaces.
**Next.js 14.2.6:** Framework for server-side rendering and building scalable React applications.
**Tailwind CSS:** Utility-first CSS framework for styling components efficiently.
**Wagmi.js:** Library for interacting with Ethereum and other EVM-compatible blockchains.
**Sonner.js:** For managing in-app notifications.
**Open Trivia DB:** Source of trivia questions.
**LocalStorage API:** To persist user data across sessions.

### LocalStorage API
LocalStorage has been used to keep track of user participation, ensuring users can’t answer more than one quiz per day. Data is saved and retrieved using helper functions for serialization/deserialization.

### Wagmi.js
Wagmi is used to connect to the Ethereum network and interact with smart contracts. Functions like claimReward are executed via useContractWrite hooks from wagmi.

### Open Trivia DB
A public trivia API for fetching quiz questions. The app utilizes categories such as "General Knowledge," "Animals," "Vehicles," "History," and "Politics." which are passed randomly with every fetch request.
The API is called using a retry mechanism to handle rate-limiting errors.
