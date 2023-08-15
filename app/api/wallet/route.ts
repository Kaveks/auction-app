
import { createClientR } from '@/utils/supabase-server';
import { NextResponse,NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  // Create Supabase Client
  const supabase = createClientR();
  // Check User is logged in
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Get Auctions
  const { data: wallet, error }
   = await supabase
   .from("wallet")
   .select("*")
   .eq('user_id',session?.user?.id)
   .single()

  if (error) {
    return NextResponse.json(error, { status: 500 });
  }
//set cores origin
  const origin = request.headers.get("origin");

  return new NextResponse(JSON.stringify(wallet), {
    status: 200,
    headers: {
      "content-type": "application/json",
      "Access-Control-Allow-Origin": origin || "*",
    },
  });
  
}