"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  Cloud,
  CreditCard,
  // Github,
  LifeBuoy,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { useAuth } from "../../components/providers/supabase-auth-provider";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import Image from "next/image";
import { userProfile } from "@/public/assets/page";



const Navbar = () => {
  const { user, signOut ,signInWithGoogle} = useAuth();
  return (
    <nav className="w-full h-20  items-center ml-1 bg-slate-300 border-b border-neutral-100">
      {/* Container */}
      <div className="flex items-center justify-between py-6 mx-auto max-w-7xl">
        {/* Logo */}
        <div className="text-lg ml-2 font-bold"> LOGO</div>
        <div className="flex items-center justify-center">
          <h2 className="font-titleFont text=slate-600 text-3xl">Welcome to Grid Auction </h2>
        </div>

        {/* Avatar */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className='mr-2'>
              <AvatarImage src={user?.avatar_url ?? ""} alt="@shadcn" />
              <AvatarFallback>
                <Image 
                  className= " text-2xl font-bold"
                  src={userProfile}
                  alt="user profile icon"
                />
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <User className="w-4 h-4 mr-2" />
                <span>Profile</span>
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard className="w-4 h-4 mr-2" />
                <span>Billing</span>
                <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="w-4 h-4 mr-2" />
                <span>Settings</span>
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signInWithGoogle}>
              {/* <Github className="w-4 h-4 mr-2" /> */}
              <FontAwesomeIcon icon={faGoogle} className="w-4 h-4 mr-2"/>
              <span>Google</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LifeBuoy className="w-4 h-4 mr-2" />
              <span>Support</span>
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <Cloud className="w-4 h-4 mr-2" />
              <span>API</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut}>
              <LogOut className="w-4 h-4 mr-2" />
              <span>Log out</span>
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar;