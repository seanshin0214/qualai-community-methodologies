/**
 * buildGroundedTheory - Construct grounded theory from themes and categories
 */

import Anthropic from '@anthropic-ai/sdk';
import {
  GroundedTheory,
  ParadigmModel,
  CategoryRelationship,
  TheoreticalIntegration,
  SaturationEvidence,
  GroundedTheoryRequest,
  GroundedTheoryResponse,
  Memo
} from '../types/theory';
import { Theme } from '../types/themes';
import { GROUNDED_THEORY_PROMPT } from '../utils/llmPrompts';
import { validateGroundedTheory } from '../utils/qualityValidation';
import { loadMethodology, getStageGuidance } from '../utils/methodologyLoader';

/**
 * MCP Tool: buildGroundedTheory
 *
 * Constructs grounded theory from themes and categories using specified paradigm
 */
export async function buildGroundedTheory(
  request: GroundedTheoryRequest,
  themes: Theme[],
  categories: any[],
  memos: Memo[],
  anthropicClient: Anthropic
): Promise<GroundedTheoryResponse> {

  console.log(`Building grounded theory for project: ${request.projectName}`);
  console.log(`Paradigm: ${request.paradigm}`);
  console.log(`Themes: ${themes.length}, Categories: ${categories.length}`);

  // Load Grounded Theory methodology
  const methodology = loadMethodology('grounded-theory-charmaz');
  let stageGuidance = null;
  if (methodology) {
    stageGuidance = getStageGuidance(methodology, 'theoretical-coding');
  }

  // Prepare categories (themes can serve as categories in GT)
  const categoriesWithThemes = [
    ...categories,
    ...themes.map(t => ({
      name: t.name,
      definition: t.definition,
      properties: t.subthemes?.map(st => st.name) || [],
      relatedCodes: t.relatedCodes,
      prevalence: t.prevalence
    }))
  ];

  // Build the prompt
  const prompt = GROUNDED_THEORY_PROMPT(
    themes,
    categoriesWithThemes,
    request.researchQuestion,
    request.paradigm
  );

  // Add methodology-specific guidance
  let fullPrompt = prompt;
  if (stageGuidance) {
    fullPrompt += `\n\n--- METHODOLOGY GUIDANCE (Charmaz Constructivist GT) ---\n`;
    fullPrompt += stageGuidance.description;
  }

  // Add theoretical sensitivity if provided
  if (request.theoreticalSensitivity && request.theoreticalSensitivity.length > 0) {
    fullPrompt += `\n\n--- THEORETICAL SENSITIVITY ---\n`;
    fullPrompt += 'Consider these existing theoretical concepts:\n';
    fullPrompt += request.theoreticalSensitivity.map(ts => `- ${ts}`).join('\n');
    fullPrompt += '\n\nBut ensure your theory remains GROUNDED in the data, not imposed from these concepts.';
  }

  // Add memos context
  if (memos && memos.length > 0) {
    fullPrompt += `\n\n--- ANALYTICAL MEMOS ---\n`;
    fullPrompt += 'Consider these analytical memos from the research process:\n';
    fullPrompt += memos.slice(0, 10).map(m => `${m.type}: ${m.content}`).join('\n\n');
  }

  // Add process focus if requested
  if (request.focusOnProcess) {
    fullPrompt += `\n\n--- PROCESS FOCUS ---\n`;
    fullPrompt += 'Pay special attention to PROCESSES and ACTIONS. Use gerunds (-ing words) to capture process.';
  }

  // Call Claude to build theory
  const response = await anthropicClient.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 16000,
    temperature: 0.5, // Higher for theoretical creativity
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

  let theoryResult;
  try {
    const jsonMatch = content.text.match(/```json\n([\s\S]*?)\n```/) ||
                     content.text.match(/\{[\s\S]*\}/);
    const jsonText = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content.text;
    theoryResult = JSON.parse(jsonText);
  } catch (error) {
    console.error('Failed to parse grounded theory result:', error);
    throw new Error('Failed to parse grounded theory from Claude response');
  }

  // Build paradigm model
  const paradigmModel: ParadigmModel = {
    phenomenon: theoryResult.paradigmModel?.phenomenon || theoryResult.phenomenon || '',
    causalConditions: theoryResult.paradigmModel?.causalConditions || [],
    context: theoryResult.paradigmModel?.context || [],
    strategies: theoryResult.paradigmModel?.strategies || [],
    consequences: theoryResult.paradigmModel?.consequences || [],
    interveningConditions: theoryResult.paradigmModel?.interveningConditions || []
  };

  // Build category relationships
  const categoryRelationships: CategoryRelationship[] = (theoryResult.categoryRelationships || []).map((cr: any) => ({
    from: cr.from,
    to: cr.to,
    type: cr.type,
    explanation: cr.explanation,
    evidence: cr.evidence || [],
    strength: cr.strength || 'moderate'
  }));

  // Build theoretical integration
  const theoreticalIntegration: TheoreticalIntegration = {
    linkedTheories: theoryResult.theoreticalIntegration?.linkedTheories || [],
    contribution: theoryResult.theoreticalIntegration?.contribution || '',
    novelty: theoryResult.theoreticalIntegration?.novelty || '',
    practicalImplications: theoryResult.theoreticalIntegration?.practicalImplications || [],
    futureResearch: theoryResult.theoreticalIntegration?.futureResearch || []
  };

  // Assess saturation
  const saturationEvidence: SaturationEvidence = {
    categoriesSaturated: themes.length >= 3 && themes.every(t => t.supportingQuotes.length >= 5),
    negativeCasesExamined: 0, // This would need to be tracked during analysis
    dataSupport: `Theory integrates ${themes.length} themes and ${categories.length} categories`,
    saturatedCategories: themes.filter(t => t.supportingQuotes.length >= 5).map(t => t.name),
    unsaturatedCategories: themes.filter(t => t.supportingQuotes.length < 5).map(t => t.name)
  };

  // Build grounded theory
  const groundedTheory: GroundedTheory = {
    title: theoryResult.title || `Theory of ${theoryResult.coreCategory}`,
    coreCategory: theoryResult.coreCategory || '',
    paradigm: request.paradigm,
    paradigmModel,
    storyline: theoryResult.storyline || '',
    theoreticalPropositions: theoryResult.theoreticalPropositions || [],
    categoryRelationships,
    theoreticalIntegration,
    saturationEvidence,
    metadata: {
      projectName: request.projectName,
      researchQuestion: request.researchQuestion,
      createdAt: new Date(),
      version: '1.0'
    }
  };

  // Validate quality
  const qualityAssessment = validateGroundedTheory(groundedTheory);

  // Generate visualizations (simplified - would use actual diagramming in production)
  const visualizations = {
    paradigmDiagram: generateParadigmDiagram(paradigmModel),
    processModel: generateProcessModel(theoryResult.processModel),
    categoryMap: generateCategoryMap(categoryRelationships)
  };

  // Build response
  const responseObj: GroundedTheoryResponse = {
    groundedTheory,
    visualizations,
    qualityAssessment: {
      credibility: qualityAssessment.criteriaScores.credibility || 0,
      originality: qualityAssessment.criteriaScores.originality || 0,
      resonance: qualityAssessment.criteriaScores.resonance || 0,
      usefulness: qualityAssessment.criteriaScores.usefulness || 0
    },
    recommendations: qualityAssessment.recommendations,
    nextSteps: []
  };

  // Add next steps
  if (!saturationEvidence.categoriesSaturated) {
    responseObj.nextSteps.push('Continue data collection to achieve theoretical saturation');
  }

  if (saturationEvidence.unsaturatedCategories.length > 0) {
    responseObj.nextSteps.push(
      `Further develop these categories: ${saturationEvidence.unsaturatedCategories.join(', ')}`
    );
  }

  if (theoreticalIntegration.linkedTheories.length === 0) {
    responseObj.nextSteps.push('Connect theory to existing theoretical literature');
  }

  if (categoryRelationships.length < 3) {
    responseObj.nextSteps.push('Specify more relationships between categories');
  }

  responseObj.nextSteps.push('Validate theory with participants (member checking)');
  responseObj.nextSteps.push('Test theory with new data or different contexts');
  responseObj.nextSteps.push('Write up theory for publication');

  console.log(`Grounded theory built: ${groundedTheory.title}`);
  console.log(`Core category: ${groundedTheory.coreCategory}`);
  console.log(`Quality score: ${(qualityAssessment.overallQuality * 100).toFixed(0)}%`);
  console.log(`Saturation: ${saturationEvidence.categoriesSaturated ? 'Yes' : 'No'}`);

  return responseObj;
}

