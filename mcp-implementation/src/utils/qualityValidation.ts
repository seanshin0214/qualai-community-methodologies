/**
 * Quality validation utilities for qualitative analysis
 */

import { Codebook } from '../types/codebook';
import { Theme, QualityMetrics } from '../types/themes';
import { GroundedTheory } from '../types/theory';

export interface QualityAssessment {
  overallQuality: number;
  criteriaScores: Record<string, number>;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  passesQualityThreshold: boolean;
}

/**
 * Validate codebook quality
 */
export function validateCodebook(codebook: Codebook, methodology?: string): QualityAssessment {
  const scores: Record<string, number> = {};

  // Clarity: Are codes clearly defined?
  const codesWithDefinitions = codebook.codes.filter(c => c.definition && c.definition.length > 10);
  scores.clarity = codesWithDefinitions.length / codebook.codes.length;

  // Distinctiveness: Check for overlap
  const uniqueLabels = new Set(codebook.codes.map(c => c.label.toLowerCase()));
  scores.distinctiveness = uniqueLabels.size / codebook.codes.length;

  // Completeness: Reasonable number of codes (not too few, not too many)
  const codeCount = codebook.codes.length;
  if (codeCount < 5) scores.completeness = 0.3;
  else if (codeCount < 10) scores.completeness = 0.6;
  else if (codeCount <= 50) scores.completeness = 1.0;
  else if (codeCount <= 100) scores.completeness = 0.8;
  else scores.completeness = 0.5;

  // Hierarchy: Reasonable depth
  const hierarchyDepth = codebook.qualityMetrics.hierarchyDepth;
  if (hierarchyDepth === 0) scores.hierarchy = 0.5; // Flat is okay
  else if (hierarchyDepth <= 3) scores.hierarchy = 1.0; // Good
  else scores.hierarchy = 0.6; // Too deep

  // Examples: Codes have examples
  const codesWithExamples = codebook.codes.filter(c => c.examples && c.examples.length > 0);
  scores.examples = codesWithExamples.length / codebook.codes.length;

  const overallQuality = Object.values(scores).reduce((a, b) => a + b, 0) / Object.keys(scores).length;

  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const recommendations: string[] = [];

  if (scores.clarity >= 0.9) strengths.push('Codes are clearly defined');
  else if (scores.clarity < 0.7) {
    weaknesses.push('Some codes lack clear definitions');
    recommendations.push('Add clear definitions for all codes, including when to use and when not to use');
  }

  if (scores.distinctiveness >= 0.95) strengths.push('Codes are distinctive and non-overlapping');
  else if (scores.distinctiveness < 0.9) {
    weaknesses.push('Some code labels may be duplicates or very similar');
    recommendations.push('Review codes for duplicates and merge similar codes');
  }

  if (scores.completeness >= 0.9) strengths.push('Appropriate number of codes for analysis');
  else if (scores.completeness < 0.7) {
    if (codeCount < 10) recommendations.push('Consider if you need more codes to capture data richness');
    else recommendations.push('Consider consolidating codes - codebook may be too large');
  }

  if (scores.examples >= 0.8) strengths.push('Codes well-supported with examples');
  else {
    weaknesses.push('Many codes lack supporting examples');
    recommendations.push('Add data examples for each code to ground them in evidence');
  }

  return {
    overallQuality,
    criteriaScores: scores,
    strengths,
    weaknesses,
    recommendations,
    passesQualityThreshold: overallQuality >= 0.7
  };
}

/**
 * Validate theme quality
 */
