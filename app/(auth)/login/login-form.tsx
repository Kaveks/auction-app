"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle} from "@fortawesome/free-brands-svg-icons";
import { useAuth } from "@/components/providers/supabase-auth-provider";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const LoginForm = () => {
  const {  signInWithGoogle,user } = useAuth();
  const router =useRouter()
  // Check if there is a user
  useEffect(() => {
    if (user) {
      router.push("/");
      router.refresh()
    }
  }, [user,router]);
  return (
    <div className="flex items-center justify-center w-full h-full px-8">
      {/* Main Container */}
      <div className="w-full my-5 max-w-lg">
        {/* Text */}
        <div className="flex flex-col  gap-2">
          <h1 className="text-4xl text-black font-bold font-titleFont">Login</h1>
          <div className='items-center justify-center flex flex-col gap-2'>
          <h3 className="mdl:mt-5 text-2xl mt-5 font-titleFont font-bold text-neutral-600">
            Welcome to {" "}
            <span className="font-bold text-neutral-800">
              Grid Auction
            </span>{" "}
            
          </h3>
          <p className="mt-2 text-lg font-bodyFont text-neutral-600">Please login  with your Google account.</p>
          </div>
        </div>
      
       <div className="w-full flex-col mt-4 mdl:mt-20 items-center justify center"></div>
        {/* google Button */}
      
        <Button
        className="items center w-full inline-flex h-9 text-2xl border-2 border-yellow-500 justify-center shadow-sm shadow-current bg-green-500"
          onClick={signInWithGoogle}
        >
          Login with Google <span className='items-center  text-lg justify-center ml-2'><FontAwesomeIcon icon={faGoogle} style={{height:'16px',color:'red'}}/></span>
        </Button>
         
      </div>
    </div>
  );
};

export default LoginForm;
