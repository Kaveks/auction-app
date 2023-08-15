import "server-only";
import { createServerComponentClient,createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies,} from "next/headers";

import { Database } from "../types/supabase";





// creating server client
export const createClientS = () =>
    createServerComponentClient<Database>({cookies,})

//create route client
export const createClientR = () =>
    createRouteHandlerClient<Database>({cookies,})
 

 
