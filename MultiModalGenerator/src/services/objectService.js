import { queuePrompt, pollHistory, extractImages, imageUrl, COMFYUI_URL } from "./comfyApi";
import workflowTemplate from "../configs/objectWorkflow.json";

/**
 * Run a 3D object generation job on ComfyUI.
 * Stage 1: Generate image with dreamshaper_8 + LoRA (nodes 98-104)
 * Stage 2: Remove background (node 92)
 * Stage 3: Generate 3D mesh with Hunyuan3D (nodes 54-82)
 *
 * @param {object} params
 * @param {function} onProgress - called with "queued" | "complete"
 * @returns {Promise<{ images: string[], glbUrl: string | null }>}
 */
export async function generateObject(params, onProgress = () => {}) {
  const { positivePrompt, negativePrompt, cfg, steps, seed } = params;

  const workflow = JSON.parse(JSON.stringify(workflowTemplate));

  // ── Image generation stage ────────────────────────────────────────────────
  // Node 103: KSamplerAdvanced
  workflow["103"].inputs.cfg              = Number(cfg);
  workflow["103"].inputs.steps            = Number(steps);
  workflow["103"].inputs.noise_seed       = parseInt(seed, 10) || Math.floor(Math.random() * 1e15);

  // Node 101: Positive prompt
  workflow["101"].inputs.text = positivePrompt;
  // Node 100: Negative prompt
  workflow["100"].inputs.text = negativePrompt;

  // ── 3D generation stage ───────────────────────────────────────────────────
  // Node 3: KSampler (Hunyuan3D diffusion)
  workflow["3"].inputs.seed  = parseInt(seed, 10) || Math.floor(Math.random() * 1e15);
  workflow["3"].inputs.cfg   = Number(cfg);
  workflow["3"].inputs.steps = Number(steps);

  // ── Queue and poll ────────────────────────────────────────────────────────
  const promptId     = await queuePrompt(workflow);
  onProgress("queued");

  const historyEntry = await pollHistory(promptId, 5000, 1_800_000); // 30 min timeout
  onProgress("complete");

  // ── Extract preview images ────────────────────────────────────────────────
  const images    = extractImages(historyEntry);
  const imageUrls = images.map(imageUrl);

  // ── Extract GLB file URL from SaveGLB node 82 ────────────────────────────
  let glbUrl = null;
  const outputs = historyEntry?.outputs ?? {};

  if (outputs["82"]?.meshes?.[0]) {
    const mesh       = outputs["82"].meshes[0];
    const meshParams = new URLSearchParams({
      filename:  mesh.filename,
      subfolder: mesh.subfolder,
      type:      mesh.type,
    });
    glbUrl = `${COMFYUI_URL}/view?${meshParams.toString()}`;
  }

  return { images: imageUrls, glbUrl };
}