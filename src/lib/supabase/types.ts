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
      knowledge_sources: {
        Row: {
          id: string;
          name: string;
          source_url: string;
          domain: string;
          category: string;
          status: 'active' | 'paused' | 'disabled' | 'error';
          ingest_mode: 'whitelist' | 'manual' | 'api-discovery';
          robots_policy_status: 'unknown' | 'allowed' | 'blocked';
          tos_policy_status: 'unknown' | 'allowed' | 'blocked';
          trust_score: number;
          language: string;
          priority: number;
          ttl_minutes: number;
          retry_limit: number;
          rate_limit_per_minute: number;
          metadata: Record<string, unknown>;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          source_url: string;
          domain: string;
          category?: string;
          status?: 'active' | 'paused' | 'disabled' | 'error';
          ingest_mode?: 'whitelist' | 'manual' | 'api-discovery';
          robots_policy_status?: 'unknown' | 'allowed' | 'blocked';
          tos_policy_status?: 'unknown' | 'allowed' | 'blocked';
          trust_score?: number;
          language?: string;
          priority?: number;
          ttl_minutes?: number;
          retry_limit?: number;
          rate_limit_per_minute?: number;
          metadata?: Record<string, unknown>;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          source_url?: string;
          domain?: string;
          category?: string;
          status?: 'active' | 'paused' | 'disabled' | 'error';
          ingest_mode?: 'whitelist' | 'manual' | 'api-discovery';
          robots_policy_status?: 'unknown' | 'allowed' | 'blocked';
          tos_policy_status?: 'unknown' | 'allowed' | 'blocked';
          trust_score?: number;
          language?: string;
          priority?: number;
          ttl_minutes?: number;
          retry_limit?: number;
          rate_limit_per_minute?: number;
          metadata?: Record<string, unknown>;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'knowledge_sources_created_by_fkey';
            columns: ['created_by'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      knowledge_documents: {
        Row: {
          id: string;
          source_id: string;
          source_url: string;
          canonical_url: string;
          title: string;
          language: string;
          content_type: string;
          content_hash: string;
          content_length: number;
          raw_content: string;
          cleaned_content: string;
          status: 'queued' | 'running' | 'processed' | 'failed' | 'archived';
          fetch_status_code: number | null;
          fetched_at: string | null;
          indexed_at: string | null;
          last_error: string | null;
          trust_score: number;
          prompt_injection_risk: 'low' | 'medium' | 'high';
          metadata: Record<string, unknown>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          source_id: string;
          source_url: string;
          canonical_url: string;
          title?: string;
          language?: string;
          content_type?: string;
          content_hash: string;
          content_length?: number;
          raw_content?: string;
          cleaned_content?: string;
          status?: 'queued' | 'running' | 'processed' | 'failed' | 'archived';
          fetch_status_code?: number | null;
          fetched_at?: string | null;
          indexed_at?: string | null;
          last_error?: string | null;
          trust_score?: number;
          prompt_injection_risk?: 'low' | 'medium' | 'high';
          metadata?: Record<string, unknown>;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          source_id?: string;
          source_url?: string;
          canonical_url?: string;
          title?: string;
          language?: string;
          content_type?: string;
          content_hash?: string;
          content_length?: number;
          raw_content?: string;
          cleaned_content?: string;
          status?: 'queued' | 'running' | 'processed' | 'failed' | 'archived';
          fetch_status_code?: number | null;
          fetched_at?: string | null;
          indexed_at?: string | null;
          last_error?: string | null;
          trust_score?: number;
          prompt_injection_risk?: 'low' | 'medium' | 'high';
          metadata?: Record<string, unknown>;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'knowledge_documents_source_id_fkey';
            columns: ['source_id'];
            referencedRelation: 'knowledge_sources';
            referencedColumns: ['id'];
          },
        ];
      };
      knowledge_chunks: {
        Row: {
          id: string;
          document_id: string;
          chunk_index: number;
          content: string;
          token_count: number;
          embedding_model: string | null;
          embedding_status: 'not_indexed' | 'indexed' | 'failed';
          safety_label: 'safe' | 'needs_review' | 'blocked';
          metadata: Record<string, unknown>;
          created_at: string;
        };
        Insert: {
          id?: string;
          document_id: string;
          chunk_index: number;
          content: string;
          token_count?: number;
          embedding_model?: string | null;
          embedding_status?: 'not_indexed' | 'indexed' | 'failed';
          safety_label?: 'safe' | 'needs_review' | 'blocked';
          metadata?: Record<string, unknown>;
          created_at?: string;
        };
        Update: {
          content?: string;
          token_count?: number;
          embedding_model?: string | null;
          embedding_status?: 'not_indexed' | 'indexed' | 'failed';
          safety_label?: 'safe' | 'needs_review' | 'blocked';
          metadata?: Record<string, unknown>;
        };
        Relationships: [
          {
            foreignKeyName: 'knowledge_chunks_document_id_fkey';
            columns: ['document_id'];
            referencedRelation: 'knowledge_documents';
            referencedColumns: ['id'];
          },
        ];
      };
      knowledge_crawl_jobs: {
        Row: {
          id: string;
          source_id: string | null;
          trigger_type: 'manual' | 'schedule' | 'api-discovery';
          status: 'queued' | 'running' | 'completed' | 'failed' | 'partial';
          candidate_urls: unknown;
          processed_urls: number;
          succeeded_urls: number;
          failed_urls: number;
          retry_count: number;
          max_retries: number;
          started_at: string | null;
          finished_at: string | null;
          latency_ms: number | null;
          error_log: unknown;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          source_id?: string | null;
          trigger_type?: 'manual' | 'schedule' | 'api-discovery';
          status?: 'queued' | 'running' | 'completed' | 'failed' | 'partial';
          candidate_urls?: unknown;
          processed_urls?: number;
          succeeded_urls?: number;
          failed_urls?: number;
          retry_count?: number;
          max_retries?: number;
          started_at?: string | null;
          finished_at?: string | null;
          latency_ms?: number | null;
          error_log?: unknown;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          source_id?: string | null;
          trigger_type?: 'manual' | 'schedule' | 'api-discovery';
          status?: 'queued' | 'running' | 'completed' | 'failed' | 'partial';
          candidate_urls?: unknown;
          processed_urls?: number;
          succeeded_urls?: number;
          failed_urls?: number;
          retry_count?: number;
          max_retries?: number;
          started_at?: string | null;
          finished_at?: string | null;
          latency_ms?: number | null;
          error_log?: unknown;
        };
        Relationships: [
          {
            foreignKeyName: 'knowledge_crawl_jobs_source_id_fkey';
            columns: ['source_id'];
            referencedRelation: 'knowledge_sources';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'knowledge_crawl_jobs_created_by_fkey';
            columns: ['created_by'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      knowledge_dead_letters: {
        Row: {
          id: string;
          job_id: string | null;
          source_id: string | null;
          source_url: string;
          canonical_url: string | null;
          error_code: string;
          error_message: string;
          retry_count: number;
          last_attempt_at: string;
          payload: Record<string, unknown>;
          created_at: string;
        };
        Insert: {
          id?: string;
          job_id?: string | null;
          source_id?: string | null;
          source_url: string;
          canonical_url?: string | null;
          error_code?: string;
          error_message?: string;
          retry_count?: number;
          last_attempt_at?: string;
          payload?: Record<string, unknown>;
          created_at?: string;
        };
        Update: {
          retry_count?: number;
          error_code?: string;
          error_message?: string;
          last_attempt_at?: string;
          payload?: Record<string, unknown>;
        };
        Relationships: [
          {
            foreignKeyName: 'knowledge_dead_letters_job_id_fkey';
            columns: ['job_id'];
            referencedRelation: 'knowledge_crawl_jobs';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'knowledge_dead_letters_source_id_fkey';
            columns: ['source_id'];
            referencedRelation: 'knowledge_sources';
            referencedColumns: ['id'];
          },
        ];
      };
      knowledge_citations: {
        Row: {
          id: string;
          user_id: string | null;
          thread_id: string | null;
          query: string;
          document_id: string | null;
          chunk_id: string | null;
          source_url: string;
          title: string;
          score: number;
          used_in_response: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          thread_id?: string | null;
          query?: string;
          document_id?: string | null;
          chunk_id?: string | null;
          source_url?: string;
          title?: string;
          score?: number;
          used_in_response?: boolean;
          created_at?: string;
        };
        Update: {
          used_in_response?: boolean;
          score?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'knowledge_citations_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'knowledge_citations_thread_id_fkey';
            columns: ['thread_id'];
            referencedRelation: 'chat_threads';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'knowledge_citations_document_id_fkey';
            columns: ['document_id'];
            referencedRelation: 'knowledge_documents';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'knowledge_citations_chunk_id_fkey';
            columns: ['chunk_id'];
            referencedRelation: 'knowledge_chunks';
            referencedColumns: ['id'];
          },
        ];
      };
      knowledge_retrieval_metrics: {
        Row: {
          id: string;
          query: string;
          user_id: string | null;
          thread_id: string | null;
          latency_ms: number;
          results_count: number;
          citations_count: number;
          citation_rate: number;
          quality_score: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          query?: string;
          user_id?: string | null;
          thread_id?: string | null;
          latency_ms?: number;
          results_count?: number;
          citations_count?: number;
          citation_rate?: number;
          quality_score?: number;
          created_at?: string;
        };
        Update: {
          latency_ms?: number;
          results_count?: number;
          citations_count?: number;
          citation_rate?: number;
          quality_score?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'knowledge_retrieval_metrics_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'knowledge_retrieval_metrics_thread_id_fkey';
            columns: ['thread_id'];
            referencedRelation: 'chat_threads';
            referencedColumns: ['id'];
          },
        ];
      };
      // Idempotency store — čuva obrađene Stripe event ID-jeve da se spreči dvostruka obrada
      stripe_webhook_events: {
        Row: {
          id: string;
          event_id: string;   // Stripe event ID (evt_...) — unique
          event_type: string;
          processed_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          event_type: string;
          processed_at?: string;
        };
        Update: Record<string, never>;
        Relationships: [];
      };
      // Finansijski audit trail — beleži svaku promenu plana/pretplate
      financial_audit_log: {
        Row: {
          id: string;
          user_id: string | null;
          action: string;
          old_plan: string | null;
          new_plan: string | null;
          old_status: string | null;
          new_status: string | null;
          stripe_event_id: string | null;
          stripe_customer_id: string | null;
          metadata: Record<string, unknown>;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          action: string;
          old_plan?: string | null;
          new_plan?: string | null;
          old_status?: string | null;
          new_status?: string | null;
          stripe_event_id?: string | null;
          stripe_customer_id?: string | null;
          metadata?: Record<string, unknown>;
          created_at?: string;
        };
        Update: Record<string, never>;
        Relationships: [
          {
            foreignKeyName: 'financial_audit_log_user_id_fkey';
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
