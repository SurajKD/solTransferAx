import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import * as web3 from '@solana/web3.js'
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { FC, useState, useEffect } from 'react'
import {
    WalletNotConnectedError,
    SignerWalletAdapterProps
  } from '@solana/wallet-adapter-base';
//   import { useConnection, useWallet } from '@solana/wallet-adapter-react';
  import {
    createTransferInstruction,
    createAssociatedTokenAccountInstruction,
    getAssociatedTokenAddress,
    getAccount
  } from '@solana/spl-token';
  import {
    PublicKey,
    Transaction,
    Connection,
    TransactionInstruction
  } from '@solana/web3.js';

  export const configureAndSendCurrentTransaction = async (
    transaction: Transaction,
    connection: Connection,
    feePayer: PublicKey,
    signTransaction: SignerWalletAdapterProps['signTransaction']
  ) => {
    const blockHash = await connection.getLatestBlockhash();
    transaction.feePayer = feePayer;
    transaction.recentBlockhash = blockHash.blockhash;
    const signed = await signTransaction(transaction);
    const signature = await connection.sendRawTransaction(signed.serialize());
    await connection.confirmTransaction({
      blockhash: blockHash.blockhash,
      lastValidBlockHeight: blockHash.lastValidBlockHeight,
      signature
    });
    return signature;
  };
  

