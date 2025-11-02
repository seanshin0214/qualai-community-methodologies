/**
 * Type definitions for grounded theory construction
 */

export interface GroundedTheory {
  title: string;
  coreCategory: string;
  paradigm: 'constructivist' | 'objectivist' | 'critical';
  paradigmModel: ParadigmModel;
  storyline: string;
  theoreticalPropositions: string[];
  categoryRelationships: CategoryRelationship[];
  theoreticalIntegration: TheoreticalIntegration;
  saturationEvidence: SaturationEvidence;
  metadata: {
    projectName: string;
    researchQuestion: string;
    createdAt: Date;
    version: string;
  };
}

export interface ParadigmModel {
  phenomenon: string;
  causalConditions: string[];
  context: string[];
  strategies: string[];
  consequences: string[];
  interveningConditions: string[];
}

export interface CategoryRelationship {
  from: string;
  to: string;
  type: 'causes' | 'influences' | 'triggers' | 'precedes' | 'enables' | 'constrains';
  explanation: string;
  evidence: string[];
  strength: 'strong' | 'moderate' | 'weak';
}

export interface TheoreticalIntegration {
  linkedTheories: string[];
  contribution: string;
  novelty: string;
  practicalImplications: string[];
  futureResearch: string[];
}

export interface SaturationEvidence {
  categoriesSaturated: boolean;
  negativeCasesExamined: number;
  dataSupport: string;
  saturatedCategories: string[];
  unsaturatedCategories: string[];
}

export interface GroundedTheoryRequest {
  projectName: string;
  paradigm: 'constructivist' | 'objectivist' | 'critical';
  researchQuestion: string;
  theoreticalSensitivity?: string[];
  focusOnProcess?: boolean;
}

export interface GroundedTheoryResponse {
  groundedTheory: GroundedTheory;
  visualizations: {
    paradigmDiagram: string;
    processModel: string;
    categoryMap: string;
  };
  qualityAssessment: {
    credibility: number;
    originality: number;
    resonance: number;
    usefulness: number;
  };
  recommendations: string[];
  nextSteps: string[];
}

export interface Memo {
  id: string;
  type: 'initial' | 'focused' | 'theoretical' | 'reflective';
  content: string;
  relatedCodes?: string[];
  relatedThemes?: string[];
  createdAt: Date;
}
