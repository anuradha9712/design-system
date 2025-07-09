// import React, { useEffect, useState } from 'react';

// const LottiePlayer = (props: any) => {
//   const [Player, setPlayer] = useState<any>(null);

//   useEffect(() => {
//     // Only run on client
//     if (typeof window !== 'undefined' && typeof document !== 'undefined') {
//       try {
//         // Use require so bundlers don't hoist the import
//         // eslint-disable-next-line @typescript-eslint/no-var-requires
//         const { Player } = require('@lottiefiles/react-lottie-player');
//         setPlayer(() => Player);
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
