'use client'
import { useCallback, useEffect, useState } from "react";
import UserWallet from "@/components/profile/userWallet";
import { walletType } from "@/types/collections";


const WalletPage = () => {
    const [walletData,setWalletData]=useState<walletType|null>(null);
    const fetchUserWalletData=useCallback(async()=>{
        try{
            const response = await fetch('/api/wallet')
            const data = await response.json();
            setWalletData(data);
            console.log('user wallet info from wallet page',data)
        }catch(error){
            console.log('user wallet info fetch error',error)
        }
    },[]);

    useEffect(()=>{
        fetchUserWalletData()
    },[fetchUserWalletData])

    return ( 
        <div className=' max-w-1/2 '>
           {walletData?(
            <div key={walletData.id} className=''>
            <UserWallet wallet={walletData} onUpdate={fetchUserWalletData} />
            </div>
           ):(
            <div className=" text-center text-2xl min-h-screen text-slate-500 font-titleFont font-bold ">Sorry,no wallet info retrieved please wait or try later!</div>
           )
            }
        </div>

     );
}
 
export default WalletPage;