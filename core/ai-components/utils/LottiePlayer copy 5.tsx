// import React, { useEffect, useState } from 'react';

// // Create a function that only imports the Player component on the client side
// const getPlayerComponent = () => {
//   // Only import on client side to prevent SSR issues
//   if (typeof window !== 'undefined' && typeof document !== 'undefined') {
//     try {
//       // Use Function constructor to avoid bundler detection
//       const requireModule = new Function('return require("@lottiefiles/react-lottie-player")');
//       const lottieModule = requireModule();
//       return lottieModule.Player;
//     } catch (error) {
//       console.warn('Failed to load Lottie Player:', error);
//       return null;
//     }
//   }
//   return null;
// };

// const LottiePlayer = (props: any) => {
//   const [isClient, setIsClient] = useState(false);
//   const [Player, setPlayer] = useState<any>(null);

//   useEffect(() => {
//     // Set client flag when component mounts
//     setIsClient(true);

//     // Load the Player component only on client side
//     if (typeof window !== 'undefined') {
//       const PlayerComponent = getPlayerComponent();
//       if (PlayerComponent) {
//         setPlayer(() => PlayerComponent);
//       }
//     }
//   }, []);

//   // Return placeholder during SSR or while loading
//   if (!isClient || !Player) {
//     return <div>Loading animation...</div>;
//   }

//   // Only render the actual component on client side
//   return <Player {...props} />;
// };

// export default LottiePlayer;