export function validateThemes(themes: Theme[], totalDataPoints: number): QualityAssessment {
  const scores: Record<string, number> = {};

  // Coherence: Themes have clear central concepts
  const themesWithConcepts = themes.filter(t => t.centralConcept && t.centralConcept.length > 10);
  scores.coherence = themesWithConcepts.length / themes.length;

  // Distinctiveness: Check theme overlap (simple check based on shared codes)
  const avgSharedCodes = calculateThemeOverlap(themes);
  scores.distinctiveness = Math.max(0, 1 - (avgSharedCodes / 3)); // Penalize if themes share >3 codes on average

  // Data Support: Themes have sufficient supporting quotes
  const avgQuotesPerTheme = themes.reduce((sum, t) => sum + t.supportingQuotes.length, 0) / themes.length;
  scores.dataSupport = Math.min(1, avgQuotesPerTheme / 5); // Ideally 5+ quotes per theme

  // Relevance: Themes have significance statements
  const themesWithSignificance = themes.filter(t => t.significance && t.significance.length > 10);
  scores.relevance = themesWithSignificance.length / themes.length;

  // Prevalence: Themes appear across multiple participants
  const avgPrevalence = themes.reduce((sum, t) => {
    if (t.prevalence.totalParticipants > 0) {
      return sum + (t.prevalence.participants / t.prevalence.totalParticipants);
    }
    return sum;
  }, 0) / themes.length;
  scores.prevalence = avgPrevalence;

  // Coverage: Themes cover most of the data
  const totalDataPointsCovered = themes.reduce((sum, t) => sum + t.prevalence.dataPoints, 0);
  scores.coverage = Math.min(1, totalDataPointsCovered / totalDataPoints);

  const overallQuality = Object.values(scores).reduce((a, b) => a + b, 0) / Object.keys(scores).length;

  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const recommendations: string[] = [];

  if (scores.coherence >= 0.9) strengths.push('Themes have clear central organizing concepts');
  else {
    weaknesses.push('Some themes lack clear central concepts');
    recommendations.push('Define the central organizing concept for each theme');
  }

  if (scores.distinctiveness >= 0.8) strengths.push('Themes are clearly distinct from each other');
  else {
    weaknesses.push('Themes may have too much overlap');
    recommendations.push('Review themes for overlap and ensure each captures a distinct pattern');
  }

  if (scores.dataSupport >= 0.8) strengths.push('Themes well-supported with data extracts');
  else {
    weaknesses.push('Themes need more supporting quotes');
    recommendations.push('Add more supporting quotes for each theme (aim for 5+ per theme)');
  }

  if (scores.prevalence >= 0.5) strengths.push('Themes appear across multiple participants');
  else {
    weaknesses.push('Some themes may be too narrow, appearing in few participants');
    recommendations.push('Consider if narrow themes should be combined or presented as subthemes');
  }

  if (themes.length < 3) {
    weaknesses.push('Very few themes - may be missing patterns');
    recommendations.push('Consider if data has been analyzed in sufficient depth');
  } else if (themes.length > 8) {
    weaknesses.push('Many themes - may lack coherence');
    recommendations.push('Consider grouping themes or creating theme hierarchies');
  } else {
    strengths.push(`Appropriate number of themes (${themes.length})`);
  }

  return {
    overallQuality,
    criteriaScores: scores,
    strengths,
    weaknesses,
    recommendations,
    passesQualityThreshold: overallQuality >= 0.7
  };
}

/**
 * Validate grounded theory quality (Charmaz criteria)
 */
