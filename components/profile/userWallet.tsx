'use client'
import { useState } from "react";
import Card from "../display/card";
import { walletType } from "@/types/collections";
interface WalletProps{
    wallet:walletType;
    onUpdate:walletType|(()=>void);
}



 export default function  UserWallet  ({wallet,onUpdate}:WalletProps){

    const [topUp,setTopUp]=useState<number|null>(null);
    const[isTopUp,setIsTopUp]=useState(false);

    
    function convertToNumber(value: number | null | undefined): number {
    return typeof value === 'number' ? value : 0;
    }


      const handleTopUpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        //covert input to number|float
        const parsedValue = parseFloat(inputValue);
        if (!isNaN(parsedValue)) {
          // Only update the state if the input is a valid number.
          setTopUp(parsedValue);
        }
      };


    const resetInputFields=() => {
        setTopUp(null);
        setIsTopUp(false)
    }

        const updateWallet=async(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        try {
        // Since we already update the walletData state in the previous useEffect, we don't need to fetch it again here.
        const currentBalance = convertToNumber(wallet.balance) + convertToNumber(topUp) + convertToNumber(wallet.discount);
        console.log("Current Balance:", currentBalance);
        const response = await fetch(`/api/wallet/${wallet.id}`, {
            method: "PATCH",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({ top_up:topUp,balance:currentBalance }),
            });

            if (!response.ok) {
            const data = await response.json();
            console.log(data.message);
            return;
            }

            const { data } = await response.json();
            console.log("user wallet", data);
            if(typeof onUpdate==='function'){
                onUpdate()
            }
            resetInputFields()

        } catch (error) {
            console.log('wallet update error',error);
         }
        };
       
        return(
            <>
            <Card Padding={true}>
                <div className=" max-w-1/2 items-start border-4 border-gray-400 rounded-lg p-4 min-h-[380px] bg-[#dc3545] flex flex-col">
                    <p className="text-xl mb-3 text-center underline underline-offset-4
                     text-green-500"
                    >
                    My Wallet</p>
                    <div className="flex gap-3 flex-col">
                        <div className="flex gap-2 items-center justify-center">
                            <div className="flex flex-col gap-1 items-start">
                                <span className=" text-emerald-100 text-md font-titleFont font-bold">A/c Balance</span>
                                <div className="w-[150px] shadow-md shadow-gray-500 border h-[40px] flex relative rounded-full overflow-hidden items-center justify-center bg-yellow-600">
                                    <span className="w-full p-2 h-full insert-y-0 insert-x-0 absolute flex items-center justify-center text-emerald-100"> {wallet.balance}</span>
                                </div>
                            </div>
                            <span className="items-center mt-5 font-titleFont font-bold text-md text-emerald-200">K.sh</span>
                        </div>

                    <div className="flex flex-col">
                        <div className="flex gap-2 items-center justify-center">
                            <div className="flex flex-col gap-1 items-start">
                                <span className=" text-emerald-100 text-md font-titleFont font-bold">Last top up</span>
                                <div className="w-[150px] h-[40px] shadow-md shadow-gray-500 border relative flex  rounded-full overflow-hidden items-center justify-center bg-lime-600">
                                    <span className="w-full p-2 h-full insert-y-0 insert-x-0 absolute flex items-center justify-center text-emerald-100"> {wallet.top_up}</span>
                                </div>
                            </div>
                            <span className="items-center mt-5 font-titleFont font-bold text-md text-emerald-200">K.sh</span>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <div className="flex gap-2 items-center justify-center">
                            <div className="flex flex-col gap-1 items-start">
                                <span className=" text-emerald-100 text-md font-titleFont font-bold">Discount</span>
                                <div className="w-[150px] flex relative h-[40px] shadow-md shadow-gray-500 border rounded-full overflow-hidden items-center justify-center bg-pink-400">
                                    <span className="w-full p-2 h-full insert-y-0 insert-x-0 absolute flex items-center justify-center text-emerald-100"> {wallet.discount}</span>
                                </div>
                            </div>
                            <span className="items-center mt-5 font-titleFont font-bold text-md text-emerald-200">K.sh</span>
                        </div>
                    </div>
                    </div>
                    { !isTopUp &&(
                    <div onClick ={()=>{setIsTopUp(true)}} className="flex  relative mt-8 items-center h-[34px]">
                        <button className="items-center hover:bg-emerald-600 rounded-md px-4 h-full shadow-md border shadow-inherit bg-yellow-500 text-emerald-100 tex-base font-titleFont font-bold">
                            Top up Your Account
                        </button>
                    </div>)
                    }
                    { isTopUp && (
                    <div className='absolute mb-2 bottom-0 flex'>
                        <form onSubmit={updateWallet} >
                            <div className="items-center flex flex-col gap-2 justify-center ">
                            <input
                            type="number"
                            placeholder="Amount"
                            onChange={handleTopUpChange} // Use the custom onChange handler
                                className="h-[34px] rounded-md border-blue-400 text-center bg-emerald-100 border shadow-sm shadow-gray-3000 text-[#dc3545] "
                             />
                             <button type='submit' className="items-center border hover:bg-yellow-600 border-black rounded-md px-4 text-emerald-50 text-bold shadow-md shadow-gray-300 bg-emerald-500 ">submit</button>
                             </div>

                        </form>
                    </div>)
                    }
                </div>
            </Card>
            </>
        )
  }