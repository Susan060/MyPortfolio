import { getPublicCaseStudies, getPublicCaseStudyCategories, getPublicCaseStudyTags } from "@/api/(public)/caseStudies";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default async function sitemap() {
  const staticRoutes = [
    { url: `${siteUrl}/`, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/case-studies`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/contact`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.7 },
  ];

  let caseStudyRoutes = [];
  let categoryRoutes = [];
  let tagRoutes = [];

  try {
    const data = await getPublicCaseStudies({ limit: 100 });
    const studies = data?.caseStudies || data?.data || [];
    caseStudyRoutes = studies.map((cs) => ({
      url: `${siteUrl}/case-studies/${cs.slug}`,
      lastModified: cs.updatedAt ? new Date(cs.updatedAt) : new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    }));
  } catch (_) {}

  try {
    const categories = await getPublicCaseStudyCategories();
    const list = categories?.data || categories || [];
    categoryRoutes = list.map((cat) => ({
      url: `${siteUrl}/case-studies/category/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    }));
  } catch (_) {}

  try {
    const tags = await getPublicCaseStudyTags();
    const list = tags?.data || tags || [];
    tagRoutes = list.map((tag) => ({
      url: `${siteUrl}/case-studies/tag/${tag.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    }));
  } catch (_) {}

  return [...staticRoutes, ...caseStudyRoutes, ...categoryRoutes, ...tagRoutes];
}
