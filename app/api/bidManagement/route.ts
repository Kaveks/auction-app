
import { NextResponse,NextRequest } from 'next/server'
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { createClientR } from '@/utils/supabase-server';
import { bidType } from '@/types/collections';


export async function POST(request: NextRequest) {
  const { 
    bider,
    amount,
    seller,
    auction_item,
    auction_id,
    auction_type
    } = await request.json();


  // Get Supabase Client
  const supabase = createClientR();

  // Check User is logged in
  const {
    data: { session },
  } = await supabase.auth.getSession();
  
  // Rate Limitter
  const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(3, "60 s"), // 3 requests per 60 seconds
  });

  const identifier = session?.user.id;
  const { success } = await ratelimit.limit(identifier!!);

  if (!success) {
    return NextResponse.json(
      { message: "You are sending too many requests." },
      { status: 429 }
    );
  }

  // Insert new Auction
  const { data, error } = await supabase
    .from("bid_management")
    .insert<bidType|any>({amount,bider,seller,auction_id,auction_item,auction_type, user_id:session?.user?.id} )
    .select("*");

  if (error) {
    return NextResponse.json(error, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
 
}
// 

export async function GET(request: NextRequest) {
  //Create Supabase Client
  const supabase = createClientR();
  //Check User is logged in
  const {
    data: { session },
  } = await supabase.auth.getSession()

  //Get Auctions
  const { data: bidManagement, error }
   = await supabase
   .from("bid_management")
   .select("*")
   .eq('user_id',session?.user?.id)

  if (error) {
    return NextResponse.json(error, { status: 500 });
  }
//set cores origin
  const origin = request.headers.get("origin");

  return new NextResponse(JSON.stringify(bidManagement), {
    status: 200,
    headers: {
      "content-type": "application/json",
      "Access-Control-Allow-Origin": origin || "*",
    },
  });
  
}