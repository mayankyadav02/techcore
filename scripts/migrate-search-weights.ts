import { connectMongo } from "@/lib/db";
import { Service } from "@/modules/catalog/service.model";
import { Solution } from "@/modules/catalog/solution.model";
import { Industry } from "@/modules/catalog/industry.model";
import { Project } from "@/modules/work/project.model";
import { BlogPost } from "@/modules/insights/blog-post.model";
import { Job } from "@/modules/careers/job.model";

async function run() {
  console.log("Starting Phase 15C Migration: Search Index Weights");
  
  try {
    await connectMongo();

    const collectionsToProcess = [
      { model: Service, indexName: "service_text_idx" },
      { model: Solution, indexName: "solution_text_idx" },
      { model: Industry, indexName: "industry_text_idx" },
      { model: Project, indexName: "project_text_idx" },
      { model: BlogPost, indexName: "blog_post_text_idx" },
      { model: Job, indexName: "job_text_idx" },
    ];

    for (const { model, indexName } of collectionsToProcess) {
      console.log(`\nProcessing ${model.modelName} (index: ${indexName})...`);
      try {
        await model.collection.dropIndex(indexName);
        console.log(`Dropped existing index: ${indexName}`);
      } catch (e: any) {
        if (e.code === 27) {
          console.log(`Index ${indexName} did not exist, skipping drop.`);
        } else {
          console.error(`Failed to drop index ${indexName}: ${e.message}`);
          process.exit(1);
        }
      }

      console.log(`Syncing indexes for ${model.modelName}...`);
      await model.syncIndexes();
      console.log(`Index sync complete for ${model.modelName}.`);

      const indexes = await model.collection.indexes();
      const textIndex = indexes.find((idx: any) => idx.name === indexName);
      if (textIndex && textIndex.weights) {
        console.log(`SUCCESS: ${indexName} successfully recreated with weights.`);
      } else {
        console.error(`FAILURE: ${indexName} does not include weights or is missing.`);
        console.dir(textIndex, { depth: null });
        process.exit(1);
      }
    }
    
    console.log("\nMigration finished successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

run();
