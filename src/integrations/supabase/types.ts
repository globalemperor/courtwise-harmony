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
      case_lawyers: {
        Row: {
          case_id: string
          created_at: string
          lawyer_id: string
          role: string | null
          updated_at: string
        }
        Insert: {
          case_id: string
          created_at?: string
          lawyer_id: string
          role?: string | null
          updated_at?: string
        }
        Update: {
          case_id?: string
          created_at?: string
          lawyer_id?: string
          role?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "case_lawyers_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "case_lawyers_lawyer_id_fkey"
            columns: ["lawyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      case_requests: {
        Row: {
          case_title: string
          client_id: string
          created_at: string
          description: string
          id: string
          lawyer_id: string
          status: string
          updated_at: string
        }
        Insert: {
          case_title: string
          client_id: string
          created_at?: string
          description: string
          id?: string
          lawyer_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          case_title?: string
          client_id?: string
          created_at?: string
          description?: string
          id?: string
          lawyer_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "case_requests_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "case_requests_lawyer_id_fkey"
            columns: ["lawyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cases: {
        Row: {
          case_number: string
          client_id: string
          court_id: string | null
          court_room: string | null
          created_at: string
          defendant_id: string | null
          description: string
          filed_date: string | null
          id: string
          judge_id: string | null
          next_hearing_date: string | null
          primary_lawyer_id: string | null
          secondary_lawyer_id: string | null
          status: string
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          case_number: string
          client_id: string
          court_id?: string | null
          court_room?: string | null
          created_at?: string
          defendant_id?: string | null
          description: string
          filed_date?: string | null
          id?: string
          judge_id?: string | null
          next_hearing_date?: string | null
          primary_lawyer_id?: string | null
          secondary_lawyer_id?: string | null
          status: string
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          case_number?: string
          client_id?: string
          court_id?: string | null
          court_room?: string | null
          created_at?: string
          defendant_id?: string | null
          description?: string
          filed_date?: string | null
          id?: string
          judge_id?: string | null
          next_hearing_date?: string | null
          primary_lawyer_id?: string | null
          secondary_lawyer_id?: string | null
          status?: string
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cases_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cases_court_id_fkey"
            columns: ["court_id"]
            isOneToOne: false
            referencedRelation: "courts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cases_defendant_id_fkey"
            columns: ["defendant_id"]
            isOneToOne: false
            referencedRelation: "defendants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cases_judge_id_fkey"
            columns: ["judge_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cases_primary_lawyer_id_fkey"
            columns: ["primary_lawyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cases_secondary_lawyer_id_fkey"
            columns: ["secondary_lawyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      courts: {
        Row: {
          created_at: string
          id: string
          location: string | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          location?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          location?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      defendants: {
        Row: {
          contact_info: Json | null
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          contact_info?: Json | null
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          contact_info?: Json | null
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      evidence: {
        Row: {
          case_id: string
          created_at: string
          description: string
          file_url: string | null
          id: string
          title: string
          type: string | null
          updated_at: string
          uploaded_at: string
          uploaded_by: string
        }
        Insert: {
          case_id: string
          created_at?: string
          description: string
          file_url?: string | null
          id?: string
          title: string
          type?: string | null
          updated_at?: string
          uploaded_at?: string
          uploaded_by: string
        }
        Update: {
          case_id?: string
          created_at?: string
          description?: string
          file_url?: string | null
          id?: string
          title?: string
          type?: string | null
          updated_at?: string
          uploaded_at?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "evidence_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evidence_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      hearings: {
        Row: {
          abstract: string
          case_id: string
          court_id: string
          created_at: string
          date: string
          details: string | null
          id: string
          judge_id: string
          location: string
          status: string
          summary: string | null
          time: string
          updated_at: string
        }
        Insert: {
          abstract: string
          case_id: string
          court_id: string
          created_at?: string
          date: string
          details?: string | null
          id?: string
          judge_id: string
          location: string
          status: string
          summary?: string | null
          time: string
          updated_at?: string
        }
        Update: {
          abstract?: string
          case_id?: string
          court_id?: string
          created_at?: string
          date?: string
          details?: string | null
          id?: string
          judge_id?: string
          location?: string
          status?: string
          summary?: string | null
          time?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hearings_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hearings_court_id_fkey"
            columns: ["court_id"]
            isOneToOne: false
            referencedRelation: "courts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hearings_judge_id_fkey"
            columns: ["judge_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          case_id: string | null
          content: string
          created_at: string
          id: string
          read: boolean
          recipient_id: string
          recipient_role: string
          sender_id: string
          sender_role: string
        }
        Insert: {
          case_id?: string | null
          content: string
          created_at?: string
          id?: string
          read?: boolean
          recipient_id: string
          recipient_role: string
          sender_id: string
          sender_role: string
        }
        Update: {
          case_id?: string | null
          content?: string
          created_at?: string
          id?: string
          read?: boolean
          recipient_id?: string
          recipient_role?: string
          sender_id?: string
          sender_role?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          id: string
          name: string
          role: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          id: string
          name: string
          role: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
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
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
