export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "consumer" | "farmer" | "retailer" | "admin" | "mrv_partner";
export type ReviewStatus = "pending" | "approved" | "rejected";
export type MrvStatus =
  | "not_submitted"
  | "submitted"
  | "verified"
  | "anchored"
  | "rejected";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: UserRole;
          display_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role?: UserRole;
          display_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          role?: UserRole;
          display_name?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      product_skus: {
        Row: {
          id: string;
          farm_id: string | null;
          store_id: string | null;
          name: string;
          category: string;
          weight_grams: number | null;
          low_carbon_certified: boolean;
          packaging_info: string | null;
          distance_km: number;
          production_method: string | null;
          status: ReviewStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          farm_id?: string | null;
          store_id?: string | null;
          name: string;
          category: string;
          weight_grams?: number | null;
          low_carbon_certified?: boolean;
          packaging_info?: string | null;
          distance_km?: number;
          production_method?: string | null;
          status?: ReviewStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["product_skus"]["Insert"]>;
        Relationships: [];
      };
      reward_events: {
        Row: {
          id: string;
          consumer_id: string;
          purchase_item_id: string | null;
          reward_points: number;
          estimated_carbon_contribution: number;
          mrv_status: MrvStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          consumer_id: string;
          purchase_item_id?: string | null;
          reward_points?: number;
          estimated_carbon_contribution?: number;
          mrv_status?: MrvStatus;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["reward_events"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: {
      retailer_dashboard_summary: {
        Row: {
          organization_id: string;
          store_count: number;
          approved_sku_count: number;
          purchase_count: number;
          reward_points_issued: number;
          estimated_carbon_contribution: number;
          unique_consumers: number;
        };
        Relationships: [];
      };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
