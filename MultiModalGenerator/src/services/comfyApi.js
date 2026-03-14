// ─────────────────────────────────────────────────────────────────────────────
//  ComfyUI API Service
//
//  COMFYUI_DIRECT  → the real tunnel URL (used for image /view links)
//  COMFYUI_PROXY   → goes through Vite's dev proxy to avoid CORS on /prompt and /history
//
//  When you get a new Cloudflare tunnel URL:
//    1. Update COMFYUI_DIRECT below
//    2. Update the `target` in vite.config.js to match
//    3. Restart the Vite dev server (Ctrl+C then npm run dev)
// ─────────────────────────────────────────────────────────────────────────────

export const COMFYUI_DIRECT = "https://receive-studying-candidates-traveling.trycloudflare.com";
const COMFYUI_PROXY = "/comfyui"; // proxied through Vite to avoid CORS

const CLIENT_ID = crypto.randomUUID();

/**
 * Queue a workflow and return the prompt_id.
 */
export async function queuePrompt(workflow) {
  const response = await fetch(`${COMFYUI_PROXY}/prompt`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "cf-access-client-id": "",
    },
    body: JSON.stringify({ prompt: workflow, client_id: CLIENT_ID }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`ComfyUI error ${response.status}: ${text}`);
  }

  const data = await response.json();
  return data.prompt_id;
}

/**
 * Poll /history until the job completes.
 */
export async function pollHistory(promptId, intervalMs = 2000, timeoutMs = 180_000) {
  const deadline = Date.now() + timeoutMs;

  return new Promise((resolve, reject) => {
    const tick = async () => {
      if (Date.now() > deadline) {
        return reject(new Error("Timed out waiting for ComfyUI (3 min). Is the server still running?"));
      }
      try {
        const res = await fetch(`${COMFYUI_PROXY}/history/${promptId}`);
        if (!res.ok) throw new Error(`History fetch failed: ${res.status}`);
        const history = await res.json();
        if (history[promptId]) {
          const entry = history[promptId];
          if (entry.status?.status_str === "error") {
            return reject(new Error("ComfyUI reported a generation error. Check the ComfyUI logs."));
          }
          return resolve(entry);
        }
      } catch (err) {
        return reject(err);
      }
      setTimeout(tick, intervalMs);
    };
    setTimeout(tick, intervalMs);
  });
}

/**
 * Extract image objects from a history entry.
 */
export function extractImages(historyEntry) {
  const images = [];
  for (const nodeOutput of Object.values(historyEntry?.outputs ?? {})) {
    if (nodeOutput.images) images.push(...nodeOutput.images);
  }
  return images;
}

/**
 * Build a direct image URL (bypasses proxy — used for <img> src and download).
 */
export function imageUrl({ filename, subfolder, type }) {
  const params = new URLSearchParams({ filename, subfolder, type });
  return `${COMFYUI_DIRECT}/view?${params.toString()}`;
}
