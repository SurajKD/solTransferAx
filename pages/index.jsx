import { Inter } from 'next/font/google'
import WalletContextProvider from '@/components/WalletContextProvider';
import Head from 'next/head';
import NavBar from '../components/NavBar';
import BalanceDisplay from '@/components/BalanceDisplay';
import SendSolForm from '@/components/SendSolForm';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <div style={{background: "#000",backgroundSize:"cover",minHeight:"100vh"}}>
      <Head>
        <title>Axion IDO</title>
        <meta
          name='description'
          content='Axion IDO'
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
