# Example Usage Guide

This guide demonstrates how to use the three QualAI MCP tools for qualitative research analysis.

## Scenario: Analyzing Interview Data on Remote Work Experience

### Research Question
"How do knowledge workers experience and adapt to permanent remote work?"

### Sample Data
15 in-depth interviews with knowledge workers who transitioned to permanent remote work.

---

## Step-by-Step Workflow

### Step 1: Initial Coding (Existing Tool)

First, use the existing `autoCoding` tool to generate initial codes:

```json
{
  "tool": "autoCoding",
  "arguments": {
    "projectName": "remote-work-study",
    "methodology": "grounded-theory-charmaz",
    "data": [
      {
        "id": "interview-001",
        "type": "interview",
        "content": "I found it really isolating at first. I missed the water cooler conversations..."
      },
      {
        "id": "interview-002",
        "type": "interview",
        "content": "The flexibility has been amazing. I can structure my day around my life..."
      }
      // ... 13 more interviews
    ]
  }
}
```

**Output**: ~120 initial codes like "experiencing isolation", "missing informal interactions", "valuing flexibility", etc.

---

### Step 2: Refine Codebook

Use `refineCodebook` to consolidate and structure the initial codes:

```json
{
  "tool": "refineCodebook",
  "arguments": {
    "projectName": "remote-work-study",
    "methodology": "grounded-theory-charmaz",
    "mergeSimilar": true,
    "preserveInVivo": true,
    "minFrequency": 2
  }
}
```

**Response**:
```json
{
  "codebook": {
    "version": "1.0",
    "codes": [
      {
        "id": "code-001",
        "label": "Negotiating boundaries",
        "definition": "Actions participants take to establish and maintain boundaries between work and personal life in remote context",
        "whenToUse": "When participant describes setting limits, creating routines, or managing work-life separation",
        "whenNotToUse": "For general work-life balance discussion without specific boundary-setting actions",
        "examples": [
          "I physically close my laptop and put it in a drawer at 5pm",
          "I created a morning ritual that signals work is starting"
        ],
        "frequency": 12,
        "childCodes": ["creating physical boundaries", "establishing temporal boundaries"],
        "metadata": {
          "source": "merged",
          "mergedFrom": ["setting-limits", "work-life-boundaries", "creating-separation"]
        }
      },
      {
        "id": "code-002",
        "label": "Reconstructing social connection",
        "definition": "Strategies for building and maintaining professional relationships in remote environment",
        "whenToUse": "When participant describes efforts to connect with colleagues virtually",
        "whenNotToUse": "For casual mentions of missing office without active reconstruction efforts",
        "examples": [
          "We started virtual coffee chats every Friday",
          "I schedule video calls instead of just messaging"
        ],
        "frequency": 15,
        "childCodes": ["scheduling virtual social time", "maintaining informal communication"],
        "metadata": {
          "source": "merged",
          "mergedFrom": ["building-connections", "virtual-socializing", "maintaining-relationships"]
        }
      }
      // ... 35 more refined codes
    ],
    "codeHierarchy": {
      "rootCodes": ["negotiating-boundaries", "reconstructing-social-connection", "managing-autonomy"],
      "relationships": {
        "negotiating-boundaries": ["creating-physical-boundaries", "establishing-temporal-boundaries"],
        "reconstructing-social-connection": ["scheduling-virtual-social-time", "maintaining-informal-communication"]
      }
    },
    "qualityMetrics": {
      "totalCodes": 38,
      "hierarchyDepth": 2,
      "averageCodeFrequency": 7.8,
      "redundancyScore": 0.68
    }
  },
  "summary": {
    "initialCodeCount": 120,
    "finalCodeCount": 38,
    "mergedCodeCount": 82,
    "hierarchyLevels": 2,
    "qualityScore": 0.87
  },
  "recommendations": [
    "Codebook is well-structured with clear hierarchies",
    "Consider adding more examples for codes with frequency <5"
  ]
}
```

**Key Outputs**:
- 120 initial codes → 38 refined codes
- 2-level hierarchy
- Quality score: 87%
- Clear definitions and usage guidance

---

### Step 3: Extract Themes

Use `extractThemes` to identify patterns and themes:

