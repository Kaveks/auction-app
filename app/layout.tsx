import "server-only";
import './globals.css'
import SupabaseProvider from "@/components/providers/supabase-provider"; 
import SupabaseAuthProvider from "@/components/providers/supabase-auth-provider";
import { createClientS } from "@/utils/supabase-server";

export const metadata = {
  title: 'Auction App',
  description: 'Auction',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClientS();

  const {data: { session },} = await supabase.auth.getSession();
  return (
    <html lang="en">
      <body className="font-bodyFont bg-appBg">
        <SupabaseProvider>
        <SupabaseAuthProvider serverSession={session}>
        {children}
        </SupabaseAuthProvider>
        </SupabaseProvider>
        </body>
    </html>
  )
}