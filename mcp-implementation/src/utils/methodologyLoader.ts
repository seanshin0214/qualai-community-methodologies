/**
 * Methodology loader - loads methodology definitions from JSON files
 */

import * as fs from 'fs';
import * as path from 'path';

export interface MethodologyStage {
  name: string;
  description: string;
  order: number;
  promptTemplate: string;
  requires: string[];
  inputs: string[];
  outputs: string[];
  validationRules?: any[];
  optional?: boolean;
}

export interface Methodology {
  id: string;
  name: string;
  version: string;
  author: string;
  category: string;
  description: string;
  stages: MethodologyStage[];
  tools: Record<string, string[]>;
  qualityCriteria: Record<string, string[]>;
  metadata: any;
  validated: boolean;
  reviewers: string[];
  examples?: any[];
}

/**
 * Load a methodology from JSON file
 */
export function loadMethodology(methodologyId: string, methodologiesPath?: string): Methodology | null {
  try {
    const basePath = methodologiesPath || path.join(__dirname, '../../../methodologies');
    const filePath = path.join(basePath, `${methodologyId}.json`);

    if (!fs.existsSync(filePath)) {
      console.error(`Methodology file not found: ${filePath}`);
      return null;
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const methodology = JSON.parse(fileContent) as Methodology;

    return methodology;
  } catch (error) {
    console.error(`Error loading methodology ${methodologyId}:`, error);
    return null;
  }
}

/**
 * Get stage-specific guidance from methodology
 */
export function getStageGuidance(
  methodology: Methodology,
  stageName: string
): MethodologyStage | null {
  const stage = methodology.stages.find(s => s.name === stageName);
  return stage || null;
}

/**
 * Get prompt template for a stage
 */
export function getStagePrompt(
  methodology: Methodology,
  stageName: string,
  variables: Record<string, any>
): string {
  const stage = getStageGuidance(methodology, stageName);
  if (!stage) {
    return '';
  }

  let prompt = stage.promptTemplate;

  // Replace variables in template
  for (const [key, value] of Object.entries(variables)) {
    const placeholder = `{{${key}}}`;
    const replacement = typeof value === 'string' ? value : JSON.stringify(value, null, 2);
    prompt = prompt.replace(new RegExp(placeholder, 'g'), replacement);
  }

  return prompt;
}

/**
 * Get quality criteria for methodology
 */
export function getQualityCriteria(methodology: Methodology): Record<string, string[]> {
  return methodology.qualityCriteria;
}

/**
 * List all available methodologies
 */
export function listMethodologies(methodologiesPath?: string): string[] {
  try {
    const basePath = methodologiesPath || path.join(__dirname, '../../../methodologies');

    if (!fs.existsSync(basePath)) {
      console.error(`Methodologies directory not found: ${basePath}`);
      return [];
    }

    const files = fs.readdirSync(basePath);
    const methodologyFiles = files.filter(f => f.endsWith('.json') && f !== 'TEMPLATE.json');

    return methodologyFiles.map(f => f.replace('.json', ''));
  } catch (error) {
    console.error('Error listing methodologies:', error);
    return [];
  }
}

/**
 * Validate methodology structure
 */
export function validateMethodologyStructure(methodology: Methodology): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Required fields
  if (!methodology.id) errors.push('Missing required field: id');
  if (!methodology.name) errors.push('Missing required field: name');
  if (!methodology.version) errors.push('Missing required field: version');
  if (!methodology.category) errors.push('Missing required field: category');
  if (!methodology.stages || methodology.stages.length === 0) {
    errors.push('Missing or empty required field: stages');
  }

  // Validate stages
  if (methodology.stages) {
    methodology.stages.forEach((stage, index) => {
      if (!stage.name) errors.push(`Stage ${index}: missing name`);
      if (!stage.description) errors.push(`Stage ${index}: missing description`);
      if (stage.order === undefined) errors.push(`Stage ${index}: missing order`);
      if (!stage.promptTemplate) errors.push(`Stage ${index}: missing promptTemplate`);
    });

    // Check stage order is sequential
    const orders = methodology.stages.map(s => s.order).sort((a, b) => a - b);
    const expectedOrders = Array.from({ length: orders.length }, (_, i) => i);
    // Allow order 0 for ongoing stages like memo-writing
    if (!orders.every((o, i) => o === expectedOrders[i] || o === 0)) {
      errors.push('Stage orders should be sequential starting from 1 (or 0 for ongoing stages)');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Get recommended tools for a methodology
 */
export function getRecommendedTools(methodology: Methodology): string[] {
  const allTools = new Set<string>();

  Object.values(methodology.tools).forEach(toolList => {
    toolList.forEach(tool => allTools.add(tool));
  });

  return Array.from(allTools);
}

/**
 * Check if a tool is appropriate for methodology
 */
export function isToolApplicable(
  methodology: Methodology,
  toolName: string,
  stage?: string
): boolean {
  if (stage) {
    // Check if tool is recommended for specific stage
    const stageObj = methodology.stages.find(s => s.name === stage);
    // This would require extending the methodology JSON to map tools to stages
    // For now, check if tool is in methodology at all
  }

  const allTools = getRecommendedTools(methodology);
  return allTools.includes(toolName);
}
