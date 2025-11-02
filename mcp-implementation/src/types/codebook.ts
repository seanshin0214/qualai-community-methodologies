/**
 * Type definitions for codebook structures
 */

export interface Code {
  id: string;
  label: string;
  definition: string;
  whenToUse: string;
  whenNotToUse: string;
  examples: string[];
  frequency: number;
  childCodes?: string[];
  parentCode?: string;
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    source: 'initial' | 'refined' | 'merged';
    mergedFrom?: string[];
  };
}

export interface CodeHierarchy {
  rootCodes: string[];
  relationships: {
    [parentId: string]: string[];
  };
}

export interface Codebook {
  version: string;
  projectName: string;
  methodology?: string;
  codes: Code[];
  codeHierarchy: CodeHierarchy;
  mergedCodes: MergedCode[];
  refinementNotes: string;
  qualityMetrics: {
    totalCodes: number;
    hierarchyDepth: number;
    averageCodeFrequency: number;
    redundancyScore: number;
  };
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    refinedBy: string;
  };
}

export interface MergedCode {
  newCodeId: string;
  originalCodeIds: string[];
  reason: string;
  confidence: number;
}

export interface InitialCode {
  id: string;
  label: string;
  segment: string;
  line?: number;
  type: 'in_vivo' | 'constructed' | 'semantic' | 'latent';
  memo?: string;
  dataSource: string;
}

export interface CodebookRefinementRequest {
  projectName: string;
  methodology?: string;
  mergeSimilar?: boolean;
  minFrequency?: number;
  preserveInVivo?: boolean;
}

export interface CodebookRefinementResponse {
  codebook: Codebook;
  summary: {
    initialCodeCount: number;
    finalCodeCount: number;
    mergedCodeCount: number;
    hierarchyLevels: number;
    qualityScore: number;
  };
  recommendations: string[];
}
