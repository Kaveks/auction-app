import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { Database } from './types/supabase' 

const allowedOrigins =
  process.env.VERCEL_ENV === "production"
    ? ["https://yoururl.com"]
    : process.env.VERCEL_ENV === "preview"
    ? ["htpps://preview.yoururl.com"]
    : ["http://localhost:3000"];

const isAllowed = (origin: string) => allowedOrigins.includes(origin);
 
export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  //define origin
  const origin = req.headers.get("origin");
  //get pathname
  const pathname = req.nextUrl.pathname;
  console.log('Middleware results: current path user is at', pathname)
  const supabase = createMiddlewareClient<Database>({ req, res })
  // Check User is logged in
  const {
    data: { session },
  } = await supabase.auth.getSession();
  //protect routes

  //If it's an API Route and User is not logged in, return 401

     if (pathname.startsWith("/api") && !session) {
     return NextResponse.json(
       { message: "You are not authorized to make this request ,please login!" },
      { status: 401 }
    );
   } 


// if user is not logged in and want to access home page, send back to login
   if (!session && pathname ==="/") {
    const url = new URL(req.url);
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // If it's an API Route, check the CORS origin
  if (origin && pathname.startsWith("/api") && !isAllowed(origin)) {
    return new NextResponse(null, { status: 401, statusText: "Unauthorized" });
  }


  return res
}

//middleware matcher

export const config = {
    matcher: [
      /*
       * Match all request paths except for the ones starting with:
       * - _next/static (static files)
       * - _next/image (image optimization files)
       * - favicon.ico (favicon file)
       */
      "/((?!_next/static|_next/image|favicon.ico).*)",
    ],
  };