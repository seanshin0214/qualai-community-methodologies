/**
 * LLM prompt templates for qualitative analysis
 */

import { InitialCode } from '../types/codebook';
import { Theme } from '../types/themes';

export const CODEBOOK_REFINEMENT_PROMPT = (
  initialCodes: InitialCode[],
  methodology?: string
): string => {
  return `You are an expert qualitative researcher refining a codebook${methodology ? ` using ${methodology}` : ''}.

INITIAL CODES (${initialCodes.length} codes):
${JSON.stringify(initialCodes.slice(0, 50), null, 2)}
${initialCodes.length > 50 ? `\n... and ${initialCodes.length - 50} more codes` : ''}

Your task is to refine this codebook by:

1. **Identifying Similar Codes**: Find codes that are conceptually similar or overlapping
2. **Merging Redundant Codes**: Combine codes that capture the same concept
3. **Creating Hierarchy**: Organize codes into parent-child relationships
4. **Defining Codes Clearly**: Write clear definitions for each code
5. **Preserving Nuance**: Don't over-merge; maintain important distinctions

GUIDELINES:
- Preserve in-vivo codes (participants' own words) when powerful
- Use gerunds (action words: -ing) for process-oriented codes
- Keep codes close to the data
- Create 2-3 levels of hierarchy maximum
- Each code should have: label, definition, when to use, when NOT to use, examples

OUTPUT FORMAT:
Return a JSON object with:
{
  "refinedCodes": [
    {
      "label": "code name",
      "definition": "clear definition",
      "whenToUse": "guidance on when to apply this code",
      "whenNotToUse": "guidance on when NOT to use",
      "examples": ["example quote 1", "example quote 2"],
      "childCodes": ["child code labels if applicable"],
      "mergedFrom": ["original code IDs that were merged"]
    }
  ],
  "hierarchy": {
    "rootCodes": ["top-level codes"],
    "relationships": {
      "parentCode": ["childCode1", "childCode2"]
    }
  },
  "mergingDecisions": [
    {
      "mergedCodes": ["code1", "code2"],
      "intoCode": "new code label",
      "reason": "why these were merged"
    }
  ],
  "refinementNotes": "overall notes about the refinement process"
}`;
};

export const THEME_EXTRACTION_PROMPT = (
  codes: any[],
  mode: 'inductive' | 'deductive' | 'hybrid',
  researchQuestion?: string,
  theoreticalFramework?: string
): string => {
  const modeGuidance = {
    inductive: 'Work bottom-up from codes to discover themes emergent in the data. Let themes arise from patterns you observe.',
    deductive: `Work top-down from the theoretical framework: ${theoreticalFramework}. Look for themes that align with theoretical concepts.`,
    hybrid: `Use a combination approach: let themes emerge from data (inductive) while also considering theoretical framework: ${theoreticalFramework}`
  };

  return `You are an expert qualitative researcher extracting themes from coded data.

RESEARCH QUESTION: ${researchQuestion || 'Not specified'}

CODES (${codes.length} codes):
${JSON.stringify(codes.slice(0, 30), null, 2)}
${codes.length > 30 ? `\n... and ${codes.length - 30} more codes` : ''}

ANALYSIS MODE: ${mode.toUpperCase()}
${modeGuidance[mode]}

Your task is to identify THEMES:

A THEME is:
- A pattern of shared meaning organized around a central organizing concept
- More than just frequency - it's about significance
- Captures something important in relation to the research question
- Supported by multiple codes and data extracts

PROCESS:
1. Look for patterns across codes
2. Identify what these patterns mean
3. Group codes into themes based on shared meaning
4. Define the central organizing concept for each theme
5. Find supporting quotes from the data
6. Consider if themes need subthemes

QUALITY CRITERIA:
- Each theme has a clear central concept
- Themes are distinctive from each other (no overlap)
- Themes are internally coherent
- Themes have sufficient data support
- Themes address the research question

OUTPUT FORMAT:
Return a JSON object with:
{
  "themes": [
    {
      "name": "Theme Name (active, engaging)",
      "centralConcept": "The core idea that unifies this theme",
      "definition": "What this theme is about (2-3 sentences)",
      "relatedCodes": ["code labels that comprise this theme"],
      "supportingQuotes": [
        {
          "text": "participant quote",
          "source": "interview/document ID",
          "context": "why this supports the theme"
        }
      ],
      "prevalence": {
        "participantCount": number,
        "dataPointCount": number
      },
      "significance": "Why this theme matters for the RQ",
      "subthemes": [
        {
          "name": "Subtheme name",
          "definition": "What this subtheme is about"
        }
      ]
    }
  ],
  "themeRelationships": [
    {
      "from": "Theme A",
      "to": "Theme B",
      "type": "encompasses|precedes|influences|contrasts|complements",
      "description": "how they relate"
    }
  ],
  "overarchingNarrative": "How all themes work together to answer the RQ",
  "uncategorizedCodes": ["codes that don't fit into themes yet"]
}`;
};

