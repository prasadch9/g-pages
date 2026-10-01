import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import LocationCascadeFields from '../../components/LocationCascadeFields';
import MarkdownContent from '../../components/blog/MarkdownContent';

const EMPTY_FORM = {
  title: '', slug: '', category: '', location: { state: '', district: '', city: '', areaText: '' },
  shortDescription: '', featuredImage: { url: '', alt: '' }, content: '', gallery: [], videoUrl: '',
  tags: [], tagInput: '', seo: { title: '', description: '', keywords: '' }, status: 'draft', publishedAt: '',
};
const inputClass = 'mt-1 w-full rounded border border-line bg-white px-3 py-2.5 text-sm outline-none focus:border-ink/50';

function makeSlug(value) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function toLocalDateTime(value) {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

export default function AdminBlogEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const contentRef = useRef(null);
  const formRef = useRef(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [categories, setCategories] = useState([]);
  const [slugTouched, setSlugTouched] = useState(Boolean(id));
  const [loading, setLoading] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    api.get('/blogs/meta').then(({ data }) => setCategories(data.data.categories || [])).catch((err) => setError(err.message));
    if (!id) return;
    api.get(`/admin/blogs/${id}`).then(({ data }) => {
      const blog = data.data;
      setForm({
        ...EMPTY_FORM,
        ...blog,
        location: {
          state: blog.location?.state?._id || blog.location?.state || '',
          district: blog.location?.district?._id || blog.location?.district || '',
          city: blog.location?.city?._id || blog.location?.city || '',
          areaText: '',
        },
        featuredImage: blog.featuredImage || EMPTY_FORM.featuredImage,
        gallery: blog.gallery || [],
        tags: blog.tags || [],
        seo: { ...EMPTY_FORM.seo, ...(blog.seo || {}), keywords: (blog.seo?.keywords || []).join(', ') },
        publishedAt: toLocalDateTime(blog.publishedAt),
      });
    }).catch((err) => setError(err.message)).finally(() => setLoading(false));
  }, [id]);

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const uploadFiles = async (files, endpoint, fieldName) => {
    const payload = new FormData();
    Array.from(files).forEach((file) => payload.append(fieldName, file));
    const { data } = await api.post(endpoint, payload);
    return data.data || [];
  };

  const uploadFeaturedImage = async (file) => {
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const uploaded = await uploadFiles([file], '/uploads/images', 'images');
      update('featuredImage', { ...form.featuredImage, url: uploaded[0]?.url || '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const uploadGallery = async (files) => {
    if (!files?.length) return;
    setUploading(true);
    setError('');
    try {
      const uploaded = await uploadFiles(files, '/uploads/images', 'images');
      setForm((current) => ({ ...current, gallery: [...current.gallery, ...uploaded.map((image) => ({ url: image.url, alt: '' }))] }));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const uploadVideo = async (file) => {
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const uploaded = await uploadFiles([file], '/uploads/videos', 'videos');
      update('videoUrl', uploaded[0]?.url || '');
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const insertMarkdown = (before, after = before, placeholder = 'text') => {
    const input = contentRef.current;
    if (!input) return;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const selected = form.content.slice(start, end) || placeholder;
    const next = `${form.content.slice(0, start)}${before}${selected}${after}${form.content.slice(end)}`;
    update('content', next);
    requestAnimationFrame(() => {
      input.focus();
      input.setSelectionRange(start + before.length, start + before.length + selected.length);
    });
  };

  const addTag = (event) => {
    event?.preventDefault();
    const tag = form.tagInput.trim();
    if (!tag || form.tags.some((item) => item.toLowerCase() === tag.toLowerCase())) return;
    setForm((current) => ({ ...current, tags: [...current.tags, tag], tagInput: '' }));
  };

  const saveBlog = async (status) => {
    setError('');
    setNotice('');
    if (saving || uploading) return;
    if (!form.title.trim()) {
      setError('Add a blog title before saving.');
      return;
    }
    if (status === 'published') {
      const missing = !form.category || !form.location.state || !form.location.district || !form.location.city || !form.shortDescription.trim() || !form.featuredImage.url || !form.content.trim();
      if (missing) {
        setError('To publish, add category, state, district, city, short description, featured image, and blog content.');
        return;
      }
    }
    setSaving(true);
    const payload = {
      title: form.title,
      slug: form.slug || makeSlug(form.title),
      category: form.category,
      location: form.location,
      shortDescription: form.shortDescription,
      featuredImage: form.featuredImage,
      content: form.content,
      gallery: form.gallery,
      videoUrl: form.videoUrl,
      tags: form.tags,
      seo: { ...form.seo, keywords: form.seo.keywords },
      status,
      publishedAt: form.publishedAt ? new Date(form.publishedAt).toISOString() : undefined,
    };
    try {
      if (id) await api.put(`/admin/blogs/${id}`, payload);
      else await api.post('/admin/blogs', payload);
      setNotice(status === 'published' ? 'Blog published.' : status === 'archived' ? 'Blog archived.' : 'Draft saved.');
      navigate('/admin/blogs');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-sm text-ink/55">Loading blog…</p>;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div><Link to="/admin/blogs" className="text-sm text-ink/55 hover:text-ink">← Blogs</Link><h2 className="mt-2 font-display text-2xl font-semibold text-ink">{id ? 'Edit blog' : 'Add new blog'}</h2></div>
        {id && form.status === 'published' && <a href={`/blogs/${form.slug}`} target="_blank" rel="noreferrer" className="text-sm font-medium text-vermilion underline underline-offset-2">View published page ↗</a>}
      </div>
      {error && <p role="alert" className="mb-4 rounded border border-vermilion/30 bg-vermilion/5 p-3 text-sm text-vermilion">{error}</p>}
      {notice && <p role="status" className="mb-4 rounded border border-moss/30 bg-moss/5 p-3 text-sm text-moss">{notice}</p>}

      <form ref={formRef} noValidate onSubmit={(event) => { event.preventDefault(); saveBlog('draft'); }} className="space-y-6">
        <section className="rounded border border-line bg-white p-5 sm:p-7">
          <h3 className="font-display text-lg font-semibold text-ink">Basic information</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-ink/75 sm:col-span-2">Blog title *<input required maxLength={200} value={form.title} onChange={(event) => { const title = event.target.value; setForm((current) => ({ ...current, title, slug: slugTouched ? current.slug : makeSlug(title) })); }} className={inputClass} /></label>
            <label className="text-sm font-medium text-ink/75">URL slug<input value={form.slug} onChange={(event) => { setSlugTouched(true); update('slug', makeSlug(event.target.value)); }} placeholder="generated-from-title" className={inputClass} /></label>
            <label className="text-sm font-medium text-ink/75">Category<select value={form.category} onChange={(event) => update('category', event.target.value)} className={inputClass}><option value="">Select a category</option>{categories.map((category) => <option key={category} value={category}>{category}</option>)}</select></label>
            <div className="sm:col-span-2"><p className="mb-2 text-sm font-medium text-ink/75">Location</p><div className="grid gap-3 sm:grid-cols-3"><LocationCascadeFields value={form.location} onChange={(location) => update('location', location)} includeArea={false} /></div></div>
            <label className="text-sm font-medium text-ink/75 sm:col-span-2">Short description<textarea rows={3} maxLength={500} value={form.shortDescription} onChange={(event) => update('shortDescription', event.target.value)} className={inputClass} placeholder="A concise summary shown on blog cards and search results." /></label>
          </div>
        </section>

        <section className="rounded border border-line bg-white p-5 sm:p-7">
          <h3 className="font-display text-lg font-semibold text-ink">Featured image</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-[220px_1fr]">
            {form.featuredImage.url ? <img src={form.featuredImage.url} alt={form.featuredImage.alt || 'Blog featured image preview'} className="aspect-[16/9] w-full rounded border border-line object-cover" /> : <div className="flex aspect-[16/9] items-center justify-center rounded border border-dashed border-line bg-ink/[0.02] text-sm text-ink/40">No featured image</div>}
            <div className="space-y-3"><label className="block text-sm font-medium text-ink/75">Upload image<input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => uploadFeaturedImage(event.target.files?.[0])} className={`${inputClass} file:mr-3 file:rounded file:border-0 file:bg-ink file:px-3 file:py-2 file:text-xs file:font-medium file:text-paper`} /></label><label className="block text-sm font-medium text-ink/75">Alt text<input maxLength={250} value={form.featuredImage.alt} onChange={(event) => update('featuredImage', { ...form.featuredImage, alt: event.target.value })} className={inputClass} placeholder="Describe the image" /></label><p className="text-xs text-ink/45">JPG, PNG, or WebP. Maximum 5 MB.</p></div>
          </div>
        </section>

        <section className="rounded border border-line bg-white p-5 sm:p-7">
          <h3 className="font-display text-lg font-semibold text-ink">Blog content</h3>
          <div className="mt-4 flex flex-wrap gap-1 border border-line bg-ink/[0.02] p-2">
            {[['Bold', '**', '**'], ['Italic', '*', '*'], ['H1', '# ', ''], ['H2', '## ', ''], ['H3', '### ', ''], ['Quote', '> ', ''], ['Bullets', '- ', ''], ['Numbered', '1. ', '']].map(([label, before, after]) => <button key={label} type="button" title={label} onClick={() => insertMarkdown(before, after, label === 'Quote' ? 'Quote' : 'text')} className="min-w-10 rounded border border-line px-2.5 py-1.5 text-xs font-semibold text-ink/75 hover:bg-white">{label}</button>)}
            <button type="button" title="Insert link" onClick={() => insertMarkdown('[', '](https://example.com)', 'link text')} className="rounded border border-line px-2.5 py-1.5 text-xs font-semibold text-ink/75 hover:bg-white">Link</button>
            <button type="button" title="Insert image" onClick={() => insertMarkdown('![', '](https://example.com/image.jpg)', 'image description')} className="rounded border border-line px-2.5 py-1.5 text-xs font-semibold text-ink/75 hover:bg-white">Image</button>
            <button type="button" title="Insert video link" onClick={() => insertMarkdown('[', '](https://youtube.com/watch?v=)', 'Watch video')} className="rounded border border-line px-2.5 py-1.5 text-xs font-semibold text-ink/75 hover:bg-white">Video</button>
          </div>
          <textarea ref={contentRef} value={form.content} onChange={(event) => update('content', event.target.value)} rows={18} placeholder="Write the blog content in Markdown…" className={`${inputClass} mt-0 resize-y font-mono leading-7`} />
          <details className="mt-3 rounded border border-line bg-ink/[0.02] p-3"><summary className="cursor-pointer text-xs font-semibold text-ink/65">Preview</summary><div className="mt-4"><MarkdownContent content={form.content} /></div></details>
        </section>

        <section className="rounded border border-line bg-white p-5 sm:p-7">
          <div className="flex flex-wrap items-end justify-between gap-3"><div><h3 className="font-display text-lg font-semibold text-ink">Image gallery</h3><p className="mt-1 text-xs text-ink/45">Up to 20 images, 5 MB each.</p></div><label className="cursor-pointer rounded border border-line px-3 py-2 text-sm font-medium text-ink/75 hover:bg-ink/[0.03]">{uploading ? 'Uploading…' : '+ Add images'}<input type="file" multiple accept="image/jpeg,image/png,image/webp" onChange={(event) => { uploadGallery(event.target.files); event.target.value = ''; }} className="sr-only" /></label></div>
          {form.gallery.length > 0 ? <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{form.gallery.map((image, index) => <figure key={`${image.url}-${index}`} className="overflow-hidden rounded border border-line"><img src={image.url} alt={image.alt || `Gallery image ${index + 1}`} className="aspect-video w-full object-cover" /><div className="flex gap-2 p-2"><input aria-label={`Alt text for gallery image ${index + 1}`} value={image.alt} onChange={(event) => setForm((current) => ({ ...current, gallery: current.gallery.map((item, itemIndex) => itemIndex === index ? { ...item, alt: event.target.value } : item) }))} placeholder="Alt text" className="min-w-0 flex-1 rounded border border-line px-2 py-1 text-xs" /><button type="button" onClick={() => update('gallery', form.gallery.filter((_, itemIndex) => itemIndex !== index))} aria-label={`Remove gallery image ${index + 1}`} className="px-2 text-sm text-vermilion">×</button></div></figure>)}</div> : <p className="mt-4 text-sm text-ink/45">No gallery images uploaded.</p>}
        </section>

        <section className="rounded border border-line bg-white p-5 sm:p-7">
          <h3 className="font-display text-lg font-semibold text-ink">Video</h3>
          <label className="mt-4 block text-sm font-medium text-ink/75">Video URL<input value={form.videoUrl} onChange={(event) => update('videoUrl', event.target.value)} placeholder="YouTube URL or direct MP4/WebM URL" className={inputClass} /></label>
          <div className="mt-3 flex flex-wrap items-center gap-3"><label className="cursor-pointer rounded border border-line px-3 py-2 text-sm font-medium text-ink/75 hover:bg-ink/[0.03]">Upload video<input type="file" accept="video/mp4,video/webm,video/ogg,video/quicktime" onChange={(event) => uploadVideo(event.target.files?.[0])} className="sr-only" /></label>{form.videoUrl && <button type="button" onClick={() => update('videoUrl', '')} className="text-sm text-vermilion underline">Remove video</button>}<span className="text-xs text-ink/45">MP4, WebM, OGG, or MOV. Maximum 100 MB.</span></div>
        </section>

        <section className="rounded border border-line bg-white p-5 sm:p-7">
          <h3 className="font-display text-lg font-semibold text-ink">Tags & SEO</h3>
          <div className="mt-4"><label className="text-sm font-medium text-ink/75">Tags<input value={form.tagInput} onChange={(event) => update('tagInput', event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') addTag(event); }} placeholder="Add a tag and press Enter" className={inputClass} /></label><button type="button" onClick={() => addTag()} className="mt-2 rounded border border-line px-3 py-1.5 text-sm font-medium text-ink/70 hover:bg-ink/[0.03]">+ Add tag</button><div className="mt-3 flex flex-wrap gap-2">{form.tags.map((tag) => <span key={tag} className="inline-flex items-center gap-2 rounded border border-line bg-ink/[0.02] px-2.5 py-1.5 text-xs">{tag}<button type="button" onClick={() => update('tags', form.tags.filter((item) => item !== tag))} aria-label={`Remove ${tag}`} className="text-ink/50 hover:text-vermilion">×</button></span>)}</div></div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="text-sm font-medium text-ink/75">SEO title<input maxLength={160} value={form.seo.title} onChange={(event) => update('seo', { ...form.seo, title: event.target.value })} className={inputClass} /></label><label className="text-sm font-medium text-ink/75">SEO keywords<input value={form.seo.keywords} onChange={(event) => update('seo', { ...form.seo, keywords: event.target.value })} placeholder="education, city, schools" className={inputClass} /></label><label className="text-sm font-medium text-ink/75 sm:col-span-2">Meta description<textarea maxLength={320} rows={2} value={form.seo.description} onChange={(event) => update('seo', { ...form.seo, description: event.target.value })} className={inputClass} /></label></div>
        </section>

        <section className="rounded border border-line bg-white p-5 sm:p-7">
          <h3 className="font-display text-lg font-semibold text-ink">Publishing</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2"><label className="text-sm font-medium text-ink/75">Status<select value={form.status} onChange={(event) => update('status', event.target.value)} className={inputClass}><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></label><label className="text-sm font-medium text-ink/75">Publish date and time<input type="datetime-local" value={form.publishedAt} onChange={(event) => update('publishedAt', event.target.value)} className={inputClass} /></label></div>
          <div className="mt-6 flex flex-wrap justify-end gap-2"><Link to="/admin/blogs" className="rounded border border-line px-4 py-2.5 text-sm font-medium text-ink/65">Cancel</Link><button type="button" disabled={saving || uploading} onClick={() => saveBlog('draft')} className="rounded border border-line px-4 py-2.5 text-sm font-medium text-ink disabled:opacity-50">{saving ? 'Saving…' : 'Save Draft'}</button><button type="button" disabled={saving || uploading} onClick={() => saveBlog('published')} className="rounded bg-vermilion px-4 py-2.5 text-sm font-medium text-paper disabled:opacity-50">{saving ? 'Saving…' : id && form.status === 'published' ? 'Update Published Blog' : 'Publish Blog'}</button>{id && <button type="button" disabled={saving || uploading} onClick={() => saveBlog('archived')} className="rounded border border-vermilion/30 px-4 py-2.5 text-sm font-medium text-vermilion disabled:opacity-50">Archive</button>}</div>
        </section>
      </form>
    </div>
  );
}
