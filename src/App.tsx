import { WalletAdapterNetwork, WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Button } from '@solana/wallet-adapter-react-ui/lib/types/Button';

import '../src/css/bootstrap.css'
import {
    GlowWalletAdapter,
    LedgerWalletAdapter,
    PhantomWalletAdapter,
    SlopeWalletAdapter,
    SolflareWalletAdapter,
    SolletExtensionWalletAdapter,
    SolletWalletAdapter,
    TorusWalletAdapter,

} from '@solana/wallet-adapter-wallets';
import fs from "fs";

import { clusterApiUrl, Transaction, SystemProgram, Keypair, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import React, { FC, ReactNode, useMemo, useCallback, useState } from 'react';

import { actions, utils, programs, NodeWallet, Connection} from '@metaplex/js'; 
import * as anchor from "@project-serum/anchor";
const { Wallet } = require("@project-serum/anchor");
const {
  TOKEN_PROGRAM_ID,
  MINT_SIZE,
  createInitializeMintInstruction,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
} = require("@solana/spl-token");
const {
  createCreateMasterEditionV3Instruction,
  createCreateMetadataAccountV2Instruction,
  DataV2,
} = require("@metaplex-foundation/mpl-token-metadata");
// const fs = require("fs");
const bs58 = require('bs58');

type DataV2 = InstanceType<typeof DataV2>;
let abc: DataV2;

type Wallet = InstanceType<typeof Wallet>;
let def: Wallet;

require('./App.css');
require('@solana/wallet-adapter-react-ui/styles.css');
let thelamports = 0;
let theaddress = "";
let theWallet = "9m5kFDqgpf7Ckzbox91RYcADqcmvxW4MmuNvroD5H2r9"

export class MyWallet implements Wallet {

  constructor(readonly payer: Keypair) {
      this.payer = payer
  }

  async signTransaction(tx: Transaction): Promise<Transaction> {
      tx.partialSign(this.payer);
      return tx;
  }

  async signAllTransactions(txs: Transaction[]): Promise<Transaction[]> {
      return txs.map((t) => {
          t.partialSign(this.payer);
          return t;
      });
  }

  get publicKey(): PublicKey {
      return this.payer.publicKey;
  }
}

function getWallet(){

    
}
const App: FC = () => {


    return (
        <Context>
            <Content />
        </Context>
    );
};


export default App;

const Context: FC<{ children: ReactNode }> = ({ children }) => {
    // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
    const network = WalletAdapterNetwork.Mainnet;

    // You can also provide a custom RPC endpoint.
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
    // Only the wallets you configure here will be compiled into your application, and only the dependencies
    // of wallets that your users connect to will be loaded.
    const wallets = useMemo(
        () => [
            new LedgerWalletAdapter(),
            new PhantomWalletAdapter(),
            new GlowWalletAdapter(),
            new SlopeWalletAdapter(),
            new SolletExtensionWalletAdapter(), 
            new SolletWalletAdapter(),
            new SolflareWalletAdapter({ network }),
            new TorusWalletAdapter(),
        ],
        [network]
    );

   

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

const Content: FC = () => {
    let [lamports, setLamports] = useState(.1);
    let [address, setAddress] = useState("");
    // let [wallet, setWallet] = useState("9m5kFDqgpf7Ckzbox91RYcADqcmvxW4MmuNvroD5H2r9");
    let [wallet, setWallet] = useState("");

  
    

    // const { connection } = useConnection();
    const connection = new Connection(clusterApiUrl("devnet"))
    const { publicKey, sendTransaction } = useWallet();


 

    const onClick = useCallback( async () => {

        if (!publicKey) throw new WalletNotConnectedError();
        connection.getBalance(publicKey).then((bal) => {
            console.log(bal/LAMPORTS_PER_SOL);

        });

        let lamportsI = LAMPORTS_PER_SOL*lamports;
        console.log(publicKey.toBase58());
        console.log("lamports sending: {}", thelamports)
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: publicKey,
                toPubkey: new PublicKey(wallet),
                lamports: lamportsI,
            })
        );
        console.log("address sending too: ", theaddress)
        const signature = await sendTransaction(transaction, connection);

        await connection.confirmTransaction(signature, 'processed');
    }, [publicKey, sendTransaction, connection]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAddress(event.target.value);
    }
