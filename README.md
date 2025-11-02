# 🌍 QualAI Community Methodologies

**The world's first open-source, peer-reviewed qualitative research methodology repository.**

This repository contains community-contributed qualitative research methodologies for use with [QualAI](https://github.com/seanshin0214/qualai-mcp).

---

## 📖 What Are Community Methodologies?

Research methodologies created, tested, and shared by qualitative researchers worldwide. Each methodology includes:

- ✅ **Step-by-step guidance** for conducting the analysis
- ✅ **Quality criteria** for validation
- ✅ **Example studies** demonstrating application
- ✅ **Tool recommendations** for each stage
- ✅ **Peer review** by experienced researchers

---

## 🌟 Featured Methodologies

### Theory-Building Approaches

1. **Constructivist Grounded Theory** (Charmaz, 2014)
   - Status: ✅ Core methodology
   - Best for: Theory development from data
   - Difficulty: Intermediate
   - [View methodology](methodologies/grounded-theory-charmaz.json)

### Descriptive Approaches

2. **Reflexive Thematic Analysis** (Braun & Clarke, 2006)
   - Status: ✅ Core methodology
   - Best for: Pattern identification
   - Difficulty: Beginner-friendly
   - [View methodology](methodologies/thematic-analysis-braun-clarke.json)

### Coming Soon

- **Interpretive Phenomenological Analysis** (Smith)
- **Foucauldian Discourse Analysis**
- **Critical Discourse Analysis** (Fairclough)
- **Conversation Analysis**
- **Narrative Analysis**
- **Framework Analysis**

**Want to contribute yours?** See below!

---

## 🚀 Quick Start for Users

### Install QualAI

```bash
git clone https://github.com/seanshin0214/qualai-mcp.git
cd qualai-mcp
npm install && npm run build
```

### Configure Methodology Sync

In your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "qualai": {
      "command": "node",
      "args": ["path/to/qualai-mcp/dist/index.js"],
      "env": {
        "QUALAI_GITHUB_REPO": "amnotyoung/qualai-community-methodologies"
      }
    }
  }
}
```

QualAI will automatically sync methodologies on startup!

---

## 📝 Contributing Your Methodology

**Your methodology could help thousands of researchers worldwide.**

### Prerequisites

- ✅ You've developed or adapted a qualitative methodology
- ✅ You've used it successfully in published research
- ✅ You can provide clear step-by-step guidance
- ✅ You're willing to support users (via GitHub issues)

### Contribution Process

#### Step 1: Prepare Your Methodology

1. **Copy the template:**
   ```bash
   cp TEMPLATE.json methodologies/your-methodology.json
   ```

2. **Fill in all sections:**
   - Metadata (name, author, citation)
   - Stages (step-by-step process)
   - Tools (which QualAI tools to use)
   - Quality criteria (validation checks)
   - Examples (published studies)

3. **Test locally:**
   ```bash
   # Copy to your QualAI installation
   cp methodologies/your-methodology.json ~/qualai-mcp/methodologies/

   # Restart QualAI and test with sample data
   ```

#### Step 2: Submit for Review

1. **Fork this repository**

2. **Create a new branch:**
   ```bash
   git checkout -b add-methodology-your-name
   ```

3. **Add your methodology:**
   ```bash
   git add methodologies/your-methodology.json
   git commit -m "Add [Methodology Name] by [Your Name]"
   ```

4. **Push and create Pull Request:**
   ```bash
   git push origin add-methodology-your-name
   ```

5. **Fill out PR template** (auto-populated)

#### Step 3: Peer Review

Your methodology will be reviewed by:
- ✅ 2+ experienced qualitative researchers
- ✅ 1 technical reviewer (JSON validation)
- ✅ Community feedback (optional)

**Review criteria:**
- Methodological rigor
- Clarity of instructions
- Completeness
- Proper citations
- Technical correctness

**Timeline:** ~2 weeks for review

#### Step 4: Merge & Recognition

Once approved:
- ✅ Merged into main branch
- ✅ Available to all QualAI users immediately
- ✅ Your name in contributors list
- ✅ Citation tracking enabled
- ✅ Usage statistics (opt-in)

---

## 📋 Methodology Template

See [TEMPLATE.json](TEMPLATE.json) for the complete structure.

**Key sections:**

```json
{
  "id": "unique-slug",
  "name": "Your Methodology Name",
  "version": "1.0.0",
  "author": {
    "name": "Your Name",
    "email": "your@email.com",
    "orcid": "0000-0000-0000-0000",
    "affiliation": "Your Institution"
  },
  "citation": {
    "apa": "Author (Year). Title. Journal.",
    "bibtex": "@article{...}"
  },
  "category": "theory-building | descriptive | interpretive | critical",
  "description": "When to use this methodology (2-3 sentences)",
  "keywords": ["keyword1", "keyword2"],
  "difficulty": "beginner | intermediate | advanced",
  "sampleSize": {
    "minimum": 10,
    "recommended": 15,
    "maximum": null
  },
  "stages": [
    {
      "name": "Stage 1 Name",
      "order": 1,
      "description": "What happens in this stage",
      "guidance": "Detailed step-by-step instructions",
      "tools": ["autoCoding", "refineCodebook"],
      "qualityCriteria": ["Criterion 1", "Criterion 2"],
      "commonPitfalls": ["Pitfall 1", "Pitfall 2"]
    }
  ],
  "examples": [
    {
      "study": "Brief description of study",
      "citation": "Full citation",
      "findings": "Key findings"
    }
  ],
  "resources": [
    {
      "type": "book | article | video | website",
      "title": "Resource title",
      "url": "https://..."
    }
  ]
}
```

---

## 🔍 Quality Standards

All methodologies must meet these standards:

### Methodological Standards
- ✅ Based on peer-reviewed literature
- ✅ Clear epistemological positioning
- ✅ Well-defined stages/phases
- ✅ Quality criteria specified
- ✅ At least 1 example study

### Technical Standards
- ✅ Valid JSON format
- ✅ All required fields completed
- ✅ Proper tool mappings
- ✅ Tested with sample data
- ✅ No syntax errors

### Documentation Standards
- ✅ Clear, jargon-free language
- ✅ Proper citations (APA + BibTeX)
- ✅ Examples for each stage
- ✅ Common pitfalls identified
- ✅ Resources for learning

---

## 👥 Peer Review Process

### Becoming a Reviewer

Interested in reviewing methodologies?

**Requirements:**
- PhD or equivalent in relevant field
- Published qualitative research using the methodology type
- Active qualitative researcher

**Benefits:**
- Help shape the community
- Early access to new methodologies
- Reviewer badge on profile
- Citation in reviewed methodologies

**Apply:** [Open an issue](https://github.com/amnotyoung/qualai-community-methodologies/issues/new?template=reviewer-application.md)

### Review Guidelines

Reviewers should assess:

1. **Methodological Rigor** (40%)
   - Alignment with published literature
   - Theoretical coherence
   - Completeness of process

2. **Usability** (30%)
   - Clarity of instructions
   - Appropriate tool recommendations
   - Helpful examples

3. **Quality Criteria** (20%)
   - Well-defined validation steps
   - Realistic quality standards
   - Common pitfalls addressed

4. **Technical Correctness** (10%)
   - JSON validity
   - Proper field formatting
   - Tool compatibility

---

## 📊 Methodology Statistics

Track the impact of your methodology:

- **Usage Count**: How many projects use your methodology
- **Citations**: Automatic citation in research outputs
- **Ratings**: User feedback and ratings
- **Forks**: Adaptations by other researchers

**Opt-in via your methodology metadata**

---

## 🏆 Top Contributors

<!-- Auto-generated contributor leaderboard -->

1. **[Be the first!]**
2. ...
3. ...

**Contribute to get featured!**

---

## 📜 Licensing

### Default License
Community methodologies are licensed under **CC-BY-4.0** (Creative Commons Attribution) unless specified otherwise.

**This means:**
- ✅ Anyone can use your methodology
- ✅ Must give appropriate credit
- ✅ Can adapt for any purpose
- ✅ No warranty/liability

### Alternative Licenses
You may use:
- CC-BY-SA-4.0 (Share-alike)
- CC-BY-NC-4.0 (Non-commercial)
- Custom (with approval)

**Specify in your methodology JSON**

---

## 🆘 Support

### For Contributors
- **Questions**: [Discussions](https://github.com/amnotyoung/qualai-community-methodologies/discussions)
- **Issues**: [Issue Tracker](https://github.com/amnotyoung/qualai-community-methodologies/issues)
- **Email**: community@qualai.dev

### For Users
- **QualAI Issues**: [Main repo](https://github.com/seanshin0214/qualai-mcp/issues)
- **Methodology Questions**: [Discussions](https://github.com/amnotyoung/qualai-community-methodologies/discussions)

---

## 🎯 Vision

**Our Goal:**
Build the world's most comprehensive, accessible, and rigorous collection of qualitative research methodologies.

**By 2026:**
- 50+ peer-reviewed methodologies
- 1000+ research projects using QualAI
- 100+ methodology contributors
- 10+ languages supported

**Together, we're democratizing qualitative research.**

---

## 🙏 Acknowledgments

Thank you to all methodology contributors and reviewers who make this possible.

**Special Thanks:**
- Kathy Charmaz - Constructivist Grounded Theory
- Virginia Braun & Victoria Clarke - Reflexive Thematic Analysis
- All future contributors!

---

## 📞 Contact

- **General Inquiries**: community@qualai.dev
- **Technical Issues**: [GitHub Issues](https://github.com/amnotyoung/qualai-community-methodologies/issues)
- **Twitter**: @QualAI_Research

---

**Made with ❤️ by the qualitative research community**

**Let's transform research together.**

[**→ Start Contributing**](CONTRIBUTING.md)
