
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { auctionType } from "@/types/collections";

const AuctionType = ({ auction}: { auction: auctionType }) => {
  const [value, setValue] = useState(auction.auction_type);
  const changeHandler = async (value: string) => {
    setValue(value);
    try {
      const res = await fetch(`/api/auction/${auction.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ auction_type: value }),
      });
      const {data }= await res.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    
    <Select onValueChange={changeHandler} value={value}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="Gold">
            <div className="flex items-center gap-2">
              <div className={`rounded-full w-3 h-3 bg-yellow-500`} />
              <div>Gold</div>
            </div>
          </SelectItem>
          <SelectItem value="Diamond">
            <div className="flex items-center gap-2">
              <div className={`rounded-full w-3 h-3 bg-blue-500`} />
              <div>Diamond</div> 
            </div>
          </SelectItem>
          <SelectItem value="Platinum">
            <div className="flex items-center gap-2">
              <div className={`rounded-full w-3 h-3 bg-emerald-500`} />
              <div>Platinum</div>
            </div>
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
   
  );
};

export default AuctionType;
