export const inputConfig = {
  //   resume_run: false,
  //   run_to_resume: 'latest',
  //   retain_overwritten_frames: false,
  //   intermediate_saves: 0,
  //   intermediates_in_subfolder: true,
  //   console_preview: false,
  //   console_preview_width: 80,
  //   display_rate: 50,
  //   config_file: null,

  //seed
  seed_type: {
    type: "string",
    default: "random_seed",
    label: "Seed Type",
  },
  seed_value: {
    type: "integer",
    default: 123456,
    label: "Seed Value",
  },

  //general run
  batch_name: {
    type: "string",
    default: "TimeToDisco",
    label: "Batch Name",
  },
  n_batches: {
    type: "integer",
    default: 150,
    label: "Images Per Batch",
  },
  width: {
    type: "integer",
    default: 1280,
    label: "Width",
  },
  height: {
    type: "integer",
    default: 768,
    label: "Height",
  },
  steps: {
    type: "integer",
    default: 250,
    label: "Steps",
  },

  // prompt

  prompt_type: "single",

  text_prompts: {
    type: "json",
    default: [
      {
        startFrame: 0,
        weight: 1,
        prompt:
          "A beautiful painting of a singular lighthouse, shining its light across a tumultuous sea of blood by greg rutkowski and thomas kinkade, Trending on artstation.",
      },
      {
        startFrame: 0,
        weight: 2,
        prompt: "Yellow color scheme, this prompt is twice as important as the first",
      },
    ],
    label: "Text Prompts",
  },

  //   prompt_salad: false,
  //   prompt_salad_template:
  //     '{colors} {things} in the {custom/customword} shape of {shapes}, art by {artists}',
  //   prompt_salad_amount: 5,

  //   fuzzy_prompt: false,
  init_image: {
    default: null,
    type: "string",
    label: "Init Image Path",
  },
  //   skip_steps: 0,
  init_generator: {
    default: "perlin",
    type: "select",
    options: ["perlin", "voronoi"],
    label: "Initial Noise Type",
  },
  perlin_init: {
    default: false,
    type: "boolean",
    label: "Perlin Init",
  },
  perlin_mode: {
    default: "mixed",
    type: "select",
    options: ["mixed", "color", "gray"],
    label: "Perlin Mode",
  },
  voronoi_points: {
    default: 20,
    type: "integer",
    label: "Number of Voronoi Points",
  },
  voronoi_palette: {
    default: "default.yml",
    type: "string",
    label: "Voronoi Palette",
  },
  //   target_image: null,
  //   target_scale: 20000,

  // models
  RN50: { type: "boolean", default: true },
  RN101: { type: "boolean", default: false },
  RN50x64: { type: "boolean", default: false },
  RN50x16: { type: "boolean", default: false },
  RN50x4: { type: "boolean", default: false },
  ViTB16: { type: "boolean", default: true },
  ViTB32: { type: "boolean", default: true },
  ViTL14: { type: "boolean", default: false },
  ViTL14_336: { type: "boolean", default: false },
  use_secondary_model: { type: "boolean", default: true, label: "Use Secondary Model" },
  diffusion_model: {
    type: "select",
    default: "512x512_diffusion_uncond_finetune_008100",
    options: ["512x512_diffusion_uncond_finetune_008100", "256x256_diffusion_uncond"],
    label: "Diffusion Model",
  },
  randomize_class: { type: "boolean", default: true, label: "Randomize Class" },

  // cut stuff
  cutn_batches: { default: 4, type: "integer", label: "Number Cut Batches" },
  clip_guidance_scale: { default: 5000, type: "integer", label: "Clip Guidance Scale" },
  cut_overview: { default: "[12]*400+[4]*600", type: "string", label: "Cut Overview" },
  cut_innercut: { default: "[4]*400+[12]*600", type: "string", label: "Cut Innercut" },
  cut_icgray_p: { default: "[0.2]*400+[0]*600", type: "string", label: "Cut IC Power" },
  cut_ic_pow: { default: 1, type: "integer", label: "Cut IC Power" },
  eta: { default: 0.8, type: "float", label: "ETA" },
  clamp_grad: { default: true, type: "boolean", label: "Clamp Grad" },
  clamp_max: { default: 0.05, type: "float", label: "Clamp Max" },
  clip_denoised: { default: false, type: "boolean", label: "Clip Denoised" },
  rand_mag: { default: 0.05, type: "float", label: "Random Mag" },
  tv_scale: { default: 0, type: "integer", label: "TV Scale" },
  range_scale: { default: 150, type: "integer", label: "Range Scale" },
  sat_scale: { default: 0, type: "integer", label: "Sat Scale" },
  skip_augs: { default: false, type: "boolean", label: "Skip Augs" },

  //symmetry
  symmetry_loss: { default: false, type: "boolean", label: "Use Horizontal Symmetry" },
  v_symmetry_loss: { default: false, type: "boolean", label: "Use Vertical Symmetry" },

  symmetry_loss_scale: { default: 1500, type: "integer", label: "H Symmetry Loss Scale" },
  v_symmetry_loss_scale: { default: 1500, type: "integer", label: "V Symmetry Loss Scale" },
  symmetry_switch: { default: 40, type: "integer", label: "H Symmetry Switch" },
  v_symmetry_switch: { default: 40, type: "integer", label: "V Symmetry Switch" },

  // animation
  animation: { default: false, type: "boolean", label: "Enable Animation" },
  animation_mode: {
    type: "select",
    default: "2D",
    options: ["2D", "3D", "Video Input"],
    label: "Animation Mode",
  },
  video_init_path: { default: "training.mp4", type: "string", label: "Video Init Path" },
  extract_nth_frame: { default: 10, type: "integer", label: "Extract Nth Frame" },
  video_init_seed_continuity: {
    default: true,
    type: "boolean",
    label: "Video Init Seed Continuity",
  },
  key_frames: { default: true, type: "boolean", label: "Key Frames" },
  max_frames: { default: 10000, type: "integer", label: "Max Frames" },
  interp_spline: {
    default: "Linear",
    type: "select",
    options: ["Linear", "Quadratic", "Cubic"],
    label: "Interp Spline",
  },
  frames_skip_steps: { default: "60%", type: "string", label: "Frame Skip Steps" },
  vr_mode: { default: false, type: "boolean", label: "VR Mode" },
  angle: { default: "0:(0)", type: "string", label: "Angle" },
  zoom: { default: "0:(1),10:(1.05)", type: "string", label: "Zoom" },
  translation_x: { default: "0: (0)", type: "string", label: "Translation X" },
  translation_y: { default: "0: (0)", type: "string", label: "Translation Y" },
  translation_z: { default: "0: (10.0)", type: "string", label: "Translation Z" },
  rotation_3d_x: { default: "0: (0)", type: "string", label: "3D Rotation X" },
  rotation_3d_y: { default: "0: (0)", type: "string", label: "3D Rotation Y" },
  rotation_3d_z: { default: "0: (0)", type: "string", label: "3D Rotation Z" },
  midas_depth_model: { default: "dpt_large", type: "string", label: "Midas Depth Model" },
  midas_weight: { default: 0.3, type: "float", label: "Midas Weight" },
  near_plane: { default: 0, type: "float", label: "Near Plane" },
  far_plane: { default: 0, type: "integer", label: "Far Plane" },
  fov: { default: 0, type: "integer", label: "FOV" },
  padding_mode: { default: "border", type: "string", label: "Padding Mode" },
  sampling_mode: { default: "bicubic", type: "string", label: "Sampling Mode" },
  turbo_mode: { default: false, type: "boolean", label: "Turbo Mode" },
  turbo_steps: { default: 3, type: "integer", label: "Turbo Steps" },
  turbo_preroll: { default: 10, type: "integer", label: "Turbo Pre-Roll" },
  frames_scale: { default: 1500, type: "integer", label: "Frames Scale" },

  //twilio
  twilio_account_sid: { default: "", type: "string", label: "Twilio Account SID" },
  twilio_auth_token: { default: "", type: "string", label: "Twilio Auth Token" },
  twilio_from: { default: "", type: "string", label: "Twilio From" },
  twilio_to: { default: "", type: "string", label: "Twilio To" },

  //generate many jobs
  modifiers: {},
  multipliers: {},

  // misc
  save_metadata: false,

  init_images: "init_images",
  images_out: "images_out",

  model_path: "models",
  prompt_salad_path: "prompt_salad",

  cuda_device: { default: 0, type: "integer", label: "Cuda Device ID" },

  gen_config: "AUTO",
  gen_config_only: false,
  use_checkpoint: true,
  cutout_debug: false,
  image_prompts: {},
}
