import { Database } from "./supabase";
export type auctionType = Database["public"]["Tables"]["Auction"]["Row"];
export type profileType = Database["public"]["Tables"]["user_profile"]["Row"];
export type walletType = Database["public"]["Tables"]["wallet"]["Row"];
export type bidType = Database["public"]["Tables"]["bid_management"]["Row"];