export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      Auction: {
        Row: {
          auction_amount: number
          auction_creator: string
          auction_status: string
          auction_type: string
          bid_count: number
          created_at: string
          end_time: string | null
          id: string
          item_color: string | null
          item_description: string
          item_id: string
          item_image: Json
          item_name: string
          item_type: string | null
          location: string | null
          max_bids: number
          min_bidders: number
          seller: string
          start_time: string | null
          year_purchased: string
        }
        Insert: {
          auction_amount: number
          auction_creator: string
          auction_status?: string
          auction_type?: string
          bid_count?: number
          created_at?: string
          end_time?: string | null
          id?: string
          item_color?: string | null
          item_description: string
          item_id?: string
          item_image?: Json
          item_name: string
          item_type?: string | null
          location?: string | null
          max_bids: number
          min_bidders: number
          seller?: string
          start_time?: string | null
          year_purchased?: string
        }
        Update: {
          auction_amount?: number
          auction_creator?: string
          auction_status?: string
          auction_type?: string
          bid_count?: number
          created_at?: string
          end_time?: string | null
          id?: string
          item_color?: string | null
          item_description?: string
          item_id?: string
          item_image?: Json
          item_name?: string
          item_type?: string | null
          location?: string | null
          max_bids?: number
          min_bidders?: number
          seller?: string
          start_time?: string | null
          year_purchased?: string
        }
        Relationships: [
          {
            foreignKeyName: "Auction_auction_creator_fkey"
            columns: ["auction_creator"]
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          }
        ]
      }
      bid_management: {
        Row: {
          amount: number
          auction_id: string
          auction_item: string
          auction_type: string
          bider: string
          created_at: string
          id: number
          seller: string
          user_id: string
        }
        Insert: {
          amount: number
          auction_id: string
          auction_item: string
          auction_type: string
          bider: string
          created_at?: string
          id?: number
          seller: string
          user_id: string
        }
        Update: {
          amount?: number
          auction_id?: string
          auction_item?: string
          auction_type?: string
          bider?: string
          created_at?: string
          id?: number
          seller?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bid_management_auction_id_fkey"
            columns: ["auction_id"]
            referencedRelation: "Auction"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bid_management_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          }
        ]
      }
      user_profile: {
        Row: {
          avatar_url: string | null
          city: string
          country: string
          cover: Json | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string | null
          updated_by: string | null
          user_role: string | null
          username: string | null
          wallet_id: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          city?: string
          country?: string
          cover?: Json | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string | null
          updated_by?: string | null
          user_role?: string | null
          username?: string | null
          wallet_id?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          city?: string
          country?: string
          cover?: Json | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
          updated_by?: string | null
          user_role?: string | null
          username?: string | null
          wallet_id?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profile_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_profile_wallet_id_fkey"
            columns: ["wallet_id"]
            referencedRelation: "wallet"
            referencedColumns: ["id"]
          }
        ]
      }
      wallet: {
        Row: {
          balance: number
          created_at: string
          discount: number
          id: string
          top_up: number
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string
          discount?: number
          id?: string
          top_up?: number
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string
          discount?: number
          id?: string
          top_up?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallet_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "buckets_owner_fkey"
            columns: ["owner"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "objects_owner_fkey"
            columns: ["owner"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: unknown
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
