import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

const NavBar = () => {
    return (
        <div className="bg-black text-white font-normal flex justify-center items-center p-4">
            <div className="flex items-center">
                <div className="mr-auto">
                    <img src="/axion2.png" alt="axion logo" style={{height:"50px"}} />
                </div>
             
            </div>
            <div className="ml-auto">
                <WalletMultiButton />
            </div>
        </div>
    )
}

export default NavBar;
