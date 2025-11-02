/**
 * extractThemes - Extract themes from refined codes
 */

import Anthropic from '@anthropic-ai/sdk';
import {
  Theme,
  Subtheme,
  Quote,
  ThemeMap,
  ThemeRelationship,
  ThemeExtractionRequest,
  ThemeExtractionResponse
} from '../types/themes';
import { Codebook } from '../types/codebook';
import { THEME_EXTRACTION_PROMPT } from '../utils/llmPrompts';
import { validateThemes } from '../utils/qualityValidation';
import { loadMethodology, getStageGuidance } from '../utils/methodologyLoader';

/**
 * MCP Tool: extractThemes
 *
 * Extracts themes from refined codes using inductive, deductive, or hybrid approaches
 */
export async function extractThemes(
  request: ThemeExtractionRequest,
  codebook: Codebook,
  rawData: any[], // Original interview/document data
  anthropicClient: Anthropic
): Promise<ThemeExtractionResponse> {

  console.log(`Extracting themes for project: ${request.projectName}`);
  console.log(`Mode: ${request.mode}, Depth: ${request.depth || 'deep'}`);
  console.log(`Codes to analyze: ${codebook.codes.length}`);

  // Load methodology if specified
  let methodology = null;
  let stageGuidance = null;
  if (codebook.methodology) {
    methodology = loadMethodology(codebook.methodology);
    if (methodology) {
      // Look for theme generation stage
      stageGuidance = getStageGuidance(methodology, 'generate-themes') ||
                      getStageGuidance(methodology, 'theoretical-coding') ||
                      getStageGuidance(methodology, 'define-name-themes');
    }
  }

  // Prepare codes with context
  const codesWithContext = codebook.codes.map(code => ({
    label: code.label,
    definition: code.definition,
    frequency: code.frequency,
    examples: code.examples,
    childCodes: code.childCodes
  }));

  // Build the prompt
  const prompt = THEME_EXTRACTION_PROMPT(
    codesWithContext,
    request.mode,
    request.researchQuestion,
    request.theoreticalFramework
  );

  // Add methodology-specific guidance
  let fullPrompt = prompt;
  if (stageGuidance) {
    fullPrompt += `\n\n--- METHODOLOGY GUIDANCE (${methodology!.name}) ---\n`;
    fullPrompt += stageGuidance.description;
  }

  // Add depth-specific instructions
  const depthInstructions = {
    surface: 'Focus on explicit, semantic themes - what participants explicitly say.',
    deep: 'Go beyond surface to identify underlying patterns and meanings.',
    latent: 'Identify latent themes - underlying ideas, assumptions, and ideologies that shape the data.'
  };
  fullPrompt += `\n\nANALYSIS DEPTH: ${depthInstructions[request.depth || 'deep']}`;

  // Call Claude to extract themes
  const response = await anthropicClient.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 16000,
    temperature: 0.4, // Slightly higher for creative theme identification
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

  let extractionResult;
  try {
    const jsonMatch = content.text.match(/```json\n([\s\S]*?)\n```/) ||
                     content.text.match(/\{[\s\S]*\}/);
    const jsonText = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content.text;
    extractionResult = JSON.parse(jsonText);
  } catch (error) {
    console.error('Failed to parse theme extraction result:', error);
    throw new Error('Failed to parse theme extraction from Claude response');
  }

  // Transform result into Theme structures
  const themes: Theme[] = extractionResult.themes.map((t: any, index: number) => {
    const subthemes: Subtheme[] = (t.subthemes || []).map((st: any, stIndex: number) => ({
      id: `subtheme-${String(index + 1).padStart(3, '0')}-${String(stIndex + 1).padStart(2, '0')}`,
      name: st.name,
      definition: st.definition,
      relatedCodes: st.relatedCodes || [],
      supportingQuotes: (st.supportingQuotes || []).map((q: any, qIndex: number) => ({
        id: `quote-${index}-${stIndex}-${qIndex}`,
        text: q.text || q,
        source: q.source || 'unknown',
        participant: q.participant,
        context: q.context || '',
        codeLabels: []
      }))
    }));

    const supportingQuotes: Quote[] = (t.supportingQuotes || []).map((q: any, qIndex: number) => ({
      id: `quote-${String(index + 1).padStart(3, '0')}-${String(qIndex + 1).padStart(3, '0')}`,
      text: q.text || (typeof q === 'string' ? q : ''),
      source: q.source || 'unknown',
      participant: q.participant,
      context: q.context || '',
      codeLabels: t.relatedCodes || []
    }));

    return {
      id: `theme-${String(index + 1).padStart(3, '0')}`,
      name: t.name,
      centralConcept: t.centralConcept,
      definition: t.definition,
      subthemes: subthemes.length > 0 ? subthemes : undefined,
      relatedCodes: t.relatedCodes || [],
      supportingQuotes,
      prevalence: {
        participants: t.prevalence?.participantCount || 0,
        totalParticipants: rawData.length,
        dataPoints: t.prevalence?.dataPointCount || supportingQuotes.length
      },
      significance: t.significance || '',
      metadata: {
        extractionMode: request.mode,
        analysisDepth: request.depth || 'deep',
        createdAt: new Date()
      }
    };
  });

  // Build theme relationships
  const relationships: ThemeRelationship[] = (extractionResult.themeRelationships || []).map((tr: any) => ({
    fromThemeId: themes.find(t => t.name === tr.from)?.id || '',
    toThemeId: themes.find(t => t.name === tr.to)?.id || '',
    relationshipType: tr.type,
    description: tr.description
  }));

  const themeMap: ThemeMap = {
    themes,
    relationships,
    overarchingNarrative: extractionResult.overarchingNarrative || ''
  };

  // Calculate quality metrics
  const totalDataPoints = rawData.length * 10; // Rough estimate
  const qualityAssessment = validateThemes(themes, totalDataPoints);

  // Check for saturation (simple heuristic)
  const saturation = themes.length >= 3 &&
                     themes.every(t => t.supportingQuotes.length >= 3) &&
                     themes.every(t => t.prevalence.participants >= Math.min(3, Math.floor(rawData.length * 0.3)));

  const qualityMetrics = {
    coherence: qualityAssessment.criteriaScores.coherence || 0,
    distinctiveness: qualityAssessment.criteriaScores.distinctiveness || 0,
    coverage: qualityAssessment.criteriaScores.coverage || 0,
    saturation
  };

  // Build response
  const responseObj: ThemeExtractionResponse = {
    themes,
    themeMap,
    extractionMode: request.mode,
    qualityMetrics,
    recommendations: qualityAssessment.recommendations,
    warnings: []
  };

  // Add warnings
  if (!qualityAssessment.passesQualityThreshold) {
    responseObj.warnings.push(
      `Theme quality score (${(qualityAssessment.overallQuality * 100).toFixed(0)}%) is below threshold`
    );
  }

  if (!saturation) {
    responseObj.warnings.push('Theoretical saturation may not be achieved - consider analyzing more data');
  }

  if (extractionResult.uncategorizedCodes && extractionResult.uncategorizedCodes.length > 0) {
    responseObj.warnings.push(
      `${extractionResult.uncategorizedCodes.length} codes not incorporated into themes`
    );
  }

  // Validate minimum prevalence if specified
  if (request.minPrevalence) {
    const lowPrevalenceThemes = themes.filter(
      t => (t.prevalence.participants / t.prevalence.totalParticipants) < request.minPrevalence
    );
    if (lowPrevalenceThemes.length > 0) {
      responseObj.warnings.push(
        `${lowPrevalenceThemes.length} themes below minimum prevalence threshold (${request.minPrevalence})`
      );
    }
  }

  console.log(`Themes extracted: ${themes.length}`);
  console.log(`Quality score: ${(qualityAssessment.overallQuality * 100).toFixed(0)}%`);
  console.log(`Saturation: ${saturation ? 'Yes' : 'No'}`);

  return responseObj;
}

/**
 * MCP Tool Registration
 */
export const extractThemesTool = {
  name: 'extractThemes',
  description: 'Extract themes from coded data using inductive, deductive, or hybrid approaches',
  inputSchema: {
    type: 'object',
    properties: {
      projectName: {
        type: 'string',
        description: 'Name of the research project'
      },
      mode: {
        type: 'string',
        enum: ['inductive', 'deductive', 'hybrid'],
        description: 'Theme extraction mode: inductive (bottom-up), deductive (theory-driven), or hybrid'
      },
      depth: {
        type: 'string',
        enum: ['surface', 'deep', 'latent'],
        description: 'Analysis depth: surface (explicit), deep (underlying patterns), latent (assumptions/ideologies)',
        optional: true,
        default: 'deep'
      },
      researchQuestion: {
        type: 'string',
        description: 'Research question to guide theme relevance',
        optional: true
      },
      theoreticalFramework: {
        type: 'string',
        description: 'Theoretical framework for deductive/hybrid analysis',
        optional: true
      },
      minPrevalence: {
        type: 'number',
        description: 'Minimum prevalence threshold (0-1) for themes',
        optional: true
      }
    },
    required: ['projectName', 'mode']
  }
};
