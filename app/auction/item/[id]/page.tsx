'use client'
import Card from "@/components/display/card";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Layout from "@/components/display/layout";
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { useAuth } from "@/components/providers/supabase-auth-provider";
import { auctionType, walletType } from "@/types/collections";
import { createClientB } from "@/utils/supabase-browser";




const AuctionItem = ({params}:{params:{id:string}}) => {
    const {user}=useAuth()
    const id = params.id;
    const[itemDescription,setItemDescription]=useState(false);
    const [auctionItem,setAuctionItem]=useState<auctionType|any|[]>([]);
    const[bidAmount,setBidAmount]=useState<number|null>(null); 
    const [walletData,setWalletData]=useState<walletType|null|any>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [user_id, setUser_id] = useState<string|undefined >('');
    const [auctionBidCounts, setAuctionBidCounts] = useState<{ [key: string]: number }>({});
    const supabase=createClientB();

     const getUserSession = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    setUser_id(userId);
    }, [supabase.auth]);

     //convert value to a number
    function convertToNumber(value:number|null|undefined):number{
        return typeof value ==='number'? value:0
    };

    const resetInputField=()=>{
        // Reset the input value directly using the DOM API
        const bidInput = document.getElementById("bid-amount-input") as HTMLInputElement;
        if (bidInput) {
            bidInput.value = "";
        }
    }


      const inputAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputAmount = e.target.value;
        const parsedInputAmount = parseFloat(inputAmount);
        if (!isNaN(parsedInputAmount) ) {
            setBidAmount(parsedInputAmount);
          } 
        };

        // Function to fetch the user's wallet data
      const fetchWalletInfo = useCallback(async () => {
        try {
          getUserSession()
          const response= await fetch(`/api/wallet/${user_id}`);
          const data=await response.json();

            setWalletData(data);
          
        } catch (error) {
         console.log('fetch user wallet data ',error)
          }
        }, [getUserSession, user_id]);

        useEffect(() => {
          fetchWalletInfo();
        // Subscribe to changes on the 'wallet' table for the current user
        const subscription = supabase
          .channel('wallet_listened')
          .on("postgres_changes",{
            event:'UPDATE',schema:'public',table:'wallet'
            
          },(payload)=>{
            console.log('wallet listened updates', payload.new);
          setWalletData((prevWalletData:any)=>({
            ...prevWalletData,
            ...payload.new
          }));
        })
        .subscribe();

        // Clean up the subscription when the component unmounts
        return () => {
        subscription.unsubscribe();
        };
      
        }, [supabase, fetchWalletInfo]);


      const bidHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if( convertToNumber(bidAmount)>convertToNumber(auctionItem.auction_amount)){
         setErrorMessage('Invalid bid amount. Please enter a valid amount which is less or equal to max amount');
        }else if( convertToNumber(bidAmount)>convertToNumber(walletData?.balance)){
            setErrorMessage('Invalid bid amount. Please enter a valid amount which is within your wallet balance')
        }else if((convertToNumber(bidAmount))===(0)){
            setErrorMessage('Invalid bid amount. You cannot bid with a zero amount')
        }else{
            setErrorMessage(null);
          
        
        const newBalance=(convertToNumber(walletData?.balance))-(convertToNumber(bidAmount))
        setWalletData((prevWalletData:any) => ({
        ...prevWalletData,
        balance: newBalance,
      }));
        try {
            const response = await fetch(`/api/wallet/${walletData?.id}`, {
              method: "PATCH",
              body: JSON.stringify( {
                  balance:newBalance
              } ),
              headers: {
                "Content-Type": "application/json",
              },
            });
            if (!response.ok) {
              console.log(response);
              const data = await response.json();
              console.log(data.message);
            }
             resetInputField()
          } catch (error) {
            console.log('wallet update error',error)
          }


        try {
            const response = await fetch("/api/bidManagement", {
              method: "POST",
              body: JSON.stringify( {
                  bider:user?.full_name,
                  seller:auctionItem.seller,
                  auction_item:auctionItem.item_name,
                  auction_id:auctionItem.id,
                  amount:bidAmount,
                  auction_type:auctionItem.auction_type
              } ),
              headers: {
                "Content-Type": "application/json",
              },
            });
            if (!response.ok) {
              console.log(response);
              const data = await response.json();
              console.log(data.message);
            }
          } catch (error) {
            console.log('bid submission error',error)
          }
        }
      };

      //bid count functionality
  // Function to count the number of bids for each auction
  const countBids =useCallback( (bidsData: any[]) => {
    const auctionCounts: { [key: string]: number } = {};

    bidsData.forEach((bid) => {
      const auctionId = bid.auction_id;
      if (!auctionCounts[auctionId]) {
        auctionCounts[auctionId] = 1;
      } else {
        auctionCounts[auctionId] += 1;
      }
    });

    // If there are initial bids fetched from the database, merge them with real-time updates
    const mergedCounts = {
      ...auctionBidCounts, // Previous bid counts
      ...auctionCounts, // New bid counts
    };

    return mergedCounts;
  },[auctionBidCounts]);

  // Use the supabase real-time subscription to listen for changes in the 'bid_management' table
  useEffect(() => {
    // Subscribe to 'INSERT' events for new bids
    const subscription= supabase.channel("bid_management_listen")
    .on("postgres_changes",{
      event: 'INSERT',schema:'public',table: 'bid_management'
    },(payload)=>{
      const newBidData = payload.new;
      console.log('new bid',newBidData)
      const auctionId = newBidData.auction_id;
    // Update the bid counts with the new bid
    setAuctionBidCounts((prevCounts) => {
      return {
        ...prevCounts,
        [auctionId]: (prevCounts[auctionId] || 0) + 1,
      };
    });


    })
      .subscribe();

    // Clean up the subscription when the component unmounts
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  // Fetch initial bids when the component mounts
  useEffect(() => {
    const fetchBids = async () => {
      try {
        const response = await fetch(`/api/bidManagement/${auctionItem.id}`);
        const data =await response.json();
          const auctionCounts = countBids(data);
          setAuctionBidCounts(auctionCounts);
      } catch (error) {
        console.error("Error fetching bids:", error);
      }
    };

    fetchBids();
  }, [auctionItem.id, countBids]);

    const fetchAuctions = useCallback(async () => {
        try{
            const response = await fetch(`/api/auction/${id}`);
            const data = await response.json();
            //console.log('auction item',data)
            setAuctionItem(data)
        }catch(error){
            console.log('fetch',error)
        }

        },[id])
        
        useEffect(() => {
            fetchAuctions();
        },[fetchAuctions]);

        
        const columns: GridColDef[] = [
            { field: 'id', headerName: 'ID', width: 50 },
            { field: 'details', headerName: 'Details', width: 130 },
            {field: "-" , headerName: '-',width: 130}
            // {
            //     field: 'details',
            //     headerName: 'Details',
            //     description: 'This column has a value getter and is not sortable.',
            //     sortable: false,
            //     width: 160,
            //     valueGetter: (params: GridValueGetterParams) =>
            //     `${params.row.firstName || ''} ${params.row.lastName || ''}`,
            // },
            ];

            const rows = [
            { id: 1, details: 'Name', "-": `${auctionItem.item_name}` },
            { id: 2, details: 'Color', "-": `${auctionItem.item_color}` },
            { id: 3, details: 'Type', "-": `${auctionItem.item_type}` },
            { id: 4, details: 'Year Purchased', "-": `${auctionItem.year_purchased}` },
            { id: 5, details: 'Seller', "-": `${auctionItem.seller}` },
            { id: 6, details: 'Location', "-": `${auctionItem.location}` },
            ];
   
    const startTime = new Date(auctionItem.start_time);
    const currentTime = new Date();

    const totalDuration = 3600; // Total duration in seconds

    // Calculate the remaining time in seconds
    const remainingTime = Math.ceil((startTime.getTime() - currentTime.getTime()) / 1000);

        /// Define your colors and corresponding time intervals
    const colors: { 0: `#${string}` } & { 1: `#${string}` } & `#${string}`[] = ['#004777', '#F7B801', '#A30000', '#A30000'];
    // Define your colors and corresponding time intervals

    const colorsTime: any = [totalDuration, totalDuration * 0.7, totalDuration * 0.5, totalDuration * 0.3, 0];
    // Adjust the colorsTime array dynamically based on the remaining time
    const dynamicColorsTime = colorsTime.map((time: number, index: number) => {
    const interval = (totalDuration - time) / colors.length;
    const dynamicTime = remainingTime - interval * (colors.length - index);
    return dynamicTime > 0 ? dynamicTime : 0;
    });


    return ( 

          <Layout hideSideNav={true}>
            <Card Padding={false}>
                <div className="flex min-h-screen gap-2"> 
                    <div className="w-1/2 h-full">
                        <div className="m-1 flex flex-col w-[600px]">
                        <Card Padding={true}>
                            {auctionItem.item_image?.length >0 && (<div className=" w-[500px] h-[450px]">
                            {auctionItem.item_image.map((itemImage:string) => (
                                <div className="w-full h-full" key={itemImage}>
                                <Image
                                 width='500'
                                  height='450' 
                                   className= 'object-cover p-10 overflow-hidden' 
                                   src={itemImage} 
                                   alt='Item Image'
                                /></div>
                                ))}
                                </div>
                            )}
                            <div className="items-center mb-2 flex  justify-center">
                            <h2 className=" text-2xl text-bold font-titleFont text-[#033090]">{auctionItem.item_name}</h2>
                            </div>
                        </Card>
                        </div>
                        </div>

                    <div className="w-1/2 -ml-10 h-full  gap-2">
                        <div className="flex w-full h-full mx-1 mt-1 gap-2">
                            <div className="w-1/2 h-full">
                                <div className="w-full flex flex-col min-h-screen h-full border-t border-b border-b-gray-300 rounded-lg border-t-gray-300 items-start mx-2 p-2 ">
                                    <div className='w-full border-b mb-2 rounded-md border-b-gray-300'>
                                        <h3 className="text-2xl mx-2 font-bold text-[#033090] font-titleFont">Item Details</h3>
                                    </div>
                                    <div className="flex">
                                        {/* <div style={{ height: 600, width: '100%' }}> */}
                                        <div className ='w-full -mx-3 bg-[#8cd67b] rounded-md '>
                                        <DataGrid
                                            rows={rows}
                                            columns={columns}
                                            // style={{ color: 'rgb(30 41 59)' }}
                                            initialState={{
                                            pagination: {
                                            paginationModel: { page: 0, pageSize:6},
                                            },
                                            }}
                                            pageSizeOptions={[6, 10]}
                                            checkboxSelection
                                        />
                                        </div>
                                    </div>
                                    <div className="flex mt-2 items-center justify-center flex-col w-full ">
                                        <div className="flex flex-col mx-2 md:mx-5 w-full">
                                            {auctionItem.item_description &&(<>
                                                <div className="items-center justify-center w-full h-10">
                                                   <button onClick={()=>{setItemDescription(true)}} className="h-full md:w-[150px] md:ml-5 bg-appBg shadow-lg border-4  shadow-gray-300 text-center">
                                                        Item Description
                                                    </button>
                                                </div>
                                                </>
                                                )
                                                }
                                        <div className="items-center justify-center mx-2">
                                            {
                                                itemDescription &&(
                                                    <div
                                                    className="">
                                                    <p className="text-sm font-bodyFont font-bold text-slate-700">{auctionItem.item_description}</p>
                                                    </div>
                                                        )
                                                    }
                                        </div>
                                            
                                        </div>

                                    </div>
                                 </div>
                            </div>

                            <div className="w-1/2 ml-2 -mr-16 h-full">
                                <div className="  min-h-screen border rounded-md border-gray-300 p-3 mx-2 w-full h-full">
                                    <div className="items-center justify-center mb-2 border-b w-full border-offset-3 border-b-gray-300">
                                        <h3 className="text-2xl  font-bold text-center font-titleFont text-[#033090]">Bid Information</h3>
                                    </div>
                                    <div className=" flex flex-col w-full">
                                    <table className="border-collapse:collapse  table-fixed">
                                        <thead>
                                            <tr>
                                            <th></th>
                                            <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                            <td ><p className="my-4 mb-5">Bid Status</p></td>
                                            <td >
                                            <div className="flex my-4 mb-5 -ml-1 gap-1 w-full">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6  text-green-700 fill-current rounded-full h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.564A.562.562 0 019 14.437V9.564z" />
                                                </svg>
                                                <span className="text-base font-titleFont font-bold">{auctionItem.auction_status}</span>
                                            </div>
                                            </td>
                                            </tr>
                                            <tr>
                                            <td ><p className="my-4 mb-3">Auction Type</p></td>
                                            <td ><p className="my-4 mb-3 text-base font-titleFont font-bold">{auctionItem.auction_type}</p></td>
                                            </tr>
                                            <tr>
                                            <td className="my-4 mb-3">Max amount</td>
                                            <td> <p className="my-4 mb-3 text-base font-titleFont font-bold">{auctionItem.auction_amount}{""}/=</p></td>
                                            </tr>
                                            <tr>
                                            <td ><p className="my-4">Bids</p></td>
                                            <td ><p className="my-1 text-base text-center  bg-[#ffa800] border-2 rounded-md border-red-500 p-2 font-titleFont font-bold">{auctionBidCounts[auctionItem.id] || 0}</p></td>
                                            </tr>
                                        </tbody>
                                        </table>
                                        <div className="w-full mt-5 gap-4 flex items-center max-h-[150px]">
                                            <p className="text-start text-2xl">Time Left:</p>
                                    {/* Render the CountdownCircleTimer component with the dynamic colorsTime array */}
                                        <CountdownCircleTimer
                                        isPlaying
                                        duration={remainingTime > 0 ? remainingTime : 0}
                                        colors={colors}
                                        colorsTime={dynamicColorsTime}
                                        size={120}
                                        >
                                        {({ remainingTime }) => remainingTime}
                                        </CountdownCircleTimer>
                                        </div>
                                        <div className='flex mt-2 my-4 w-full h-[45px] gap-2 flex-col'>
                                        <form onSubmit={bidHandler}>
                                            <div className='items-start '>
                                            <Label htmlFor="bid_amount" className='text-slate-700 font-bold'>Your Bid:</Label>
                                            </div>
                                            {errorMessage && <div className="text-sm text-bold text-red-500">{errorMessage}</div>}
                                           <div className=" flex gap-2 ml-5 items-center justify-center mx-auto w-full h-[40px]">
                                            <Input
                                            type='number'
                                            id='bid-amount-input'
                                            placeholder="Amount"
                                            onChange={inputAmount}
                                            className="h-[34px] w-[150px] text-center border border-blue-400 transition shadow-md shadow-gray-300 ease-in-out duration-30">
                                            </Input>
                                            <span className="text-xl">$ {""}or {""}/=</span>
                                            </div>
                                            <div className="w-[200px] mt-3 ml-10 items-center justify-center inline-flex h-10 ">
                                                <button type ='submit' className="bg-[#ffa800] my-4 border rounded-md shadow-lg items-center justify-center flex gap-2 shadow-appBg w-full h-full"> 
                                                <span className='font-bold'>Bid Now {""}</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className=" md:ml-4 w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                                                </svg>
                                                </button>
                                                </div>
                                        </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
            </Layout>

     );
}
 
export default AuctionItem;