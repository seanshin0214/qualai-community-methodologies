/**
 * Theory Engine - Grounded Theory construction and theoretical development
 */

import type { Code } from './coding-engine.js';
import type { Theme } from './theme-engine.js';

export interface GroundedTheory {
  title: string;
  coreCategory: string;
  paradigm: 'constructivist' | 'objectivist';
  paradigmModel: ParadigmModel;
  storyline: string;
  theoreticalPropositions: string[];
  categoryRelationships: CategoryRelationship[];
  metadata: {
    researchQuestion: string;
    createdAt: Date;
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
  strength: 'strong' | 'moderate' | 'weak';
}

export class TheoryEngine {
  /**
   * Build grounded theory from codes and themes
   */
  async buildGroundedTheory(params: {
    codes: Code[];
    themes: Theme[];
    researchQuestion: string;
    paradigm?: 'constructivist' | 'objectivist';
  }): Promise<GroundedTheory> {
    const { codes, themes, researchQuestion, paradigm = 'constructivist' } = params;

    // 1. Identify core category (most prevalent theme)
    const coreCategory = this.identifyCoreCategory(themes);

    // 2. Build paradigm model
    const paradigmModel = this.buildParadigmModel(themes, codes);

    // 3. Map category relationships
    const relationships = this.mapCategoryRelationships(themes);

    // 4. Generate storyline
    const storyline = this.generateStoryline(coreCategory, paradigmModel, themes);

    // 5. Generate theoretical propositions
    const propositions = this.generatePropositions(themes, relationships);

    const title = `Theory of ${coreCategory.name}`;

    return {
      title,
      coreCategory: coreCategory.name,
      paradigm,
      paradigmModel,
      storyline,
      theoreticalPropositions: propositions,
      categoryRelationships: relationships,
      metadata: {
        researchQuestion,
        createdAt: new Date(),
      },
    };
  }

  /**
   * Identify the core category - the main phenomenon
   */
  private identifyCoreCategory(themes: Theme[]): Theme {
    // Core category is typically:
    // 1. Most prevalent
    // 2. Central to other themes
    // 3. Accounts for most variation

    if (themes.length === 0) {
      return {
        name: 'Unknown Process',
        description: 'No themes identified',
        supportingCodes: [],
        prevalence: 0,
        examples: [],
      };
    }

    // Sort by prevalence
    const sorted = [...themes].sort((a, b) => b.prevalence - a.prevalence);

    return sorted[0];
  }

  /**
   * Build the paradigm model (Strauss & Corbin)
   */
  private buildParadigmModel(themes: Theme[], codes: Code[]): ParadigmModel {
    const model: ParadigmModel = {
      phenomenon: '',
      causalConditions: [],
      context: [],
      strategies: [],
      consequences: [],
      interveningConditions: [],
    };

    // Analyze themes to categorize into paradigm elements
    for (const theme of themes) {
      const themeName = theme.name.toLowerCase();

      // Identify causal conditions (what leads to phenomenon)
      if (
        themeName.includes('trigger') ||
        themeName.includes('cause') ||
        themeName.includes('lead to') ||
        themeName.includes('result from')
      ) {
        model.causalConditions.push(theme.name);
      }

      // Identify context (environmental/situational factors)
      else if (
        themeName.includes('context') ||
        themeName.includes('environment') ||
        themeName.includes('setting') ||
        themeName.includes('background')
      ) {
        model.context.push(theme.name);
      }

      // Identify strategies/actions
      else if (
        themeName.includes('strateg') ||
        themeName.includes('action') ||
        themeName.includes('approach') ||
        themeName.includes('managing') ||
        themeName.includes('coping') ||
        this.containsGerunds(theme.supportingCodes)
      ) {
        model.strategies.push(theme.name);
      }

      // Identify consequences (outcomes)
      else if (
        themeName.includes('outcome') ||
        themeName.includes('result') ||
        themeName.includes('consequence') ||
        themeName.includes('impact') ||
        themeName.includes('effect')
      ) {
        model.consequences.push(theme.name);
      }

      // Identify intervening conditions (factors that influence strategies)
      else if (
        themeName.includes('factor') ||
        themeName.includes('influence') ||
        themeName.includes('constraint') ||
        themeName.includes('resource')
      ) {
        model.interveningConditions.push(theme.name);
      }

      // If can't categorize, likely a strategy or context
      else {
        if (theme.prevalence > 0.3) {
          model.strategies.push(theme.name);
        } else {
          model.context.push(theme.name);
        }
      }
    }

    // Set phenomenon (core phenomenon being studied)
    if (themes.length > 0) {
      model.phenomenon = themes[0].name; // Most prevalent theme
    }

    return model;
  }

