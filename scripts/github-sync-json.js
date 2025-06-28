#!/usr/bin/env node

/**
 * GitHub Sync for JSON-based SitRep System
 */

import { Octokit } from '@octokit/rest';
import dotenv from 'dotenv';
import SitRepGenerator from './sitrep-generator.js';

dotenv.config();

class GitHubSyncJson extends SitRepGenerator {
  constructor() {
    super();

    if (!process.env.GITHUB_TOKEN) {
      throw new Error('GITHUB_TOKEN environment variable is required');
    }

    this.octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    });

    this.repoOwner = 'GEOLYTIX';
    this.repoName = 'xyz';

    // Team member GitHub usernames
    this.teamMembers = {
      Agata: 'cityremade',
      Dennis: 'dbauszus-glx',
      Simon: 'simon-leech',
      Alex: 'AlexanderGeere',
      Rob: 'RobAndrewHurst',
    };
  }

  // Get assigned issues and PRs for team members
  async fetchAssignedItems(startDate, endDate) {
    const assignments = {};

    let prs = await this.octokit.rest.pulls.list({
      owner: this.repoOwner,
      repo: this.repoName,
      state: 'all',
      per_page: 100,
      sort: 'updated',
      direction: 'desc',
    });

    prs = prs.data.filter(
      (pr) =>
        new Date(pr.created_at) >= startDate &&
        new Date(pr.created_at) <= endDate,
    );

    for (const [teamName, githubUsername] of Object.entries(this.teamMembers)) {
      console.log(
        `📥 Fetching assignments for ${teamName} (${githubUsername})...`,
      );

      try {
        // Get assigned issues
        const devPrs = prs
          .filter((pr) => pr.user.login === githubUsername)
          .map((pr) => {
            const prData = {
              number: pr.number,
              title: pr.title,
              state: pr.state,
              isPR: true,
              url: pr.html_url,
              labels: pr.labels.map((label) => label.name),
              assignees: pr.assignees.map((assignee) => assignee.login),
              created_at: pr.created_at,
              updated_at: pr.updated_at,
              closed_at: pr.closed_at,
              merged_at: pr.merged_at,
              draft: false,
            };

            return prData;
          });

        assignments[teamName] = devPrs;

        console.log(
          `   Found ${assignments[teamName].length} items for ${teamName}`,
        );
      } catch (error) {
        console.error(
          `❌ Failed to fetch assignments for ${teamName}:`,
          error.message,
        );
        assignments[teamName] = [];
      }
    }

    return assignments;
  }

  // Determine type from GitHub labels
  getTypeFromLabels(labels) {
    const labelMap = {
      bug: 'bug',
      feature: 'feature',
      enhancement: 'feature',
      devex: 'devex',
      rfc: 'rfc',
      documentation: 'devex',
    };

    for (const label of labels) {
      const lowerLabel = label.toLowerCase();
      if (labelMap[lowerLabel]) {
        return labelMap[lowerLabel];
      }
    }

    return 'feature'; // default
  }

  // Determine status from GitHub state
  getStatusFromGitHub(item) {
    if (item.state === 'closed') {
      if (!item.merged_at) {
        return 'closed';
      }
      return 'done';
    }

    if (item.isPR) {
      if (item.draft) {
        return 'in_progress';
      }
      return 'in_review';
    }

    if (item.state === 'open') {
      return 'in_progress';
    }

    return 'in_progress';
  }

  // Determine version from PR target branch
  async getVersionFromPR(number) {
    try {
      const pr = await this.octokit.rest.pulls.get({
        owner: this.repoOwner,
        repo: this.repoName,
        pull_number: number,
      });

      const targetBranch = pr.data.base.ref;
      const data = this.loadSitrepData();

      const iterations = data.iterations.filter(
        (iteration) => iteration.type === targetBranch,
      );

      return iterations.find(
        (iteration) =>
          iteration.date >= (pr.data.merged_at || pr.data.created_at),
      ).version;
    } catch (error) {
      console.log(error);
      console.warn(`! Could not fetch PR ${number}:`, error.message);
      return 'TBD';
    }
  }

  // Sync GitHub assignments with sitrep data
  async syncAssignments() {
    console.log('🔄 Syncing GitHub assignments...\n');

    const data = this.loadSitrepData();

    const assignments = await this.fetchAssignedItems(
      data.meta.startDate,
      data.meta.endDate,
    );

    let totalAdded = 0;
    let totalUpdated = 0;

    for (const [teamName, githubItems] of Object.entries(assignments)) {
      if (githubItems.length === 0) continue;

      console.log(
        `\n📋 Processing ${teamName} team (${githubItems.length} GitHub items)...`,
      );

      for (const githubItem of githubItems) {
        // Find existing item in sitrep
        const existingItem = data.teams[teamName].find(
          (item) => item.issueNumber === githubItem.number,
        );

        const type = this.getTypeFromLabels(githubItem.labels);
        const status = this.getStatusFromGitHub(githubItem);
        const version = githubItem.isPR
          ? await this.getVersionFromPR(githubItem.number)
          : 'TBD';

        if (existingItem) {
          // Update existing item
          let updated = false;

          if (existingItem.title !== githubItem.title) {
            console.log(
              `   📝 Title changed: "${existingItem.title}" → "${githubItem.title}"`,
            );
            existingItem.title = githubItem.title;
            updated = true;
          }

          if (existingItem.type !== type) {
            console.log(`   🏷 Type changed: ${existingItem.type} → ${type}`);
            existingItem.type = type;
            updated = true;
          }

          if (existingItem.status !== status) {
            console.log(
              `   📊 Status changed: ${existingItem.status} → ${status}`,
            );
            existingItem.status = status;
            updated = true;
          }

          if (existingItem.iteration !== version && version !== 'TBD') {
            console.log(
              `   🎯 Version changed: ${existingItem.iteration} → ${version}`,
            );
            existingItem.iteration = version;
            updated = true;
          }

          if (updated) {
            totalUpdated++;
          }
        } else {
          // Add new item
          const newItem = {
            title: githubItem.title,
            type,
            status,
            planned: 'no',
            iteration: version,
            issueNumber: githubItem.number,
            isPR: githubItem.isPR,
            url: githubItem.url,
          };

          data.teams[teamName].push(newItem);
          totalAdded++;

          console.log(`   ➕ Added: ${githubItem.title} [${type}]`);
        }
      }
    }

    // Save updated data
    this.saveSitrepData(data);
    this.generateLatest();

    console.log(`\n✅ Sync completed!`);
    console.log(`   📥 Added: ${totalAdded} items`);
    console.log(`   🔄 Updated: ${totalUpdated} items`);
  }

  // Generate GitHub sync report
  async generateReport() {
    console.log('📊 Generating GitHub sync report...\n');

    const data = this.loadSitrepData();

    const assignments = await this.fetchAssignedItems(
      data.meta.startDate,
      data.meta.endDate,
    );

    console.log(`📈 GitHub Assignment Report`);
    console.log(`================================`);

    for (const [teamName, githubItems] of Object.entries(assignments)) {
      const sitrepItems = data.teams[teamName] || [];
      const githubCount = githubItems.length;
      const sitrepCount = sitrepItems.length;
      const matchedCount = sitrepItems.filter(
        (item) => item.issueNumber,
      ).length;

      console.log(`\n👤 ${teamName}:`);
      console.log(`   GitHub assignments: ${githubCount}`);
      console.log(`   SitRep items: ${sitrepCount}`);
      console.log(`   Matched items: ${matchedCount}`);
      console.log(`   Untracked items: ${githubCount - matchedCount}`);

      if (githubCount - matchedCount > 0) {
        console.log(`   🔍 Untracked GitHub items:`);
        githubItems.forEach((item) => {
          const isTracked = sitrepItems.some(
            (sItem) => sItem.issueNumber === item.number,
          );
          if (!isTracked) {
            const type = item.isPR ? 'PR' : 'Issue';
            console.log(`      - ${type} #${item.number}: ${item.title}`);
          }
        });
      }
    }

    console.log(`\n📋 Summary:`);
    const totalGitHub = Object.values(assignments).flat().length;
    const totalSitRep = Object.values(data.teams).flat().length;
    const totalMatched = Object.values(data.teams)
      .flat()
      .filter((item) => item.issueNumber).length;

    console.log(`   Total GitHub items: ${totalGitHub}`);
    console.log(`   Total SitRep items: ${totalSitRep}`);
    console.log(`   Total matched: ${totalMatched}`);
    console.log(
      `   Coverage: ${Math.round((totalMatched / totalGitHub) * 100)}%`,
    );
  }

  // Update status of existing items based on GitHub
  async updateExistingItems() {
    console.log('🔄 Updating existing items from GitHub...\n');

    const data = this.loadSitrepData();
    let totalUpdated = 0;

    for (const [teamName, items] of Object.entries(data.teams)) {
      for (const item of items) {
        if (!item.issueNumber) continue;

        try {
          console.log(`🔍 Checking ${item.issueNumber}...`);

          const githubItem = await this.octokit.rest.issues.get({
            owner: this.repoOwner,
            repo: this.repoName,
            issue_number: item.issueNumber,
          });

          const newStatus = this.getStatusFromGitHub({
            state: githubItem.data.state,
            isPR: !!githubItem.data.pull_request,
            draft: githubItem.data.draft || false,
          });

          const newType = this.getTypeFromLabels(
            githubItem.data.labels.map((l) => l.name),
          );

          let updated = false;

          if (item.status !== newStatus) {
            console.log(
              `   📊 ${teamName}: "${item.title}" status: ${item.status} → ${newStatus}`,
            );
            item.status = newStatus;
            updated = true;
          }

          if (item.type !== newType) {
            console.log(
              `   🏷 ${teamName}: "${item.title}" type: ${item.type} → ${newType}`,
            );
            item.type = newType;
            updated = true;
          }

          if (item.title !== githubItem.data.title) {
            console.log(
              `   📝 ${teamName}: Title updated: "${item.title}" → "${githubItem.data.title}"`,
            );
            item.title = githubItem.data.title;
            updated = true;
          }

          if (updated) {
            totalUpdated++;
          }
        } catch (error) {
          console.warn(
            `! Could not update item ${item.issueNumber}:`,
            error.message,
          );
        }
      }
    }

    if (totalUpdated > 0) {
      this.saveSitrepData(data);
      this.generateLatest();
      console.log(`\n✅ Updated ${totalUpdated} items from GitHub`);
    } else {
      console.log(`\n✅ All items are up to date`);
    }
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
GitHub Sync for JSON SitRep System

Usage:
  node github-sync-json.js sync     - Sync new assignments from GitHub
  node github-sync-json.js update   - Update existing items from GitHub
  node github-sync-json.js report   - Generate sync report
  node github-sync-json.js full     - Full sync (sync + update)

Examples:
  node github-sync-json.js sync
  node github-sync-json.js report
`);
    return;
  }

  try {
    const syncer = new GitHubSyncJson();
    const command = args[0];

    switch (command) {
      case 'sync':
        await syncer.syncAssignments();
        break;

      case 'update':
        await syncer.updateExistingItems();
        break;

      case 'report':
        await syncer.generateReport();
        break;

      case 'full':
        await syncer.syncAssignments();
        // console.log('\n' + '='.repeat(50) + '\n');
        // await syncer.updateExistingItems();
        break;

      default:
        console.error(`Unknown command: ${command}`);
        process.exit(1);
    }
  } catch (error) {
    console.log(error);
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default GitHubSyncJson;
