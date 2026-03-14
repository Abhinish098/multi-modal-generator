// ─────────────────────────────────────────────────────────────────────────────
//  ComfyUI API Service
//
//  When you get a new Cloudflare tunnel URL, update COMFYUI_URL below.
//  Then:
//    - Also update the `target` in vite.config.js to match (for local dev)
//    - Restart Vite dev server (Ctrl+C then npm run dev)
// ─────────────────────────────────────────────────────────────────────────────

export const COMFYUI_URL = "https://tone-rss-oct-basics.trycloudflare.com";

const IS_DEV = import.meta.env.DEV;
const BASE   = IS_DEV ? "/comfyui" : COMFYUI_URL;

const CLIENT_ID = crypto.randomUUID();

export async function queuePrompt(workflow) {
  const response = await fetch(`${BASE}/prompt`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: workflow, client_id: CLIENT_ID }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`ComfyUI error ${response.status}: ${text}`);
  }

  const data = await response.json();
  return data.prompt_id;
}

export async function pollHistory(promptId, intervalMs = 2000, timeoutMs = 180_000) {
  const deadline = Date.now() + timeoutMs;

  return new Promise((resolve, reject) => {
    const tick = async () => {
      if (Date.now() > deadline) {
        return reject(new Error("Timed out waiting for ComfyUI (3 min). Is the server still running?"));
      }
      try {
        const res = await fetch(`${BASE}/history/${promptId}`);
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