```json
{
  "tool": "extractThemes",
  "arguments": {
    "projectName": "remote-work-study",
    "mode": "inductive",
    "depth": "deep",
    "researchQuestion": "How do knowledge workers experience and adapt to permanent remote work?"
  }
}
```

**Response**:
```json
{
  "themes": [
    {
      "id": "theme-001",
      "name": "Reconstructing Professional Identity in Isolation",
      "centralConcept": "The process of redefining one's professional self without physical workplace cues and social mirrors",
      "definition": "Participants actively reconstruct their professional identities when traditional markers (office, colleagues, routines) are removed. This involves creating new symbols, routines, and social connections that validate their professional self.",
      "subthemes": [
        {
          "id": "subtheme-001-01",
          "name": "Creating symbolic workspaces",
          "definition": "Establishing physical spaces and artifacts that signal professional identity"
        },
        {
          "id": "subtheme-001-02",
          "name": "Seeking virtual validation",
          "definition": "Finding new ways to receive professional recognition and feedback"
        }
      ],
      "relatedCodes": [
        "code-002",
        "code-015",
        "code-023"
      ],
      "supportingQuotes": [
        {
          "id": "quote-001-001",
          "text": "I bought a really nice desk setup - not for functionality, but because I needed something that said 'I'm a professional' when I looked at it",
          "source": "interview-007",
          "participant": "P7",
          "context": "Discussing motivation for home office investment"
        },
        {
          "id": "quote-001-002",
          "text": "Without the office, I lost my sense of who I was at work. I had to figure out: am I still the same professional person in my living room?",
          "source": "interview-012",
          "participant": "P12",
          "context": "Reflecting on identity transition"
        }
      ],
      "prevalence": {
        "participants": 13,
        "totalParticipants": 15,
        "dataPoints": 47
      },
      "significance": "Central to understanding adaptation - participants don't just adjust logistics, but fundamentally reconstruct their professional selves",
      "metadata": {
        "extractionMode": "inductive",
        "analysisDepth": "deep"
      }
    },
    {
      "id": "theme-002",
      "name": "Navigating Autonomy's Double Edge",
      "centralConcept": "The simultaneous liberation and burden of self-directed work without external structure",
      "definition": "Participants experience autonomy as both empowering (control over schedule, environment) and challenging (responsibility for self-management, lack of external accountability). This creates ongoing negotiation between freedom and structure.",
      "relatedCodes": [
        "code-001",
        "code-008",
        "code-019"
      ],
      "supportingQuotes": [
        {
          "text": "I love that I can work when I'm most productive, but I also hate that no one is there to tell me it's okay to stop",
          "source": "interview-003",
          "context": "Discussing self-management challenges"
        }
      ],
      "prevalence": {
        "participants": 14,
        "totalParticipants": 15,
        "dataPoints": 52
      },
      "significance": "Reveals that remote work adaptation involves managing paradoxes, not just solving problems"
    },
    {
      "id": "theme-003",
      "name": "Curating Selective Visibility",
      "centralConcept": "Strategic management of what aspects of home life become visible to colleagues",
      "definition": "Participants actively curate what colleagues see/hear during video calls, managing professional presentation while working from home. This involves both physical staging and disclosure decisions.",
      "relatedCodes": [
        "code-005",
        "code-012",
        "code-028"
      ],
      "supportingQuotes": [],
      "prevalence": {
        "participants": 11,
        "totalParticipants": 15,
        "dataPoints": 31
      },
      "significance": "Shows impression management continues in remote work, but with new considerations"
    }
  ],
  "themeMap": {
    "themes": "... (same as above)",
    "relationships": [
      {
        "fromThemeId": "theme-001",
        "toThemeId": "theme-002",
        "relationshipType": "influences",
        "description": "Identity reconstruction shapes how autonomy is experienced - those who successfully reconstruct professional identity manage autonomy more effectively"
      },
      {
        "fromThemeId": "theme-003",
        "toThemeId": "theme-001",
        "relationshipType": "complements",
        "description": "Curating visibility is one strategy for reconstructing professional identity"
      }
    ],
    "overarchingNarrative": "Remote work requires fundamental reconstruction of professional self in absence of physical workplace. This reconstruction involves managing new autonomy paradoxes and strategically curating visibility to maintain professional identity."
  },
  "qualityMetrics": {
    "coherence": 0.89,
    "distinctiveness": 0.92,
    "coverage": 0.85,
    "saturation": true
  },
  "recommendations": [
    "Themes are well-developed and distinctive",
    "Consider exploring counter-narratives for theme-003"
  ]
}
```

