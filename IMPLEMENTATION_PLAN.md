# QualAI MCP Tools Implementation Plan

## Overview
Implementation plan for three core qualitative research analysis tools:
1. `refineCodebook` - Codebook refinement and consolidation
2. `extractThemes` - Theme extraction from coded data
3. `buildGroundedTheory` - Grounded theory construction

## Architecture

### Tool Flow
```
Raw Data → autoCoding (existing)
         ↓
Initial Codes → refineCodebook (NEW)
              ↓
Refined Codebook → extractThemes (NEW)
                 ↓
Themes + Categories → buildGroundedTheory (NEW)
                    ↓
Grounded Theory Output
```

### Integration Points
- **Methodology System**: Load methodology definitions from JSON files
- **Project Management**: Store codebooks, themes, and theories per project
- **LLM Integration**: Use Claude for intelligent analysis at each stage
- **Quality Validation**: Apply methodology-specific quality criteria

## Tool Specifications

### 1. refineCodebook

**Purpose**: Consolidate and refine initial codes into a coherent codebook

**Inputs**:
- `projectName` (required): Project identifier
- `methodology` (optional): Methodology ID (e.g., "grounded-theory-charmaz")
- `mergeSimilar` (optional, default: true): Auto-merge similar codes
- `minFrequency` (optional): Minimum code frequency threshold

**Process**:
1. Load initial codes from project
2. Load methodology-specific guidance
3. Use LLM to:
   - Group similar codes
   - Identify redundant codes
   - Suggest hierarchical relationships
   - Define each code clearly
4. Apply quality criteria from methodology
5. Generate refined codebook

**Output**:
```json
{
  "codebook": {
    "version": "1.0",
    "codes": [
      {
        "id": "code-001",
        "label": "Managing uncertainty",
        "definition": "Actions and strategies participants use to handle uncertain situations",
        "whenToUse": "Apply when participant describes dealing with ambiguity",
        "whenNotToUse": "Not for general anxiety or stress",
        "examples": ["quote 1", "quote 2"],
        "frequency": 15,
        "childCodes": ["code-002", "code-003"]
      }
    ],
    "codeHierarchy": {...},
    "mergedCodes": [...],
    "refinementNotes": "..."
  }
}
```

### 2. extractThemes

**Purpose**: Extract themes from refined codes using inductive, deductive, or hybrid approaches

**Inputs**:
- `projectName` (required): Project identifier
- `mode` (required): "inductive" | "deductive" | "hybrid"
- `depth` (optional): "surface" | "deep" | "latent"
- `researchQuestion` (optional): Guide theme relevance
- `theoreticalFramework` (optional): For deductive analysis

**Process**:
1. Load refined codebook and data
2. Load methodology stage for theme extraction
3. Based on mode:
   - **Inductive**: Bottom-up from codes to themes
   - **Deductive**: Top-down from theoretical framework
   - **Hybrid**: Combination approach
4. Use LLM to:
   - Identify patterns across codes
   - Group codes into themes
   - Define central organizing concepts
   - Extract supporting quotes
5. Validate theme quality
6. Check for theme saturation

**Output**:
```json
{
  "themes": [
    {
      "id": "theme-001",
      "name": "Navigating Identity Transitions",
      "centralConcept": "The process of reconstructing identity in new contexts",
      "definition": "...",
      "subthemes": [
        {
          "id": "subtheme-001",
          "name": "Letting go of old identities",
          "definition": "..."
        }
      ],
      "relatedCodes": ["code-001", "code-005", "code-012"],
      "supportingQuotes": [...],
      "prevalence": {
        "participants": 12,
        "totalParticipants": 15,
        "dataPoints": 45
      },
      "significance": "Central to understanding adaptation process"
    }
  ],
  "themeMap": {...},
  "extractionMode": "inductive",
  "qualityMetrics": {
    "coherence": 0.85,
    "distinctiveness": 0.92,
    "coverage": 0.88
  }
}
```

### 3. buildGroundedTheory

**Purpose**: Construct grounded theory from themes and categories

**Inputs**:
- `projectName` (required): Project identifier
- `paradigm` (required): "constructivist" | "objectivist" | "critical"
- `researchQuestion` (required): Core research question
- `theoreticalSensitivity` (optional): Existing concepts to consider

**Process**:
1. Load themes, categories, and memos
2. Load Grounded Theory methodology (Charmaz or specified)
3. Use LLM to:
   - Identify core category (main phenomenon)
   - Map relationships between categories
   - Identify conditions, contexts, strategies, consequences
   - Develop theoretical storyline
   - Connect to broader theoretical concepts
4. Validate theoretical saturation
5. Check for negative cases
6. Generate theoretical model

