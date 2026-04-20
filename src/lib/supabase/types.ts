// SpajaUltraOmegaCore -∞Ω+∞ — Supabase Database Types
// Kompanija SPAJA — Digitalna Industrija
// Tipovi za bazu podataka

export type PlanTip = 'starter' | 'basic' | 'pro' | 'enterprise' | 'unlimited';

export type ModelId = 'gpt-4o-mini' | 'gpt-4o' | 'gpt-4-turbo' | 'o1-mini' | 'o3-mini';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          plan: PlanTip;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          subscription_status: string | null;
          chat_messages_used: number;
          chat_messages_limit: number;
          custom_instructions: string | null;
          preferred_model: ModelId | null;
          preferred_language: string | null;
          memory: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          plan?: PlanTip;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          subscription_status?: string | null;
          chat_messages_used?: number;
          chat_messages_limit?: number;
          custom_instructions?: string | null;
          preferred_model?: ModelId | null;
          preferred_language?: string | null;
          memory?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          plan?: PlanTip;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          subscription_status?: string | null;
          chat_messages_used?: number;
          chat_messages_limit?: number;
          custom_instructions?: string | null;
          preferred_model?: ModelId | null;
          preferred_language?: string | null;
          memory?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      chat_threads: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          model: ModelId;
          is_shared: boolean;
          share_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title?: string;
          model?: ModelId;
          is_shared?: boolean;
          share_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          model?: ModelId;
          is_shared?: boolean;
          share_id?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'chat_threads_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      chat_history: {
        Row: {
          id: string;
          user_id: string;
          thread_id: string | null;
          role: 'user' | 'assistant' | 'system';
          content: string;
          model: ModelId | null;
          tokens_used: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          thread_id?: string | null;
          role: 'user' | 'assistant' | 'system';
          content: string;
          model?: ModelId | null;
          tokens_used?: number;
          created_at?: string;
        };
        Update: {
          role?: 'user' | 'assistant' | 'system';
          content?: string;
          model?: ModelId | null;
          tokens_used?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'chat_history_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'chat_history_thread_id_fkey';
            columns: ['thread_id'];
            referencedRelation: 'chat_threads';
            referencedColumns: ['id'];
          },
        ];
      };
      usage_logs: {
        Row: {
          id: string;
          user_id: string;
          action: string;
          endpoint: string;
          tokens_used: number;
          cost_eur: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          action: string;
          endpoint: string;
          tokens_used?: number;
          cost_eur?: number;
          created_at?: string;
        };
        Update: {
          action?: string;
          endpoint?: string;
          tokens_used?: number;
          cost_eur?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'usage_logs_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
