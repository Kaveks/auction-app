'use client'
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Layout from "../display/layout";
import Link from "next/link";
import { useState } from "react";
import Preloader from "../auctions/preloader";
import { usePathname } from "next/navigation";
import { updateProfileField } from "./utils/profileUtils";
import Card from "../display/card";
import WalletPage from "@/app/wallet/page";
import { profileType } from "@/types/collections";
import { createClientB } from "@/utils/supabase-browser";
import { userProfile } from "@/public/assets/page";



interface ProfileProps{
  profile:profileType|any;
  onUpdate:()=>void;
}
const UserProfile = ({profile,onUpdate}:ProfileProps) => {
    const pathname=usePathname()
    const supabase=createClientB()
    const [uploads,setUploads] = useState<string[]>([]);
    const [isUploading,setIsUploading] = useState(false);
    const [city,setCity]=useState('');
    const [country,setCountry]=useState('');
    const [isEditing, setIsEditing] = useState(false);
    const isWallet=pathname.includes('wallet');
    const [isChangeCover, setIsChangeCover]=useState(false)
    const selectedTab="flex gap-1 border-lime-600 border-b-8 px-4 py-1 text-textGreen h-full  shadow-md  items-center justify-center shadow-gray-300 p-2 mt-1";
    const unSelectedTab="flex gap-1 px-4 py-1 h-full text-blue-700 shadow-md shadow-gray-300 p-2 mt-1 hover:bg-green-300 hover:text-white hover:font-bold items-center";
    const updateResidence = async (ev: React.FormEvent<HTMLFormElement>) => {
      ev.preventDefault();
      await updateProfileField(profile, "city", city);
      await updateProfileField(profile, "country", country);
      if(typeof onUpdate==='function'){
        onUpdate(); 
      }
      clearInputField()
    };
    
      
    const addAvatar =async()=>{
    };
    const changeCover=async (event: { target: { files: any; }; })=>{
      const files=event.target.files
        for (const file of files){
          const coverName =Date.now()+file.name;
          try{
              const response = await supabase.storage.from('cover').upload(coverName,file)
              if(response.data){
                const url=process.env.NEXT_PUBLIC_SUPABASE_URL+'/storage/v1/object/public/cover/'+response.data.path;
                setUploads(prevUploads=>[...prevUploads,url])
  
              }else{
                console.log(response)
                setIsUploading(false);
              }
          }catch(error:any){
            setUploads([])
            setIsUploading(false)
            return error.message
          }}
                 
      };

    const clearInputField=() =>{
      setUploads([]);
      setCity('');
      setIsEditing(false)
      setIsChangeCover(false)
    };
    const updateCover =async(e: React.FormEvent<HTMLFormElement>)=>{
      e.preventDefault()
      await updateProfileField(profile,'cover',uploads[uploads.length - 1])
          if (typeof onUpdate === 'function') {
            onUpdate();
          }
      clearInputField()
    }

    
    return ( 
      <Layout hideSideNav={false}>
      <div className="flex flex-col">
      <div className="flex">
      <div className="flex w-3/4 ml-20 items-center justify-between">
        <div className="flex flex-col w-full" > 
        <div className="w-full h-[200px]">
        {uploads.length >0 ?(
          <div>
          {uploads.map((upload)=>(
            <div key={upload} className="relative  w-full rounded-xl p-1 shadow-md shadow-gray-300 border h-[200px]">
              <Image  src={upload} width='900' height='200' className=" w-full h-[200px] object-cover rounded-lg overflow-hidden " alt="cover image" />
              </div> 
          ))}
          </div>

        ):( <div>
            {profile.cover?.length > 0 && (
              <div  className="relative  w-full rounded-xl p-1 shadow-md shadow-gray-300 border h-[200px]">
                { profile.cover.map((url:string)=>(
                    <Image key={url} 
                    src={url} 
                    width='900'
                    height='200'
                    className=" w-full h-[200px] object-cover rounded-lg overflow-hidden " 
                  alt="cover image" />
      
                ))}
              </div>
              )}
          </div>
          )}
          </div>

          <div className="absolute top-28 ml-5 z-10 flex gap-2 items-start">
            <div className="items-center">
              <Avatar className="w-20 h-20">
              <AvatarImage src={profile?.avatar_url ?? ""} className='object-cover' alt="@shadcn" />
                  <AvatarFallback>
                    <Image 
                    className= "object-cover w-10 h-10" 
                    src={userProfile} 
                    alt="user profile icon" 
                    /> 
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex overflow-hidden gap-2 flex-col">
                <div className="items-center h-[30px] rounded-full bg-appBg p-1 justify-center">
                    <p className="text-md text-center font-bold font-titleFont">{ profile.full_name}</p>
                </div>
                <div className="flex items-center p-2 h-[30px] bg-appBg justify-center rounded-lg gap-2">
                      <p className="text-base font-bold">{profile.city}</p>
                      <span className="font-bold text-base">{profile.country}</span>
                </div>
            </div>
          </div>
          {isEditing && (
            <div className="absolute flex flex-col gap-2  z-10 top-28 ml-60 ">
              <form onSubmit={updateResidence}>
                <div className="items-center justify-center gap-1 flex flex-col">
                <input 
                value={city}
                type='text'
                placeholder="city"
                onChange={(e) => {setCity(e.target.value);}}
                id="city"
                className="border p-2 rounded-md border-red-400 h-[34px] bg-appBg"
                />
                <input
                value={country}
                placeholder="country"
                onChange={(e) => {setCountry(e.target.value);}}
                id="country"
                className="border rounded-md p-2 border-red-400 h-[34px] bg-appBg"
                 />
                 <button type='submit' className="inline-flex bg-appBg border rounded-md px-4 border-red-400 shadow-md shadow-red-300">save</button>
                 </div>
              </form>
              </div>)}
              {!isEditing && (
              <div className="absolute z-10 top-48 ml-56 hover:cursor-pointer inline-flex items-center rounded-full bg-appBg gap-1 shadow-md shadow-red-400 p-2 border border-red-400 h-[24px]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 text-red-500 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
              </svg>
              <span onClick={() => setIsEditing(true)}>edit</span>
              </div>
              )}
            
          

          <div className="absolute flex  top-48  ml-3 h-[24px] z-10 ">
            <button className="h-full p-2 gap-1 inline-flex rounded-lg border items-center justify-center  border-blue-400 shadow-md shadow-blue-300 bg-appBg">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              <span>photo</span>
            </button>
          </div>
            <div className="absolute z-20 top-12  end-72  items-end">
              { isUploading &&(
                <div className="inline-flex h-[24px]"> <Preloader /> </div>
              )}
            </div>

              {isChangeCover &&(
                 <div className=" absolute z-20 top-8  end-72  items-end flex ">
                  <form onSubmit={updateCover} className="">
                    <div className="gap-2 items-center justify-center flex flex-col">
                    <input 
                      type="file"
                      multiple
                      onChange={changeCover}
                      id='cover_image'
                      className="h-[40px] w-[210px] p-1 border border-blue-400 shadow-md  rounded-xl  bg-appBg shadow-blue-300 "
                      />
                      <button type='submit' className="inline-flex w-16 bg-appBg border rounded-md px-4 border-blue-400 shadow-md shadow-blue-300">save</button>
                      </div>
                      </form>
                      </div>
               
              )}
              
              {!isChangeCover &&(
                
                    <div className=" absolute z-20 top-8  end-72  items-end flex shadow-md gap-1 p-2 hover:cursor-pointer rounded-lg bg-appBg shadow-gray-300 border border-blue-400 h-[34px]">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className=" text-blue-400 w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                    <span onClick={()=>{setIsChangeCover(true)}}>change cover</span>
                  </div>
             
                  )}
           
        </div>
        </div>
        <div className="w-1/4 items-center"></div>
        </div>
          <div className="flex w-3/4 h-[28px] ml-16 mt-4 border-t border-t-gray-300">
    
              <Link href='/profile/wallet' className={isWallet? selectedTab : unSelectedTab}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 text-yellow-700 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
              </svg>
                <span className=''>wallet</span>
            </Link>
            </div>
            <div className='max-w-1/2 flex flex-col -mt-4 ml-44'>
              {
                isWallet &&(
                  <div className="max-w-1/2  flex min-h-[380px]">
                    <WalletPage />
                  </div>
                )
              }
            </div>
          </div>
      </Layout>

     );
}
 
export default UserProfile;