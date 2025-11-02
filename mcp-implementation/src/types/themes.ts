/**
 * Type definitions for theme extraction
 */

export interface Theme {
  id: string;
  name: string;
  centralConcept: string;
  definition: string;
  subthemes?: Subtheme[];
  relatedCodes: string[];
  supportingQuotes: Quote[];
  prevalence: {
    participants: number;
    totalParticipants: number;
    dataPoints: number;
  };
  significance: string;
  metadata: {
    extractionMode: 'inductive' | 'deductive' | 'hybrid';
    analysisDepth: 'surface' | 'deep' | 'latent';
    createdAt: Date;
  };
}

export interface Subtheme {
  id: string;
  name: string;
  definition: string;
  relatedCodes: string[];
  supportingQuotes: Quote[];
}

export interface Quote {
  id: string;
  text: string;
  source: string;
  participant?: string;
  context: string;
  codeLabels: string[];
}

export interface ThemeMap {
  themes: Theme[];
  relationships: ThemeRelationship[];
  overarchingNarrative: string;
}

export interface ThemeRelationship {
  fromThemeId: string;
  toThemeId: string;
  relationshipType: 'encompasses' | 'precedes' | 'influences' | 'contrasts' | 'complements';
  description: string;
}

export interface ThemeExtractionRequest {
  projectName: string;
  mode: 'inductive' | 'deductive' | 'hybrid';
  depth?: 'surface' | 'deep' | 'latent';
  researchQuestion?: string;
  theoreticalFramework?: string;
  minPrevalence?: number;
}

export interface ThemeExtractionResponse {
  themes: Theme[];
  themeMap: ThemeMap;
  extractionMode: 'inductive' | 'deductive' | 'hybrid';
  qualityMetrics: {
    coherence: number;
    distinctiveness: number;
    coverage: number;
    saturation: boolean;
  };
  recommendations: string[];
  warnings: string[];
}

export interface QualityMetrics {
  coherence: number; // 0-1: How well theme holds together
  distinctiveness: number; // 0-1: How different from other themes
  coverage: number; // 0-1: % of data accounted for
  saturation: boolean; // Whether theoretical saturation reached
}
