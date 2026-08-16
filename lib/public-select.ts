/** Fields never returned from public catalogue queries. */
export const publicCatalogSelect =
  "-createdBy -updatedBy -deletedAt -__v -relatedServiceIds -relatedSolutionIds -relatedIndustryIds -relatedProjectIds -industryIds -serviceIds -solutionIds -heroImageId -heroImageUrl -galleryIds -avatarId -relatedProjectId";

export const publicJobSelect =
  "-createdBy -updatedBy -deletedAt -__v -applicationsCount";
