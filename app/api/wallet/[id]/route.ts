
import { createClientR } from "@/utils/supabase-server";
import { NextResponse ,NextRequest} from "next/server";


// PATCH for update 
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const { balance,top_up} = await req.json();
  
  // if (!auction_status || typeof auction_status !== "string") {
  //   return NextResponse.json({ message: "Wrong payload." }, { status: 400 });
  // }
  
// Create Supabase Client
  const supabase = createClientR();
  const {data:{session}}=await supabase.auth.getSession()
  // Update  Auction
  const { data, error } = await supabase
    .from("wallet")
    .update({ balance,top_up,user_id:session?.user?.id})
    .match({ id })
    .select("*");

  if (error) {
    return NextResponse.json(error, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}

// 


export async function GET(request: NextRequest,{params}:{params:{id:string}}) {
  
  //Create Supabase Client
  const supabase = createClientR();
  //Check User is logged in
const {
  data: { session },
} = await supabase.auth.getSession();
const user_id =params.id
  //Get auctionItem
  const { data: user_wallet, error }
   = await supabase
   .from("wallet")
   .select("*")
   .eq('user_id',user_id)
   .single()
   
  if (error) {
    return NextResponse.json(error, { status: 500 });
  }
//set cores origin
  const origin = request.headers.get("origin");

  return new NextResponse(JSON.stringify(user_wallet), {
    status: 200,
    headers: {
      "content-type": "application/json",
      "Access-Control-Allow-Origin": origin || "*",
    },
  });
}