  /**
   * Check if codes contain action-oriented gerunds
   */
  private containsGerunds(codes: string[]): boolean {
    return codes.some(code => /\w+ing/.test(code));
  }

  /**
   * Map relationships between categories
   */
  private mapCategoryRelationships(themes: Theme[]): CategoryRelationship[] {
    const relationships: CategoryRelationship[] = [];

    // Analyze theme names and descriptions for relationship indicators
    for (let i = 0; i < themes.length; i++) {
      for (let j = 0; j < themes.length; j++) {
        if (i === j) continue;

        const theme1 = themes[i];
        const theme2 = themes[j];

        const relationship = this.inferRelationship(theme1, theme2);
        if (relationship) {
          relationships.push({
            from: theme1.name,
            to: theme2.name,
            ...relationship,
          });
        }
      }
    }

    return relationships;
  }

  /**
   * Infer relationship between two themes
   */
  private inferRelationship(
    theme1: Theme,
    theme2: Theme
  ): { type: CategoryRelationship['type']; explanation: string; strength: 'strong' | 'moderate' | 'weak' } | null {
    const name1 = theme1.name.toLowerCase();
    const name2 = theme2.name.toLowerCase();

    // Check for shared codes (indicates relationship)
    const sharedCodes = theme1.supportingCodes.filter(c => theme2.supportingCodes.includes(c));
    if (sharedCodes.length === 0) return null;

    const strength = sharedCodes.length > 2 ? 'strong' : sharedCodes.length > 1 ? 'moderate' : 'weak';

    // Infer relationship type based on theme names
    if (name1.includes('challeng') && name2.includes('strateg')) {
      return {
        type: 'triggers',
        explanation: 'Challenges trigger the use of strategies',
        strength,
      };
    }

    if (name1.includes('strateg') && name2.includes('outcome')) {
      return {
        type: 'causes',
        explanation: 'Strategies lead to outcomes',
        strength,
      };
    }

    if (name1.includes('context') || name1.includes('factor')) {
      return {
        type: 'influences',
        explanation: 'Contextual factors influence other processes',
        strength,
      };
    }

    // Default: influence relationship
    return {
      type: 'influences',
      explanation: `"${theme1.name}" influences "${theme2.name}" through shared underlying processes`,
      strength,
    };
  }

  /**
   * Generate theoretical storyline
   */
  private generateStoryline(coreCategory: Theme, model: ParadigmModel, themes: Theme[]): string {
    let storyline = `This grounded theory explains the process of ${coreCategory.name.toLowerCase()}. `;

    // Add causal conditions
    if (model.causalConditions.length > 0) {
      storyline += `This process is initiated by ${this.formatList(model.causalConditions)}. `;
    }

    // Add context
    if (model.context.length > 0) {
      storyline += `It occurs within the context of ${this.formatList(model.context)}. `;
    }

    // Add strategies
    if (model.strategies.length > 0) {
      storyline += `Participants engage in ${this.formatList(model.strategies)} as responses to the phenomenon. `;
    }

    // Add intervening conditions
    if (model.interveningConditions.length > 0) {
      storyline += `These responses are shaped by ${this.formatList(model.interveningConditions)}. `;
    }

    // Add consequences
    if (model.consequences.length > 0) {
      storyline += `This ultimately results in ${this.formatList(model.consequences)}. `;
    }

    // Add integration
    storyline += `\n\nThe data reveals ${themes.length} interconnected themes that together explain how participants navigate ${coreCategory.name.toLowerCase()}. `;
    storyline += `This theory demonstrates that the process is not linear but involves continuous interaction between individual actions, contextual factors, and evolving outcomes.`;

    return storyline;
  }

