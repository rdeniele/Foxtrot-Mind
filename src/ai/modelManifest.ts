export interface ModelSpec {
  id: 'qwen3_0_6b';
  name: string;
  purpose: string;
  quant: string;
  url: string;
  fileName: string;
  sizeBytes: number;
}

/**
 * A single, deliberately small model so "offline AI companion" is an honest claim
 * on a mid-range phone. Size/URL verified against Hugging Face LFS metadata.
 */
export const MODEL: ModelSpec = {
  id: 'qwen3_0_6b',
  name: 'Qwen3 0.6B',
  purpose: 'Talk, challenges, and reading feedback',
  quant: 'Q4_K_M',
  url: 'https://huggingface.co/unsloth/Qwen3-0.6B-GGUF/resolve/main/Qwen3-0.6B-Q4_K_M.gguf',
  fileName: 'Qwen3-0.6B-Q4_K_M.gguf',
  sizeBytes: 396705472,
};
