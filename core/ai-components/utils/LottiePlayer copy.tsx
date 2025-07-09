// import React, { useEffect, useState } from 'react';

// // Extend Window interface to include LottiePlayer
// declare global {
//   interface Window {
//     LottiePlayer?: any;
//   }
// }

// // Use a runtime-only approach to prevent SSR issues
// const LottiePlayer = (props: any) => {
//   const [isClient, setIsClient] = useState(false);
//   const [Player, setPlayer] = useState<any>(null);

//   useEffect(() => {
//     // Set client flag when component mounts
//     setIsClient(true);

//     // Only load the Player component on the client side
//     if (typeof window !== 'undefined') {
//       // Try to get the Player from global scope first
//       if (window.LottiePlayer) {
//         setPlayer(() => window.LottiePlayer);
//       } else {
//         // If not available globally, we'll need to load it differently
//         // For now, just show a placeholder
//         console.warn('LottiePlayer not available globally. Please ensure the library is loaded.');
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
