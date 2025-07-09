// import React, { useEffect, useState } from 'react';

// // Dynamically import the Player component only on client side
// let Player: any = null;

// const LottiePlayer = (props: any) => {
//   const [isClient, setIsClient] = useState(false);

//   useEffect(() => {
//     // Only load the Player component on the client side
//     if (window && typeof window !== 'undefined' && typeof document !== 'undefined') {
//       import('@lottiefiles/react-lottie-player').then((module) => {
//         Player = module.Player;
//         setIsClient(true);
//       });
//     }
//   }, []);

//   // Return null or a placeholder during SSR
//   if (!isClient || !Player) {
//     return <div>Loading animation...</div>;
//   }

//   return <Player {...props} />;
// };

// export default LottiePlayer;
