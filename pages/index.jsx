import { Inter } from 'next/font/google'
import WalletContextProvider from '@/components/WalletContextProvider';
import Head from 'next/head';
import NavBar from '../components/NavBar';
import BalanceDisplay from '@/components/BalanceDisplay';
import SendSolForm from '@/components/SendSolForm';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <div style={{background: "#512da8 url('./bg.jpg') no-repeat fixed center",backgroundSize:"cover",height:"100vh"}}>
      <Head>
        <title>SolTransfer</title>
        <meta
          name='description'
          content='Wallet Adapter Example'
        />
      </Head>
      <WalletContextProvider>
        <NavBar />
        <div>
          <BalanceDisplay />
          <SendSolForm />
        </div>
      </WalletContextProvider>
    </div>
  )
}
