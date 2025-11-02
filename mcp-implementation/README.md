# QualAI MCP Tools Implementation

Complete TypeScript implementation of three core qualitative research analysis tools for the QualAI MCP server.

## 📦 Implemented Tools

### 1. refineCodebook
Consolidates and refines initial codes from autoCoding into a structured, hierarchical codebook.

**Features**:
- Merges similar/redundant codes
- Creates hierarchical code structures
- Generates clear code definitions
- Provides usage guidance (when to use/not use)
- Includes quality validation
- Preserves in-vivo codes

**Input**: Initial codes from autoCoding
**Output**: Refined codebook with hierarchy and quality metrics

### 2. extractThemes
Extracts themes from refined codes using inductive, deductive, or hybrid approaches.

**Features**:
- Three analysis modes: inductive, deductive, hybrid
- Three analysis depths: surface, deep, latent
- Theme relationship mapping
- Prevalence tracking across participants
- Quality metrics and saturation checking
- Research question alignment

**Input**: Refined codebook + raw data
**Output**: Themes with supporting quotes and quality metrics

### 3. buildGroundedTheory
Constructs grounded theory from themes and categories using Charmaz's constructivist approach.

**Features**:
- Paradigm model (causal conditions, context, strategies, consequences)
- Core category identification
- Category relationship mapping
- Theoretical integration with existing literature
- Storyline generation
- Visual diagrams (paradigm, process, category maps)
- Quality assessment (credibility, originality, resonance, usefulness)

**Input**: Themes + categories + memos
**Output**: Complete grounded theory with visualizations

## 🏗️ Architecture

```
mcp-implementation/
├── src/
│   ├── tools/
│   │   ├── refineCodebook.ts       # Codebook refinement tool
│   │   ├── extractThemes.ts        # Theme extraction tool
│   │   └── buildGroundedTheory.ts  # Grounded theory construction
│   ├── types/
│   │   ├── codebook.ts             # Codebook type definitions
│   │   ├── themes.ts               # Theme type definitions
│   │   └── theory.ts               # Grounded theory type definitions
│   └── utils/
│       ├── llmPrompts.ts           # LLM prompt templates
│       ├── qualityValidation.ts    # Quality validation functions
│       └── methodologyLoader.ts    # Methodology JSON loader
└── tests/                          # Unit tests (to be added)
```

## 🚀 Integration with QualAI MCP Server

### Step 1: Copy Files

Copy this implementation to your qualai-mcp repository:

```bash
# From qualai-community-methodologies directory
cp -r mcp-implementation/src/* /path/to/qualai-mcp/src/
```

### Step 2: Install Dependencies

Ensure your package.json includes:

```json
{
  "dependencies": {
    "@modelcontextprotocol/sdk": "^0.5.0",
    "@anthropic-ai/sdk": "^0.27.0",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0"
  }
}
```

Install dependencies:
```bash
cd /path/to/qualai-mcp
npm install
```

### Step 3: Register Tools in MCP Server

In your main MCP server file (e.g., `src/index.ts`), register the tools:

