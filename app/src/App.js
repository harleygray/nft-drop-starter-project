import React, { useEffect, useState } from 'react';
import './App.css';
import twitterLogo from './assets/twitter-logo.svg';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {

  const [walletAddress, setWalletAddress] = useState(null);
  /* Check the window object in our DOM (document object model) to see if 
  * the Phantom Wallet extenction has injected the solana object. We also 
  * check if it's a Phantom Wallet
  */
  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;
      
      if (solana) {
        if (solana.isPhantom) {
          console.log('Phantom wallet found!');

          // The solana object gives us a function that allows us to 
          // connect directly with the user's wallet!
          const response = await solana.connect({onlyIfTrusted: true});
          console.log(
            'Connected with Public Key:',
            response.publicKey.toString()
          );

          // Set user's publicKey in state to be used later
          setWalletAddress(response.publicKey.toString());
        }
      } else {
        alert('Solana object not found! Get a Phantom Wallet');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const connectWallet = async () => {
    const {solana } = window;

    if (solana) {
      const response = await solana.connect();
      console.log('Connected with Public Key:',response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };
  
  // Render this UI when user hasn't connected their wallet to our app yet
  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
      >
        Connect to Wallet
      </button>
  )


  /*
  * When our component first mounts, let's check to see if we have a connected
  * Phantom Wallet
  */
  useEffect(() => { //useEffect gets called once on component mount when the [] is empty
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener('load',onLoad);
    return () => window.removeEventListener('load',onLoad);
  }, []);


  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header">🍭 Candy Drop</p>
          <p className="sub-text">NFT drop machine with fair mint</p>
          {!walletAddress && renderNotConnectedContainer()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );


};

export default App;
