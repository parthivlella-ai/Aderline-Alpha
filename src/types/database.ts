/**
 * Supabase Database Schema Definitions for Prismora
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "creator" | "brand_agency" | "admin";
export type ContentType = "video" | "image" | "audio" | "3d" | "multi_modal";
export type AspectRatio = "16:9" | "9:16" | "1:1" | "4:5" | "21:9";
export type CommercialLicenseType =
  | "full_buyout"
  | "digital_only"
  | "broadcast"
  | "social_media_ads"
  | "non_commercial";
export type VerificationStatus = "unverified" | "pending" | "verified" | "rejected";
export type BriefStatus = "draft" | "open" | "in_review" | "assigned" | "completed" | "cancelled";
export type EngagementStatus =
  | "proposed"
  | "accepted"
  | "in_progress"
  | "submitted"
  | "revision_requested"
  | "approved"
  | "completed"
  | "declined";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: UserRole;
          full_name: string;
          display_name: string;
          handle: string;
          avatar_url: string | null;
          bio: string | null;
          location: string | null;
          website_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role?: UserRole;
          full_name: string;
          display_name: string;
          handle: string;
          avatar_url?: string | null;
          bio?: string | null;
          location?: string | null;
          website_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          role?: UserRole;
          full_name?: string;
          display_name?: string;
          handle?: string;
          avatar_url?: string | null;
          bio?: string | null;
          location?: string | null;
          website_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      creator_profiles: {
        Row: {
          id: string;
          tagline: string | null;
          specializations: string[];
          primary_ai_tools: string[];
          custom_workflow_summary: string | null;
          hardware_specs: string | null;
          commercial_terms: string | null;
          starting_rate_cents: number;
          currency: string;
          verification_status: VerificationStatus;
          is_available: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          tagline?: string | null;
          specializations?: string[];
          primary_ai_tools?: string[];
          custom_workflow_summary?: string | null;
          hardware_specs?: string | null;
          commercial_terms?: string | null;
          starting_rate_cents?: number;
          currency?: string;
          verification_status?: VerificationStatus;
          is_available?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tagline?: string | null;
          specializations?: string[];
          primary_ai_tools?: string[];
          custom_workflow_summary?: string | null;
          hardware_specs?: string | null;
          commercial_terms?: string | null;
          starting_rate_cents?: number;
          currency?: string;
          verification_status?: VerificationStatus;
          is_available?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      portfolio_items: {
        Row: {
          id: string;
          creator_id: string;
          title: string;
          description: string | null;
          content_type: ContentType;
          media_url: string;
          thumbnail_url: string | null;
          aspect_ratio: AspectRatio;
          ai_tools_used: string[];
          generation_parameters: Json;
          workflow_breakdown: string | null;
          commercial_rights_granted: CommercialLicenseType;
          is_featured: boolean;
          view_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          creator_id: string;
          title: string;
          description?: string | null;
          content_type: ContentType;
          media_url: string;
          thumbnail_url?: string | null;
          aspect_ratio?: AspectRatio;
          ai_tools_used?: string[];
          generation_parameters?: Json;
          workflow_breakdown?: string | null;
          commercial_rights_granted?: CommercialLicenseType;
          is_featured?: boolean;
          view_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          creator_id?: string;
          title?: string;
          description?: string | null;
          content_type?: ContentType;
          media_url?: string;
          thumbnail_url?: string | null;
          aspect_ratio?: AspectRatio;
          ai_tools_used?: string[];
          generation_parameters?: Json;
          workflow_breakdown?: string | null;
          commercial_rights_granted?: CommercialLicenseType;
          is_featured?: boolean;
          view_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      brand_briefs: {
        Row: {
          id: string;
          brand_id: string;
          title: string;
          company_name: string;
          description: string;
          campaign_goals: string;
          target_content_type: ContentType;
          preferred_style: string | null;
          preferred_aspect_ratio: AspectRatio;
          required_ai_tools: string[];
          commercial_use_requirements: CommercialLicenseType;
          budget_min_cents: number;
          budget_max_cents: number;
          currency: string;
          deadline: string | null;
          status: BriefStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          brand_id: string;
          title: string;
          company_name: string;
          description: string;
          campaign_goals: string;
          target_content_type: ContentType;
          preferred_style?: string | null;
          preferred_aspect_ratio?: AspectRatio;
          required_ai_tools?: string[];
          commercial_use_requirements?: CommercialLicenseType;
          budget_min_cents: number;
          budget_max_cents: number;
          currency?: string;
          deadline?: string | null;
          status?: BriefStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          brand_id?: string;
          title?: string;
          company_name?: string;
          description?: string;
          campaign_goals?: string;
          target_content_type?: ContentType;
          preferred_style?: string | null;
          preferred_aspect_ratio?: AspectRatio;
          required_ai_tools?: string[];
          commercial_use_requirements?: CommercialLicenseType;
          budget_min_cents?: number;
          budget_max_cents?: number;
          currency?: string;
          deadline?: string | null;
          status?: BriefStatus;
          created_at?: string;
          updated_at?: string;
        };
      };
      creator_verifications: {
        Row: {
          id: string;
          creator_id: string;
          status: VerificationStatus;
          evidence_type: string;
          evidence_url: string;
          notes: string | null;
          reviewed_by: string | null;
          reviewed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          creator_id: string;
          status?: VerificationStatus;
          evidence_type: string;
          evidence_url: string;
          notes?: string | null;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          creator_id?: string;
          status?: VerificationStatus;
          evidence_type?: string;
          evidence_url?: string;
          notes?: string | null;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      engagements: {
        Row: {
          id: string;
          brief_id: string | null;
          brand_id: string;
          creator_id: string;
          status: EngagementStatus;
          agreed_price_cents: number;
          currency: string;
          deliverables_summary: string;
          revision_limit: number;
          commercial_license: CommercialLicenseType;
          deadline: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          brief_id?: string | null;
          brand_id: string;
          creator_id: string;
          status?: EngagementStatus;
          agreed_price_cents: number;
          currency?: string;
          deliverables_summary: string;
          revision_limit?: number;
          commercial_license?: CommercialLicenseType;
          deadline?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          brief_id?: string | null;
          brand_id?: string;
          creator_id?: string;
          status?: EngagementStatus;
          agreed_price_cents?: number;
          currency?: string;
          deliverables_summary?: string;
          revision_limit?: number;
          commercial_license?: CommercialLicenseType;
          deadline?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