```typescript
import { refineCodebook, refineCodebookTool } from './tools/refineCodebook';
import { extractThemes, extractThemesTool } from './tools/extractThemes';
import { buildGroundedTheory, buildGroundedTheoryTool } from './tools/buildGroundedTheory';
import Anthropic from '@anthropic-ai/sdk';

// Initialize Anthropic client
const anthropicClient = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// Register tools with MCP server
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'refineCodebook': {
        // Load initial codes from project storage
        const initialCodes = await loadInitialCodes(args.projectName);

        const result = await refineCodebook(
          args as CodebookRefinementRequest,
          initialCodes,
          anthropicClient
        );

        // Save refined codebook
        await saveCodebook(args.projectName, result.codebook);

        return {
          content: [{
            type: 'text',
            text: JSON.stringify(result, null, 2)
          }]
        };
      }

      case 'extractThemes': {
        // Load codebook and raw data
        const codebook = await loadCodebook(args.projectName);
        const rawData = await loadRawData(args.projectName);

        const result = await extractThemes(
          args as ThemeExtractionRequest,
          codebook,
          rawData,
          anthropicClient
        );

        // Save themes
        await saveThemes(args.projectName, result.themes);

        return {
          content: [{
            type: 'text',
            text: JSON.stringify(result, null, 2)
          }]
        };
      }

      case 'buildGroundedTheory': {
        // Load themes, categories, and memos
        const themes = await loadThemes(args.projectName);
        const categories = await loadCategories(args.projectName);
        const memos = await loadMemos(args.projectName);

        const result = await buildGroundedTheory(
          args as GroundedTheoryRequest,
          themes,
          categories,
          memos,
          anthropicClient
        );

        // Save grounded theory
        await saveGroundedTheory(args.projectName, result.groundedTheory);

        return {
          content: [{
            type: 'text',
            text: JSON.stringify(result, null, 2)
          }]
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [{
        type: 'text',
        text: `Error: ${error.message}`
      }],
      isError: true
    };
  }
});

// Register tool schemas
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      refineCodebookTool,
      extractThemesTool,
      buildGroundedTheoryTool,
      // ... other tools
    ]
  };
});
```

### Step 4: Implement Storage Functions

You'll need to implement storage functions for saving/loading data:

```typescript
// Example storage implementation (adjust based on your storage strategy)
import * as fs from 'fs/promises';
import * as path from 'path';

const PROJECTS_DIR = process.env.QUALAI_PROJECTS_DIR || './projects';

async function loadInitialCodes(projectName: string): Promise<InitialCode[]> {
  const filePath = path.join(PROJECTS_DIR, projectName, 'initial-codes.json');
  const content = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(content);
}

async function saveCodebook(projectName: string, codebook: Codebook): Promise<void> {
  const filePath = path.join(PROJECTS_DIR, projectName, 'codebook.json');
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(codebook, null, 2));
}

// ... implement other storage functions
```

### Step 5: Sync Methodologies

Ensure methodologies from this repository are available:

```bash
# Copy methodologies to qualai-mcp
cp -r methodologies /path/to/qualai-mcp/
```

Or configure automatic sync (recommended):

```typescript
// In your MCP server startup
import { syncMethodologies } from './utils/methodologySync';

// On server start
await syncMethodologies({
  sourceRepo: 'qualai-community/methodologies',
  targetPath: './methodologies'
});
```

### Step 6: Build and Test

```bash
npm run build
npm test  # Run tests
npm start # Start MCP server
```

## 📝 Usage Examples

### Example 1: Complete Qualitative Analysis Workflow

```typescript
// 1. Auto-code initial data (existing tool)
await autoCoding({
  projectName: 'interview-study',
  methodology: 'grounded-theory-charmaz',
  data: transcripts
});

// 2. Refine codebook
const refinement = await refineCodebook({
  projectName: 'interview-study',
  methodology: 'grounded-theory-charmaz',
  mergeSimilar: true
});

console.log(`Codes: ${refinement.summary.initialCodeCount} → ${refinement.summary.finalCodeCount}`);
console.log(`Quality: ${(refinement.summary.qualityScore * 100).toFixed(0)}%`);

// 3. Extract themes
const themeExtraction = await extractThemes({
  projectName: 'interview-study',
  mode: 'inductive',
  depth: 'deep',
  researchQuestion: 'How do participants experience transition?'
});

console.log(`Themes identified: ${themeExtraction.themes.length}`);
console.log(`Saturation: ${themeExtraction.qualityMetrics.saturation ? 'Yes' : 'No'}`);

// 4. Build grounded theory
const theory = await buildGroundedTheory({
  projectName: 'interview-study',
  paradigm: 'constructivist',
  researchQuestion: 'How do participants experience transition?',
  focusOnProcess: true
});

console.log(`Theory: ${theory.groundedTheory.title}`);
console.log(`Core category: ${theory.groundedTheory.coreCategory}`);
console.log(`Credibility: ${(theory.qualityAssessment.credibility * 100).toFixed(0)}%`);
```