**Key Outputs**:
- 3 major themes identified
- Each theme has central concept, definition, and supporting evidence
- Theme relationships mapped
- Quality score: high coherence (89%), distinctiveness (92%), coverage (85%)
- Saturation achieved

---

### Step 4: Build Grounded Theory

Use `buildGroundedTheory` to construct theoretical model:

```json
{
  "tool": "buildGroundedTheory",
  "arguments": {
    "projectName": "remote-work-study",
    "paradigm": "constructivist",
    "researchQuestion": "How do knowledge workers experience and adapt to permanent remote work?",
    "focusOnProcess": true
  }
}
```

**Response**:
```json
{
  "groundedTheory": {
    "title": "Theory of Professional Self-Reconstruction in Remote Work Transition",
    "coreCategory": "Reconstructing Professional Self",
    "paradigm": "constructivist",
    "paradigmModel": {
      "phenomenon": "Loss of physical workplace cues and social validation of professional identity",
      "causalConditions": [
        "Removal of physical office environment",
        "Loss of informal colleague interactions",
        "Disappearance of routine-based identity markers"
      ],
      "context": [
        "Home environment characteristics",
        "Organizational remote work culture",
        "Personal life circumstances",
        "Prior professional identity strength"
      ],
      "strategies": [
        "Creating symbolic workspaces",
        "Establishing new routines and rituals",
        "Curating selective visibility",
        "Building virtual social connections",
        "Negotiating autonomy boundaries"
      ],
      "consequences": [
        "Hybrid professional-personal identity",
        "Enhanced autonomy awareness",
        "Renegotiated work-life boundaries",
        "Transformed colleague relationships"
      ],
      "interveningConditions": [
        "Organizational support level",
        "Home environment constraints",
        "Technology proficiency",
        "Personality traits (introversion/extroversion)"
      ]
    },
    "storyline": "When knowledge workers transition to permanent remote work, they experience a disruption of their established professional identity as physical workplace cues and social validation mechanisms disappear (phenomenon). This disruption is caused by the removal of office environments, loss of informal interactions, and disappearance of routine-based identity markers (causal conditions).\n\nWithin the context of their home environments, organizational cultures, and personal circumstances (context), workers engage in active reconstruction of their professional selves (core category). They employ various strategies including creating symbolic workspaces, establishing new routines, curating what aspects of home life become visible to colleagues, and building virtual connections (strategies).\n\nThis reconstruction process is influenced by organizational support, home constraints, and individual characteristics (intervening conditions), ultimately leading to the emergence of hybrid professional-personal identities, enhanced awareness of autonomy, and transformed relationships with colleagues and work-life boundaries (consequences).\n\nThe theory highlights that remote work adaptation is not merely logistical adjustment, but fundamental identity work where professionals actively construct new meanings of professional self in the absence of traditional workplace structures.",
    "theoreticalPropositions": [
      "Professional identity reconstruction is more intensive when traditional workplace cues are suddenly removed rather than gradually reduced",
      "Workers with stronger pre-existing professional identities experience more acute identity disruption in remote transition",
      "The degree of autonomy challenge correlates inversely with organizational provision of structure and social connection",
      "Successful identity reconstruction requires balancing visibility curation with authentic self-presentation"
    ],
    "categoryRelationships": [
      {
        "from": "Loss of workplace cues",
        "to": "Identity reconstruction strategies",
        "type": "triggers",
        "explanation": "The removal of physical and social workplace cues directly triggers active identity reconstruction efforts",
        "evidence": [
          "Participants began workspace curation immediately after permanent remote announcement",
          "Identity questioning emerged within first month of transition"
        ],
        "strength": "strong"
      },
      {
        "from": "Autonomy management",
        "to": "Identity outcomes",
        "type": "influences",
        "explanation": "How workers manage autonomy shapes the type of professional identity that emerges",
        "evidence": [
          "Those who embraced autonomy developed more fluid identities",
          "Those who resisted autonomy maintained more traditional professional identities"
        ],
        "strength": "moderate"
      }
    ],
    "theoreticalIntegration": {
      "linkedTheories": [
        "Identity Process Theory (Breakwell, 1986)",
        "Job Demands-Resources Model (Bakker & Demerouti, 2007)",
        "Boundary Theory (Nippert-Eng, 1996)"
      ],
      "contribution": "Extends understanding of professional identity as actively constructed and context-dependent, rather than stable trait. Shows identity work is central to workplace transition, not peripheral.",
      "novelty": "First theory to position professional identity reconstruction as core process in remote work adaptation, integrating autonomy, boundary, and visibility management as identity strategies",
      "practicalImplications": [
        "Organizations should provide identity scaffolding during remote transitions (rituals, symbols, recognition)",
        "Remote work policies should address identity needs, not just productivity metrics",
        "Training should include identity reconstruction strategies, not just technology skills",
        "Managers should recognize autonomy as identity challenge, not just scheduling issue"
      ],
      "futureResearch": [
        "Longitudinal study of identity stabilization over time",
        "Comparison across professions with varying identity sources",
        "Role of organizational culture in supporting/hindering identity reconstruction",
        "Intergenerational differences in remote identity work"
      ]
    },
    "saturationEvidence": {
      "categoriesSaturated": true,
      "negativeCasesExamined": 2,
      "dataSupport": "Theory accounts for 95% of coded data; negative cases (2 participants who didn't experience identity disruption) explained by strong pre-existing autonomous work styles",
      "saturatedCategories": [
        "Reconstructing Professional Self",
        "Managing Autonomy",
        "Curating Visibility"
      ],
      "unsaturatedCategories": []
    }
  },
  "visualizations": {
    "paradigmDiagram": "[ASCII diagram shown earlier in buildGroundedTheory.ts]",
    "processModel": "...",
    "categoryMap": "..."
  },
  "qualityAssessment": {
    "credibility": 0.88,
    "originality": 0.85,
    "resonance": 0.91,
    "usefulness": 0.87
  },
  "recommendations": [
    "Theory is well-developed across all Charmaz criteria",
    "Consider member checking with participants to validate resonance",
    "Strong practical implications - ready for application"
  ],
  "nextSteps": [
    "Validate theory with participants (member checking)",
    "Test theory with new data or different contexts",
    "Write up theory for publication"
  ]
}
```