  /**
   * Format list of items for narrative
   */
  private formatList(items: string[]): string {
    if (items.length === 0) return '';
    if (items.length === 1) return items[0].toLowerCase();
    if (items.length === 2) return `${items[0].toLowerCase()} and ${items[1].toLowerCase()}`;

    const lastItem = items[items.length - 1];
    const otherItems = items.slice(0, -1);
    return `${otherItems.map(i => i.toLowerCase()).join(', ')}, and ${lastItem.toLowerCase()}`;
  }

  /**
   * Generate theoretical propositions
   */
  private generatePropositions(themes: Theme[], relationships: CategoryRelationship[]): string[] {
    const propositions: string[] = [];

    // Generate propositions from strong relationships
    const strongRelationships = relationships.filter(r => r.strength === 'strong');

    for (const rel of strongRelationships.slice(0, 5)) {
      let proposition = '';

      switch (rel.type) {
        case 'causes':
          proposition = `${rel.from} directly causes ${rel.to}`;
          break;
        case 'triggers':
          proposition = `${rel.from} triggers the initiation of ${rel.to}`;
          break;
        case 'influences':
          proposition = `${rel.from} significantly influences ${rel.to}`;
          break;
        case 'enables':
          proposition = `${rel.from} enables or facilitates ${rel.to}`;
          break;
        case 'constrains':
          proposition = `${rel.from} constrains or limits ${rel.to}`;
          break;
        case 'precedes':
          proposition = `${rel.from} temporally precedes ${rel.to}`;
          break;
      }

      if (proposition) {
        propositions.push(proposition);
      }
    }

    // Add propositions from prevalent themes
    const prevalentThemes = themes.filter(t => t.prevalence > 0.5);
    for (const theme of prevalentThemes.slice(0, 3)) {
      propositions.push(
        `${theme.name} is a central process that appears across most participant experiences`
      );
    }

    // Ensure we have at least some propositions
    if (propositions.length === 0) {
      propositions.push(
        'The identified themes represent interconnected processes in participants\' experiences',
        'Context and individual factors mediate how these processes manifest',
        'The overall process is dynamic and evolves over time'
      );
    }

    return propositions;
  }

  /**
   * Generate concept map data
   */
  generateConceptMap(params: {
    codes: Code[];
    themes: Theme[];
    style: 'hierarchical' | 'network' | 'process';
  }): {
    nodes: Array<{ id: string; label: string; type: 'code' | 'theme' | 'category'; size: number }>;
    edges: Array<{ from: string; to: string; type: string }>;
  } {
    const { codes, themes, style } = params;
    const nodes: Array<{ id: string; label: string; type: 'code' | 'theme' | 'category'; size: number }> = [];
    const edges: Array<{ from: string; to: string; type: string }> = [];

    // Add theme nodes
    for (const theme of themes) {
      nodes.push({
        id: theme.name,
        label: theme.name,
        type: 'theme',
        size: theme.prevalence * 100,
      });

      // Add edges from theme to supporting codes
      for (const codeName of theme.supportingCodes) {
        const code = codes.find(c => c.name === codeName);
        if (code) {
          // Add code node if not exists
          if (!nodes.some(n => n.id === code.name)) {
            nodes.push({
              id: code.name,
              label: code.name,
              type: 'code',
              size: code.frequency * 10,
            });
          }

          edges.push({
            from: theme.name,
            to: code.name,
            type: 'includes',
          });
        }
      }
    }

    return { nodes, edges };
  }
}
