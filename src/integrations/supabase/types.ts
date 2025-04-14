export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      pages: {
        Row: {
          content: Json
          created_at: string
          id: string
          meta_description: string | null
          path: string
          published: boolean
          title: string
          updated_at: string
        }
        Insert: {
          content?: Json
          created_at?: string
          id?: string
          meta_description?: string | null
          path: string
          published?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          meta_description?: string | null
          path?: string
          published?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      payment_logs: {
        Row: {
          action: string
          amount: number | null
          created_at: string
          error_message: string | null
          id: string
          ip_address: string | null
          payment_id: string | null
          response_data: Json | null
          status: string
          user_id: string | null
          workshop_id: string | null
        }
        Insert: {
          action: string
          amount?: number | null
          created_at?: string
          error_message?: string | null
          id?: string
          ip_address?: string | null
          payment_id?: string | null
          response_data?: Json | null
          status: string
          user_id?: string | null
          workshop_id?: string | null
        }
        Update: {
          action?: string
          amount?: number | null
          created_at?: string
          error_message?: string | null
          id?: string
          ip_address?: string | null
          payment_id?: string | null
          response_data?: Json | null
          status?: string
          user_id?: string | null
          workshop_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_payment_logs_workshop"
            columns: ["workshop_id"]
            isOneToOne: false
            referencedRelation: "workshops"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          contact_email: string
          enable_registrations: boolean
          footer_text: string | null
          id: string
          logo_url: string | null
          primary_color: string | null
          site_description: string
          site_name: string
          social_links: Json | null
        }
        Insert: {
          contact_email: string
          enable_registrations?: boolean
          footer_text?: string | null
          id?: string
          logo_url?: string | null
          primary_color?: string | null
          site_description: string
          site_name: string
          social_links?: Json | null
        }
        Update: {
          contact_email?: string
          enable_registrations?: boolean
          footer_text?: string | null
          id?: string
          logo_url?: string | null
          primary_color?: string | null
          site_description?: string
          site_name?: string
          social_links?: Json | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          created_at: string | null
          full_name: string | null
          id: string
          is_admin: boolean | null
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          created_at?: string | null
          full_name?: string | null
          id: string
          is_admin?: boolean | null
          role?: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          is_admin?: boolean | null
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: []
      }
      workshop_certificates: {
        Row: {
          certificate_url: string | null
          created_at: string | null
          id: string
          user_id: string
          workshop_id: string
        }
        Insert: {
          certificate_url?: string | null
          created_at?: string | null
          id?: string
          user_id: string
          workshop_id: string
        }
        Update: {
          certificate_url?: string | null
          created_at?: string | null
          id?: string
          user_id?: string
          workshop_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workshop_certificates_workshop_id_fkey"
            columns: ["workshop_id"]
            isOneToOne: false
            referencedRelation: "workshops"
            referencedColumns: ["id"]
          },
        ]
      }
      workshop_materials: {
        Row: {
          created_at: string | null
          description: string | null
          file_url: string
          id: string
          title: string
          workshop_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          file_url: string
          id?: string
          title: string
          workshop_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          file_url?: string
          id?: string
          title?: string
          workshop_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workshop_materials_workshop_id_fkey"
            columns: ["workshop_id"]
            isOneToOne: false
            referencedRelation: "workshops"
            referencedColumns: ["id"]
          },
        ]
      }
      workshop_registrations: {
        Row: {
          admin_notes: string | null
          created_at: string | null
          email: string
          full_name: string
          id: string
          notes: string | null
          payment_id: string | null
          payment_status: string
          phone: string | null
          status: string
          updated_at: string | null
          user_id: string
          workshop_id: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          notes?: string | null
          payment_id?: string | null
          payment_status?: string
          phone?: string | null
          status?: string
          updated_at?: string | null
          user_id: string
          workshop_id: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          notes?: string | null
          payment_id?: string | null
          payment_status?: string
          phone?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string
          workshop_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workshop_registrations_workshop_id_fkey"
            columns: ["workshop_id"]
            isOneToOne: false
            referencedRelation: "workshops"
            referencedColumns: ["id"]
          },
        ]
      }
      workshops: {
        Row: {
          available_seats: number
          benefits: string[] | null
          cover_image: string | null
          created_at: string | null
          date: string
          gallery: string[] | null
          id: string
          instructor: string
          instructor_bio: string | null
          instructor_image: string | null
          location: string
          long_description: string | null
          objectives: string[] | null
          price: number
          requirements: string[] | null
          short_description: string
          target_audience: string[] | null
          time: string
          title: string
          total_seats: number
          updated_at: string | null
          venue: string
        }
        Insert: {
          available_seats: number
          benefits?: string[] | null
          cover_image?: string | null
          created_at?: string | null
          date: string
          gallery?: string[] | null
          id?: string
          instructor: string
          instructor_bio?: string | null
          instructor_image?: string | null
          location: string
          long_description?: string | null
          objectives?: string[] | null
          price: number
          requirements?: string[] | null
          short_description: string
          target_audience?: string[] | null
          time: string
          title: string
          total_seats: number
          updated_at?: string | null
          venue: string
        }
        Update: {
          available_seats?: number
          benefits?: string[] | null
          cover_image?: string | null
          created_at?: string | null
          date?: string
          gallery?: string[] | null
          id?: string
          instructor?: string
          instructor_bio?: string | null
          instructor_image?: string | null
          location?: string
          long_description?: string | null
          objectives?: string[] | null
          price?: number
          requirements?: string[] | null
          short_description?: string
          target_audience?: string[] | null
          time?: string
          title?: string
          total_seats?: number
          updated_at?: string | null
          venue?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      user_role: "admin" | "supervisor" | "subscriber"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["admin", "supervisor", "subscriber"],
    },
  },
} as const
