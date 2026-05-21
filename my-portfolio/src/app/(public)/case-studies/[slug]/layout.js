// app/case-studies/[slug]/layout.js
export async function generateMetadata({ params }) {
  const { slug } = await params;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/case-studies/${slug}`,
      { next: { revalidate: 60 } }
    );

    if (!res.ok) return { title: "Case Study Not Found" };

    const { data: cs } = await res.json();
    
    // Ensure absolute URL for Open Graph image
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    const ogImage = cs.featuredImage?.url 
      ? (cs.featuredImage.url.startsWith('http') 
          ? cs.featuredImage.url 
          : `${siteUrl}${cs.featuredImage.url}`)
      : `${siteUrl}/default-og.jpg`;

    const description =
      cs.description ||
      (cs.challenge
        ? cs.challenge.replace(/<[^>]+>/g, "").slice(0, 160)
        : `Case study: ${cs.title}`);

    return {
      title: `${cs.title} | Case Study`,
      description,
      keywords: cs.keywords || cs.tags?.map((t) => t.name).join(", ") || "",
      openGraph: {
        title: cs.title,
        description,
        url: `${siteUrl}/case-studies/${slug}`,
        type: "article",
        publishedTime: cs.publishedAt,
        authors: cs.author?.name || "Admin",
        tags: cs.tags?.map((t) => t.name) || cs.keywords?.split(",") || [],
        images: [{ 
          url: ogImage, 
          width: 1200, 
          height: 630, 
          alt: cs.title 
        }],
        siteName: "Your Blog Name",
      },
      twitter: {
        card: "summary_large_image",
        title: cs.title,
        description,
        images: [ogImage],
      },
      alternates: {
        canonical: `${siteUrl}/case-studies/${slug}`,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return { title: "Case Study" };
  }
}

export default function CaseStudyLayout({ children }) {
  return children;
}