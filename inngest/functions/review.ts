import { inngest } from "@/inngest/client";
import {
  getPullRequestDiff,
  postReviewComment,
} from "@/modules/github/lib/github";
import { retrieveContext } from "@/modules/ai/lib/rag";
import prisma from "@/lib/db";

import { generateText } from "ai";
import { google } from "@ai-sdk/google";

/* ------------------ HELPER FUNCTIONS ------------------ */

// Extract file names from diff
function extractFileNamesFromDiff(diff: string): string[] {
  const matches = diff.match(/diff --git a\/(.*?) b\//g) || [];
  return matches.map((m) =>
    m.replace("diff --git a/", "").replace(" b/", "")
  );
}

// Create small summary of diff (avoid token overload)
function summarizeDiff(diff: string): string {
  return diff
    .split("\n")
    .filter((line) => line.startsWith("+") || line.startsWith("-"))
    .slice(0, 50)
    .join("\n");
}

// Extract keywords for better semantic search
function extractKeywords(text: string): string[] {
  return text
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .toLowerCase()
    .split(" ")
    .filter((word) => word.length > 4)
    .slice(0, 20);
}

/* ------------------ MAIN FUNCTION ------------------ */

export const generateReview = inngest.createFunction(
  {
    id: "generate-review",
    concurrency: 5,
    triggers: [{ event: "pr.review.requested" }],
  },
  async ({ event, step }: { event: any; step: any }) => {
    const { owner, repo, prNumber, userId } = event.data;

    /* -------- STEP 1: FETCH PR DATA -------- */

    const { diff, title, description, token } = await step.run(
      "fetch-pr-data",
      async () => {
        const account = await prisma.account.findFirst({
          where: {
            userId: userId,
            providerId: "github",
          },
        });

        if (!account?.accessToken) {
          throw new Error("No GitHub access token found");
        }

        const data = await getPullRequestDiff(
          account.accessToken,
          owner,
          repo,
          prNumber
        );

        return {
          ...data,
          token: account.accessToken,
        };
      }
    );

    /* -------- STEP 2: BUILD OPTIMIZED QUERY -------- */

    const context = await step.run("retrieve-context", async () => {
      const files = extractFileNamesFromDiff(diff);
      const diffSummary = summarizeDiff(diff);
      const keywords = extractKeywords(
        `${title} ${description} ${diffSummary}`
      );

      const query = `
PR Title: ${title}
PR Description: ${description || "No description"}

Files Changed:
${files.join(", ")}

Summary of Changes:
${diffSummary}

Keywords:
${keywords.join(", ")}
      `;

      return await retrieveContext(query, `${owner}/${repo}`);
    });

    /* -------- STEP 3: GENERATE AI REVIEW -------- */

    const review = await step.run("generate-ai-review", async () => {
      const prompt = `You are an expert code reviewer. Analyze the following pull request and provide a detailed, constructive code review.

PR Title: ${title}
PR Description: ${description || "No description"}

Files Changed:
${extractFileNamesFromDiff(diff).join(", ")}

Context from Codebase:
${context.join("\n\n")}

Code Changes:
\`\`\`diff
${diff}
\`\`\`

Please provide:
1. Walkthrough
2. Sequence Diagram (if applicable)
3. Summary
4. Strengths
5. Issues
6. Suggestions
7. Poem`;

      const { text } = await generateText({
        model: google("gemini-2.5-flash"),
        prompt,
      });

      return text;
    });

    /* -------- STEP 4: POST TO GITHUB -------- */

    await step.run("post-comment", async () => {
      await postReviewComment(
        token as string,
        owner,
        repo,
        prNumber,
        review as string
      );
    });

    /* -------- STEP 5: SAVE TO DATABASE -------- */

    await step.run("save-review", async () => {
      const repository = await prisma.repository.findFirst({
        where: { owner, name: repo },
      });

      if (repository) {
        await prisma.review.create({
          data: {
            repositoryId: repository.id,
            prNumber,
            prTitle: title,
            prUrl: `https://github.com/${owner}/${repo}/pull/${prNumber}`,
            review: review as string,
            status: "completed",
          },
        });
      }
    });

    return { success: true };
  }
);
