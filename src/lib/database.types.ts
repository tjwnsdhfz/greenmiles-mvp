export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      trips: {
        Row: {
          id: string;
          user_id: string;
          origin: string;
          destination: string;
          distance_km: number;
          travel_mode: "walk" | "bike" | "transit" | "carpool" | "ev" | "car";
          estimated_co2e_kg: number | null;
          avoided_co2e_kg: number | null;
          occurred_on: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          origin: string;
          destination: string;
          distance_km: number;
          travel_mode: "walk" | "bike" | "transit" | "carpool" | "ev" | "car";
          estimated_co2e_kg?: number | null;
          avoided_co2e_kg?: number | null;
          occurred_on?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          origin?: string;
          destination?: string;
          distance_km?: number;
          travel_mode?: "walk" | "bike" | "transit" | "carpool" | "ev" | "car";
          estimated_co2e_kg?: number | null;
          avoided_co2e_kg?: number | null;
          occurred_on?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      trip_dashboard_summary: {
        Row: {
          user_id: string;
          trip_count: number;
          total_distance_km: number;
          estimated_co2e_kg: number;
          avoided_co2e_kg: number;
          last_trip_on: string | null;
        };
      };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
