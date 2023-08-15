"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useRef, useState } from "react";
import Image from "next/image";
import Preloader from "./preloader";
import { auctionType } from "@/types/collections";
import { createClientB } from "@/utils/supabase-browser";

interface Props{
  onPost :auctionType|(()=>void);
}
export default function AddNewAuction({onPost}:Props){
    const [item_name, setItemName] = useState<string>('');
    const [location, setLocation] = useState<string>('');
    const [item_description, setItemDescription] = useState<string>('');
    const [auction_amount, setAuctionAmount] = useState<number|string>('');
    const [min_bidders, setMinBidders] = useState<number|string>('');
    const [max_bids,setMaxBids]=useState<number|string>('');
    const [uploads,setUploads] = useState<string[]>([]);
    const [isUploading,setIsUploading] = useState(false);
    const supabase=createClientB()
    const ref = useRef<HTMLButtonElement>(null); 
 
  //reset form after submission
  const resetForm = () => {
    setItemName('');
    setItemDescription('');
    setAuctionAmount('');
    setMinBidders('');
    setMaxBids('');
    setUploads([]);
    setLocation('')
  };

  async function addImage(event: {[x: string]: any; preventDefault: () => void; }){
    event.preventDefault()
    const files=event.target.files;
    if(files.length >0){
      setIsUploading(true)
        for(const file of files){
          //change the file name
          console.log(file)
          const newName=Date.now()+file.name;
          try{
            const response= await supabase.storage.from('auctionitem_images')
            .upload(newName,file);
            if(response.data){
              const url=process.env.NEXT_PUBLIC_SUPABASE_URL+'/storage/v1/object/public/auctionitem_images/'+response.data.path;
              setUploads(prevUploads =>[...prevUploads,url]);
            }else{
              console.log(response);
              setIsUploading(false);
            }
          }
          catch(error:any){
            setIsUploading(false);
            return error.message
          }
        }
  }
    setIsUploading(false);
  }
  // Add Auction Handler
  const addAuctionHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Update the newAuction object with the latest form input values
    // POST request
    try {
      const response = await fetch("/api/auction", {
        method: "POST",
        body: JSON.stringify( {auction_amount,
          item_description,
          item_name,
          max_bids,
          min_bidders,
          item_image:uploads,
          location
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
     
      const {data }= await response.json();
      console.log(data);
      // alert('Auction created!')
      if (typeof onPost === 'function') {
        onPost();
      }
      resetForm()
      ref.current?.click();
    } catch (error) {
      console.log('Submission error',error)
    }
  };
  return (
    <div className="max-w-contentContainer flex flex-col max-h-screen">
      <Dialog>
          <DialogTrigger asChild>
            <Button ref={ref} variant="outline" className="text-3xl">
              Add new Auction <Plus size="18" />
            </Button>
          </DialogTrigger>
          <DialogContent className=" sm:max-w-[425px]">
            <div className="flex flex-col items-center justify-center">
            <DialogHeader >
              <DialogTitle >Add new Auction</DialogTitle>
              <DialogDescription className='text-stone-950 text-lg'>
                You can add a new Auction by filling the form below.
              </DialogDescription>
            </DialogHeader>
            </div>
            <div className="items-center justify-center">
            <form onSubmit={addAuctionHandler}>
            <div className="grid grid-cols-3 items-center justify-center gap-2">
              <div>
              <Label htmlFor="item_name" className='text-white'>Item Name</Label> <Label/>
              <Input
                  value={item_name}
                  placeholder="Name"
                  onChange={(e) => {
                    setItemName(e.target.value);
                  }}
                  id="item_name"
                  className=" bg-appBg"
                />
                </div>

              <div>
              <Label htmlFor="location" className='text-white'>Location</Label> <Label/>
              <Input
                  value={location}
                  placeholder="eg Kisumu,Kenya"
                  onChange={(e) => {
                    setLocation(e.target.value);
                  }}
                  id="location"
                  className=" bg-appBg"
                />
              </div>

              <div>
              <Label htmlFor="auction_amount" className='text-white'>Auction Amount</Label>
              <Input
                  value={auction_amount}
                  type="number"
                  placeholder="amount"
                  onChange={(e) => {
                    setAuctionAmount(e.target.value);
                  }}
                  id="auction_amount"
                  className=" bg-appBg"
                />
                </div>

                <div>
              <Label htmlFor="min_bidders" className='text-white'>Minimum Bidders</Label>
              <Input
                  value={min_bidders}
                  placeholder="Minimum bidders"
                  type="number"
                  onChange={(e) => {
                    setMinBidders(e.target.value);
                  }}
                  id="min_bidders"
                  className=" bg-appBg"
                />
              </div>

                  <div>
              <Label htmlFor="max_bids" className='text-white'>Maximum Bids</Label>
              <Input
                  value={max_bids}
                  placeholder="Maximum bids"

                  onChange={(e) => {
                    setMaxBids(e.target.value);
                  }}
                  id="max_bids"
                  type="number"
                  className=" bg-appBg"
                />
                </div>

            </div>
            <div className="grid grid-cols-2  mt-2  gap-2 items-center justify-center">
              <div className=" mt-4 items-start h-16 flex flex-col w-1/2">
              <Label htmlFor="item_description" className='text-white '>Description</Label> <Label/>
              <textarea
                  value={item_description}
                  placeholder="Description"
                  onChange={(e) => {
                    setItemDescription(e.target.value);
                  }}
                  id="item_description"
                  className="w-[500px] px-4 bg-appBg"></textarea>
                </div>

            <div className="flex w-1/2 h-16 gap-3 items-center justify-center">
                <div className='h-full'>
              <Label htmlFor="image" className='text-white'>Upload Image</Label> <Label/>
              <Input
                  type="file"
                  multiple
                  placeholder="image"
                  onChange={addImage}
                  id="item_image"
                  className="h-12  flex p-2 bg-appBg"
                />
              </div>

            {isUploading && (
                <div className="flex h-full">
                  <Preloader />
                </div>
              )}
            {uploads.length > 0 && (
                <div className="flex border-2 items-center p-2 justify-center border-black mt-8 gap-2 ">
                  {uploads.map(upload => (
                    // eslint-disable-next-line react/jsx-key
                    <div className=" rounded-md mt-4 bg-appBg flex h-full" >
                      <Image src={upload} width='100'  height='50' alt="item image" className="object-cover p-2 overflow-hidden" />
                    </div>
                  ))}
                </div>
              )}
            </div>
            </div>
            
            <div className="inline-flex ml-68 mt-8 w-[500px] items-center justify-center">
              <Button variant='outline' className="w-full bg-teal-600 text-2xl" type="submit">
                Add Auction
              </Button>
              </div>
            </form>
            </div>
           
          </DialogContent>
      </Dialog>
    </div>
  );
}