import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

const NavBar = () => {
    return (
        <div className="text-white font-normal flex justify-center items-center navbar">
            <div className="flex items-center">
                <div className="mr-auto">
                    <img src="/axion2.png" alt="axion logo" style={{height:"45px"}} />
                </div>
             
            </div>
            <div className="ml-auto">
                <WalletMultiButton />
            </div>
        </div>
    )
}

export default NavBar;
