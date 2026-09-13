import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import { seoSchema } from "@/modules/shared/subdocs";
import { PAGE_SEO_KEYS } from "./page-seo.schema";

const pageSeoSchema = new Schema(
  {
    page: { 
      type: String, 
      required: true, 
      unique: true, 
      enum: PAGE_SEO_KEYS 
    },
    seo: { type: seoSchema },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export type PageSeoDocument = InferSchemaType<typeof pageSeoSchema>;

export const PageSeo: Model<PageSeoDocument> =
  mongoose.models.PageSeo || mongoose.model<PageSeoDocument>("PageSeo", pageSeoSchema);
