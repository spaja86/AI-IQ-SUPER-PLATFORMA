// SpajaUltraOmegaCore -∞Ω+∞ — Supabase Database Types
// Kompanija SPAJA — Digitalna Industrija
// Tipovi za bazu podataka

export type PlanTip = 'starter' | 'basic' | 'pro' | 'enterprise' | 'unlimited';

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
          updated_at?: string;
        };
      };
      chat_history: {
        Row: {
          id: string;
          user_id: string;
          role: 'user' | 'assistant';
          content: string;
          tokens_used: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          role: 'user' | 'assistant';
          content: string;
          tokens_used?: number;
          created_at?: string;
        };
        Update: {
          role?: 'user' | 'assistant';
          content?: string;
          tokens_used?: number;
        };
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
      };
    };
  };
}