/**
 * Generate paradigm diagram (text-based)
 */
function generateParadigmDiagram(model: ParadigmModel): string {
  return `
PARADIGM MODEL

┌─────────────────────────────────┐
│   CAUSAL CONDITIONS             │
│   ${model.causalConditions.map(c => `- ${c}`).join('\n    ')}
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│   PHENOMENON                    │
│   ${model.phenomenon}
└──────────────┬──────────────────┘
               │
    ┌──────────┴──────────┐
    │                     │
    ▼                     ▼
┌─────────────────┐   ┌─────────────────┐
│  CONTEXT        │   │  INTERVENING    │
│  ${model.context.map(c => `- ${c}`).join('\n  ')}
└─────────────────┘   │  CONDITIONS     │
                      │  ${model.interveningConditions.map(c => `- ${c}`).join('\n  ')}
                      └─────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│   STRATEGIES/ACTIONS            │
│   ${model.strategies.map(s => `- ${s}`).join('\n    ')}
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│   CONSEQUENCES                  │
│   ${model.consequences.map(c => `- ${c}`).join('\n    ')}
└─────────────────────────────────┘
`.trim();
}

/**
 * Generate process model diagram
 */
function generateProcessModel(processModel: any): string {
  if (!processModel || !processModel.stages) {
    return 'No process model specified';
  }

  return `
PROCESS MODEL

${processModel.stages.map((stage: any, i: number) => `
Stage ${i + 1}: ${stage.stage}
  ${stage.description}
  Transitions: ${stage.transitions?.join(', ') || 'N/A'}
`).join('\n')}
`.trim();
}