const SendSolForm = () => {
    const [txSig, setTxSig] = useState<any>('')
    const [solAmt, setSolAmt] = useState<any>('')
    const [countdown, setCountdown] = useState<any>('')
    const [prevTransactions, setPrevTransactions] = useState<any>([])
    const { connection } = useConnection();
    // const { publicKey, sendTransaction } = useWallet();
    const link = () => {
        return txSig ? `https://explorer.solana.com/tx/${txSig}` : ''
    }
    const addRecAx = async (walletAddr:any, sent:any, given:any) => {
        let data = { "wallet_address": walletAddr, "sol_sent": sent, "ax_given": given }
        try {
            const response = await fetch('https://block.axionprotocol.com/presale-logs.json', {
                method: "POST",
                body: JSON.stringify(data),
                headers: { "Content-type": "application/json; charset=UTF-8" }
            })
            let json = await response.json();
        } catch (error) {
            if (error instanceof SyntaxError) {
                // Unexpected token < in JSON
                console.log('There was a SyntaxError', error);
            } else {
                console.log('There was an error', error);
            }
        }

    }
    const getPrevRec = async () => {
        try {
            const response = await fetch(`https://block.axionprotocol.com/presale-logs.json?wallet_address__iexact=${publicKey}`, {
                method: "GET",
                headers: { "Content-type": "application/json; charset=UTF-8" }
            })
            let json = await response.json();
            setPrevTransactions(json);
        } catch (error) {
            if (error instanceof SyntaxError) {
                // Unexpected token < in JSON
                console.log('There was a SyntaxError', error);
            } else {
                console.log('There was an error', error);
            }
        }
    }


    const { publicKey, signTransaction } = useWallet();
    useEffect(() => {
        if (publicKey) {
            getPrevRec()
        } else {
            setPrevTransactions([])
        }
    }, [publicKey])

  const handlePayment = async () => {
   console.log("kd",publicKey,"vx->",signTransaction)
    try {
      if (!publicKey || !signTransaction) {
       
        throw new WalletNotConnectedError();
      }
      const mintToken = new PublicKey(
        '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'
      ); // 4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU is USDC token address on solana devnet
      const recipientAddress = new PublicKey(
        'H6oUNAkFWLzZ5NQxEoQP3Drq5zZe2wSe6WpDwN36sjEN'
      );

      const transactionInstructions: TransactionInstruction[] = [];
      const associatedTokenFrom = await getAssociatedTokenAddress(
        mintToken,
        publicKey
      );
      const fromAccount = await getAccount(connection, associatedTokenFrom);
      const associatedTokenTo = await getAssociatedTokenAddress(
        mintToken,
        recipientAddress
      );
      if (!(await connection.getAccountInfo(associatedTokenTo))) {
        transactionInstructions.push(
          createAssociatedTokenAccountInstruction(
            publicKey,
            associatedTokenTo,
            recipientAddress,
            mintToken
          )
        );
      }
      transactionInstructions.push(
        createTransferInstruction(
          fromAccount.address, // source
          associatedTokenTo, // dest
          publicKey,
          solAmt*1000000 // transfer 1 USDC, USDC on solana devnet has 6 decimal
        )
      );
      const transaction = new Transaction().add(...transactionInstructions);
      const signature = await configureAndSendCurrentTransaction(
        transaction,
        connection,
        publicKey,
        signTransaction
      );
      // signature is transaction address, you can confirm your transaction on 'https://explorer.solana.com/?cluster=devnet'
    } catch (error) {
        console.log(error)
    }
  };
    // const sendSol = (event) => {
    //     event.preventDefault();
    //     if (!connection || !publicKey) {
    //         alert("Please connect a wallet first!")
    //         return
    //     }

    //     const transaction = new web3.Transaction();
    //     const recipientPubKey = new web3.PublicKey("Ftnx9tjA2tfQraYPkPuE6f634w7yhwxFza7avHQkHGtk")

    //     const sendSolInstruction = web3.SystemProgram.transfer({
    //         fromPubkey: publicKey,
    //         toPubkey: recipientPubKey,
    //         lamports: LAMPORTS_PER_SOL * event.target.amount.value
    //     })

    //     transaction.add(sendSolInstruction)
    //     sendTransaction(transaction, connection).then((sig) => {
    //         setTxSig(sig)
    //         addRecAx(publicKey, solAmt, solAmt * 1000)
    //         setSolAmt('')

    //     })
    // }

    // Set the date we're counting down to
    var countDownDate = new Date("Apr 24, 2024 00:00:00").getTime();

    // Update the count down every 1 second
    var x = setInterval(function () {

        // Get today's date and time
        var now = new Date().getTime();

        // Find the distance between now and the count down date
        var distance = countDownDate - now;

        // Time calculations for days, hours, minutes and seconds
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Display the result in the element with id="demo"
        setCountdown(days + "d " + hours + "h "
            + minutes + "m " + seconds + "s ")

        // If the count down is finished, write some text
        if (distance < 0) {
            clearInterval(x);
            setCountdown("EXPIRED")
        }
    }, 1000);

    return (
        <div className='bg-[]'>
            <div>
                <div className='homeSale'>
                    <div >
                        <h2 className="grad-h2">Private Sale</h2>
                        <div className="p-s-grid-links"><a href="https://docs.axionprotocol.com/" target="_blank" className="p-s-g-link"><p >Pitch-Deck</p> <div className="text-right"><svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="currentColor" className="p-l-icon"><path d="M0.536474 1.45962C0.282634 1.20578 0.282634 0.794221 0.536474 0.540381C0.790315 0.28654 1.20187 0.28654 1.45571 0.540381L0.536474 1.45962ZM7.64609 7C7.64609 7.35899 7.35508 7.65 6.99609 7.65L1.14609 7.65C0.787109 7.65 0.496094 7.35899 0.496095 7C0.496094 6.64102 0.787109 6.35 1.14609 6.35H6.34609V1.15C6.34609 0.791016 6.63711 0.5 6.99609 0.500001C7.35508 0.5 7.64609 0.791016 7.64609 1.15L7.64609 7ZM1.45571 0.540381L7.45571 6.54038L6.53647 7.45962L0.536474 1.45962L1.45571 0.540381Z" fill="currentColor"></path></svg></div></a><a href="https://www.canva.com/design/DAF4A6H-UwA/Tyr18B6sZEZymtD3OatPbg/view?utm_content=DAF4A6H-UwA&amp;utm_campaign=designshare&amp;utm_medium=link&amp;utm_source=editor" target="_blank" className="p-s-g-link"><p >Presentation</p> <div className="text-right"><svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="currentColor" className="p-l-icon"><path d="M0.536474 1.45962C0.282634 1.20578 0.282634 0.794221 0.536474 0.540381C0.790315 0.28654 1.20187 0.28654 1.45571 0.540381L0.536474 1.45962ZM7.64609 7C7.64609 7.35899 7.35508 7.65 6.99609 7.65L1.14609 7.65C0.787109 7.65 0.496094 7.35899 0.496095 7C0.496094 6.64102 0.787109 6.35 1.14609 6.35H6.34609V1.15C6.34609 0.791016 6.63711 0.5 6.99609 0.500001C7.35508 0.5 7.64609 0.791016 7.64609 1.15L7.64609 7ZM1.45571 0.540381L7.45571 6.54038L6.53647 7.45962L0.536474 1.45962L1.45571 0.540381Z" fill="currentColor"></path></svg></div></a><a href="https://docs.axionprotocol.com/" target="_blank" className="p-s-g-link"><p >Tokenomics</p> <div className="text-right"><svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="currentColor" className="p-l-icon"><path d="M0.536474 1.45962C0.282634 1.20578 0.282634 0.794221 0.536474 0.540381C0.790315 0.28654 1.20187 0.28654 1.45571 0.540381L0.536474 1.45962ZM7.64609 7C7.64609 7.35899 7.35508 7.65 6.99609 7.65L1.14609 7.65C0.787109 7.65 0.496094 7.35899 0.496095 7C0.496094 6.64102 0.787109 6.35 1.14609 6.35H6.34609V1.15C6.34609 0.791016 6.63711 0.5 6.99609 0.500001C7.35508 0.5 7.64609 0.791016 7.64609 1.15L7.64609 7ZM1.45571 0.540381L7.45571 6.54038L6.53647 7.45962L0.536474 1.45962L1.45571 0.540381Z" fill="currentColor"></path></svg></div></a><a href="https://docs.axionprotocol.com/" target="_blank" className="p-s-g-link"><p >Instructions</p> <div className="text-right"><svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="currentColor" className="p-l-icon"><path d="M0.536474 1.45962C0.282634 1.20578 0.282634 0.794221 0.536474 0.540381C0.790315 0.28654 1.20187 0.28654 1.45571 0.540381L0.536474 1.45962ZM7.64609 7C7.64609 7.35899 7.35508 7.65 6.99609 7.65L1.14609 7.65C0.787109 7.65 0.496094 7.35899 0.496095 7C0.496094 6.64102 0.787109 6.35 1.14609 6.35H6.34609V1.15C6.34609 0.791016 6.63711 0.5 6.99609 0.500001C7.35508 0.5 7.64609 0.791016 7.64609 1.15L7.64609 7ZM1.45571 0.540381L7.45571 6.54038L6.53647 7.45962L0.536474 1.45962L1.45571 0.540381Z" fill="currentColor"></path></svg></div></a></div>
                        <div className="g-p-subs"><p >Please note that you are using the Binance Smart Chain (BEP20) network for your investment and make sure to verify the address on the website: <a href="https://docs.axionprotocol.com/" target="_blank" className="private-sale-link">axionprotocol.com</a>. If you make a mistake, the tokens will not be credited to your account.</p> <p className="private-sale-link">See Step-by-Step Guide&gt;</p> <br /> <p >To ensure that coins have been received, perform a test purchase for the minimum amount, then go to <a className="private-sale-link">personal account</a> and check your balance.</p></div>
                    </div>
                    <div>
                        <div className="g-pre-seed"><div className="g-p-s-head"><p >Ends in:</p> <p className="private-timer" style={{ color: "rgb(255, 255, 255)" }}>{countdown}</p></div> <div className="g-p-s-content"><p className="g-p-title">Pre-seed sale</p> <div className="g-p-label"><span >LIMITED EMISSION</span></div> <p className="g-p-total-collected-title">Total Collected:</p> <p className="g-p-total-collected"><span >$304,546</span> <span >&nbsp;/ $855,000</span></p> <div className="g-p-progress-info"><div className="progress_sale__row"><div className="progress_sale"><div className="progress_range" style={{ width: "35%" }}></div> <span className="g-p-softcap-arrow" style={{ left: "66.5497%" }}></span></div></div> <p className="g-p-soft-cap" style={{ left: "66.5497%" }}>Softcap: <span >$569,000</span></p></div> <div className="g-p-grid"><div ><p className="g-p-total-collected-title"><span >Pre-seed</span> price</p> <p className="g-p-grid-text">$0.009</p></div> <div ><p className="g-p-total-collected-title">Token Amount</p> <p className="g-p-grid-text">61M/95M AX</p></div></div>
                            {/* <form > */}
                                <div className="m-p-input-wrapper m-p-i-w-first" style={{ margin: "0px", borderBottom: "1px solid rgb(218, 224, 239)" }}><p className="p-i-label">Give:</p> <div className="input-prefix-w">
                                    <input type="number" step="0.01" value={solAmt} onChange={(e) => setSolAmt(e.target.value)} id='amount' placeholder='e.g. 0.1' required />
                                    <p className="m-p-max mob"><span >0</span> USDC</p></div> <p className="m-p-max">USDC</p> <div className="dropdown_1"><div className="dropdown-btn">
                                        <img src="usdc.svg" className="dropdown-btn-icon" />
                                    </div></div>
                                </div>
                                <div className="m-p-input-wrapper"><p className="p-i-label">Receive:</p> <div className="input-prefix-w">
                                    <input value={solAmt * 1000} readOnly type="number" step="0.01" placeholder="0" />
                                    <p className="m-p-max mob"><span >0</span> AX</p></div> <p className="m-p-max">AX</p> <div className="dropdown_1"><div className="dropdown-btn">
                                        <img src="axionicon.svg" className="dropdown-btn-icon" />  </div></div>
                                </div>

                               {solAmt<50? <div className="error-enter-sum">*Minimum investment amount is <span >50 USDC</span> or <span >50000 AX</span></div>:""}
                                {!publicKey? <div className="error-enter-sum">*Please connect your wallet before submission!</div>:""}
                               
                               
                                 <button className="btn-log-in" onClick={()=>handlePayment()} disabled={solAmt<50||!publicKey}> <span >Buy Tokens AX</span></button><br/>
                            {/* </form> */}
                        </div>
                            {/* <div className="g-p-s-footer">
                                <div >
                                <p style={{ cursor: "pointer", color: "#fff" }}>[0x6F4...55d9]</p>
                                 <button className="token_copy-btn">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style={{ pointerEvents: "none", color: "#fff" }}><g clipPath="url(#clip0_4921_355)"><path d="M9.81462 12.8378H3.76633C2.96457 12.8368 2.19593 12.5179 1.629 11.951C1.06207 11.384 0.743148 10.6154 0.742188 9.81364L0.742188 3.76536C0.743148 2.9636 1.06207 2.19495 1.629 1.62802C2.19593 1.06109 2.96457 0.742171 3.76633 0.741211L9.81462 0.741211C10.6164 0.742171 11.385 1.06109 11.952 1.62802C12.5189 2.19495 12.8378 2.9636 12.8388 3.76536V9.81364C12.8378 10.6154 12.5189 11.384 11.952 11.951C11.385 12.5179 10.6164 12.8368 9.81462 12.8378ZM15.2581 12.233V4.37018C15.2581 4.20977 15.1944 4.05593 15.0809 3.94251C14.9675 3.82908 14.8137 3.76536 14.6533 3.76536C14.4928 3.76536 14.339 3.82908 14.2256 3.94251C14.1121 4.05593 14.0484 4.20977 14.0484 4.37018V12.233C14.0484 12.7142 13.8573 13.1757 13.517 13.516C13.1767 13.8563 12.7152 14.0474 12.2339 14.0474H4.37116C4.21075 14.0474 4.05691 14.1112 3.94348 14.2246C3.83005 14.338 3.76633 14.4919 3.76633 14.6523C3.76633 14.8127 3.83005 14.9665 3.94348 15.08C4.05691 15.1934 4.21075 15.2571 4.37116 15.2571H12.2339C13.0357 15.2561 13.8043 14.9372 14.3713 14.3703C14.9382 13.8034 15.2571 13.0347 15.2581 12.233Z" fill="currentColor"></path></g> <defs><clipPath id="clip0_4921_355"><rect width="14.5159" height="14.5159" fill="currentColor" transform="translate(0.742188 0.741211)"></rect></clipPath></defs>
                                    </svg>
                                    </button> 
                                    <a href="https://docs.axionprotocol.com/" target="_blank" className="xpp-chain">[BSC-20]</a>
                                     <div ><svg xmlns="http://www.w3.org/2000/svg" width="19" height="18" viewBox="0 0 19 18" fill="none" className="xpp-metamask"><path d="M17.1587 1L10.5176 6L11.7526 3.05334L17.1587 1Z" fill="#E17726" stroke="#E17726" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M1.83984 1L8.42183 6.04666L7.24601 3.05333L1.83984 1Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M14.769 12.5928L13.002 15.3394L16.7856 16.3995L17.8695 12.6528L14.769 12.5928Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M1.13867 12.6528L2.21596 16.3995L5.99305 15.3394L4.23259 12.5928L1.13867 12.6528Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M5.78928 7.95296L4.73828 9.56631L8.48251 9.73964L8.35772 5.63965L5.78928 7.95296Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M13.2108 7.95276L10.603 5.59277L10.5176 9.73944L14.2618 9.56611L13.2108 7.95276Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M5.99219 15.3397L8.25841 14.2264L6.3075 12.6797L5.99219 15.3397Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M10.7422 14.2264L13.0018 15.3397L12.6931 12.6797L10.7422 14.2264Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M13.0018 15.3399L10.7422 14.2266L10.9261 15.7199L10.9064 16.3532L13.0018 15.3399Z" fill="#D5BFB2" stroke="#D5BFB2" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M5.99219 15.3399L8.09423 16.3532L8.08108 15.7199L8.25841 14.2266L5.99219 15.3399Z" fill="#D5BFB2" stroke="#D5BFB2" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M8.13456 11.6927L6.25586 11.1327L7.58276 10.5127L8.13456 11.6927Z" fill="#233447" stroke="#233447" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M10.8672 11.6927L11.419 10.5127L12.7525 11.1327L10.8672 11.6927Z" fill="#233447" stroke="#233447" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M5.9909 15.3394L6.31936 12.5928L4.23047 12.6528L5.9909 15.3394Z" fill="#CC6228" stroke="#CC6228" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M12.6797 12.5928L13.0016 15.3394L14.7686 12.6528L12.6797 12.5928Z" fill="#CC6228" stroke="#CC6228" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M14.2618 9.56641L10.5176 9.73974L10.8657 11.6931L11.4175 10.5131L12.751 11.1331L14.2618 9.56641Z" fill="#CC6228" stroke="#CC6228" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M6.25568 11.1331L7.58258 10.5131L8.13438 11.6931L8.48251 9.73974L4.73828 9.56641L6.25568 11.1331Z" fill="#CC6228" stroke="#CC6228" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M4.73828 9.56641L6.30824 12.6798L6.25566 11.1331L4.73828 9.56641Z" fill="#E27525" stroke="#E27525" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M12.7525 11.1331L12.6934 12.6798L14.2633 9.56641L12.7525 11.1331Z" fill="#E27525" stroke="#E27525" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M8.48295 9.74023L8.13477 11.6936L8.57487 14.0002L8.67342 10.9603L8.48295 9.74023Z" fill="#E27525" stroke="#E27525" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M10.5179 9.74023L10.334 10.9536L10.426 14.0002L10.8661 11.6936L10.5179 9.74023Z" fill="#E27525" stroke="#E27525" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M10.8659 11.6928L10.4258 13.9995L10.7411 14.2262L12.6921 12.6795L12.7512 11.1328L10.8659 11.6928Z" fill="#F5841F" stroke="#F5841F" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M6.25586 11.1328L6.30845 12.6795L8.25935 14.2262L8.57467 13.9995L8.13456 11.6928L6.25586 11.1328Z" fill="#F5841F" stroke="#F5841F" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M10.9057 16.3532L10.9254 15.7198L10.7546 15.5732H8.24531L8.08108 15.7198L8.09423 16.3532L5.99219 15.3398L6.72789 15.9532L8.21902 16.9999H10.7743L12.272 15.9532L13.0011 15.3398L10.9057 16.3532Z" fill="#C0AC9D" stroke="#C0AC9D" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M10.7404 14.2266L10.4251 14H8.57272L8.25746 14.2266L8.08008 15.72L8.24431 15.5733H10.7536L10.9244 15.72L10.7404 14.2266Z" fill="#161616" stroke="#161616" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M17.4424 6.32665L18.0007 3.56667L17.1599 1L10.7422 5.83335L13.212 7.95332L16.7001 8.98668L17.4687 8.07336L17.1337 7.82666L17.6657 7.33336L17.2585 7.01334L17.7905 6.6L17.4424 6.32665Z" fill="#763E1A" stroke="#763E1A" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M1 3.56667L1.56492 6.32665L1.20364 6.6L1.74228 7.01334L1.33501 7.33336L1.86708 7.82666L1.53207 8.07336L2.30063 8.98668L5.7887 7.95332L8.25855 5.83335L1.84081 1L1 3.56667Z" fill="#763E1A" stroke="#763E1A" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M16.7003 8.98643L13.2123 7.95312L14.2633 9.56647L12.6934 12.6798L14.7691 12.6531H17.8696L16.7003 8.98643Z" fill="#F5841F" stroke="#F5841F" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M5.78938 7.95312L2.30135 8.98643L1.13867 12.6531H4.23259L6.30832 12.6798L4.73839 9.56647L5.78938 7.95312Z" fill="#F5841F" stroke="#F5841F" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M10.5193 9.74039L10.7427 5.83369L11.7543 3.05371H7.24805L8.25963 5.83369L8.48297 9.74039L8.56837 10.967L8.57494 14.0004H10.4274L10.4339 10.967L10.5193 9.74039Z" fill="#F5841F" stroke="#F5841F" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                                     </div>
                                     </div>
                                      <p className="xpp-why">How to add AX to your Metamask?</p>
                                      </div> */}

                        </div>
                    </div>

                </div>
                {
                    prevTransactions.length > 0 &&
                    <div className="transactionBox">
                        <h2>Previous transactions</h2>
                        <div style={{ overflow: "auto" }}>
                            <table>
                                <tr>
                                    <th>Sr. no.</th>
                                    <th>USDC sent</th>
                                    <th>AX received</th>
                                    <th>Transaction time</th>
                                </tr>
                                {
                                    prevTransactions.map((val:any, index:any) => {
                                        const date = new Date(val.created_at);
                                        return (<tr key={val.id}>
                                            <td>{index + 1}</td>
                                            <td>{val.sol_sent}</td>
                                            <td>{val.ax_given}</td>
                                            <td>{date.toLocaleString()}</td>
                                        </tr>)
                                    }
                                    )
                                }


                            </table>

                        </div>
                    </div>
                }


                {
                    txSig ?
                        <div className='flex justify-center items-center mt-4'>
                            <a href={link()} className='font-normal hover:text-[#01c7ff]' style={{ color: "#fff" }}>View your transaction on- Solana Explorer 🚀</a>
                        </div> :
                        null
                }
            </div>
        </div>

    )

}

export default SendSolForm