export function validateGroundedTheory(theory: GroundedTheory): QualityAssessment {
  const scores: Record<string, number> = {};

  // Credibility: Evidence of systematic analysis
  scores.credibility = 0;
  if (theory.paradigmModel.causalConditions.length > 0) scores.credibility += 0.2;
  if (theory.paradigmModel.strategies.length > 0) scores.credibility += 0.2;
  if (theory.categoryRelationships.length >= 3) scores.credibility += 0.3;
  if (theory.saturationEvidence.categoriesSaturated) scores.credibility += 0.3;

  // Originality: Fresh insights
  scores.originality = 0;
  if (theory.theoreticalIntegration.novelty && theory.theoreticalIntegration.novelty.length > 20) {
    scores.originality += 0.5;
  }
  if (theory.theoreticalPropositions.length >= 3) scores.originality += 0.5;

  // Resonance: Captures fullness of experience
  scores.resonance = 0;
  if (theory.storyline && theory.storyline.length > 100) scores.resonance += 0.3;
  if (theory.paradigmModel.context.length > 0) scores.resonance += 0.2;
  if (theory.paradigmModel.interveningConditions.length > 0) scores.resonance += 0.2;
  if (theory.categoryRelationships.some(r => r.strength === 'strong')) scores.resonance += 0.3;

  // Usefulness: Practical value
  scores.usefulness = 0;
  if (theory.theoreticalIntegration.contribution && theory.theoreticalIntegration.contribution.length > 20) {
    scores.usefulness += 0.4;
  }
  if (theory.theoreticalIntegration.practicalImplications.length > 0) scores.usefulness += 0.3;
  if (theory.theoreticalIntegration.futureResearch.length > 0) scores.usefulness += 0.3;

  const overallQuality = Object.values(scores).reduce((a, b) => a + b, 0) / Object.keys(scores).length;

  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const recommendations: string[] = [];

  if (scores.credibility >= 0.8) strengths.push('Strong evidence of systematic analysis');
  else {
    weaknesses.push('Theory needs more systematic development');
    recommendations.push('Ensure all paradigm model elements are developed and relationships are specified');
  }

  if (scores.originality >= 0.7) strengths.push('Theory offers fresh insights');
  else {
    weaknesses.push('Theory may lack originality');
    recommendations.push('Develop more theoretical propositions and clarify what is novel about this theory');
  }

  if (scores.resonance >= 0.7) strengths.push('Theory captures richness of experience');
  else {
    weaknesses.push('Theory may not fully capture participant experiences');
    recommendations.push('Develop more contextual and conditional factors; strengthen the storyline');
  }

  if (scores.usefulness >= 0.7) strengths.push('Theory has clear practical value');
  else {
    weaknesses.push('Practical implications need development');
    recommendations.push('Articulate practical implications and future research directions');
  }

  if (!theory.saturationEvidence.categoriesSaturated) {
    weaknesses.push('Theoretical saturation not achieved');
    recommendations.push('Continue analysis or acknowledge saturation limitations');
  }

  return {
    overallQuality,
    criteriaScores: scores,
    strengths,
    weaknesses,
    recommendations,
    passesQualityThreshold: overallQuality >= 0.65
  };
}

/**
 * Calculate average code overlap between themes
 */
function calculateThemeOverlap(themes: Theme[]): number {
  if (themes.length < 2) return 0;

  let totalOverlap = 0;
  let comparisons = 0;

  for (let i = 0; i < themes.length; i++) {
    for (let j = i + 1; j < themes.length; j++) {
      const codes1 = new Set(themes[i].relatedCodes);
      const codes2 = new Set(themes[j].relatedCodes);
      const overlap = [...codes1].filter(c => codes2.has(c)).length;
      totalOverlap += overlap;
      comparisons++;
    }
  }

  return comparisons > 0 ? totalOverlap / comparisons : 0;
}

/**
 * Check for theoretical saturation
 */
export function checkSaturation(
  codes: any[],
  recentDataBatches: any[][]
): { saturated: boolean; confidence: number; evidence: string } {
  if (recentDataBatches.length < 3) {
    return {
      saturated: false,
      confidence: 0,
      evidence: 'Insufficient data batches to assess saturation (need at least 3 batches)'
    };
  }

  // Check if new codes are still being generated
  const codesPerBatch = recentDataBatches.map(batch => {
    // Count unique codes in this batch
    const uniqueCodes = new Set(batch.map((item: any) => item.code || item.label));
    return uniqueCodes.size;
  });

  // If last 3 batches show <10% new codes, consider saturated
  const lastThree = codesPerBatch.slice(-3);
  const avgNewCodes = lastThree.reduce((a, b) => a + b, 0) / 3;
  const totalCodes = codes.length;
  const newCodeRate = avgNewCodes / totalCodes;

  if (newCodeRate < 0.1) {
    return {
      saturated: true,
      confidence: 0.8,
      evidence: `Last 3 data batches generated <10% new codes (${Math.round(newCodeRate * 100)}%)`
    };
  } else if (newCodeRate < 0.2) {
    return {
      saturated: true,
      confidence: 0.6,
      evidence: `New code generation slowing (${Math.round(newCodeRate * 100)}% in recent batches)`
    };
  } else {
    return {
      saturated: false,
      confidence: 1 - newCodeRate,
      evidence: `Still generating new codes at ${Math.round(newCodeRate * 100)}% rate - continue data collection`
    };
  }
}
