import Link from "next/link";
import Image from "next/image";

export default function CaseStudyCard({ caseStudy }) {
  const category = caseStudy.categories?.[0];

  return (
    <Link
      href={`/case-studies/${caseStudy.slug}`}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300"
    >
      {/* Image — full width, badges overlaid */}
      <div className="relative w-full h-48 bg-gray-100 overflow-hidden flex-shrink-0">
        {caseStudy.featuredImage?.url ? (
          <Image
            src={caseStudy.featuredImage.url}
            alt={caseStudy.featuredImage.altText || caseStudy.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#2a7a8a]/10 to-[#2a7a8a]/20" />
        )}

        {/* Badges overlaid on image — consistent position always */}
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
          {category && (
            <span className="text-[10px] font-bold uppercase tracking-widest bg-white text-[#2a7a8a] px-2.5 py-1 rounded-full shadow-sm">
              {category.name}
            </span>
          )}
          {caseStudy.industry && (
            <span className="text-[10px] font-semibold uppercase tracking-widest bg-[#2a7a8a] text-white px-2.5 py-1 rounded-full ml-auto">
              {caseStudy.industry}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 space-y-3">
        {caseStudy.clientName && (
          <p className="text-[11px] font-bold text-[#2a7a8a] uppercase tracking-widest">
            {caseStudy.clientName}
          </p>
        )}

        <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-[#2a7a8a] transition-colors">
          {caseStudy.title}
        </h3>

        <p className="text-xs text-gray-400 leading-relaxed line-clamp-3 flex-1">
          {caseStudy.description}
        </p>

        {caseStudy.metrics?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {caseStudy.metrics.slice(0, 2).map((m, i) => (
              <span
                key={i}
                className="text-[10px] font-semibold bg-[#2a7a8a]/10 text-[#2a7a8a] px-2 py-0.5 rounded-full"
              >
                {m.value} {m.label}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="text-[11px] text-gray-400">
            {caseStudy.projectDuration || (
              caseStudy.publishedAt
                ? new Date(caseStudy.publishedAt).toLocaleDateString("en-US", {
                    month: "short", day: "numeric", year: "numeric",
                  })
                : ""
            )}
          </span>
          <span className="text-[11px] text-[#2a7a8a] font-semibold group-hover:underline">
            View Case Study →
          </span>
        </div>
      </div>
    </Link>
  );
}