export const GROUNDED_THEORY_PROMPT = (
  themes: Theme[],
  categories: any[],
  researchQuestion: string,
  paradigm: 'constructivist' | 'objectivist' | 'critical'
): string => {
  const paradigmGuidance = {
    constructivist: 'Emphasize the co-construction of meaning. Consider multiple realities and interpretations. Focus on process and context.',
    objectivist: 'Aim for systematic, rigorous analysis. Seek to identify generalizable patterns and relationships.',
    critical: 'Examine power relations, social justice issues, and structural constraints. Question taken-for-granted assumptions.'
  };

  return `You are an expert in Constructivist Grounded Theory (Charmaz) building a substantive theory from data.

RESEARCH QUESTION: ${researchQuestion}

PARADIGM: ${paradigm.toUpperCase()}
${paradigmGuidance[paradigm]}

THEMES AND CATEGORIES:
${JSON.stringify(themes, null, 2)}

Your task is to construct a GROUNDED THEORY by:

1. **Identifying the CORE CATEGORY**
   - What is the main concern of participants?
   - What is the basic social PROCESS?
   - What category best explains what's happening?

2. **Developing the PARADIGM MODEL**
   - Phenomenon: What is the central phenomenon?
   - Causal Conditions: What causes/leads to this phenomenon?
   - Context: In what context does this occur?
   - Strategies: What actions/interactions occur?
   - Consequences: What are the outcomes?
   - Intervening Conditions: What factors affect the strategies?

3. **Specifying RELATIONSHIPS**
   - How do categories relate to each other?
   - What are the causes, contexts, contingencies, consequences?
   - Map the relationships between categories

4. **Creating a STORYLINE**
   - Integrate all categories into a coherent narrative
   - Explain the process/phenomenon
   - Account for variation in the data

5. **Theoretical INTEGRATION**
   - How does this theory connect to existing theories?
   - What is novel about this theory?
   - What does it contribute to knowledge?

OUTPUT FORMAT:
Return a JSON object with:
{
  "coreCategory": "Name of the core category",
  "coreCategoryDefinition": "What the core category represents",
  "mainProcess": "The basic social process",

  "paradigmModel": {
    "phenomenon": "The central phenomenon",
    "causalConditions": ["What causes this"],
    "context": ["Contextual factors"],
    "strategies": ["Actions/interactions"],
    "consequences": ["Outcomes"],
    "interveningConditions": ["Factors that influence strategies"]
  },

  "storyline": "A coherent narrative that integrates all categories and explains the theory. This should be 3-5 paragraphs that tell the story of what's happening in the data.",

  "theoreticalPropositions": [
    "Proposition 1: Clear theoretical statement",
    "Proposition 2: ..."
  ],

  "categoryRelationships": [
    {
      "from": "Category A",
      "to": "Category B",
      "type": "causes|influences|triggers|precedes|enables|constrains",
      "explanation": "How they relate",
      "evidence": ["Supporting quotes"],
      "strength": "strong|moderate|weak"
    }
  ],

  "theoreticalIntegration": {
    "linkedTheories": ["Existing theories this connects to"],
    "contribution": "What this adds to knowledge",
    "novelty": "What is new/different",
    "practicalImplications": ["Practical applications"],
    "futureResearch": ["Suggested future research directions"]
  },

  "processModel": {
    "stages": [
      {
        "stage": "Stage name",
        "description": "What happens",
        "transitions": ["What leads to next stage"]
      }
    ]
  }
}

Remember: The theory should be GROUNDED in your data, not imposed from outside. It should explain the main concerns and processes evident in participants' experiences.`;
};

export const QUALITY_VALIDATION_PROMPT = (
  analysisType: 'codebook' | 'themes' | 'theory',
  output: any,
  methodology: string
): string => {
  return `You are a qualitative research methodologist evaluating the quality of ${analysisType} analysis.

METHODOLOGY: ${methodology}

OUTPUT TO EVALUATE:
${JSON.stringify(output, null, 2)}

Evaluate this ${analysisType} against quality criteria:

${analysisType === 'codebook' ? `
CODEBOOK QUALITY:
- Clarity: Are codes clearly defined?
- Distinctiveness: Are codes distinct from each other?
- Completeness: Do codes cover the data adequately?
- Parsimony: Is the codebook appropriately streamlined?
- Hierarchy: Is the hierarchical structure logical?
` : ''}

${analysisType === 'themes' ? `
THEME QUALITY (Braun & Clarke):
- Coherence: Do themes have internal coherence?
- Distinctiveness: Are themes clearly distinct?
- Data Support: Is there sufficient data for each theme?
- Relevance: Do themes address the research question?
- Depth: Do themes go beyond surface description?
` : ''}

${analysisType === 'theory' ? `
THEORY QUALITY (Charmaz):
- Credibility: Constant comparison, theoretical sampling evidence?
- Originality: Fresh insights, new conceptual rendering?
- Resonance: Fullness of experience, revealed meanings?
- Usefulness: Knowledge contribution, practical value?
` : ''}

OUTPUT FORMAT:
{
  "overallQuality": number (0-1),
  "criteriaScores": {
    "criterion1": number (0-1),
    "criterion2": number (0-1),
    ...
  },
  "strengths": ["strength 1", "strength 2"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "recommendations": ["recommendation 1", "recommendation 2"],
  "passesQualityThreshold": boolean
}`;
};
