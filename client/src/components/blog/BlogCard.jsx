import React from 'react';
import { Link } from 'react-router-dom';

export function formatBlogDate(value) {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
}

export default function BlogCard({ blog }) {
  return (
    <article className="group overflow-hidden rounded-md border border-line bg-white transition hover:border-ink/25 hover:shadow-sm">
      <Link to={`/blogs/${blog.slug}`} className="block overflow-hidden bg-ink/5">
        {blog.featuredImage?.url ? <img src={blog.featuredImage.url} alt={blog.featuredImage.alt || blog.title} loading="lazy" className="aspect-[16/9] w-full object-cover transition duration-300 group-hover:scale-[1.02]" /> : <div className="aspect-[16/9]" />}
      </Link>
      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold text-vermilion"><span>{blog.category}</span>{blog.location?.city?.name && <><span className="text-ink/25">/</span><span className="text-ink/55">{blog.location.city.name}</span></>}</div>
        <h2 className="mt-2 font-display text-xl font-semibold leading-snug text-ink"><Link to={`/blogs/${blog.slug}`} className="hover:text-vermilion">{blog.title}</Link></h2>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-ink/65">{blog.shortDescription}</p>
        <div className="mt-4 flex items-center justify-between gap-3"><time className="text-xs text-ink/45" dateTime={blog.publishedAt}>{formatBlogDate(blog.publishedAt)}</time><Link to={`/blogs/${blog.slug}`} className="text-sm font-semibold text-ink underline decoration-ink/20 underline-offset-4 hover:decoration-vermilion">Read more</Link></div>
      </div>
    </article>
  );
}
