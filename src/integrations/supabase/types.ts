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
      blocks: {
        Row: {
          acres: number | null
          created_at: string
          id: string
          name: string
          rows: number | null
          site_id: string
          vines: number | null
        }
        Insert: {
          acres?: number | null
          created_at?: string
          id?: string
          name: string
          rows?: number | null
          site_id: string
          vines?: number | null
        }
        Update: {
          acres?: number | null
          created_at?: string
          id?: string
          name?: string
          rows?: number | null
          site_id?: string
          vines?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "blocks_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_settings: {
        Row: {
          application_status_notif: boolean | null
          general_notif: boolean | null
          new_job_notif: boolean | null
          payment_notif: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          application_status_notif?: boolean | null
          general_notif?: boolean | null
          new_job_notif?: boolean | null
          payment_notif?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          application_status_notif?: boolean | null
          general_notif?: boolean | null
          new_job_notif?: boolean | null
          payment_notif?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          company_name: string | null
          created_at: string
          email: string
          id: string
          logo: string | null
          name: string
          phone: string | null
          profile_image: string | null
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          address?: string | null
          company_name?: string | null
          created_at?: string
          email: string
          id: string
          logo?: string | null
          name: string
          phone?: string | null
          profile_image?: string | null
          role: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          address?: string | null
          company_name?: string | null
          created_at?: string
          email?: string
          id?: string
          logo?: string | null
          name?: string
          phone?: string | null
          profile_image?: string | null
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: []
      }
      sites: {
        Row: {
          address: string
          created_at: string
          customer_id: string
          id: string
          manager_id: string | null
          name: string
        }
        Insert: {
          address: string
          created_at?: string
          customer_id: string
          id?: string
          manager_id?: string | null
          name: string
        }
        Update: {
          address?: string
          created_at?: string
          customer_id?: string
          id?: string
          manager_id?: string | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "sites_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sites_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      task_photos: {
        Row: {
          created_at: string
          id: string
          photo_url: string
          task_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          photo_url: string
          task_id: string
        }
        Update: {
          created_at?: string
          id?: string
          photo_url?: string
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_photos_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "worker_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      work_orders: {
        Row: {
          acres: number | null
          address: string
          block_id: string
          created_at: string
          created_by: string
          end_date: string
          expected_hours: number
          id: string
          needed_workers: number
          notes: string | null
          pay_rate: number
          rows: number | null
          site_id: string
          start_date: string
          status: Database["public"]["Enums"]["work_order_status"]
          vines: number | null
          vines_per_row: number | null
          work_type: Database["public"]["Enums"]["work_type"]
        }
        Insert: {
          acres?: number | null
          address: string
          block_id: string
          created_at?: string
          created_by: string
          end_date: string
          expected_hours: number
          id?: string
          needed_workers: number
          notes?: string | null
          pay_rate: number
          rows?: number | null
          site_id: string
          start_date: string
          status?: Database["public"]["Enums"]["work_order_status"]
          vines?: number | null
          vines_per_row?: number | null
          work_type: Database["public"]["Enums"]["work_type"]
        }
        Update: {
          acres?: number | null
          address?: string
          block_id?: string
          created_at?: string
          created_by?: string
          end_date?: string
          expected_hours?: number
          id?: string
          needed_workers?: number
          notes?: string | null
          pay_rate?: number
          rows?: number | null
          site_id?: string
          start_date?: string
          status?: Database["public"]["Enums"]["work_order_status"]
          vines?: number | null
          vines_per_row?: number | null
          work_type?: Database["public"]["Enums"]["work_type"]
        }
        Relationships: [
          {
            foreignKeyName: "work_orders_block_id_fkey"
            columns: ["block_id"]
            isOneToOne: false
            referencedRelation: "blocks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_orders_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_orders_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      worker_applications: {
        Row: {
          created_at: string
          id: string
          order_id: string
          status: Database["public"]["Enums"]["application_status"]
          worker_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          status?: Database["public"]["Enums"]["application_status"]
          worker_id: string
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          status?: Database["public"]["Enums"]["application_status"]
          worker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "worker_applications_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "work_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "worker_applications_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      worker_tasks: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          order_id: string
          status: Database["public"]["Enums"]["task_status"]
          worker_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          order_id: string
          status?: Database["public"]["Enums"]["task_status"]
          worker_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          order_id?: string
          status?: Database["public"]["Enums"]["task_status"]
          worker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "worker_tasks_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "work_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "worker_tasks_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
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
      application_status: "pending" | "approved" | "rejected"
      task_status: "registered" | "approved" | "working" | "worked"
      user_role: "admin" | "customer" | "siteManager" | "worker"
      work_order_status:
        | "draft"
        | "published"
        | "inProgress"
        | "completed"
        | "cancelled"
      work_type: "pruning" | "shootThinning" | "other"
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
