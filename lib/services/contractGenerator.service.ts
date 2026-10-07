import { generateContractDraft as generateDraft, enhanceContract as enhance } from '@/lib/services/contractGenerator.service';

/**
 * Stub implementation for contract generation.
 * Returns a title, the generated content, and flags for fallback handling.
 */
export async function generateContractDraft(prompt: string, templateId?: string) {
  const title = templateId ? `Template ${templateId} Contract` : 'AI Generated Contract';
  const content = `Draft contract based on prompt: ${prompt}` + (templateId ? ` (using template ${templateId})` : '');
  return {
    title,
    content,
    isFallback: false,
    error: null,
  };
}

/**
 * Stub for enhancing an existing contract with a new clause.
 * Simply appends the clause text; real implementation would insert intelligently.
 */
export async function enhanceContract(existingContent: string, clauseText: string) {
  const enhanced = `${existingContent}\n\n--- Added Clause ---\n${clauseText}`;
  return {
    content: enhanced,
    success: true,
  };
}

