// ─────────────────────────────────────────────────────────────────────────────
//  ComfyUI API Service
//
//  When you get a new Cloudflare tunnel URL, update COMFYUI_URL below.
//  Then:
//    - Also update the `target` in vite.config.js to match (for local dev)
//    - Restart Vite dev server (Ctrl+C then npm run dev)
// ─────────────────────────────────────────────────────────────────────────────

export const COMFYUI_URL = "https://comfy.abhinish.dev";

const IS_DEV = import.meta.env.DEV;
const BASE   = IS_DEV ? "/comfyui" : COMFYUI_URL;

const CLIENT_ID = crypto.randomUUID();

// Single fetch with timeout — prevents hanging connections through Cloudflare tunnel
async function fetchWithTimeout(url, options = {}, timeoutMs = 10_000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(timer);
  }
}

export async function queuePrompt(workflow) {
  const response = await fetchWithTimeout(`${BASE}/prompt`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: workflow, client_id: CLIENT_ID }),
  }, 15_000);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`ComfyUI error ${response.status}: ${text}`);
  }

  const data = await response.json();
  return data.prompt_id;
}

/**
 * Poll /history every intervalMs until job completes.
 * Each poll is an independent short request — safe through Cloudflare tunnels.
 */
export async function pollHistory(promptId, intervalMs = 5000, timeoutMs = 1_800_000) {
  const deadline = Date.now() + timeoutMs; // 30 min default

  return new Promise((resolve, reject) => {
    const tick = async () => {
      if (Date.now() > deadline) {
        return reject(new Error("Timed out waiting for ComfyUI (30 min). Is the server still running?"));
      }
      try {
        const res = await fetchWithTimeout(
          `${BASE}/history/${promptId}`,
          { headers: { "Content-Type": "application/json" } },
          10_000 // 10s per poll request
        );
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
        // Don't reject on network errors — tunnel may have briefly dropped, retry
        if (err.name === "AbortError" || err.message.includes("fetch")) {
          console.warn("Poll attempt failed, retrying...", err.message);
        } else {
          return reject(err);
        }
      }
      setTimeout(tick, intervalMs);
    };
    setTimeout(tick, intervalMs);
  });
}

export function extractImages(historyEntry) {
  const images = [];
  for (const nodeOutput of Object.values(historyEntry?.outputs ?? {})) {
    if (nodeOutput.images) images.push(...nodeOutput.images);
  }
  return images;
}

export function imageUrl({ filename, subfolder, type }) {
  const params = new URLSearchParams({ filename, subfolder, type });
  return `${COMFYUI_URL}/view?${params.toString()}`;
}