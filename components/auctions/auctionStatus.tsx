
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

const AuctionStatus = (
  { auction }: { auction: auctionType})=> {
  const [value, setValue] = useState(auction.auction_status);
  const changeHandler = async (value: string) => {
    setValue(value);
    try {
      const res = await fetch(`/api/auction/${auction.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ auction_status: value }),
      });
      const data = await res.json();
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
          <SelectItem value="Started">
            <div className="flex items-center gap-2">
              <div className={`rounded-full w-3 h-3 bg-pink-300`} />
              <div>Started</div>
            </div>
          </SelectItem>
          <SelectItem value="In-Progress">
            <div className="flex items-center gap-2">
              <div className={`rounded-full w-3 h-3 bg-green-600`} />
              <div>In-Progress</div> 
            </div>
          </SelectItem>
          <SelectItem value="Ended">
            <div className="flex items-center gap-2">
              <div className={`rounded-full w-3 h-3 bg-red-800`} />
              <div>Ended</div>
            </div>
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>

  );
};

export default AuctionStatus;
