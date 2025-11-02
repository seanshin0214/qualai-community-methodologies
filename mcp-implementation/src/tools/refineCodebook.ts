/**
 * refineCodebook - Consolidate and refine initial codes into coherent codebook
 */

import Anthropic from '@anthropic-ai/sdk';
import {
  Codebook,
  Code,
  InitialCode,
  CodebookRefinementRequest,
  CodebookRefinementResponse,
  MergedCode,
  CodeHierarchy
} from '../types/codebook';
import { CODEBOOK_REFINEMENT_PROMPT } from '../utils/llmPrompts';
import { validateCodebook } from '../utils/qualityValidation';
import { loadMethodology, getStageGuidance } from '../utils/methodologyLoader';

/**
 * MCP Tool: refineCodebook
 *
 * Takes initial codes from autoCoding and refines them into a structured codebook
 */
export async function refineCodebook(
  request: CodebookRefinementRequest,
  initialCodes: InitialCode[],
  anthropicClient: Anthropic
): Promise<CodebookRefinementResponse> {

  console.log(`Refining codebook for project: ${request.projectName}`);
  console.log(`Initial codes: ${initialCodes.length}`);

  // Load methodology if specified
  let methodology = null;
  let stageGuidance = null;
  if (request.methodology) {
    methodology = loadMethodology(request.methodology);
    if (methodology) {
      // Look for focused-coding or similar stage
      stageGuidance = getStageGuidance(methodology, 'focused-coding') ||
                      getStageGuidance(methodology, 'generate-initial-codes');
    }
  }

  // Build the prompt
  const prompt = CODEBOOK_REFINEMENT_PROMPT(
    initialCodes,
    methodology?.name
  );

  // Add methodology-specific guidance if available
  let fullPrompt = prompt;
  if (stageGuidance) {
    fullPrompt += `\n\n--- METHODOLOGY GUIDANCE (${methodology!.name}) ---\n`;
    fullPrompt += stageGuidance.description;
  }

  // Call Claude to refine the codebook
  const response = await anthropicClient.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8000,
    temperature: 0.3, // Lower temperature for more consistent analysis
    messages: [{
      role: 'user',
      content: fullPrompt
    }]
  });

  // Parse the response
  const content = response.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude');
  }

  let refinementResult;
  try {
    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = content.text.match(/```json\n([\s\S]*?)\n```/) ||
                     content.text.match(/\{[\s\S]*\}/);
    const jsonText = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content.text;
    refinementResult = JSON.parse(jsonText);
  } catch (error) {
    console.error('Failed to parse refinement result:', error);
    throw new Error('Failed to parse codebook refinement from Claude response');
  }

  // Transform the result into Codebook structure
  const refinedCodes: Code[] = refinementResult.refinedCodes.map((rc: any, index: number) => {
    // Find original codes that were merged
    const mergedFrom = rc.mergedFrom || [];
    const originalCodes = initialCodes.filter(ic => mergedFrom.includes(ic.id));

    // Calculate frequency from original codes
    const frequency = mergedFrom.length || 1;

    return {
      id: `code-${String(index + 1).padStart(3, '0')}`,
      label: rc.label,
      definition: rc.definition || '',
      whenToUse: rc.whenToUse || '',
      whenNotToUse: rc.whenNotToUse || '',
      examples: rc.examples || [],
      frequency,
      childCodes: rc.childCodes || [],
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        source: mergedFrom.length > 1 ? 'merged' : 'refined',
        mergedFrom: mergedFrom.length > 0 ? mergedFrom : undefined
      }
    };
  });

  // Build hierarchy
  const hierarchy: CodeHierarchy = {
    rootCodes: refinementResult.hierarchy?.rootCodes || [],
    relationships: refinementResult.hierarchy?.relationships || {}
  };

  // Build merged codes list
  const mergedCodes: MergedCode[] = (refinementResult.mergingDecisions || []).map((md: any) => ({
    newCodeId: refinedCodes.find(c => c.label === md.intoCode)?.id || '',
    originalCodeIds: md.mergedCodes || [],
    reason: md.reason || '',
    confidence: 0.8 // Could be enhanced with confidence scoring
  }));

  // Calculate quality metrics
  const hierarchyDepth = calculateHierarchyDepth(hierarchy);
  const avgFrequency = refinedCodes.reduce((sum, c) => sum + c.frequency, 0) / refinedCodes.length;
  const redundancyScore = 1 - (refinedCodes.length / initialCodes.length);

  const codebook: Codebook = {
    version: '1.0',
    projectName: request.projectName,
    methodology: request.methodology,
    codes: refinedCodes,
    codeHierarchy: hierarchy,
    mergedCodes,
    refinementNotes: refinementResult.refinementNotes || '',
    qualityMetrics: {
      totalCodes: refinedCodes.length,
      hierarchyDepth,
      averageCodeFrequency: avgFrequency,
      redundancyScore
    },
    metadata: {
      createdAt: new Date(),
      updatedAt: new Date(),
      refinedBy: 'qualai-mcp'
    }
  };

  // Validate quality
  const qualityAssessment = validateCodebook(codebook, request.methodology);

  // Build response
  const responseObj: CodebookRefinementResponse = {
    codebook,
    summary: {
      initialCodeCount: initialCodes.length,
      finalCodeCount: refinedCodes.length,
      mergedCodeCount: mergedCodes.length,
      hierarchyLevels: hierarchyDepth,
      qualityScore: qualityAssessment.overallQuality
    },
    recommendations: qualityAssessment.recommendations
  };

  // Add warnings if quality is low
  if (!qualityAssessment.passesQualityThreshold) {
    responseObj.recommendations.unshift(
      `⚠️ Codebook quality score (${(qualityAssessment.overallQuality * 100).toFixed(0)}%) is below threshold. Please review.`
    );
  }

  console.log(`Codebook refined: ${initialCodes.length} → ${refinedCodes.length} codes`);
  console.log(`Quality score: ${(qualityAssessment.overallQuality * 100).toFixed(0)}%`);

  return responseObj;
}

/**
 * Calculate hierarchy depth
 */
function calculateHierarchyDepth(hierarchy: CodeHierarchy): number {
  let maxDepth = 0;

  function getDepth(codeId: string, currentDepth: number): number {
    const children = hierarchy.relationships[codeId] || [];
    if (children.length === 0) {
      return currentDepth;
    }

    const childDepths = children.map(childId => getDepth(childId, currentDepth + 1));
    return Math.max(...childDepths);
  }

  for (const rootCode of hierarchy.rootCodes) {
    const depth = getDepth(rootCode, 1);
    maxDepth = Math.max(maxDepth, depth);
  }

  return maxDepth;
}

/**
 * MCP Tool Registration
 */
export const refineCodebookTool = {
  name: 'refineCodebook',
  description: 'Refine and consolidate initial codes into a structured codebook with clear definitions and hierarchical organization',
  inputSchema: {
    type: 'object',
    properties: {
      projectName: {
        type: 'string',
        description: 'Name of the research project'
      },
      methodology: {
        type: 'string',
        description: 'Methodology ID (e.g., "grounded-theory-charmaz")',
        optional: true
      },
      mergeSimilar: {
        type: 'boolean',
        description: 'Automatically merge similar codes',
        default: true
      },
      minFrequency: {
        type: 'number',
        description: 'Minimum frequency threshold for codes',
        optional: true
      },
      preserveInVivo: {
        type: 'boolean',
        description: 'Preserve in-vivo codes from participants',
        default: true
      }
    },
    required: ['projectName']
  }
};
