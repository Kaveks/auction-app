import { createClientR } from "@/utils/supabase-server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest,{params}:{params:{id:string}}) {
  
    //Create Supabase Client
    const supabase = createClientR();
    //Check User is logged in
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const auction_id =params.id
    //Get auctionItem
    const { data: itemBids, error }
     = await supabase
     .from("bid_management")
     .select("*")
     .eq('auction_id',auction_id)
     
    if (error) {
      return NextResponse.json(error, { status: 500 });
    }
  //set cores origin
    const origin = request.headers.get("origin");
  
    return new NextResponse(JSON.stringify(itemBids), {
      status: 200,
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Origin": origin || "*",
      },
    });
    
  }