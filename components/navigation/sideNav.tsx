'use client'
import { useAuth } from "../providers/supabase-auth-provider";
import Card from "../display/card";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "../ui/button";
const SideNav = () => {
    const{ signOut }= useAuth();
    const pathname = usePathname();
    const activePath='flex items-center border gap-2 w-full h-10 bg-activeButton  px-2 text-white shadow-gray-300 rounded-md shadow-md py-2'
    const nonActivePath='flex mx-2  border-2 gap-2 items-center shadow-md shadow-gray-400 h-10 w-full duration-300 hover:py-2 py-2  rounded-md hover:text-white  hover:shadow-md hover:shadow-gray-300 hover:bg-activeButton/40 '
    return (  
    <div className="flex flex-col w-full ">
        <Card Padding={true}>
        <div className="md:block p-2 md:p-5 gap-2 border border-gray-200 flex ">
            <div className="items-center flex justify-center mb-3 ">
                <h2 className='text-slate-600 font-titleFont mx-3 text-2xl items-center justify-center hidden md:block' >Navigation</h2>
            </div>

            <div className="items-start w-full flex gap-3 h-10 my-2 ">
                <Link href="/" className={pathname==='/' ? activePath :nonActivePath}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>

                <span className="hidden md:block">
                Home
                </span> 
                </Link>
            </div>
            <div className="items-start w-full flex gap-3 h-10 my-2 ">
            <Link href="/profile" className={pathname==='/profile' ? activePath :nonActivePath}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="text-green-400 w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
            </svg>
            <span className="hidden md:block">
                profile
            </span> 
            </Link>
            </div>

            <div className="items-start w-full flex gap-3 h-10 my-2 ">
            <Link href="/profile/wallet" className={pathname==='/profile/wallet' ? activePath :nonActivePath}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className=" text-yellow-700 w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
                </svg>
                <span className="hidden md:block">
                wallet
                </span> 
                </Link>
            </div>

            <div className="flex w-full items-center h-12 mt-6 ">
                <Button onClick={signOut} variant="outline" className="gap-2 mx-2 w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                    </svg>
                    <span className="hidden md:block">Logout</span>
                </Button>
            </div>
        </div>
        </Card>
    </div>
     );
}
 
export default SideNav;