function setTheLamports(e: any)
{
    console.log(Number(e.target.value));
    setLamports(Number(e.target.value));
    lamports = e.target.value;
    thelamports = lamports;
}
function setTheAddress(e: any)
{
    console.log(String(e.target.value));
    setAddress(String(e.target.value))
    address = e.target.value;
    theaddress = address;
}
function setTheWallet(e: any){
    setWallet(e.target.value)
    theWallet = e.target.value;
    console.log("wallet", theWallet);
}
const mintBtt = async () => {
    try {
        // const secretKey = fs.readFileSync(
        //   "/Users/pratiksaria/.config/solana/id.json",
        //   "utf8"
        // );
        const secretKey = "[140,240,198,127,47,73,167,84,83,30,165,145,248,92,199,219,89,0,176,21,43,140,230,178,71,58,135,175,72,99,234,70,144,101,4,150,179,194,54,18,240,103,220,96,106,128,41,224,76,118,78,23,64,226,74,42,210,27,208,112,72,146,224,192]"
        const keypair = anchor.web3.Keypair.fromSecretKey(
          Buffer.from(JSON.parse(secretKey))
        );
        console.log("xxx")
    
        const wallet = new MyWallet(keypair);
        // const wallet = bs58.decode(keypair).toString();
        console.log("wallet bs58: ", wallet)
        console.log("Connected Wallet", wallet.publicKey.toString());
    
        const endpoint = "https://metaplex.devnet.rpcpool.com/";
        const connection = new anchor.web3.Connection(endpoint);
        const { blockhash } = await connection.getLatestBlockhash("finalized");
        const transaction = new anchor.web3.Transaction({
          recentBlockhash: blockhash,
          feePayer: wallet.publicKey,
        });
    
        const mintKey = anchor.web3.Keypair.generate();
    
        const lamports = await connection.getMinimumBalanceForRentExemption(
          MINT_SIZE
        );
    
        transaction.add(
          anchor.web3.SystemProgram.createAccount({
            fromPubkey: wallet.publicKey, // The account that will transfer lamports to the created account
            newAccountPubkey: mintKey.publicKey, // Public key of the created account
            space: MINT_SIZE, // Amount of space in bytes to allocate to the created account
            lamports, // Amount of lamports to transfer to the created account
            programId: TOKEN_PROGRAM_ID, // Public key of the program to assign as the owner of the created account
          }),
          createInitializeMintInstruction(
            mintKey.publicKey, // mint pubkey
            0, // decimals
            wallet.publicKey, // mint authority
            wallet.publicKey // freeze authority (you can use `null` to disable it. when you disable it, you can't turn it on again)
          )
        );
        // ata stands for Associated Token Account
        let wallet_ata = await getAssociatedTokenAddress(
          mintKey.publicKey, // mint
          wallet.publicKey // owner
        );
    
        transaction.add(
          createAssociatedTokenAccountInstruction(
            wallet.publicKey,
            wallet_ata,
            wallet.publicKey,
            mintKey.publicKey
          ),
          createMintToInstruction(
            mintKey.publicKey, // mint
            wallet_ata,
            wallet.publicKey,
            1
          )
        );
    
        const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
          "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
        );
    
        const [metadatakey] = await anchor.web3.PublicKey.findProgramAddress(
          [
            Buffer.from("metadata"),
            TOKEN_METADATA_PROGRAM_ID.toBuffer(),
            mintKey.publicKey.toBuffer(),
          ],
          TOKEN_METADATA_PROGRAM_ID
        );
    
        const [masterKey] = await anchor.web3.PublicKey.findProgramAddress(
          [
            Buffer.from("metadata"),
            TOKEN_METADATA_PROGRAM_ID.toBuffer(),
            mintKey.publicKey.toBuffer(),
            Buffer.from("edition"),
          ],
          TOKEN_METADATA_PROGRAM_ID
        );
    
        const data: DataV2 = {
          name: "Metaplex",
          symbol: "PAT",
          uri: "https://metadata.degods.com/g/4924.json",
          sellerFeeBasisPoints: 500,
          creators: [
            {
              address: wallet.publicKey,
              verified: true,
              share: 100,
            },
          ],
          collection: null,
          uses: null,
        };
    
        const args = {
          data,
          isMutable: true,
        };
    
        const createMetadataV2 = createCreateMetadataAccountV2Instruction(
          {
            metadata: metadatakey,
            mint: mintKey.publicKey,
            mintAuthority: wallet.publicKey,
            payer: wallet.publicKey,
            updateAuthority: wallet.publicKey,
          },
          {
            createMetadataAccountArgsV2: args,
          }
        );
    
        transaction.add(createMetadataV2);
    
        const createMasterEditionV3 = createCreateMasterEditionV3Instruction(
          {
            edition: masterKey,
            mint: mintKey.publicKey,
            updateAuthority: wallet.publicKey,
            mintAuthority: wallet.publicKey,
            payer: wallet.publicKey,
            metadata: metadatakey,
          },
          {
            createMasterEditionArgs: {
              maxSupply: new anchor.BN(0),
            },
          }
        );
        transaction.add(createMasterEditionV3);
    
        transaction.partialSign(mintKey);
        const signed_transaction = await wallet.signTransaction(transaction);
        const serialized_transaction = signed_transaction.serialize();
    
        const sig = await connection.sendRawTransaction(serialized_transaction);
        await connection.confirmTransaction(sig, "confirmed");
        console.log("Transaction Signature", sig);
      } catch (error) {
        console.log("Error: " + error);
      }
}
    return (
       

        <div className="App">
                <div className="navbar">
        <div className="navbar-inner ">
          <a id="title" className="brand" href="#">Brand</a>
          <ul className="nav">


          </ul>
          <ul className="nav pull-right">
                      <li><a href="#">White Paper</a></li>
                      <li className="divider-vertical"></li>
                      <li><WalletMultiButton /></li>

                    </ul>
        </div>
      </div>
<input value={lamports} type="number" onChange={(e) => setTheLamports(e)}></input>
{/* <input value={wallet} type="text" onChange={handleChange}></input> */}
<input value={wallet} type="text" onChange={(e) => setTheWallet(e)}></input>
        <br></br>
      <button className='btn' onClick={onClick}>Send Sol </button>
      <button className='mint' onClick={mintBtt}>Mint</button>


        </div>
    );
};
