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
          billing_locked: boolean | null;
          failed_payment_count: number | null;
          grace_period_expires_at: string | null;
          last_plan_changed_at: string | null;
          paypal_subscription_id: string | null;
          personalization_version: string;
          stable_preferences: Record<string, unknown> | null;
          contextual_preferences: Record<string, unknown> | null;
          personalization_confidence: number;
          personalization_updated_at: string | null;
          personalization_enabled: boolean;
          personalization_opt_out: boolean;
          adaptive_preferences: Record<string, unknown> | null;
          personalization_feedback: Record<string, unknown> | null;
          personalization_v3_score: number;
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
          personalization_version?: string;
          stable_preferences?: Record<string, unknown> | null;
          contextual_preferences?: Record<string, unknown> | null;
          personalization_confidence?: number;
          personalization_updated_at?: string | null;
          personalization_enabled?: boolean;
          personalization_opt_out?: boolean;
          adaptive_preferences?: Record<string, unknown> | null;
          personalization_feedback?: Record<string, unknown> | null;
          personalization_v3_score?: number;
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
          billing_locked?: boolean | null;
          failed_payment_count?: number | null;
          grace_period_expires_at?: string | null;
          last_plan_changed_at?: string | null;
          paypal_subscription_id?: string | null;
          personalization_version?: string;
          stable_preferences?: Record<string, unknown> | null;
          contextual_preferences?: Record<string, unknown> | null;
          personalization_confidence?: number;
          personalization_updated_at?: string | null;
          personalization_enabled?: boolean;
          personalization_opt_out?: boolean;
          adaptive_preferences?: Record<string, unknown> | null;
          personalization_feedback?: Record<string, unknown> | null;
          personalization_v3_score?: number;
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
          indexed_content: string;
          token_count: number;
          embedding_model: string | null;
          embedding_model_version: string | null;
          embedding_generated_at: string | null;
          embedding_vector: string | null;
          embedding_status: 'not_indexed' | 'indexed' | 'failed';
          indexing_attempts: number;
          indexing_error: string | null;
          last_index_attempt_at: string | null;
          indexed_at: string | null;
          index_version: string;
          keyword_density: number;
          unique_term_count: number;
          position_score: number;
          semantic_score: number;
          safety_label: 'safe' | 'needs_review' | 'blocked';
          metadata: Record<string, unknown>;
          created_at: string;
        };
        Insert: {
          id?: string;
          document_id: string;
          chunk_index: number;
          content: string;
          indexed_content?: string;
          token_count?: number;
          embedding_model?: string | null;
          embedding_model_version?: string | null;
          embedding_generated_at?: string | null;
          embedding_vector?: string | null;
          embedding_status?: 'not_indexed' | 'indexed' | 'failed';
          indexing_attempts?: number;
          indexing_error?: string | null;
          last_index_attempt_at?: string | null;
          indexed_at?: string | null;
          index_version?: string;
          keyword_density?: number;
          unique_term_count?: number;
          position_score?: number;
          semantic_score?: number;
          safety_label?: 'safe' | 'needs_review' | 'blocked';
          metadata?: Record<string, unknown>;
          created_at?: string;
        };
        Update: {
          indexed_content?: string;
          content?: string;
          token_count?: number;
          embedding_model?: string | null;
          embedding_model_version?: string | null;
          embedding_generated_at?: string | null;
          embedding_vector?: string | null;
          embedding_status?: 'not_indexed' | 'indexed' | 'failed';
          indexing_attempts?: number;
          indexing_error?: string | null;
          last_index_attempt_at?: string | null;
          indexed_at?: string | null;
          index_version?: string;
          keyword_density?: number;
          unique_term_count?: number;
          position_score?: number;
          semantic_score?: number;
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
      knowledge_index_jobs: {
        Row: {
          id: string;
          status: 'queued' | 'running' | 'completed' | 'failed' | 'partial';
          trigger_type: 'manual' | 'schedule' | 'reindex';
          source_id: string | null;
          document_id: string | null;
          requested_by: string | null;
          batch_size: number;
          max_batches: number;
          processed_chunks: number;
          indexed_chunks: number;
          failed_chunks: number;
          throughput_per_minute: number;
          average_latency_ms: number;
          started_at: string | null;
          finished_at: string | null;
          error_log: unknown;
          created_at: string;
        };
        Insert: {
          id?: string;
          status?: 'queued' | 'running' | 'completed' | 'failed' | 'partial';
          trigger_type?: 'manual' | 'schedule' | 'reindex';
          source_id?: string | null;
          document_id?: string | null;
          requested_by?: string | null;
          batch_size?: number;
          max_batches?: number;
          processed_chunks?: number;
          indexed_chunks?: number;
          failed_chunks?: number;
          throughput_per_minute?: number;
          average_latency_ms?: number;
          started_at?: string | null;
          finished_at?: string | null;
          error_log?: unknown;
          created_at?: string;
        };
        Update: {
          status?: 'queued' | 'running' | 'completed' | 'failed' | 'partial';
          trigger_type?: 'manual' | 'schedule' | 'reindex';
          source_id?: string | null;
          document_id?: string | null;
          requested_by?: string | null;
          batch_size?: number;
          max_batches?: number;
          processed_chunks?: number;
          indexed_chunks?: number;
          failed_chunks?: number;
          throughput_per_minute?: number;
          average_latency_ms?: number;
          started_at?: string | null;
          finished_at?: string | null;
          error_log?: unknown;
        };
        Relationships: [
          {
            foreignKeyName: 'knowledge_index_jobs_source_id_fkey';
            columns: ['source_id'];
            referencedRelation: 'knowledge_sources';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'knowledge_index_jobs_document_id_fkey';
            columns: ['document_id'];
            referencedRelation: 'knowledge_documents';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'knowledge_index_jobs_requested_by_fkey';
            columns: ['requested_by'];
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
          retrieval_index_version: string;
          semantic_retrieval_used: boolean;
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
          retrieval_index_version?: string;
          semantic_retrieval_used?: boolean;
          created_at?: string;
        };
        Update: {
          latency_ms?: number;
          results_count?: number;
          citations_count?: number;
          citation_rate?: number;
          quality_score?: number;
          retrieval_index_version?: string;
          semantic_retrieval_used?: boolean;
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
          handler_version: string;
          webhook_latency_ms: number | null;
          consistency_latency_ms: number | null;
          quarantined: boolean;
        };
        Insert: {
          id?: string;
          event_id: string;
          event_type: string;
          processed_at?: string;
          handler_version?: string;
          webhook_latency_ms?: number | null;
          consistency_latency_ms?: number | null;
          quarantined?: boolean;
        };
        Update: {
          webhook_latency_ms?: number | null;
          consistency_latency_ms?: number | null;
          quarantined?: boolean;
          handler_version?: string;
        };
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
          request_id: string | null;
          payload_hash: string | null;
          prev_hash: string | null;
          chain_hash: string | null;
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
          request_id?: string | null;
          payload_hash?: string | null;
          prev_hash?: string | null;
          chain_hash?: string | null;
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
      // Dead-letter queue — čuva webhook evente koji padnu za kasniji replay (#7)
      webhook_dead_letter: {
        Row: {
          id: string;
          event_id: string;
          event_type: string;
          payload: string;
          failure_reason: string;
          retry_count: number;
          replay_attempts: number;
          replayed: boolean;
          replayed_at: string | null;
          occurred_at: string;
          created_at: string;
          quarantine: boolean;
          quarantine_reason: string | null;
          poison: boolean;
          poison_reason: string | null;
          approved_by: string | null;
          approved_at: string | null;
          last_replayed_by: string | null;
        };
        Insert: {
          id?: string;
          event_id: string;
          event_type: string;
          payload: string;
          failure_reason: string;
          retry_count?: number;
          replay_attempts?: number;
          replayed?: boolean;
          replayed_at?: string | null;
          occurred_at?: string;
          created_at?: string;
          quarantine?: boolean;
          quarantine_reason?: string | null;
          poison?: boolean;
          poison_reason?: string | null;
          approved_by?: string | null;
          approved_at?: string | null;
          last_replayed_by?: string | null;
        };
        Update: {
          retry_count?: number;
          replay_attempts?: number;
          replayed?: boolean;
          replayed_at?: string | null;
          quarantine?: boolean;
          quarantine_reason?: string | null;
          poison?: boolean;
          poison_reason?: string | null;
          approved_by?: string | null;
          approved_at?: string | null;
          last_replayed_by?: string | null;
        };
        Relationships: [];
      };
      // Korisničke notifikacije za billing promene (#49)
      user_notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          action: string;
          metadata: Record<string, unknown>;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type?: string;
          action: string;
          metadata?: Record<string, unknown>;
          read?: boolean;
          created_at?: string;
        };
        Update: {
          read?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: 'user_notifications_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      // Billing feature flags tabela (#33)
      billing_feature_flags: {
        Row: {
          id: string;
          naziv: string;
          enabled: boolean;
          rollout_pct: number;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          id: string;
          naziv: string;
          enabled?: boolean;
          rollout_pct?: number;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          naziv?: string;
          enabled?: boolean;
          rollout_pct?: number;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [];
      };
      // ─── Menjačnica + Poslovni Novčanik ─────────────────────────────────

      // Asset katalog
      exchange_assets: {
        Row: {
          id: string;
          naziv: string;
          tip: 'crypto' | 'fiat' | 'stablecoin';
          decimals: number;
          min_order_qty: number;
          max_order_qty: number | null;
          mreza: string | null;
          ugovor_adresa: string | null;
          is_spaja_btc: boolean;
          enabled: boolean;
          metadata: Record<string, unknown>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          naziv: string;
          tip: 'crypto' | 'fiat' | 'stablecoin';
          decimals?: number;
          min_order_qty?: number;
          max_order_qty?: number | null;
          mreza?: string | null;
          ugovor_adresa?: string | null;
          is_spaja_btc?: boolean;
          enabled?: boolean;
          metadata?: Record<string, unknown>;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          naziv?: string;
          tip?: 'crypto' | 'fiat' | 'stablecoin';
          decimals?: number;
          min_order_qty?: number;
          max_order_qty?: number | null;
          mreza?: string | null;
          ugovor_adresa?: string | null;
          is_spaja_btc?: boolean;
          enabled?: boolean;
          metadata?: Record<string, unknown>;
          updated_at?: string;
        };
        Relationships: [];
      };

      // Market pair konfiguracije
      exchange_market_pairs: {
        Row: {
          id: string;
          base_asset_id: string;
          quote_asset_id: string;
          min_qty: number;
          max_qty: number | null;
          price_precision: number;
          qty_precision: number;
          taker_fee_pct: number;
          maker_fee_pct: number;
          is_spaja_pair: boolean;
          simulation_only: boolean;
          enabled: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          base_asset_id: string;
          quote_asset_id: string;
          min_qty?: number;
          max_qty?: number | null;
          price_precision?: number;
          qty_precision?: number;
          taker_fee_pct?: number;
          maker_fee_pct?: number;
          is_spaja_pair?: boolean;
          simulation_only?: boolean;
          enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          min_qty?: number;
          max_qty?: number | null;
          taker_fee_pct?: number;
          maker_fee_pct?: number;
          is_spaja_pair?: boolean;
          simulation_only?: boolean;
          enabled?: boolean;
          updated_at?: string;
        };
        Relationships: [
          { foreignKeyName: 'exchange_market_pairs_base_asset_id_fkey'; columns: ['base_asset_id']; referencedRelation: 'exchange_assets'; referencedColumns: ['id'] },
          { foreignKeyName: 'exchange_market_pairs_quote_asset_id_fkey'; columns: ['quote_asset_id']; referencedRelation: 'exchange_assets'; referencedColumns: ['id'] },
        ];
      };

      // Quote snapshots (price feed)
      exchange_quote_snapshots: {
        Row: {
          id: string;
          pair_id: string;
          bid: number;
          ask: number;
          last: number;
          volume_24h: number;
          change_pct_24h: number | null;
          source: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          pair_id: string;
          bid: number;
          ask: number;
          last: number;
          volume_24h?: number;
          change_pct_24h?: number | null;
          source?: string;
          created_at?: string;
        };
        Update: {
          bid?: number;
          ask?: number;
          last?: number;
          volume_24h?: number;
          change_pct_24h?: number | null;
        };
        Relationships: [
          { foreignKeyName: 'exchange_quote_snapshots_pair_id_fkey'; columns: ['pair_id']; referencedRelation: 'exchange_market_pairs'; referencedColumns: ['id'] },
        ];
      };

      // Order book
      exchange_orders: {
        Row: {
          id: string;
          idempotency_key: string | null;
          user_id: string;
          pair_id: string;
          side: 'buy' | 'sell';
          tip: 'market' | 'limit';
          qty: number;
          price: number | null;
          filled_qty: number;
          avg_fill_price: number | null;
          fee_asset_id: string | null;
          fee_total: number;
          status: 'pending' | 'open' | 'partially_filled' | 'filled' | 'cancelled' | 'rejected' | 'expired';
          simulation_mode: boolean;
          reject_reason: string | null;
          aml_score: number | null;
          risk_flags: string[];
          metadata: Record<string, unknown>;
          created_at: string;
          updated_at: string;
          expires_at: string | null;
        };
        Insert: {
          id?: string;
          idempotency_key?: string | null;
          user_id: string;
          pair_id: string;
          side: 'buy' | 'sell';
          tip: 'market' | 'limit';
          qty: number;
          price?: number | null;
          filled_qty?: number;
          avg_fill_price?: number | null;
          fee_asset_id?: string | null;
          fee_total?: number;
          status?: 'pending' | 'open' | 'partially_filled' | 'filled' | 'cancelled' | 'rejected' | 'expired';
          simulation_mode?: boolean;
          reject_reason?: string | null;
          aml_score?: number | null;
          risk_flags?: string[];
          metadata?: Record<string, unknown>;
          created_at?: string;
          updated_at?: string;
          expires_at?: string | null;
        };
        Update: {
          filled_qty?: number;
          avg_fill_price?: number | null;
          fee_total?: number;
          status?: 'pending' | 'open' | 'partially_filled' | 'filled' | 'cancelled' | 'rejected' | 'expired';
          reject_reason?: string | null;
          aml_score?: number | null;
          risk_flags?: string[];
          updated_at?: string;
        };
        Relationships: [
          { foreignKeyName: 'exchange_orders_pair_id_fkey'; columns: ['pair_id']; referencedRelation: 'exchange_market_pairs'; referencedColumns: ['id'] },
        ];
      };

      // Executed trades
      exchange_trades: {
        Row: {
          id: string;
          order_id: string;
          pair_id: string;
          user_id: string;
          side: 'buy' | 'sell';
          qty: number;
          price: number;
          fee: number;
          fee_asset_id: string | null;
          simulation_mode: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          pair_id: string;
          user_id: string;
          side: 'buy' | 'sell';
          qty: number;
          price: number;
          fee?: number;
          fee_asset_id?: string | null;
          simulation_mode?: boolean;
          created_at?: string;
        };
        Update: {
          fee?: number;
        };
        Relationships: [
          { foreignKeyName: 'exchange_trades_order_id_fkey'; columns: ['order_id']; referencedRelation: 'exchange_orders'; referencedColumns: ['id'] },
        ];
      };

      // AML/risk signali
      exchange_aml_signals: {
        Row: {
          id: string;
          user_id: string;
          reference_id: string;
          reference_type: string;
          score: number;
          flags: string[];
          action: 'allow' | 'review' | 'block';
          reviewed_by: string | null;
          resolved_at: string | null;
          metadata: Record<string, unknown>;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          reference_id: string;
          reference_type: string;
          score: number;
          flags?: string[];
          action: 'allow' | 'review' | 'block';
          reviewed_by?: string | null;
          resolved_at?: string | null;
          metadata?: Record<string, unknown>;
          created_at?: string;
        };
        Update: {
          action?: 'allow' | 'review' | 'block';
          reviewed_by?: string | null;
          resolved_at?: string | null;
        };
        Relationships: [];
      };

      // Wallet accounts (per user, per asset)
      novcanik_accounts: {
        Row: {
          id: string;
          user_id: string;
          asset_id: string;
          available: number;
          reserved: number;
          total: number;
          kyc_tier: 'basic' | 'verified' | 'enterprise';
          enabled: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          asset_id: string;
          available?: number;
          reserved?: number;
          kyc_tier?: 'basic' | 'verified' | 'enterprise';
          enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          available?: number;
          reserved?: number;
          kyc_tier?: 'basic' | 'verified' | 'enterprise';
          enabled?: boolean;
          updated_at?: string;
        };
        Relationships: [
          { foreignKeyName: 'novcanik_accounts_asset_id_fkey'; columns: ['asset_id']; referencedRelation: 'exchange_assets'; referencedColumns: ['id'] },
        ];
      };

      // Wallet ledger (double-entry)
      novcanik_ledger: {
        Row: {
          id: string;
          account_id: string;
          user_id: string;
          asset_id: string;
          entry_type: 'deposit' | 'withdrawal' | 'trade_debit' | 'trade_credit' | 'fee' | 'transfer_out' | 'transfer_in' | 'adjustment';
          amount: number;
          direction: 'credit' | 'debit';
          balance_after: number;
          reference_id: string | null;
          reference_type: string | null;
          idempotency_key: string | null;
          description: string | null;
          metadata: Record<string, unknown>;
          created_at: string;
        };
        Insert: {
          id?: string;
          account_id: string;
          user_id: string;
          asset_id: string;
          entry_type: 'deposit' | 'withdrawal' | 'trade_debit' | 'trade_credit' | 'fee' | 'transfer_out' | 'transfer_in' | 'adjustment';
          amount: number;
          direction: 'credit' | 'debit';
          balance_after: number;
          reference_id?: string | null;
          reference_type?: string | null;
          idempotency_key?: string | null;
          description?: string | null;
          metadata?: Record<string, unknown>;
          created_at?: string;
        };
        Update: {
          description?: string | null;
          metadata?: Record<string, unknown>;
        };
        Relationships: [
          { foreignKeyName: 'novcanik_ledger_account_id_fkey'; columns: ['account_id']; referencedRelation: 'novcanik_accounts'; referencedColumns: ['id'] },
        ];
      };

      // Deposits
      novcanik_deposits: {
        Row: {
          id: string;
          idempotency_key: string;
          user_id: string;
          asset_id: string;
          amount: number;
          status: 'pending' | 'confirming' | 'credited' | 'failed' | 'rejected';
          network: string | null;
          tx_hash: string | null;
          confirmations: number;
          required_confirmations: number;
          source_address: string | null;
          destination_address: string | null;
          kyc_tier_required: string;
          aml_score: number | null;
          aml_flags: string[];
          ledger_entry_id: string | null;
          metadata: Record<string, unknown>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          idempotency_key: string;
          user_id: string;
          asset_id: string;
          amount: number;
          status?: 'pending' | 'confirming' | 'credited' | 'failed' | 'rejected';
          network?: string | null;
          tx_hash?: string | null;
          confirmations?: number;
          required_confirmations?: number;
          source_address?: string | null;
          destination_address?: string | null;
          kyc_tier_required?: string;
          aml_score?: number | null;
          aml_flags?: string[];
          ledger_entry_id?: string | null;
          metadata?: Record<string, unknown>;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          status?: 'pending' | 'confirming' | 'credited' | 'failed' | 'rejected';
          tx_hash?: string | null;
          confirmations?: number;
          aml_score?: number | null;
          aml_flags?: string[];
          ledger_entry_id?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };

      // Withdrawals
      novcanik_withdrawals: {
        Row: {
          id: string;
          idempotency_key: string;
          user_id: string;
          asset_id: string;
          amount: number;
          fee: number;
          amount_net: number;
          status: 'pending' | 'review' | 'approved' | 'processing' | 'completed' | 'failed' | 'rejected';
          network: string | null;
          tx_hash: string | null;
          destination_address: string;
          kyc_tier_required: string;
          aml_score: number | null;
          aml_flags: string[];
          review_reason: string | null;
          approved_by: string | null;
          ledger_entry_id: string | null;
          metadata: Record<string, unknown>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          idempotency_key: string;
          user_id: string;
          asset_id: string;
          amount: number;
          fee?: number;
          status?: 'pending' | 'review' | 'approved' | 'processing' | 'completed' | 'failed' | 'rejected';
          network?: string | null;
          tx_hash?: string | null;
          destination_address: string;
          kyc_tier_required?: string;
          aml_score?: number | null;
          aml_flags?: string[];
          review_reason?: string | null;
          approved_by?: string | null;
          ledger_entry_id?: string | null;
          metadata?: Record<string, unknown>;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          status?: 'pending' | 'review' | 'approved' | 'processing' | 'completed' | 'failed' | 'rejected';
          tx_hash?: string | null;
          review_reason?: string | null;
          approved_by?: string | null;
          ledger_entry_id?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };

      // PayPal idempotency store — čuva obrađene PayPal event ID-jeve
      paypal_webhook_events: {
        Row: {
          id: string;
          event_id: string;
          event_type: string;
          processed_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          event_type: string;
          processed_at?: string;
        };
        Update: {
          event_type?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      match_knowledge_chunks_v4: {
        Args: {
          query_vector_literal: string;
          match_count?: number;
          min_similarity?: number;
        };
        Returns: {
          id: string;
          chunk_index: number;
          content: string;
          indexed_content: string;
          embedding_status: string;
          index_version: string;
          keyword_density: number;
          position_score: number;
          semantic_similarity: number;
          semantic_score: number;
          document_id: string;
          title: string;
          canonical_url: string;
          trust_score: number;
          source_name: string | null;
        }[];
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
