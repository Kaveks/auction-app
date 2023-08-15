"use client";
import { useCallback, useEffect, useState } from "react"
import AuctionItem from "./auctionsItem";
import AddNewAuction from "./addNewAuctions";
import Card from "../display/card";
import { auctionType } from "@/types/collections";
import Load from "../loading";
const AuctionList = () => {
  const [auctions, setAuctions] = useState<auctionType[]>([]);
  const [loading,setLoading] = useState(true)

  // const [auctionTrigger, setAuctionTrigger]=useState([])

  // Fetch Auctions
  const fetchAuctions = useCallback(async () => {
    try {
      const response = await fetch("/api/auction");
      const data = await response.json();
      setAuctions(data)
      setLoading(false);
      
    } catch (error) {
      setAuctions([])
      setLoading(false)
      console.log('Fetch Error' ,error);
    }
  }, []);


  useEffect(() => {
    fetchAuctions();
  },[fetchAuctions]);

  const deletedAuctionHandler = useCallback(() => {
    fetchAuctions();
  }, [fetchAuctions]);

  if(loading){
    return<Load />
  }

  return (
  <div className='w-full min-h-screen'>
      <div className="items-center justify-center  flex flex-col my-2">
      <AddNewAuction onPost={fetchAuctions}/>
      </div>
      <div className=" mx-4 grid grid-cols-3  bg-yellow-500">
      {auctions.length > 0 ?(
          auctions.map((auction => <div key={auction.id} className='my-5 mx-5'>
                <AuctionItem auction={auction}  onDelete={deletedAuctionHandler}/>
                </div>))
        ): (
          <div className="items-center  mx-auto justify-center">
          <h1 className="flex text-center text-slate-600 text-2xl"> Currently seems like there are no Auctions</h1>
          </div>
        )
      }
      </div>

  </div>
  );
};

export default AuctionList;