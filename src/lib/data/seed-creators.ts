/**
 * Seed Creator Profiles & AI Portfolio Items
 *
 * NOTE: All creator profiles, claims, metrics, and workflows in this file
 * are provided strictly for demonstration and testing purposes.
 * As per policy, these represent self-reported sample submissions
 * and are NOT independently verified.
 */

import type { CreatorWithDetails } from "@/types";

export const SEED_CREATORS: CreatorWithDetails[] = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    tagline: "Next-generation cinematic AI commercials & photorealistic VFX",
    specializations: ["cinematic_video", "product_render", "vfx_composite"],
    primary_ai_tools: ["runway_gen3", "kling_ai", "flux_1", "comfy_ui"],
    custom_workflow_summary:
      "FLUX.1 [dev] keyframe synthesis with custom LoRA nodes -> Kling 1.5 camera motion interpolation -> Runway Gen-3 Alpha upscaling & DaVinci Resolve color grading.",
    hardware_specs: "Dual NVIDIA RTX 4090 24GB, 128GB DDR5 RAM",
    commercial_terms:
      "Full commercial buyout included. Delivery includes 4K ProRes masters, generation parameter metadata, and up to 2 revisions.",
    starting_rate_cents: 120000, // $1,200
    currency: "USD",
    verification_status: "verified",
    is_available: true,
    verifications: [
      {
        id: "v0000000-0000-0000-0000-000000000001",
        creator_id: "00000000-0000-0000-0000-000000000001",
        status: "verified",
        evidence_type: "workflow_screen_recording",
        evidence_url: "https://evidence.prismora.ai/screencasts/aetheris-flux-comfyui-live.mp4",
        notes: "Live screencast demonstrating FLUX.1 + custom ComfyUI LoRA generation with raw node pipeline and terminal seeds.",
        reviewed_by: "00000000-0000-0000-0000-000000000099",
        reviewed_at: "2026-10-07T14:00:00Z",
        created_at: "2026-10-06T10:00:00Z",
        updated_at: "2026-10-07T14:00:00Z",
      },
      {
        id: "v0000000-0000-0000-0000-000000000002",
        creator_id: "00000000-0000-0000-0000-000000000001",
        status: "verified",
        evidence_type: "past_work_client_delivery",
        evidence_url: "https://evidence.prismora.ai/deliveries/obsidian-zenith-prores4k-receipt.pdf",
        notes: "Client delivery receipt and 4K ProRes master file checksums for Obsidian Zenith luxury timepiece commercial.",
        reviewed_by: "00000000-0000-0000-0000-000000000099",
        reviewed_at: "2026-10-07T14:15:00Z",
        created_at: "2026-10-06T10:30:00Z",
        updated_at: "2026-10-07T14:15:00Z",
      },
    ],
    created_at: "2026-10-01T10:00:00Z",
    updated_at: "2026-10-08T12:00:00Z",
    profile: {
      id: "00000000-0000-0000-0000-000000000001",
      role: "creator",
      full_name: "Elena Rostova",
      display_name: "Aetheris Studios",
      handle: "aetheris",
      avatar_url:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      bio: "Cinematic AI director specializing in photorealistic commercial spots, luxury product reveals, and high-framerate fluid dynamics.",
      location: "San Francisco, CA",
      website_url: "https://aetheris.ai",
      created_at: "2026-10-01T10:00:00Z",
      updated_at: "2026-10-08T12:00:00Z",
    },
    portfolio_items: [
      {
        id: "p0000000-0000-0000-0000-000000000001",
        creator_id: "00000000-0000-0000-0000-000000000001",
        title: "Obsidian Zenith: Luxury Timepiece Spec Commercial",
        description:
          "Macro cinematography spec commercial highlighting ceramic chronometer surfaces, liquid light caustics, and tourbillon movement.",
        content_type: "video",
        media_url:
          "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        thumbnail_url:
          "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
        aspect_ratio: "16:9",
        ai_tools_used: ["runway_gen3", "flux_1", "comfy_ui"],
        generation_parameters: {
          sampler: "dpmpp_2m_sde",
          steps: 40,
          cfg_scale: 6.5,
          motion_bucket: 175,
          base_model: "FLUX.1 [dev]",
          upscaler: "Topaz Video AI 4x",
        },
        workflow_breakdown:
          "1. Generated 4K hero product angles in FLUX.1 using custom depth ControlNet.\n2. Injected into Runway Gen-3 Alpha Turbo with prompt: 'Camera slow 360 orbit around obsidian watch face, cinematic anamorphic bokeh, 60fps'.\n3. Upscaled and color-timed in DaVinci Resolve.",
        commercial_rights_granted: "full_buyout",
        is_featured: true,
        view_count: 342,
        created_at: "2026-10-02T14:30:00Z",
        updated_at: "2026-10-02T14:30:00Z",
      },
      {
        id: "p0000000-0000-0000-0000-000000000002",
        creator_id: "00000000-0000-0000-0000-000000000001",
        title: "Neo-Kyoto 2088: Architectural Hologram Flythrough",
        description:
          "Atmospheric cyberpunk architectural visual exploring elevated skywalks, holographic rain reflections, and neon fog diffusion.",
        content_type: "video",
        media_url:
          "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        thumbnail_url:
          "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80",
        aspect_ratio: "16:9",
        ai_tools_used: ["kling_ai", "flux_1", "comfy_ui"],
        generation_parameters: {
          model: "Kling 1.5 Pro",
          mode: "text-to-video-camera-path",
          prompt_strength: 0.85,
          seed: 48920193,
        },
        workflow_breakdown:
          "Initial structural framing rendered through ComfyUI SDXL LoRA stack, animated via Kling 1.5 Pro camera tracking path, composited with synthesized binaural city ambience.",
        commercial_rights_granted: "social_media_ads",
        is_featured: false,
        view_count: 215,
        created_at: "2026-10-04T09:15:00Z",
        updated_at: "2026-10-04T09:15:00Z",
      },
      {
        id: "p0000000-0000-0000-0000-000000000003",
        creator_id: "00000000-0000-0000-0000-000000000001",
        title: "AeroPulse Electric Hypercar: Aerodynamic Windtunnel Study",
        description:
          "Precision product visualization of carbon-fiber vehicle chassis under fluorescent aerodynamic smoke tests.",
        content_type: "image",
        media_url:
          "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80",
        thumbnail_url:
          "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80",
        aspect_ratio: "21:9",
        ai_tools_used: ["flux_1", "comfy_ui"],
        generation_parameters: {
          sampler: "euler_ancestral",
          steps: 50,
          aspect: "21:9",
          lora_weights: ["automotive_carbon_fiber:0.7", "studio_hard_light:0.5"],
        },
        workflow_breakdown:
          "Rendered via ComfyUI with multi-pass regional prompting for illuminated aerodynamic smoke lines and carbon texture reflection passes.",
        commercial_rights_granted: "full_buyout",
        is_featured: true,
        view_count: 512,
        created_at: "2026-10-06T16:00:00Z",
        updated_at: "2026-10-06T16:00:00Z",
      },
    ],
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    tagline: "AI Fashion Editorial Director & Consistent Character Stylist",
    specializations: ["character_design", "virtual_influencer", "concept_art"],
    primary_ai_tools: ["midjourney_v6", "flux_1", "comfy_ui"],
    custom_workflow_summary:
      "Consistent facial structure LoRA training -> Midjourney v6.1 editorial lighting -> Inpainting detail passes in ComfyUI -> Magnific AI texture refinement.",
    hardware_specs: "NVIDIA RTX 4080 16GB, Apple M3 Max 64GB",
    commercial_terms:
      "Full digital rights for marketing and e-commerce campaigns. Raw high-resolution PNGs delivered with transparency cutouts if requested.",
    starting_rate_cents: 85000, // $850
    currency: "USD",
    verification_status: "pending",
    is_available: true,
    verifications: [
      {
        id: "v0000000-0000-0000-0000-000000000003",
        creator_id: "00000000-0000-0000-0000-000000000002",
        status: "pending",
        evidence_type: "node_graph_snapshot",
        evidence_url: "https://evidence.prismora.ai/uploads/synthcraft-ipadapter-graph.png",
        notes: "Submitted ComfyUI IP-Adapter node graph and LoRA checkpoint hashes for virtual influencer consistency audit.",
        reviewed_by: null,
        reviewed_at: null,
        created_at: "2026-10-08T09:30:00Z",
        updated_at: "2026-10-08T09:30:00Z",
      },
    ],
    created_at: "2026-10-02T11:00:00Z",
    updated_at: "2026-10-07T14:30:00Z",
    profile: {
      id: "00000000-0000-0000-0000-000000000002",
      role: "creator",
      full_name: "Maya Chen",
      display_name: "SynthCraft Studio",
      handle: "synthcraft",
      avatar_url:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
      bio: "Editorial fashion creator developing consistent virtual ambassadors, synthetic garment collections, and haute couture brand campaigns.",
      location: "New York, NY",
      website_url: "https://synthcraft.design",
      created_at: "2026-10-02T11:00:00Z",
      updated_at: "2026-10-07T14:30:00Z",
    },
    portfolio_items: [
      {
        id: "p0000000-0000-0000-0000-000000000004",
        creator_id: "00000000-0000-0000-0000-000000000002",
        title: "Luminary Couture: Autumn / Winter 2026 Synthetic Editorial",
        description:
          "High-fashion editorial campaign featuring layered metallic silks, avant-garde architectural headwear, and volumetric studio lighting.",
        content_type: "image",
        media_url:
          "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80",
        thumbnail_url:
          "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80",
        aspect_ratio: "4:5",
        ai_tools_used: ["midjourney_v6", "flux_1"],
        generation_parameters: {
          engine: "Midjourney v6.1",
          stylize: 250,
          chaos: 10,
          aspect: "4:5",
          refiner: "FLUX.1 [dev] skin texture pass",
        },
        workflow_breakdown:
          "Prompted base wardrobe silhouettes in Midjourney v6.1 with Hasselblad medium format color science, touched up seam lines and skin micro-texture in Photoshop & ComfyUI.",
        commercial_rights_granted: "full_buyout",
        is_featured: true,
        view_count: 489,
        created_at: "2026-10-03T18:00:00Z",
        updated_at: "2026-10-03T18:00:00Z",
      },
      {
        id: "p0000000-0000-0000-0000-000000000005",
        creator_id: "00000000-0000-0000-0000-000000000002",
        title: "Aria Vance: Consistent Virtual Brand Persona for Social Ads",
        description:
          "A multi-shot character identity study maintaining identical facial bone structure and wardrobe palette across diverse camera angles.",
        content_type: "image",
        media_url:
          "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
        thumbnail_url:
          "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
        aspect_ratio: "9:16",
        ai_tools_used: ["flux_1", "comfy_ui"],
        generation_parameters: {
          base_model: "FLUX.1 [dev]",
          lora: "Custom Aria Vance Identity v3 @ 0.85 weight",
          steps: 32,
        },
        workflow_breakdown:
          "Custom trained character LoRA deployed on FLUX.1. Enabled IP-Adapter reference conditioning to ensure 100% facial and hair consistency for ongoing social media ad series.",
        commercial_rights_granted: "digital_only",
        is_featured: false,
        view_count: 310,
        created_at: "2026-10-05T12:00:00Z",
        updated_at: "2026-10-05T12:00:00Z",
      },
    ],
  },
  {
    id: "00000000-0000-0000-0000-000000000003",
    tagline: "Hybrid 3D Generative Motion, Product Simulations & Kinetic Typography",
    specializations: ["motion_graphics", "3d", "vfx_composite"],
    primary_ai_tools: ["luma_dream_machine", "comfy_ui", "runway_gen3"],
    custom_workflow_summary:
      "Cinema 4D geometry proxies -> ComfyUI ControlNet normal/depth conditioning -> Luma Dream Machine camera moves -> After Effects compositing.",
    hardware_specs: "NVIDIA RTX 4090 24GB + 64GB DDR5",
    commercial_terms:
      "Broadcast-ready deliverables with alpha channels and 3D depth passes included.",
    starting_rate_cents: 95000, // $950
    currency: "USD",
    verification_status: "unverified",
    is_available: true,
    verifications: [
      {
        id: "v0000000-0000-0000-0000-000000000004",
        creator_id: "00000000-0000-0000-0000-000000000003",
        status: "unverified",
        evidence_type: "self_declared_submission",
        evidence_url: "https://evidence.prismora.ai/uploads/voxelsurge-submission-draft.txt",
        notes: "Self-declared pipeline description submitted without raw project files, screencasts, or verified deliverables.",
        reviewed_by: null,
        reviewed_at: null,
        created_at: "2026-10-07T11:00:00Z",
        updated_at: "2026-10-07T11:00:00Z",
      },
    ],
    created_at: "2026-10-03T15:20:00Z",
    updated_at: "2026-10-08T09:10:00Z",
    profile: {
      id: "00000000-0000-0000-0000-000000000003",
      role: "creator",
      full_name: "Leo Tanaka",
      display_name: "VoxelSurge FX",
      handle: "voxelsurge",
      avatar_url:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      bio: "Motion designer bridging generative neural networks with traditional 3D pipelines for tech product reveals and futuristic brand idents.",
      location: "Tokyo, Japan",
      website_url: "https://voxelsurge.io",
      created_at: "2026-10-03T15:20:00Z",
      updated_at: "2026-10-08T09:10:00Z",
    },
    portfolio_items: [
      {
        id: "p0000000-0000-0000-0000-000000000006",
        creator_id: "00000000-0000-0000-0000-000000000003",
        title: "Holographic Kinetic Sneaker: Exploded Cushion Assembly",
        description:
          "Exploded view product animation breaking down kinetic air-cushion polymers and responsive carbon soles.",
        content_type: "video",
        media_url:
          "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
        thumbnail_url:
          "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80",
        aspect_ratio: "1:1",
        ai_tools_used: ["luma_dream_machine", "comfy_ui"],
        generation_parameters: {
          guidance: 7.0,
          motion_vector: "camera_spiral_upwards",
          frames: 120,
        },
        workflow_breakdown:
          "Built low-poly proxy in Blender, exported depth passes to ComfyUI, animated with Luma Dream Machine 1.5, combined with glitch typography in After Effects.",
        commercial_rights_granted: "full_buyout",
        is_featured: true,
        view_count: 620,
        created_at: "2026-10-04T11:00:00Z",
        updated_at: "2026-10-04T11:00:00Z",
      },
    ],
  },
  {
    id: "00000000-0000-0000-0000-000000000004",
    tagline: "Experimental AI Audio & Voiceover Soundscapes",
    specializations: ["voice_audio", "concept_art"],
    primary_ai_tools: ["eleven_labs", "suno", "midjourney_v6"],
    custom_workflow_summary:
      "ElevenLabs voice design cloned from licensed voice actors -> Suno acoustic bed generation -> Audition multi-track mastering.",
    hardware_specs: "Mac Studio M2 Ultra, Focusrite Clarett+",
    commercial_terms:
      "Worldwide advertising rights including TV, streaming, and podcast ad usage.",
    starting_rate_cents: 45000, // $450
    currency: "USD",
    verification_status: "unverified",
    is_available: false, // Currently busy
    created_at: "2026-10-05T08:00:00Z",
    updated_at: "2026-10-05T08:00:00Z",
    profile: {
      id: "00000000-0000-0000-0000-000000000004",
      role: "creator",
      full_name: "Marcus Finch",
      display_name: "Finch Sound Design",
      handle: "finch_sound",
      avatar_url:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
      bio: "Audio producer and neural synthesis sound designer crafting brand sonic identities, custom AI voiceovers, and ambient scores.",
      location: "London, UK",
      website_url: "https://finchsound.co.uk",
      created_at: "2026-10-05T08:00:00Z",
      updated_at: "2026-10-05T08:00:00Z",
    },
    // Intentionally empty portfolio array to test Empty State!
    portfolio_items: [],
    // Intentionally empty verifications array to test Missing-Evidence Case!
    verifications: [],
  },
];
