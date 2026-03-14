import { queuePrompt, pollHistory, extractImages, imageUrl } from "./comfyApi";
import workflowTemplate from "../configs/imageWorkflow.json";

const RATIO_DIMENSIONS = {
  "1:1":  { width: 512,  height: 512  },
  "4:3":  { width: 768,  height: 576  },
  "16:9": { width: 768,  height: 432  },
  "9:16": { width: 432,  height: 768  },
  "3:2":  { width: 768,  height: 512  },
  "2:3":  { width: 512,  height: 768  },
};

/**
 * @param {object} params         - form values
 * @param {function} onProgress   - called with "queued" | "complete"
 */
export async function generateImage(params, onProgress = () => {}) {
  const { positivePrompt, negativePrompt, cfg, steps, sampler, aspectRatio, seed } = params;

  const workflow = JSON.parse(JSON.stringify(workflowTemplate));

  workflow["3"].inputs.seed         = parseInt(seed, 10) || Math.floor(Math.random() * 1e15);
  workflow["3"].inputs.steps        = Number(steps);
  workflow["3"].inputs.cfg          = Number(cfg);
  // sampler_name kept as-is from the workflow JSON template — not overridden by UI

  const dims = RATIO_DIMENSIONS[aspectRatio] ?? RATIO_DIMENSIONS["1:1"];
  workflow["5"].inputs.width  = dims.width;
  workflow["5"].inputs.height = dims.height;

  workflow["6"].inputs.text = positivePrompt;
  workflow["7"].inputs.text = negativePrompt;

  const promptId = await queuePrompt(workflow);
  onProgress("queued");

  const historyEntry = await pollHistory(promptId);
  onProgress("complete");

  const images = extractImages(historyEntry);
  if (images.length === 0) throw new Error("No images returned by ComfyUI.");

  return images.map(imageUrl);
}