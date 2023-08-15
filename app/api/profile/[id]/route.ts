
import { createClientR } from "@/utils/supabase-server";
import { NextResponse ,NextRequest} from "next/server";


export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }) {
    const id = params.id;

  // Get Supabase Client
  const supabase = createClientR();


  // Delete an Auction
  const { error } = await supabase.from("user_profile").delete().match({ id });

  if (error) {
    return NextResponse.json(error, { status: 500 });
  }

  return NextResponse.json({ message: "profile deleted." }, { status: 200 });
}

// PATCH for update 
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const { avatar_url,city,country,phone,cover } = await req.json();
// Create Supabase Client
  const supabase = createClientR();
  // Update  Auction
  const { data, error } = await supabase
    .from("user_profile")
    .update({avatar_url, city, country, phone ,cover })
    .match({ id })
    .select("*");

  if (error) {
    return NextResponse.json(error, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}