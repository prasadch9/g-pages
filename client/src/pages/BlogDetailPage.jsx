import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';
import BlogCard, { formatBlogDate } from '../components/blog/BlogCard';
import MarkdownContent from '../components/blog/MarkdownContent';

function youtubeId(url) {
  return url?.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{6,})/)?.[1] || '';
}

function isDirectVideo(url) {
  return /\.(mp4|webm|ogg|mov)(?:[?#].*)?$/i.test(url || '');
}

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    api.get(`/blogs/${encodeURIComponent(slug)}`)
      .then(({ data }) => { if (active) setBlog(data.data); })
      .catch((err) => { if (active) setError(err.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [slug]);

  useEffect(() => {
    if (!blog) return undefined;
    const previousTitle = document.title;
    const title = blog.seo?.title || `${blog.title} | Google Pages`;
    const description = blog.seo?.description || blog.shortDescription;
    const tags = [
      ['name', 'description', description],
      ['name', 'keywords', (blog.seo?.keywords || []).join(', ')],
      ['property', 'og:type', 'article'],
      ['property', 'og:title', title],
      ['property', 'og:description', description],
      ['property', 'og:image', blog.featuredImage?.url || ''],
      ['property', 'og:url', window.location.href],
      ['name', 'twitter:card', 'summary_large_image'],
    ];
    document.title = title;
    const previousTags = tags.map(([attribute, key, value]) => {
      let element = document.querySelector(`meta[${attribute}="${key}"]`);
      const created = !element;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
      }
      const previousContent = element.content;
      element.content = value;
      return { element, created, previousContent };
    });
    return () => {
      document.title = previousTitle;
      previousTags.forEach(({ element, created, previousContent }) => {
        if (created) element.remove();
        else element.content = previousContent;
      });
    };
  }, [blog]);

  if (loading) return <div className="container-page py-16 text-sm text-ink/55">Loading story…</div>;
  if (error || !blog) return <div className="container-page py-16"><p role="alert" className="text-sm text-vermilion">{error || 'This blog could not be found.'}</p><Link to="/blogs" className="mt-4 inline-block text-sm font-semibold text-vermilion underline">Back to blogs</Link></div>;

  const pageUrl = window.location.href;
  const shareText = encodeURIComponent(blog.title);
  const shareUrl = encodeURIComponent(pageUrl);
  const videoId = youtubeId(blog.videoUrl);

  return (
    <article className="container-page py-8 sm:py-12">
      <Link to="/blogs" className="text-sm font-medium text-ink/55 hover:text-ink">← All blogs</Link>
      <header className="mx-auto mt-8 max-w-4xl">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-semibold text-vermilion"><span>{blog.category}</span>{blog.location?.city?.name && <><span className="text-ink/25">/</span><span className="text-ink/55">{blog.location.city.name}</span></>}</div>
        <h1 className="mt-3 font-display text-3xl font-semibold leading-tight text-ink sm:text-5xl">{blog.title}</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-ink/65">{blog.shortDescription}</p>
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-line py-3 text-xs text-ink/50"><span>By {blog.author?.name || 'Google Pages Team'}</span><time dateTime={blog.publishedAt}>Published {formatBlogDate(blog.publishedAt)}</time><span>{blog.views || 0} views</span></div>
      </header>

      {blog.featuredImage?.url && <figure className="mx-auto mt-8 max-w-5xl"><img src={blog.featuredImage.url} alt={blog.featuredImage.alt || blog.title} className="max-h-[620px] w-full rounded-md object-cover" /></figure>}

      <div className="mx-auto mt-9 grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,760px)_220px]">
        <div>
          <MarkdownContent content={blog.content} />
          {blog.videoUrl && <section className="mt-9"><h2 className="mb-3 font-display text-xl font-semibold text-ink">Watch</h2>{videoId ? <iframe src={`https://www.youtube-nocookie.com/embed/${videoId}`} title={`${blog.title} video`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen className="aspect-video w-full rounded-md border-0" /> : isDirectVideo(blog.videoUrl) ? <video src={blog.videoUrl} controls preload="metadata" className="max-h-[620px] w-full rounded-md bg-black" /> : <a href={blog.videoUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-vermilion underline">Open video ↗</a>}</section>}
          {blog.gallery?.length > 0 && <section className="mt-10"><h2 className="font-display text-2xl font-semibold text-ink">Gallery</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{blog.gallery.map((image, index) => <figure key={`${image.url}-${index}`}><img src={image.url} alt={image.alt || `${blog.title} image ${index + 1}`} loading="lazy" className="aspect-[4/3] w-full rounded object-cover" />{image.alt && <figcaption className="mt-1 text-xs text-ink/50">{image.alt}</figcaption>}</figure>)}</div></section>}
          {blog.tags?.length > 0 && <div className="mt-8 flex flex-wrap gap-2">{blog.tags.map((tag) => <Link key={tag} to={`/blogs?search=${encodeURIComponent(tag)}`} className="rounded border border-line px-2.5 py-1 text-xs text-ink/60 hover:border-ink/40">#{tag}</Link>)}</div>}
        </div>

        <aside className="h-fit border-t border-line pt-4 lg:sticky lg:top-24 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
          <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-ink/45">Share story</h2>
          <div className="mt-3 flex flex-wrap gap-2 lg:flex-col"><a href={`https://wa.me/?text=${shareText}%20${shareUrl}`} target="_blank" rel="noopener noreferrer" className="rounded border border-line px-3 py-2 text-sm hover:bg-ink/[0.03]">WhatsApp</a><a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noopener noreferrer" className="rounded border border-line px-3 py-2 text-sm hover:bg-ink/[0.03]">Facebook</a><a href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`} target="_blank" rel="noopener noreferrer" className="rounded border border-line px-3 py-2 text-sm hover:bg-ink/[0.03]">LinkedIn</a></div>
        </aside>
      </div>

      {blog.relatedBlogs?.length > 0 && <section className="mt-14 border-t border-line pt-8"><h2 className="font-display text-2xl font-semibold text-ink">You may also like</h2><div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{blog.relatedBlogs.map((related) => <BlogCard key={related._id} blog={related} />)}</div></section>}
    </article>
  );
}
