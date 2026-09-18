import { connectMongo } from "@/lib/db";
import { BlogPost } from "@/modules/insights/blog-post.model";
import { htmlToSearchText } from "@/modules/insights/blog-search-text";
import mongoose from "mongoose";

async function run() {
  console.log("Starting Phase 15B Migration: Blog Search Index");
  
  try {
    await connectMongo();
    
    console.log("Fetching all blog posts...");
    const posts = await BlogPost.find({});
    console.log(`Found ${posts.length} posts.`);
    
    let updated = 0;
    let unchanged = 0;
    
    for (const post of posts) {
      const derived = htmlToSearchText(post.body);
      if (post.plainTextBody !== derived) {
        await BlogPost.updateOne({ _id: post._id }, { $set: { plainTextBody: derived } });
        updated++;
      } else {
        unchanged++;
      }
    }
    
    console.log(`Backfill complete. Updated: ${updated}, Unchanged: ${unchanged}`);
    
    console.log("Dropping old text index...");
    try {
      await mongoose.connection.collection("posts").dropIndex("blog_post_text_idx");
      console.log("Dropped blog_post_text_idx.");
    } catch (e: any) {
      if (e.code === 27) {
        console.log("Index blog_post_text_idx did not exist, skipping drop.");
      } else {
        console.warn("Could not drop index:", e.message);
      }
    }
    
    console.log("Syncing indexes...");
    await BlogPost.syncIndexes();
    console.log("Index sync complete.");
    
    const indexes = await mongoose.connection.collection("posts").indexes();
    const textIndex = indexes.find((idx: any) => idx.name === "blog_post_text_idx");
    if (textIndex && textIndex.weights && textIndex.weights.plainTextBody) {
      console.log("SUCCESS: blog_post_text_idx successfully includes plainTextBody.");
    } else {
      console.error("FAILURE: blog_post_text_idx does not include plainTextBody or is missing.");
      console.dir(textIndex, { depth: null });
      process.exit(1);
    }
    
    console.log("Migration finished successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

run();