/**
 * Generate category relationship map
 */
function generateCategoryMap(relationships: CategoryRelationship[]): string {
  if (relationships.length === 0) {
    return 'No category relationships specified';
  }

  return `
CATEGORY RELATIONSHIPS

${relationships.map(r => `
${r.from} --[${r.type}]--> ${r.to}
  ${r.explanation}
  Strength: ${r.strength}
`).join('\n')}
`.trim();
}

/**
 * MCP Tool Registration
 */
export const buildGroundedTheoryTool = {
  name: 'buildGroundedTheory',
  description: 'Build a grounded theory from themes and categories using Charmaz constructivist approach',
  inputSchema: {
    type: 'object',
    properties: {
      projectName: {
        type: 'string',
        description: 'Name of the research project'
      },
      paradigm: {
        type: 'string',
        enum: ['constructivist', 'objectivist', 'critical'],
        description: 'Grounded theory paradigm: constructivist (Charmaz), objectivist (Glaser), or critical'
      },
      researchQuestion: {
        type: 'string',
        description: 'Core research question guiding theory development'
      },
      theoreticalSensitivity: {
        type: 'array',
        items: { type: 'string' },
        description: 'Existing theoretical concepts to consider (while staying grounded in data)',
        optional: true
      },
      focusOnProcess: {
        type: 'boolean',
        description: 'Focus on identifying social processes',
        optional: true,
        default: true
      }
    },
    required: ['projectName', 'paradigm', 'researchQuestion']
  }
};
