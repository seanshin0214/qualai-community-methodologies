# 🤝 Contributing to QualAI Community Methodologies

Thank you for considering contributing to QualAI! This guide will help you share your methodology with the global research community.

---

## 📋 Table of Contents

1. [Who Can Contribute](#who-can-contribute)
2. [What to Contribute](#what-to-contribute)
3. [How to Contribute](#how-to-contribute)
4. [Review Process](#review-process)
5. [After Acceptance](#after-acceptance)
6. [Guidelines](#guidelines)
7. [Support](#support)

---

## 👥 Who Can Contribute

**Anyone can contribute if you:**

✅ Have developed or adapted a qualitative methodology
✅ Have used it successfully in research (published or pre-print)
✅ Can provide clear, step-by-step guidance
✅ Are willing to support users via GitHub issues

**No PhD required!** We welcome contributions from:
- Graduate students with novel approaches
- Practitioners with field-tested methods
- Interdisciplinary researchers
- Indigenous researchers with culturally-specific methods
- Anyone innovating in qualitative research

---

## 📚 What to Contribute

### Types of Contributions

1. **New Methodologies**
   - Original methodologies you've developed
   - Adaptations of existing methods for new contexts
   - Culturally-specific approaches
   - Interdisciplinary hybrid methods

2. **Methodology Improvements**
   - Updates to existing methodologies
   - Additional examples or resources
   - Clarifications based on user feedback
   - Translation to other languages

3. **Documentation**
   - Tutorial videos
   - Example datasets (anonymized)
   - Case studies
   - Best practices guides

4. **Review & Feedback**
   - Peer review of proposed methodologies
   - Testing methodologies with your data
   - User experience feedback

---

## 🚀 How to Contribute

### Step-by-Step Guide

#### 1. Prepare Your Methodology

**A. Copy the Template**

```bash
# Clone the community repository
git clone https://github.com/qualai-community/methodologies.git
cd methodologies

# Copy template
cp TEMPLATE.json methodologies/your-methodology-name.json
```

**B. Fill Out All Sections**

Required sections:
- ✅ Metadata (id, name, version, author)
- ✅ Citation (APA and BibTeX)
- ✅ Description (brief and long)
- ✅ At least 2 stages with detailed guidance
- ✅ Quality criteria for each stage
- ✅ At least 1 published example

Optional but recommended:
- Related methodologies
- Common pitfalls
- Resources for learning
- Tool parameter mappings

**C. Validate Your JSON**

```bash
# Install validator
npm install

# Validate your methodology
npm run validate methodologies/your-methodology-name.json
```

Fix any errors before proceeding.

#### 2. Test Locally

**A. Install QualAI**

```bash
git clone https://github.com/seanshin0214/qualai-mcp.git
cd qualai-mcp
npm install && npm run build
```

**B. Copy Your Methodology**

```bash
cp ../qualai-community-methodologies/methodologies/your-methodology.json ./methodologies/
```

**C. Test with Sample Data**

1. Restart Claude Desktop
2. Try loading your methodology: "Load [your methodology name]"
3. Test each stage with sample data
4. Verify all tools work as expected
5. Check quality criteria are clear

**Document any issues and fix them.**

#### 3. Submit Pull Request

**A. Fork the Repository**

Click "Fork" on [qualai-community/methodologies](https://github.com/qualai-community/methodologies)

**B. Create a Branch**

```bash
git checkout -b add-methodology-yourname
```

**C. Add Your Files**

```bash
# Add methodology
git add methodologies/your-methodology.json

# If you have additional resources
git add resources/your-methodology/

# Commit with clear message
git commit -m "Add [Methodology Name] by [Your Name]

- Brief description of methodology
- Target use cases
- Key innovations"
```

**D. Push and Create PR**

```bash
git push origin add-methodology-yourname
```

Then create Pull Request on GitHub with the template.

#### 4. Pull Request Template

When you create a PR, fill out:

```markdown
## Methodology Information

**Name:** Your Methodology Name
**Category:** theory-building | descriptive | interpretive | critical
**Difficulty:** beginner | intermediate | advanced

## Description

Brief description of what this methodology does and when to use it.

## Checklist

- [ ] Methodology JSON is valid (run `npm run validate`)
- [ ] All required fields completed
- [ ] At least 2 stages with detailed guidance
- [ ] Quality criteria for each stage
- [ ] At least 1 published example
- [ ] Tested locally with sample data
- [ ] Proper citations (APA + BibTeX)
- [ ] License specified (default: CC-BY-4.0)

## Testing

Describe how you tested this methodology:
- Sample data used:
- Tools tested:
- Issues encountered:

## Additional Context

Any additional information reviewers should know.

## Author Agreement

- [ ] I am the original author or have permission to share
- [ ] I agree to the Code of Conduct
- [ ] I will support users via GitHub issues
- [ ] I understand this will be licensed under CC-BY-4.0 (or specified license)
```

---

## 🔍 Review Process

### What Happens Next

1. **Automated Checks** (immediate)
   - JSON validation
   - Required fields check
   - Citation format verification
   - File size limits

2. **Technical Review** (2-3 days)
   - Reviewer: QualAI maintainer
   - Checks: Tool compatibility, JSON structure, completeness

3. **Peer Review** (1-2 weeks)
   - Reviewers: 2+ qualitative researchers
   - Checks: Methodological rigor, clarity, accuracy

4. **Community Feedback** (optional, 1 week)
   - Open for community comments
   - You can address feedback

5. **Final Decision** (2-3 days)
   - Approved: Merged!
   - Revisions needed: Specific feedback provided
   - Declined: Explanation and alternative suggestions

### Review Criteria

Reviewers assess:

**Methodological Rigor (40%)**
- Alignment with published literature
- Theoretical coherence
- Clear epistemological positioning
- Appropriate for stated use cases

**Usability (30%)**
- Clear, step-by-step instructions
- Appropriate tool recommendations
- Helpful examples
- Jargon explained

**Quality & Validation (20%)**
- Well-defined quality criteria
- Realistic standards
- Common pitfalls identified
- Validation process clear

**Technical Correctness (10%)**
- Valid JSON
- All required fields
- Proper formatting
- Tool mappings correct

### Responding to Reviews

**If revisions requested:**

```bash
# Make changes to your methodology
git add methodologies/your-methodology.json
git commit -m "Address review feedback: [specific changes]"
git push origin add-methodology-yourname
```

PR will automatically update. Respond to reviewer comments on GitHub.

---

## ✅ After Acceptance

### What Happens

1. **Immediate**
   - Methodology merged to main branch
   - Available in QualAI within 24 hours
   - Added to methodology catalog

2. **Within 1 Week**
   - Featured on social media
   - Added to contributor leaderboard
   - DOI assigned (via Zenodo)

3. **Ongoing**
   - Usage statistics tracked (opt-in)
   - Citations counted
   - User ratings collected
   - Issues/questions routed to you

### Your Responsibilities

As a methodology contributor, you agree to:

✅ **Support users** who have questions (via GitHub issues)
✅ **Respond to issues** within 2 weeks (or delegate)
✅ **Update methodology** if major issues found
✅ **Maintain quality** of your contribution

Don't worry - the community will help! You're not alone.

### Recognition

You'll receive:
- ✅ Name in methodology metadata
- ✅ Profile on contributors page
- ✅ Automatic citation generation
- ✅ Usage statistics (opt-in)
- ✅ Contributor badge
- ✅ DOI for citation in your CV

---

## 📖 Guidelines

### Writing Style

**DO:**
- ✅ Write in clear, accessible language
- ✅ Define technical terms
- ✅ Use active voice
- ✅ Provide concrete examples
- ✅ Anticipate user questions

**DON'T:**
- ❌ Assume advanced knowledge
- ❌ Use unexplained jargon
- ❌ Write vague instructions
- ❌ Skip important steps
- ❌ Forget to cite sources

### Example: Good vs Bad

**❌ Bad:**
```json
"guidance": "Code the data using the methodology's principles."
```

**✅ Good:**
```json
"guidance": "Code the data line-by-line:\n1. Read the first sentence of your transcript\n2. Ask: What is happening here?\n3. Create a code that captures the action or process\n4. Use gerunds (verbs ending in -ing) when possible\n5. Example: 'seeking reassurance' not 'reassurance'\n6. Move to the next sentence and repeat"
```

### Citations

**Always cite:**
- Original methodology developers
- Key theoretical works
- Example studies
- Resources you recommend

**Format:**
- APA 7th edition for text
- BibTeX for programmatic use
- Include DOIs when available

### Examples

Provide at least 1 published example showing:
- Research question addressed
- Sample size and data type
- How methodology was applied
- Key findings
- Lessons learned

**Good examples:**
- Published in peer-reviewed journals
- Diverse contexts (different fields, populations)
- Clear explanation of process
- Accessible (open access preferred)

### Common Pitfalls

For each stage, identify:
- What typically goes wrong
- Why it happens
- How to avoid it
- What to do if it happens

This is invaluable for new users!

---

## 🌍 Special Considerations

### Culturally-Specific Methodologies

We strongly encourage methodologies from diverse cultural contexts!

**Additional guidance:**
- Explain cultural context clearly
- Identify when methodology is/isn't appropriate
- Provide resources for cultural understanding
- Consider offering consultation for cross-cultural use

### Interdisciplinary Methodologies

**Clearly explain:**
- Which disciplines it bridges
- Epistemological tensions (if any)
- When interdisciplinary approach is valuable
- Disciplinary prerequisites

### Adaptations of Existing Methods

**Must include:**
- Original methodology citation
- Clear explanation of what you changed and why
- Comparison: when to use original vs. adaptation
- Permission from original authors (if alive)

### Proprietary or Restricted Methods

**Not allowed:**
- Methodologies requiring paid training
- Methods with usage restrictions
- Proprietary approaches (unless you own them)

**We're building an open commons!**

---

## 🆘 Getting Help

### Before Contributing

**Questions?**
- Read the [FAQ](FAQ.md)
- Browse existing methodologies for examples
- Ask in [Discussions](https://github.com/qualai-community/methodologies/discussions)

### During Contribution

**Stuck?**
- Post in [Discussions](https://github.com/qualai-community/methodologies/discussions)
- Email: community@qualai.dev
- Tag maintainers in your PR

### Technical Issues

**JSON validation errors:**
- Use [JSONLint](https://jsonlint.com/)
- Check [TEMPLATE.json](TEMPLATE.json) for structure
- Run `npm run validate`

**Git/GitHub help:**
- [GitHub's Git Handbook](https://guides.github.com/introduction/git-handbook/)
- Ask in Discussions
- Many researchers new to Git - we're here to help!

---

## 🎯 Tips for Success

1. **Start Simple**
   - Your first contribution doesn't need to be perfect
   - You can improve it based on feedback
   - The community will help!

2. **Look at Examples**
   - Study existing methodologies
   - See what makes them clear
   - Model your contribution on the best ones

3. **Test Thoroughly**
   - Actually use your methodology with sample data
   - Ask a colleague to try it
   - Document any confusion

4. **Be Responsive**
   - Reply to reviewer comments
   - Address feedback promptly
   - Ask questions if unclear

5. **Think About Users**
   - What will they struggle with?
   - What questions will they have?
   - How can you help them succeed?

---

## 🏆 Contributor Levels

As you contribute, you'll level up!

**🥉 Bronze Contributor**
- 1 methodology accepted
- Badge on profile

**🥈 Silver Contributor**
- 3 methodologies accepted OR
- 10+ reviews provided
- Featured on contributors page

**🥇 Gold Contributor**
- 5+ methodologies accepted OR
- 25+ reviews provided
- Priority support for your methods

**💎 Diamond Contributor**
- 10+ methodologies OR
- Extraordinary community service
- Invited to advisory board

---

## 📜 Code of Conduct

All contributors must follow our [Code of Conduct](CODE_OF_CONDUCT.md).

**In brief:**
- Be respectful and inclusive
- Assume good intentions
- Provide constructive feedback
- Support fellow contributors
- No harassment or discrimination

**Violations:** Report to conduct@qualai.dev

---

## 🎉 Thank You!

Your contribution helps researchers worldwide conduct better, more rigorous qualitative research.

**Every methodology you share:**
- Saves hundreds of hours for other researchers
- Advances methodological innovation
- Democratizes access to advanced methods
- Builds the community

**You're making a difference.**

---

## 📞 Contact

- **General Questions**: [Discussions](https://github.com/qualai-community/methodologies/discussions)
- **Technical Issues**: [Issues](https://github.com/qualai-community/methodologies/issues)
- **Private Inquiries**: community@qualai.dev

---

**Ready to contribute?**

[**→ Copy the Template and Get Started**](TEMPLATE.json)

**Questions first?**

[**→ Browse Existing Methodologies**](methodologies/)

---

**Made with ❤️ by the qualitative research community**
