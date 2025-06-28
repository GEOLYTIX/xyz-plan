#!/usr/bin/env node

/**
 * SitRep Generator - Generate markdown sitreps from JSON data
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Status and type icons
const STATUS_ICONS = {
  done: '✅',
  closed: '❌',
  in_progress: '⏳',
  in_review: '👀',
  pending: '⌛',
};

const TYPE_ICONS = {
  feature: 'feature 🚀',
  bug: 'bug 🐛',
  devex: 'DevEx 🖥',
  rfc: 'RFC ♻',
};

class SitRepGenerator {
  constructor() {
    this.sitrepDir = path.join(__dirname, '../sitrep');
    this.dataDir = path.join(this.sitrepDir, 'data');

    // Ensure data directory exists
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
  }

  // Get the latest sitrep data file
  findLatestDataFile() {
    const files = fs
      .readdirSync(this.dataDir)
      .filter((f) => f.startsWith('sitrep-') && f.endsWith('.json'))
      .sort()
      .reverse();

    return files[0] || null;
  }

  // Load sitrep data from JSON
  loadSitrepData(filename) {
    if (!filename) {
      filename = this.findLatestDataFile();
    }

    if (!filename) {
      return this.createDefaultSitrepData();
    }

    const dataPath = path.join(this.dataDir, filename);
    if (!fs.existsSync(dataPath)) {
      throw new Error(`Data file not found: ${filename}`);
    }

    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    return this.validateSitrepData(data);
  }

  // Save sitrep data to JSON
  saveSitrepData(data, filename) {
    if (!filename) {
      filename = this.findLatestDataFile();
    }

    if (!filename) {
      // Create new filename based on next number
      const existingFiles = fs
        .readdirSync(this.dataDir)
        .filter((f) => f.startsWith('sitrep-') && f.endsWith('.json'));
      const nextNumber = existingFiles.length + 1;
      filename = `sitrep-${nextNumber}.json`;
    }

    const dataPath = path.join(this.dataDir, filename);
    const validatedData = this.validateSitrepData(data);

    fs.writeFileSync(dataPath, JSON.stringify(validatedData, null, 2));
    console.log(`💾 Saved sitrep data to ${filename}`);

    return filename;
  }

  // Create default sitrep data structure
  createDefaultSitrepData() {
    return {
      meta: {
        title: 'New SitRep',
        dateRange: 'TBD',
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
      },
      iterations: [{ version: 'v4.x.x', status: 'pending', date: 'TBD' }],
      teams: {
        Agata: [],
        Dennis: [],
        Simon: [],
        Alex: [],
        Rob: [],
      },
      iceBucket: [],
    };
  }

  // Validate and normalize sitrep data
  validateSitrepData(data) {
    const normalized = {
      meta: {
        title: data.meta?.title || 'SitRep',
        dateRange: data.meta?.dateRange || 'TBD',
        startDate: new Date(data.meta.startDate),
        endDate: new Date(data.meta.endDate),
        created: data.meta?.created || new Date().toISOString(),
        updated: new Date().toISOString(),
      },
      iterations: data.iterations || [],
      teams: data.teams || {},
      iceBucket: data.iceBucket || [],
    };

    // Ensure all work items have required fields
    for (const [team, items] of Object.entries(normalized.teams)) {
      normalized.teams[team] = items.map((item) => ({
        title: item.title || '',
        type: item.type || 'feature',
        status: item.status || 'in_progress',
        planned: item.planned || 'no',
        iteration: item.iteration || 'TBD',
        issueNumber: item.issueNumber || null,
        isPR: item.isPR || false,
        url: item.url || null,
      }));
    }

    normalized.iceBucket = normalized.iceBucket.map((item) => ({
      title: item.title || '',
      type: item.type || 'feature',
      status: item.status || 'in_progress',
      planned: item.planned || 'no',
      iteration: item.iteration || 'TBD',
      issueNumber: item.issueNumber || null,
      isPR: item.isPR || false,
      url: item.url || null,
    }));

    return normalized;
  }

  // Generate markdown from JSON data
  generateMarkdown(data, outputPath) {
    const validated = this.validateSitrepData(data);

    let markdown = `---
layout: doc
---

# ${validated.meta.title}

## Iterations

| version | released? |
| ------- | --------- |
`;

    // Add iterations
    for (const iteration of validated.iterations) {
      const statusIcon = STATUS_ICONS[iteration.status] || iteration.status;
      markdown += `| ${iteration.version} | ${statusIcon} (${iteration.date}) |\n`;
    }

    // Add team sections
    for (const [teamName, items] of Object.entries(validated.teams)) {
      if (items.length === 0) continue;

      markdown += `\n## ${teamName}\n\n`;
      markdown += `| title | type | status | planned | iteration | issue/pr |\n`;
      markdown += `| ----- | ---- | ------ | ------- | --------- | -------- |\n`;

      for (const item of items) {
        const typeFormatted = TYPE_ICONS[item.type] || item.type;
        const statusIcon = STATUS_ICONS[item.status] || item.status;

        let issueLink = '';
        if (item.issueNumber) {
          const baseUrl = 'https://github.com/GEOLYTIX/xyz';
          const linkType = item.isPR ? 'pull' : 'issues';
          issueLink = `[${item.issueNumber}](${baseUrl}/${linkType}/${item.issueNumber})`;
        } else if (item.url) {
          issueLink = item.url;
        }

        markdown += `| ${item.title} | ${typeFormatted} | ${statusIcon} | ${item.planned} | ${item.iteration} | ${issueLink} |\n`;
      }
    }

    // Add ice bucket if it has items
    if (validated.iceBucket.length > 0) {
      markdown += `\n## Ice Bucket 🧊\n\n`;
      markdown += `| title | type | status | planned | iteration | issue/pr |\n`;
      markdown += `| ----- | ---- | ------ | ------- | --------- | -------- |\n`;

      for (const item of validated.iceBucket) {
        const typeFormatted = TYPE_ICONS[item.type] || item.type;
        const statusIcon = STATUS_ICONS[item.status] || item.status;

        let issueLink = '';
        if (item.issueNumber) {
          const baseUrl = 'https://github.com/GEOLYTIX/xyz';
          const linkType = item.isPR ? 'pull' : 'issues';
          issueLink = `[${item.issueNumber}](${baseUrl}/${linkType}/${item.issueNumber})`;
        } else if (item.url) {
          issueLink = item.url;
        }

        markdown += `| ${item.title} | ${typeFormatted} | ${statusIcon} | ${item.planned} | ${item.iteration} | ${issueLink} |\n`;
      }
    }

    if (outputPath) {
      fs.writeFileSync(outputPath, markdown);
      console.log(`📝 Generated markdown: ${outputPath}`);
    }

    return markdown;
  }

  // Generate markdown for the latest data file
  generateLatest() {
    const dataFile = this.findLatestDataFile();
    if (!dataFile) {
      console.error('❌ No data files found');
      return;
    }

    console.log(`📊 Loading data from ${dataFile}`);
    const data = this.loadSitrepData(dataFile);

    // Generate corresponding markdown file
    const markdownFile = dataFile.replace('.json', '.md');
    const outputPath = path.join(this.sitrepDir, markdownFile);

    return this.generateMarkdown(data, outputPath);
  }

  // Create a new sitrep data file
  createNewSitrep(title, dateRange) {
    const data = this.createDefaultSitrepData();
    data.meta.title = title;
    data.meta.dateRange = dateRange;

    // Set up default iterations based on the title or current state
    data.iterations = [{ version: 'v4.x.x', status: 'pending', date: 'TBD' }];

    const filename = this.saveSitrepData(data);
    this.generateMarkdown(
      data,
      path.join(this.sitrepDir, filename.replace('.json', '.md')),
    );

    return filename;
  }

  // Get current iterations for version assignment
  getCurrentIterations(data) {
    if (!data) {
      data = this.loadSitrepData();
    }

    let currentMinor = null;
    let currentPatch = null;

    for (const iteration of data.iterations) {
      const match = iteration.version.match(/v?(\d+)\.(\d+)\.(\d+)/);
      if (match) {
        const [, major, minor, patch] = match;
        if (patch === '0') {
          currentMinor = iteration.version;
        } else {
          currentPatch = iteration.version;
        }
      }
    }

    return {
      currentMinor,
      currentPatch,
      allVersions: data.iterations.map((i) => i.version),
    };
  }
}

// CLI interface
function main() {
  const args = process.argv.slice(2);
  const generator = new SitRepGenerator();

  if (args.length === 0) {
    console.log(`
SitRep Generator - JSON to Markdown Generator

Usage:
  node sitrep-generator.js generate              - Generate markdown from latest JSON
  node sitrep-generator.js new <title> <dates>   - Create new sitrep data file
  node sitrep-generator.js validate [file]       - Validate JSON data file

Examples:
  node sitrep-generator.js generate
  node sitrep-generator.js new "June 14th - July 1st" "June 14th - July 1st"
  node sitrep-generator.js validate sitrep-3.json
`);
    return;
  }

  const command = args[0];

  try {
    switch (command) {
      case 'generate':
        generator.generateLatest();
        break;

      case 'new':
        if (args.length < 3) {
          console.error('Usage: new <title> <date-range>');
          return;
        }
        const [, title, dateRange] = args;
        generator.createNewSitrep(title, dateRange);
        break;

      case 'validate':
        const filename = args[1];
        const data = generator.loadSitrepData(filename);
        console.log('✅ Data file is valid');
        console.log(`📊 Teams: ${Object.keys(data.teams).length}`);
        console.log(
          `📝 Total items: ${Object.values(data.teams).flat().length + data.iceBucket.length}`,
        );
        break;

      default:
        console.error(`Unknown command: ${command}`);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default SitRepGenerator;
