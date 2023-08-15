
import { createClientR } from "@/utils/supabase-server";
import { NextResponse ,NextRequest} from "next/server";


export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }) {
  const id = params.id;

  // Get Supabase Client
  const supabase = createClientR();


  // Delete an Auction
  const { error } = await supabase.from("Auction").delete().match({ id });

  if (error) {
    return NextResponse.json(error, { status: 500 });
  }

  return NextResponse.json({ message: "Auction deleted." }, { status: 200 });
}

// PATCH for update 
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const { auction_type,auction_status } = await req.json();
  
  // if (!auction_status || typeof auction_status !== "string") {
  //   return NextResponse.json({ message: "Wrong payload." }, { status: 400 });
  // }
  
// Create Supabase Client
  const supabase = createClientR();
  // Update  Auction
  const { data, error } = await supabase
    .from("Auction")
    .update({ auction_status,auction_type})
    .match({ id })
    .select("*");

  if (error) {
    return NextResponse.json(error, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}



export async function GET(request: NextRequest,{params}:{params:{id:string}}) {
  const id =params.id
  // Create Supabase Client
  const supabase = createClientR();
  

  // Get auctionItem
  const { data: auctionItem, error }
   = await supabase
   .from("Auction")
   .select("*")
   .eq('id',id)
   .single()
   
  if (error) {
    return NextResponse.json(error, { status: 500 });
  }
//set cores origin
  const origin = request.headers.get("origin");

  return new NextResponse(JSON.stringify(auctionItem), {
    status: 200,
    headers: {
      "content-type": "application/json",
      "Access-Control-Allow-Origin": origin || "*",
    },
  });
  
}