**Key Outputs**:
- Complete grounded theory with core category: "Reconstructing Professional Self"
- Paradigm model mapping causes, context, strategies, consequences
- 4 theoretical propositions
- Integration with existing theories
- Quality scores: Credibility (88%), Originality (85%), Resonance (91%), Usefulness (87%)
- Practical implications for organizations

---

## Complete Analysis Summary

Starting with 15 interviews, the analysis progressed through:

1. **120 initial codes** → Captured granular details
2. **38 refined codes** → Consolidated into clear, hierarchical structure
3. **3 major themes** → Identified patterns of shared meaning
4. **1 grounded theory** → Constructed theoretical explanation

**Final Theory**: Professional identity reconstruction is the core process in remote work adaptation, involving strategic management of autonomy, boundaries, and visibility to construct new professional self in absence of traditional workplace cues.

**Quality**: High across all metrics (85-91%)

**Practical Value**: Clear implications for organizational remote work policies and support

---

## Tips for Best Results

1. **Start with quality data**: 10-15+ in-depth interviews or substantial observational data
2. **Use appropriate methodology**: Grounded Theory for theory-building, Thematic Analysis for pattern description
3. **Iterate**: Review outputs and refine if quality scores are low
4. **Write memos**: Document analytical insights throughout (helps buildGroundedTheory)
5. **Check saturation**: Ensure themes appear across multiple participants
6. **Validate**: Consider member checking or peer review of findings

---

## Common Issues & Solutions

**Issue**: Too many initial codes (200+)
**Solution**: Set higher `minFrequency` in refineCodebook (e.g., 3-5)

**Issue**: Low quality scores
**Solution**: Review methodology guidance, ensure codes have clear definitions and examples

**Issue**: Themes too similar
**Solution**: Use extractThemes with `depth: "deep"` to find underlying distinctions

**Issue**: Theory feels descriptive, not theoretical
**Solution**: Focus on processes (use gerunds), specify relationships, connect to broader concepts
