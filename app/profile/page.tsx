'use client'
import UserProfile from "@/components/profile/userProfile";
import { profileType } from "@/types/collections";
import { useCallback, useEffect, useState } from "react";



const Profile = () => {
    const [profile,setProfile]=useState<profileType|null>(null);
    const fetchProfile=useCallback(async()=>{
        try{
            const response = await fetch('/api/profile')
            const data = await response.json();
            setProfile(data);
            console.log('profile',data)
        }catch(error){
            console.log('fetch error',error)
        }
    },[]);

    useEffect(()=>{
        fetchProfile()
    },[fetchProfile])

    return ( 
        <div className=' w-full min-h-screen'>
           {profile?(
            <div key={profile.id} className='w-full h-full'>
            <UserProfile profile={profile} onUpdate={fetchProfile} />
            </div>
           ):(
            <div className=" text-center text-2xl min-h-screen text-slate-500 font-titleFont font-bold ">Sorry,no profile retrieved please try later!</div>
           )
            }
        </div>

     );
}
 
export default Profile;