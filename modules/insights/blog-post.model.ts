import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import { blogStatuses, slugPattern } from "@/modules/shared/enums";
import { seoSchema } from "@/modules/shared/subdocs";

const blogPostSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: slugPattern,
    },
    excerpt: { type: String, required: true, trim: true, maxlength: 400 },
    body: { type: String, required: true, trim: true, maxlength: 50000 },
    authorName: { type: String, required: true, trim: true, maxlength: 80 },
    category: { type: String, required: true, trim: true, maxlength: 40 },
    tags: { type: [String], default: [] },
    heroImageId: { type: Schema.Types.ObjectId },
    heroImageUrl: { type: String, trim: true, maxlength: 500 },
    readTime: { type: String, trim: true, maxlength: 20 },
    seo: { type: seoSchema, default: () => ({}) },
    status: {
      type: String,
      enum: blogStatuses,
      required: true,
      default: "draft",
    },
    featured: { type: Boolean, default: false },
    publishedAt: { type: Date },
    deletedAt: { type: Date, default: null },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true, collection: "posts" },
);

blogPostSchema.index({ status: 1, publishedAt: -1 });
blogPostSchema.index({ deletedAt: 1, status: 1 });
blogPostSchema.index({ category: 1, status: 1 });

export type BlogPost = InferSchemaType<typeof blogPostSchema>;
export type BlogPostModel = Model<BlogPost>;

export const BlogPost =
  (mongoose.models.BlogPost as BlogPostModel | undefined) ??
  mongoose.model<BlogPost>("BlogPost", blogPostSchema);
