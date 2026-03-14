import { queuePrompt, pollHistory, extractImages, imageUrl, COMFYUI_URL } from "./comfyApi";
import workflowTemplate from "../configs/objectWorkflow.json";

/**
 * Run a 3D object generation job on ComfyUI.
 *
 * @param {{
 *   positivePrompt: string,
 *   negativePrompt: string,
 *   cfg:            number,
 *   steps:          number,
 *   meshStyle:      string,
 *   seed:           string,
 * }} params
 *
 * @param {function} onProgress - called with "queued" | "complete"
 * @returns {Promise<{ images: string[], glbUrl: string | null }>}
 */
export async function generateObject(params, onProgress = () => {}) {
  const { positivePrompt, negativePrompt, cfg, steps, seed } = params;

  const workflow = JSON.parse(JSON.stringify(workflowTemplate));

  // ── Image generation stage (node 103 KSamplerAdvanced) ───────────────────
  workflow["103"].inputs.cfg          = Number(cfg);
  workflow["103"].inputs.steps        = Number(steps);
  workflow["103"].inputs.noise_seed   = parseInt(seed, 10) || Math.floor(Math.random() * 1e15);

  // ── 3D generation stage (node 3 KSampler) ────────────────────────────────
  workflow["3"].inputs.seed           = parseInt(seed, 10) || Math.floor(Math.random() * 1e15);
  workflow["3"].inputs.cfg            = Number(cfg);
  workflow["3"].inputs.steps          = Number(steps);

  // ── Prompts ───────────────────────────────────────────────────────────────
  workflow["101"].inputs.text = positivePrompt;
  workflow["100"].inputs.text = negativePrompt;

  const promptId     = await queuePrompt(workflow);
  onProgress("queued");

  const historyEntry = await pollHistory(promptId, 3000, 600_000); // 10 min timeout for 3D
  onProgress("complete");

  // ── Extract preview images (from SaveImage nodes) ─────────────────────────
  const images = extractImages(historyEntry);
  const imageUrls = images.map(imageUrl);

  // ── Extract GLB file URL (from SaveGLB node 82) ───────────────────────────
  let glbUrl = null;
  const outputs = historyEntry?.outputs ?? {};
  if (outputs["82"]?.meshes?.[0]) {
    const mesh = outputs["82"].meshes[0];
    const params = new URLSearchParams({
      filename: mesh.filename,
      subfolder: mesh.subfolder,
      type: mesh.type,
    });
    
    glbUrl = `${COMFYUI_URL}/view?${params.toString()}`;
  }

  return { images: imageUrls, glbUrl };
}