**Output**:
```json
{
  "groundedTheory": {
    "title": "Theory of Identity Reconstruction in Transition",
    "coreCategory": "Reconstructing Self",
    "paradigmModel": {
      "phenomenon": "Identity disruption in new contexts",
      "causalConditions": [
        "Environmental change",
        "Loss of familiar reference points"
      ],
      "context": [
        "Cultural expectations",
        "Available support systems"
      ],
      "strategies": [
        "Selective identity retention",
        "Incremental self-disclosure",
        "Community building"
      ],
      "consequences": [
        "Hybrid identity formation",
        "Enhanced adaptability"
      ],
      "intervening_conditions": [
        "Prior transition experience",
        "Social capital"
      ]
    },
    "storyline": "When individuals experience environmental transitions that disrupt their established identities (causal conditions), they engage in a process of reconstructing self (core category). Within the context of new cultural expectations and varying support systems (context), they employ strategies such as selective retention of past identities and incremental self-disclosure (strategies). This process is influenced by their prior experiences and available resources (intervening conditions), ultimately leading to the formation of hybrid identities and enhanced adaptability (consequences).",
    "theoreticalPropositions": [
      "Identity reconstruction is a non-linear process of negotiation between past and present selves",
      "The degree of identity disruption correlates with the availability of supportive communities",
      "Hybrid identities emerge as adaptive responses to multiple contextual demands"
    ],
    "categoryRelationships": [
      {
        "from": "Identity disruption",
        "to": "Seeking familiar anchors",
        "type": "triggers",
        "explanation": "When identity is disrupted, individuals actively seek elements of familiarity"
      }
    ],
    "theoreticalIntegration": {
      "linkedTheories": [
        "Identity Process Theory (Breakwell)",
        "Acculturation Theory (Berry)"
      ],
      "contribution": "Extends understanding of identity as dynamic and context-dependent",
      "novelty": "Highlights active reconstruction rather than passive adaptation"
    },
    "saturationEvidence": {
      "categoriesSaturated": true,
      "negativeeCasesExamined": 3,
      "dataSupport": "95% of data accounted for by theory"
    }
  },
  "visualizations": {
    "paradigmDiagram": "...",
    "processModel": "..."
  }
}
```

## Technical Implementation

### Directory Structure
```
qualai-mcp/
├── src/
│   ├── tools/
│   │   ├── refineCodebook.ts
│   │   ├── extractThemes.ts
│   │   ├── buildGroundedTheory.ts
│   │   └── utils/
│   │       ├── llmPrompts.ts
│   │       ├── qualityValidation.ts
│   │       └── methodologyLoader.ts
│   ├── types/
│   │   ├── codebook.ts
│   │   ├── themes.ts
│   │   └── theory.ts
│   └── index.ts
└── methodologies/ (synced from community repo)
```

### Dependencies
```json
{
  "dependencies": {
    "@modelcontextprotocol/sdk": "^0.5.0",
    "@anthropic-ai/sdk": "^0.27.0",
    "zod": "^3.22.0"
  }
}
```

### Quality Criteria Integration

Each tool will validate outputs against methodology-specific criteria:

**Grounded Theory (Charmaz)**:
- Credibility: Constant comparison, theoretical sampling
- Originality: Fresh insights, new conceptual rendering
- Resonance: Fullness of experience, revealed meanings
- Usefulness: Knowledge contribution, practical applications

**Thematic Analysis (Braun & Clarke)**:
- Credibility: Themes grounded in data, sufficient evidence
- Transferability: Rich description, detailed themes
- Dependability: Systematic process, audit trail

## Testing Strategy

### Unit Tests
- Test each tool with sample data
- Validate output schemas
- Test error handling

### Integration Tests
- Test full workflow: coding → refinement → themes → theory
- Test with different methodologies
- Test with different data types (interviews, observations, documents)

### Quality Tests
- Compare outputs with expert-coded examples
- Validate against published studies
- Inter-rater reliability checks

## Implementation Timeline

### Phase 1: Core Implementation (Week 1)
- [ ] Set up TypeScript project structure
- [ ] Implement refineCodebook tool
- [ ] Implement extractThemes tool
- [ ] Implement buildGroundedTheory tool

### Phase 2: Quality & Validation (Week 2)
- [ ] Add quality validation for each methodology
- [ ] Implement saturation detection
- [ ] Add negative case analysis

### Phase 3: Testing (Week 3)
- [ ] Unit tests for each tool
- [ ] Integration tests for workflows
- [ ] Manual testing with real research data

### Phase 4: Documentation (Week 4)
- [ ] API documentation
- [ ] Usage examples
- [ ] Tutorial videos

## Success Criteria

1. **Functional**: All three tools produce valid outputs
2. **Quality**: Outputs meet methodology-specific quality criteria
3. **Usable**: Clear error messages and helpful guidance
4. **Tested**: >80% code coverage, validated against published studies
5. **Documented**: Complete API docs and usage examples

## Next Steps

1. Review and approve this plan
2. Set up development environment
3. Begin Phase 1 implementation
4. Create example datasets for testing
5. Establish quality validation benchmarks
