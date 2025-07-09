// import React, { useEffect, useState } from 'react';

// const LottiePlayer = (props: any) => {
//   const [Player, setPlayer] = useState<any>(null);

//   useEffect(() => {
//     // Only run on client
//     if (typeof window !== 'undefined' && typeof document !== 'undefined') {
//       try {
//         // Use synchronous import for UMD compatibility
//         const lottieModule = require('@lottiefiles/react-lottie-player');
//         setPlayer(() => lottieModule.Player);
//       } catch (error) {
//         console.warn('Failed to load Lottie Player:', error);
//       }
//     }
//   }, []);

//   if (!Player) {
//     return <div>Loading animation...</div>;
//   }

//   return <Player {...props} />;
// };

// export default LottiePlayer;