### Example 2: Thematic Analysis Workflow

```typescript
// Using Braun & Clarke Thematic Analysis
await autoCoding({
  projectName: 'focus-group-study',
  methodology: 'thematic-analysis-braun-clarke',
  data: focusGroupData
});

const refinement = await refineCodebook({
  projectName: 'focus-group-study',
  methodology: 'thematic-analysis-braun-clarke'
});

const themes = await extractThemes({
  projectName: 'focus-group-study',
  mode: 'inductive',
  depth: 'latent',  // Look for underlying meanings
  researchQuestion: 'What are student experiences of online learning?'
});

// Themes are the end point for Thematic Analysis
console.log('Themes:', themes.themes.map(t => t.name));
```

## 🧪 Testing

Create test files in `tests/` directory:

```typescript
// tests/refineCodebook.test.ts
import { refineCodebook } from '../src/tools/refineCodebook';
import { InitialCode } from '../src/types/codebook';

describe('refineCodebook', () => {
  it('should merge similar codes', async () => {
    const initialCodes: InitialCode[] = [
      { id: '1', label: 'feeling anxious', segment: '...', type: 'in_vivo', dataSource: 'interview-1' },
      { id: '2', label: 'experiencing anxiety', segment: '...', type: 'constructed', dataSource: 'interview-2' }
    ];

    const result = await refineCodebook(
      { projectName: 'test', mergeSimilar: true },
      initialCodes,
      anthropicClient
    );

    expect(result.codebook.codes.length).toBeLessThan(initialCodes.length);
    expect(result.summary.mergedCodeCount).toBeGreaterThan(0);
  });
});
```

## 🔧 Configuration

Environment variables:

```bash
# Required
ANTHROPIC_API_KEY=your_api_key_here

# Optional
QUALAI_PROJECTS_DIR=./projects
QUALAI_METHODOLOGIES_DIR=./methodologies
QUALAI_LOG_LEVEL=info
```

## 📊 Quality Metrics

All tools include quality validation:

### Codebook Quality
- **Clarity**: Codes have clear definitions
- **Distinctiveness**: Codes don't overlap
- **Completeness**: Appropriate number of codes
- **Hierarchy**: Logical structure
- **Examples**: Grounded in data

### Theme Quality
- **Coherence**: Internal consistency
- **Distinctiveness**: Clear boundaries
- **Data Support**: Sufficient evidence
- **Relevance**: Addresses research question
- **Prevalence**: Adequate coverage

### Theory Quality (Charmaz Criteria)
- **Credibility**: Systematic analysis evidence
- **Originality**: Fresh insights
- **Resonance**: Captures experience fullness
- **Usefulness**: Practical value

## 🐛 Troubleshooting

### "Failed to parse Claude response"
- Check that Claude returns valid JSON
- May need to adjust temperature parameter
- Verify prompt templates are correct

### "Methodology not found"
- Ensure methodologies are synced: `cp -r methodologies /path/to/qualai-mcp/`
- Check methodology ID matches filename (e.g., `grounded-theory-charmaz.json`)

### Low quality scores
- Review methodology-specific guidance
- Ensure sufficient data for analysis
- Check that codes are well-defined
- May need more data collection

## 📚 References

- **Charmaz, K. (2014)**. Constructing Grounded Theory (2nd ed.). Sage.
- **Braun, V., & Clarke, V. (2006)**. Using thematic analysis in psychology. Qualitative Research in Psychology, 3(2), 77-101.

## 🤝 Contributing

Improvements welcome! Please:
1. Add tests for new features
2. Follow TypeScript best practices
3. Update documentation
4. Submit pull request

## 📄 License

CC-BY-4.0 (same as community methodologies)

## 💬 Support

- Issues: [GitHub Issues](https://github.com/qualai-community/methodologies/issues)
- Discussions: [GitHub Discussions](https://github.com/qualai-community/methodologies/discussions)
- Email: community@qualai.dev
