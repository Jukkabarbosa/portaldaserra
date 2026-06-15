export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admin_logs: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          description: string | null
          entity: string
          entity_id: string | null
          id: string
          payload: Json
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          description?: string | null
          entity: string
          entity_id?: string | null
          id?: string
          payload?: Json
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          description?: string | null
          entity?: string
          entity_id?: string | null
          id?: string
          payload?: Json
        }
        Relationships: []
      }
      coupons: {
        Row: {
          applies_to: Json
          code: string
          created_at: string
          created_by: string | null
          description: string | null
          discount_type: string
          discount_value: number
          duration: string
          duration_months: number | null
          id: string
          is_active: boolean
          max_redemptions: number | null
          stripe_coupon_id: string | null
          times_redeemed: number
          updated_at: string
          valid_from: string
          valid_until: string | null
        }
        Insert: {
          applies_to?: Json
          code: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          discount_type?: string
          discount_value?: number
          duration?: string
          duration_months?: number | null
          id?: string
          is_active?: boolean
          max_redemptions?: number | null
          stripe_coupon_id?: string | null
          times_redeemed?: number
          updated_at?: string
          valid_from?: string
          valid_until?: string | null
        }
        Update: {
          applies_to?: Json
          code?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          discount_type?: string
          discount_value?: number
          duration?: string
          duration_months?: number | null
          id?: string
          is_active?: boolean
          max_redemptions?: number | null
          stripe_coupon_id?: string | null
          times_redeemed?: number
          updated_at?: string
          valid_from?: string
          valid_until?: string | null
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string
          id: string
          user_id: string
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_id: string
          vehicle_id: string
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      featured_ads: {
        Row: {
          created_at: string
          ends_at: string | null
          id: string
          is_active: boolean
          sort_order: number
          starts_at: string
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          ends_at?: string | null
          id?: string
          is_active?: boolean
          sort_order?: number
          starts_at?: string
          vehicle_id: string
        }
        Update: {
          created_at?: string
          ends_at?: string | null
          id?: string
          is_active?: boolean
          sort_order?: number
          starts_at?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "featured_ads_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_logs: {
        Row: {
          actor_id: string | null
          amount: number | null
          created_at: string
          currency: string | null
          description: string | null
          entity_id: string | null
          entity_type: string | null
          event_type: string
          id: string
          ip_address: string | null
          payload: Json
          source: string
        }
        Insert: {
          actor_id?: string | null
          amount?: number | null
          created_at?: string
          currency?: string | null
          description?: string | null
          entity_id?: string | null
          entity_type?: string | null
          event_type: string
          id?: string
          ip_address?: string | null
          payload?: Json
          source?: string
        }
        Update: {
          actor_id?: string | null
          amount?: number | null
          created_at?: string
          currency?: string | null
          description?: string | null
          entity_id?: string | null
          entity_type?: string | null
          event_type?: string
          id?: string
          ip_address?: string | null
          payload?: Json
          source?: string
        }
        Relationships: []
      }
      financing_simulations: {
        Row: {
          created_at: string
          down_payment: number
          email: string | null
          id: string
          installments: number
          interest_rate: number
          monthly_payment: number
          name: string
          notes: string | null
          phone: string | null
          total_amount: number
          vehicle_id: string | null
          vehicle_price: number
        }
        Insert: {
          created_at?: string
          down_payment?: number
          email?: string | null
          id?: string
          installments: number
          interest_rate: number
          monthly_payment: number
          name: string
          notes?: string | null
          phone?: string | null
          total_amount: number
          vehicle_id?: string | null
          vehicle_price: number
        }
        Update: {
          created_at?: string
          down_payment?: number
          email?: string | null
          id?: string
          installments?: number
          interest_rate?: number
          monthly_payment?: number
          name?: string
          notes?: string | null
          phone?: string | null
          total_amount?: number
          vehicle_id?: string | null
          vehicle_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "financing_simulations_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      garages: {
        Row: {
          address: string | null
          business_hours: string | null
          city: string | null
          cnpj: string | null
          cover_url: string | null
          created_at: string
          description: string | null
          email: string | null
          facebook: string | null
          id: string
          instagram: string | null
          is_active: boolean
          is_featured: boolean
          is_verified: boolean
          logo_url: string | null
          name: string
          owner_id: string
          phone: string | null
          rating: number | null
          responsible: string | null
          slug: string
          state: string | null
          tiktok: string | null
          updated_at: string
          website: string | null
          whatsapp: string | null
        }
        Insert: {
          address?: string | null
          business_hours?: string | null
          city?: string | null
          cnpj?: string | null
          cover_url?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          facebook?: string | null
          id?: string
          instagram?: string | null
          is_active?: boolean
          is_featured?: boolean
          is_verified?: boolean
          logo_url?: string | null
          name: string
          owner_id: string
          phone?: string | null
          rating?: number | null
          responsible?: string | null
          slug: string
          state?: string | null
          tiktok?: string | null
          updated_at?: string
          website?: string | null
          whatsapp?: string | null
        }
        Update: {
          address?: string | null
          business_hours?: string | null
          city?: string | null
          cnpj?: string | null
          cover_url?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          facebook?: string | null
          id?: string
          instagram?: string | null
          is_active?: boolean
          is_featured?: boolean
          is_verified?: boolean
          logo_url?: string | null
          name?: string
          owner_id?: string
          phone?: string | null
          rating?: number | null
          responsible?: string | null
          slug?: string
          state?: string | null
          tiktok?: string | null
          updated_at?: string
          website?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount: number
          created_at: string
          currency: string
          customer_document: string | null
          customer_email: string | null
          customer_name: string | null
          description: string | null
          discount: number
          due_date: string | null
          garage_id: string | null
          hosted_url: string | null
          id: string
          invoice_number: string | null
          metadata: Json
          paid_at: string | null
          payment_id: string | null
          pdf_url: string | null
          sponsor_id: string | null
          status: string
          stripe_invoice_id: string | null
          subscription_id: string | null
          tax: number
          total: number
          updated_at: string
        }
        Insert: {
          amount?: number
          created_at?: string
          currency?: string
          customer_document?: string | null
          customer_email?: string | null
          customer_name?: string | null
          description?: string | null
          discount?: number
          due_date?: string | null
          garage_id?: string | null
          hosted_url?: string | null
          id?: string
          invoice_number?: string | null
          metadata?: Json
          paid_at?: string | null
          payment_id?: string | null
          pdf_url?: string | null
          sponsor_id?: string | null
          status?: string
          stripe_invoice_id?: string | null
          subscription_id?: string | null
          tax?: number
          total?: number
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          customer_document?: string | null
          customer_email?: string | null
          customer_name?: string | null
          description?: string | null
          discount?: number
          due_date?: string | null
          garage_id?: string | null
          hosted_url?: string | null
          id?: string
          invoice_number?: string | null
          metadata?: Json
          paid_at?: string | null
          payment_id?: string | null
          pdf_url?: string | null
          sponsor_id?: string | null
          status?: string
          stripe_invoice_id?: string | null
          subscription_id?: string | null
          tax?: number
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_garage_id_fkey"
            columns: ["garage_id"]
            isOneToOne: false
            referencedRelation: "garages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_sponsor_id_fkey"
            columns: ["sponsor_id"]
            isOneToOne: false
            referencedRelation: "sponsors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          created_at: string
          email: string | null
          garage_id: string
          id: string
          message: string | null
          name: string
          origin: Database["public"]["Enums"]["lead_origin"]
          phone: string | null
          status: Database["public"]["Enums"]["lead_status"]
          vehicle_id: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          garage_id: string
          id?: string
          message?: string | null
          name: string
          origin?: Database["public"]["Enums"]["lead_origin"]
          phone?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          vehicle_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          garage_id?: string
          id?: string
          message?: string | null
          name?: string
          origin?: Database["public"]["Enums"]["lead_origin"]
          phone?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_garage_id_fkey"
            columns: ["garage_id"]
            isOneToOne: false
            referencedRelation: "garages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          currency: string
          customer_email: string | null
          customer_name: string | null
          description: string | null
          failed_at: string | null
          garage_id: string | null
          id: string
          metadata: Json
          paid_at: string | null
          payment_method: string | null
          plan_slug: string | null
          refunded_at: string | null
          sponsor_id: string | null
          status: string
          stripe_charge_id: string | null
          stripe_invoice_id: string | null
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          subscription_id: string | null
          user_id: string | null
        }
        Insert: {
          amount?: number
          created_at?: string
          currency?: string
          customer_email?: string | null
          customer_name?: string | null
          description?: string | null
          failed_at?: string | null
          garage_id?: string | null
          id?: string
          metadata?: Json
          paid_at?: string | null
          payment_method?: string | null
          plan_slug?: string | null
          refunded_at?: string | null
          sponsor_id?: string | null
          status?: string
          stripe_charge_id?: string | null
          stripe_invoice_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          subscription_id?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          customer_email?: string | null
          customer_name?: string | null
          description?: string | null
          failed_at?: string | null
          garage_id?: string | null
          id?: string
          metadata?: Json
          paid_at?: string | null
          payment_method?: string | null
          plan_slug?: string | null
          refunded_at?: string | null
          sponsor_id?: string | null
          status?: string
          stripe_charge_id?: string | null
          stripe_invoice_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          subscription_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_garage_id_fkey"
            columns: ["garage_id"]
            isOneToOne: false
            referencedRelation: "garages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_sponsor_id_fkey"
            columns: ["sponsor_id"]
            isOneToOne: false
            referencedRelation: "sponsors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      plans: {
        Row: {
          benefits: Json
          created_at: string
          description: string | null
          featured_slots: number
          has_ai_assistant: boolean
          has_metrics: boolean
          has_premium_support: boolean
          has_priority: boolean
          id: string
          is_active: boolean
          name: string
          price_monthly: number
          slug: string
          sort_order: number
          vehicle_limit: number
        }
        Insert: {
          benefits?: Json
          created_at?: string
          description?: string | null
          featured_slots?: number
          has_ai_assistant?: boolean
          has_metrics?: boolean
          has_premium_support?: boolean
          has_priority?: boolean
          id?: string
          is_active?: boolean
          name: string
          price_monthly: number
          slug: string
          sort_order?: number
          vehicle_limit: number
        }
        Update: {
          benefits?: Json
          created_at?: string
          description?: string | null
          featured_slots?: number
          has_ai_assistant?: boolean
          has_metrics?: boolean
          has_premium_support?: boolean
          has_priority?: boolean
          id?: string
          is_active?: boolean
          name?: string
          price_monthly?: number
          slug?: string
          sort_order?: number
          vehicle_limit?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      site_access_logs: {
        Row: {
          city: string | null
          country: string | null
          created_at: string
          device_type: string | null
          duration_seconds: number | null
          id: string
          ip_address: string | null
          is_lead: boolean
          metadata: Json
          path: string
          referrer: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          city?: string | null
          country?: string | null
          created_at?: string
          device_type?: string | null
          duration_seconds?: number | null
          id?: string
          ip_address?: string | null
          is_lead?: boolean
          metadata?: Json
          path: string
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          city?: string | null
          country?: string | null
          created_at?: string
          device_type?: string | null
          duration_seconds?: number | null
          id?: string
          ip_address?: string | null
          is_lead?: boolean
          metadata?: Json
          path?: string
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          contact_email: string | null
          facebook: string | null
          favicon_url: string | null
          hero_subtitle: string | null
          hero_title: string | null
          id: string
          instagram: string | null
          logo_url: string | null
          primary_color: string | null
          privacy: string | null
          secondary_color: string | null
          site_name: string
          support_whatsapp: string | null
          terms: string | null
          tiktok: string | null
          updated_at: string
        }
        Insert: {
          contact_email?: string | null
          facebook?: string | null
          favicon_url?: string | null
          hero_subtitle?: string | null
          hero_title?: string | null
          id?: string
          instagram?: string | null
          logo_url?: string | null
          primary_color?: string | null
          privacy?: string | null
          secondary_color?: string | null
          site_name?: string
          support_whatsapp?: string | null
          terms?: string | null
          tiktok?: string | null
          updated_at?: string
        }
        Update: {
          contact_email?: string | null
          facebook?: string | null
          favicon_url?: string | null
          hero_subtitle?: string | null
          hero_title?: string | null
          id?: string
          instagram?: string | null
          logo_url?: string | null
          primary_color?: string | null
          privacy?: string | null
          secondary_color?: string | null
          site_name?: string
          support_whatsapp?: string | null
          terms?: string | null
          tiktok?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      sponsors: {
        Row: {
          category: string | null
          clicks_count: number
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          description: string | null
          ends_at: string | null
          id: string
          impressions_count: number
          is_active: boolean
          is_featured: boolean
          logo_url: string | null
          monthly_price: number
          name: string
          slug: string
          sort_order: number
          starts_at: string
          tier: Database["public"]["Enums"]["sponsor_tier"]
          updated_at: string
          website_url: string | null
        }
        Insert: {
          category?: string | null
          clicks_count?: number
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          ends_at?: string | null
          id?: string
          impressions_count?: number
          is_active?: boolean
          is_featured?: boolean
          logo_url?: string | null
          monthly_price?: number
          name: string
          slug: string
          sort_order?: number
          starts_at?: string
          tier?: Database["public"]["Enums"]["sponsor_tier"]
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          category?: string | null
          clicks_count?: number
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          ends_at?: string | null
          id?: string
          impressions_count?: number
          is_active?: boolean
          is_featured?: boolean
          logo_url?: string | null
          monthly_price?: number
          name?: string
          slug?: string
          sort_order?: number
          starts_at?: string
          tier?: Database["public"]["Enums"]["sponsor_tier"]
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          amount: number | null
          cancel_at_period_end: boolean
          canceled_at: string | null
          created_at: string
          currency: string | null
          expires_at: string | null
          garage_id: string
          id: string
          last_payment_at: string | null
          next_billing_at: string | null
          plan_id: string
          started_at: string | null
          status: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id: string | null
          stripe_price_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
        }
        Insert: {
          amount?: number | null
          cancel_at_period_end?: boolean
          canceled_at?: string | null
          created_at?: string
          currency?: string | null
          expires_at?: string | null
          garage_id: string
          id?: string
          last_payment_at?: string | null
          next_billing_at?: string | null
          plan_id: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number | null
          cancel_at_period_end?: boolean
          canceled_at?: string | null
          created_at?: string
          currency?: string | null
          expires_at?: string | null
          garage_id?: string
          id?: string
          last_payment_at?: string | null
          next_billing_at?: string | null
          plan_id?: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_garage_id_fkey"
            columns: ["garage_id"]
            isOneToOne: true
            referencedRelation: "garages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vehicle_alerts: {
        Row: {
          brand: string | null
          city: string | null
          created_at: string
          email: string
          id: string
          is_active: boolean
          last_notified_at: string | null
          mileage_max: number | null
          model: string | null
          name: string | null
          price_max: number | null
          price_min: number | null
          updated_at: string
          year_min: number | null
        }
        Insert: {
          brand?: string | null
          city?: string | null
          created_at?: string
          email: string
          id?: string
          is_active?: boolean
          last_notified_at?: string | null
          mileage_max?: number | null
          model?: string | null
          name?: string | null
          price_max?: number | null
          price_min?: number | null
          updated_at?: string
          year_min?: number | null
        }
        Update: {
          brand?: string | null
          city?: string | null
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          last_notified_at?: string | null
          mileage_max?: number | null
          model?: string | null
          name?: string | null
          price_max?: number | null
          price_min?: number | null
          updated_at?: string
          year_min?: number | null
        }
        Relationships: []
      }
      vehicle_evaluations: {
        Row: {
          brand: string
          city: string | null
          condition: string
          created_at: string
          email: string | null
          estimated_avg: number | null
          estimated_max: number | null
          estimated_min: number | null
          id: string
          mileage: number
          model: string
          rationale: string | null
          user_id: string | null
          year_model: number
        }
        Insert: {
          brand: string
          city?: string | null
          condition: string
          created_at?: string
          email?: string | null
          estimated_avg?: number | null
          estimated_max?: number | null
          estimated_min?: number | null
          id?: string
          mileage: number
          model: string
          rationale?: string | null
          user_id?: string | null
          year_model: number
        }
        Update: {
          brand?: string
          city?: string | null
          condition?: string
          created_at?: string
          email?: string | null
          estimated_avg?: number | null
          estimated_max?: number | null
          estimated_min?: number | null
          id?: string
          mileage?: number
          model?: string
          rationale?: string | null
          user_id?: string | null
          year_model?: number
        }
        Relationships: []
      }
      vehicle_images: {
        Row: {
          created_at: string
          id: string
          is_main: boolean
          sort_order: number
          url: string
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_main?: boolean
          sort_order?: number
          url: string
          vehicle_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_main?: boolean
          sort_order?: number
          url?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_images_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_views: {
        Row: {
          created_at: string
          id: string
          ip_address: string | null
          vehicle_id: string
          viewer_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          ip_address?: string | null
          vehicle_id: string
          viewer_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          ip_address?: string | null
          vehicle_id?: string
          viewer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_views_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          accepts_trade: boolean
          ai_knowledge_base: string | null
          body_type: string | null
          brand: string
          city: string | null
          color: string | null
          condition: Database["public"]["Enums"]["vehicle_condition"]
          contacts_count: number
          created_at: string
          description: string | null
          doors: number | null
          finances: boolean
          fuel: string | null
          garage_id: string
          id: string
          inspection_approved: boolean
          inspection_pdf_url: string | null
          ipva_paid: boolean
          is_featured: boolean
          licensed: boolean
          manual: boolean
          mileage: number
          model: string
          options: Json
          plate_end: string | null
          price: number
          single_owner: boolean
          spare_key: boolean
          state: string | null
          status: Database["public"]["Enums"]["vehicle_status"]
          title: string
          transmission: string | null
          updated_at: string
          version: string | null
          views_count: number
          warranty: boolean
          year_made: number
          year_model: number
        }
        Insert: {
          accepts_trade?: boolean
          ai_knowledge_base?: string | null
          body_type?: string | null
          brand: string
          city?: string | null
          color?: string | null
          condition?: Database["public"]["Enums"]["vehicle_condition"]
          contacts_count?: number
          created_at?: string
          description?: string | null
          doors?: number | null
          finances?: boolean
          fuel?: string | null
          garage_id: string
          id?: string
          inspection_approved?: boolean
          inspection_pdf_url?: string | null
          ipva_paid?: boolean
          is_featured?: boolean
          licensed?: boolean
          manual?: boolean
          mileage?: number
          model: string
          options?: Json
          plate_end?: string | null
          price: number
          single_owner?: boolean
          spare_key?: boolean
          state?: string | null
          status?: Database["public"]["Enums"]["vehicle_status"]
          title: string
          transmission?: string | null
          updated_at?: string
          version?: string | null
          views_count?: number
          warranty?: boolean
          year_made: number
          year_model: number
        }
        Update: {
          accepts_trade?: boolean
          ai_knowledge_base?: string | null
          body_type?: string | null
          brand?: string
          city?: string | null
          color?: string | null
          condition?: Database["public"]["Enums"]["vehicle_condition"]
          contacts_count?: number
          created_at?: string
          description?: string | null
          doors?: number | null
          finances?: boolean
          fuel?: string | null
          garage_id?: string
          id?: string
          inspection_approved?: boolean
          inspection_pdf_url?: string | null
          ipva_paid?: boolean
          is_featured?: boolean
          licensed?: boolean
          manual?: boolean
          mileage?: number
          model?: string
          options?: Json
          plate_end?: string | null
          price?: number
          single_owner?: boolean
          spare_key?: boolean
          state?: string | null
          status?: Database["public"]["Enums"]["vehicle_status"]
          title?: string
          transmission?: string | null
          updated_at?: string
          version?: string | null
          views_count?: number
          warranty?: boolean
          year_made?: number
          year_model?: number
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_garage_id_fkey"
            columns: ["garage_id"]
            isOneToOne: false
            referencedRelation: "garages"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "garagista" | "cliente"
      lead_origin: "whatsapp" | "formulario" | "telefone" | "contato"
      lead_status: "novo" | "em_atendimento" | "convertido" | "perdido"
      sponsor_tier: "bronze" | "prata" | "ouro" | "platina" | "diamante"
      subscription_status: "ativa" | "pendente" | "vencida" | "cancelada"
      vehicle_condition: "novo" | "seminovo" | "usado"
      vehicle_status: "ativo" | "pausado" | "vendido" | "pendente"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "garagista", "cliente"],
      lead_origin: ["whatsapp", "formulario", "telefone", "contato"],
      lead_status: ["novo", "em_atendimento", "convertido", "perdido"],
      sponsor_tier: ["bronze", "prata", "ouro", "platina", "diamante"],
      subscription_status: ["ativa", "pendente", "vencida", "cancelada"],
      vehicle_condition: ["novo", "seminovo", "usado"],
      vehicle_status: ["ativo", "pausado", "vendido", "pendente"],
    },
  },
} as const
