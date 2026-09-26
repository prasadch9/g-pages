import React from 'react';

const EMPTY_DATA = {
  aboutUs: '',
  aboutImageUrl: '',
  products: [],
  processSteps: [],
  whyChooseUs: [],
  stats: [],
  testimonials: [],
  certifications: '',
  galleryImages: [],
  galleryVideos: [],
};

export default function FoodProcessingFields({ form, setForm, inputClass, logoFile, setLogoFile, existingLogo, aboutImageFile, setAboutImageFile, existingAboutImage }) {
  const data = { ...EMPTY_DATA, ...(form.foodProcessing || {}) };
  const update = (field, value) => setForm((current) => ({
    ...current,
    foodProcessing: { ...EMPTY_DATA, ...current.foodProcessing, [field]: value },
  }));
  const updateItem = (field, index, key, value) => update(field, data[field].map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item));
  const addItem = (field, item) => update(field, [...data[field], item]);
  const removeItem = (field, index) => update(field, data[field].filter((_, itemIndex) => itemIndex !== index));
  const sectionClass = 'col-span-2 rounded-xl border border-[#cfe3d5] bg-white p-5 shadow-sm sm:p-7';
  const addButtonClass = 'rounded-md bg-[#1d6b45] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#155638]';

  return (
    <div className="col-span-2 space-y-5">
      <div className="rounded-xl bg-[#0b3d28] p-5 text-white sm:p-7">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b8ec9b]">Food Processing</p>
        <h2 className="mt-2 font-display text-2xl font-semibold">Food business details</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/75">Add the products, processing steps, quality information, customer stories and media that will appear on your Food Processing page.</p>
      </div>

      <section className={sectionClass}>
        <h3 className="font-display text-xl font-semibold text-[#17324d]">Business branding</h3>
        <div className="mt-4 grid gap-5 lg:grid-cols-2">
          <div>
            {existingLogo && <img src={existingLogo} alt="Current business logo" className="h-20 w-20 rounded-lg border border-[#dce7f2] bg-white object-contain p-2" />}
            <label className="mt-3 block text-sm text-ink/70">{existingLogo ? 'Replace logo' : 'Business logo'}<input type="file" accept="image/*" onChange={(event) => setLogoFile(event.target.files?.[0] || null)} className={inputClass} /></label>
            {logoFile && <p className="mt-2 text-xs text-[#1d6b45]">Selected: {logoFile.name}</p>}
          </div>
          <div>
            {existingAboutImage && <img src={existingAboutImage} alt="Current About Us image" className="h-32 w-full rounded-lg border border-[#dce7f2] object-cover" />}
            <label className="mt-3 block text-sm text-ink/70">About Us image URL<input type="url" value={data.aboutImageUrl || ''} onChange={(event) => update('aboutImageUrl', event.target.value)} placeholder="https://example.com/about.jpg" className={inputClass} /></label>
            <label className="mt-3 block text-sm text-ink/70">Or upload About Us image<input type="file" accept="image/*" onChange={(event) => setAboutImageFile(event.target.files?.[0] || null)} className={inputClass} /></label>
            {aboutImageFile && <p className="mt-2 text-xs text-[#1d6b45]">Selected: {aboutImageFile.name}</p>}
          </div>
          <label className="text-sm text-ink/70 lg:col-span-2">About Us description<textarea rows={5} value={data.aboutUs || form.description || ''} onChange={(event) => update('aboutUs', event.target.value)} placeholder="Tell customers about your food processing business, sourcing, quality and experience." className={inputClass} /></label>
        </div>
      </section>

      <section className={sectionClass}>
        <div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-display text-xl font-semibold text-[#17324d]">Products</h3><p className="mt-1 text-xs text-ink/55">Add the food products shown in the product cards.</p></div><button type="button" onClick={() => addItem('products', { name: '', description: '', price: '', imageUrl: '', imageFile: null })} className={addButtonClass}>+ Add Product</button></div>
        {data.products.map((item, index) => <div key={`product-${index}`} className="mt-4 grid gap-3 rounded-lg border border-[#dce7f2] bg-[#f7fbf8] p-4 sm:grid-cols-2">
          <label className="text-xs font-semibold text-ink/70">Product name<input value={item.name || ''} onChange={(event) => updateItem('products', index, 'name', event.target.value)} className={inputClass} /></label>
          <label className="text-xs font-semibold text-ink/70">Price / pack size<input value={item.price || ''} onChange={(event) => updateItem('products', index, 'price', event.target.value)} className={inputClass} /></label>
          <label className="text-xs font-semibold text-ink/70 sm:col-span-2">Description<textarea rows={2} value={item.description || ''} onChange={(event) => updateItem('products', index, 'description', event.target.value)} className={inputClass} /></label>
          <label className="text-xs font-semibold text-ink/70">Product image URL<input type="url" value={item.imageUrl || (typeof item.image === 'string' ? item.image : '')} onChange={(event) => updateItem('products', index, 'imageUrl', event.target.value)} placeholder="https://example.com/product.jpg" className={inputClass} /></label>
          <label className="text-xs font-semibold text-ink/70">Or upload product image<input type="file" accept="image/*" onChange={(event) => updateItem('products', index, 'imageFile', event.target.files?.[0] || null)} className={inputClass} /></label>
          <button type="button" onClick={() => removeItem('products', index)} className="text-left text-xs font-bold text-red-600">Remove product</button>
        </div>)}
        {!data.products.length && <p className="mt-3 text-sm text-ink/50">No products added yet.</p>}
      </section>

      <section className={sectionClass}>
        <div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-display text-xl font-semibold text-[#17324d]">Processing steps</h3><p className="mt-1 text-xs text-ink/55">These appear in the From Farm to Fork process section.</p></div><button type="button" onClick={() => addItem('processSteps', { title: '', description: '', imageUrl: '', imageFile: null })} className={addButtonClass}>+ Add Process Step</button></div>
        {data.processSteps.map((item, index) => <div key={`step-${index}`} className="mt-4 grid gap-3 rounded-lg border border-[#dce7f2] bg-[#f7fbf8] p-4 sm:grid-cols-2">
          <label className="text-xs font-semibold text-ink/70">Step title<input value={item.title || ''} onChange={(event) => updateItem('processSteps', index, 'title', event.target.value)} placeholder={`Step ${index + 1}`} className={inputClass} /></label>
          <label className="text-xs font-semibold text-ink/70">Step description<input value={item.description || ''} onChange={(event) => updateItem('processSteps', index, 'description', event.target.value)} className={inputClass} /></label>
          <label className="text-xs font-semibold text-ink/70">Step image URL<input type="url" value={item.imageUrl || item.image || ''} onChange={(event) => updateItem('processSteps', index, 'imageUrl', event.target.value)} placeholder="https://example.com/step.jpg" className={inputClass} /></label>
          <label className="text-xs font-semibold text-ink/70">Or upload step image<input type="file" accept="image/*" onChange={(event) => updateItem('processSteps', index, 'imageFile', event.target.files?.[0] || null)} className={inputClass} /></label>
          <button type="button" onClick={() => removeItem('processSteps', index)} className="text-left text-xs font-bold text-red-600">Remove step</button>
        </div>)}
      </section>

      <section className={sectionClass}>
        <div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-display text-xl font-semibold text-[#17324d]">Why Choose Us</h3><p className="mt-1 text-xs text-ink/55">Add strengths highlighted on your page.</p></div><button type="button" onClick={() => addItem('whyChooseUs', '')} className={addButtonClass}>+ Add Reason</button></div>
        {data.whyChooseUs.map((item, index) => <div key={`reason-${index}`} className="mt-3 flex items-center gap-3"><input value={typeof item === 'string' ? item : item.title || ''} onChange={(event) => update('whyChooseUs', data.whyChooseUs.map((value, itemIndex) => itemIndex === index ? event.target.value : value))} placeholder="e.g. Hygienic processing" className={inputClass} /><button type="button" onClick={() => removeItem('whyChooseUs', index)} className="shrink-0 text-xs font-bold text-red-600">Remove</button></div>)}
      </section>

      <section className={sectionClass}>
        <div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-display text-xl font-semibold text-[#17324d]">Business highlights</h3><p className="mt-1 text-xs text-ink/55">These appear in the hero and statistics row.</p></div><button type="button" onClick={() => addItem('stats', { value: '', label: '' })} className={addButtonClass}>+ Add Highlight</button></div>
        {data.stats.map((item, index) => <div key={`stat-${index}`} className="mt-3 grid gap-3 sm:grid-cols-2"><label className="text-xs font-semibold text-ink/70">Value<input value={item.value || ''} onChange={(event) => updateItem('stats', index, 'value', event.target.value)} placeholder="e.g. 15+" className={inputClass} /></label><label className="text-xs font-semibold text-ink/70">Label<input value={item.label || ''} onChange={(event) => updateItem('stats', index, 'label', event.target.value)} placeholder="Years of experience" className={inputClass} /></label><button type="button" onClick={() => removeItem('stats', index)} className="text-left text-xs font-bold text-red-600">Remove highlight</button></div>)}
      </section>

      <section className={sectionClass}>
        <div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-display text-xl font-semibold text-[#17324d]">Customer testimonials</h3><p className="mt-1 text-xs text-ink/55">Add customer quotes for the testimonial section.</p></div><button type="button" onClick={() => addItem('testimonials', { name: '', quote: '', role: '' })} className={addButtonClass}>+ Add Testimonial</button></div>
        {data.testimonials.map((item, index) => <div key={`testimonial-${index}`} className="mt-4 grid gap-3 rounded-lg border border-[#dce7f2] bg-[#f7fbf8] p-4 sm:grid-cols-2">
          <label className="text-xs font-semibold text-ink/70">Customer name<input value={item.name || ''} onChange={(event) => updateItem('testimonials', index, 'name', event.target.value)} className={inputClass} /></label>
          <label className="text-xs font-semibold text-ink/70">Customer role<input value={item.role || ''} onChange={(event) => updateItem('testimonials', index, 'role', event.target.value)} className={inputClass} /></label>
          <label className="text-xs font-semibold text-ink/70 sm:col-span-2">Quote<textarea rows={3} value={item.quote || ''} onChange={(event) => updateItem('testimonials', index, 'quote', event.target.value)} className={inputClass} /></label>
          <button type="button" onClick={() => removeItem('testimonials', index)} className="text-left text-xs font-bold text-red-600">Remove testimonial</button>
        </div>)}
      </section>

      <section className={sectionClass}>
        <label className="block text-sm text-ink/70">Certifications (comma-separated)<input value={data.certifications || ''} onChange={(event) => update('certifications', event.target.value)} placeholder="FSSAI, ISO 22000, HACCP" className={inputClass} /></label>
      </section>

      <section className={sectionClass}>
        <div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-display text-xl font-semibold text-[#17324d]">Photo gallery</h3><p className="mt-1 text-xs text-ink/55">Add each image by URL or upload.</p></div><button type="button" onClick={() => addItem('galleryImages', { title: '', url: '', file: null })} className={addButtonClass}>+ Add Image</button></div>
        {data.galleryImages.map((item, index) => <div key={`image-${index}`} className="mt-4 grid gap-3 rounded-lg border border-[#dce7f2] bg-[#f7fbf8] p-4 sm:grid-cols-2"><label className="text-xs font-semibold text-ink/70">Image title<input value={item.title || ''} onChange={(event) => updateItem('galleryImages', index, 'title', event.target.value)} className={inputClass} /></label><label className="text-xs font-semibold text-ink/70">Image URL<input type="url" value={item.url || ''} onChange={(event) => updateItem('galleryImages', index, 'url', event.target.value)} placeholder="https://example.com/image.jpg" className={inputClass} /></label><label className="text-xs font-semibold text-ink/70 sm:col-span-2">Or upload image<input type="file" accept="image/*" onChange={(event) => updateItem('galleryImages', index, 'file', event.target.files?.[0] || null)} className={inputClass} /></label><button type="button" onClick={() => removeItem('galleryImages', index)} className="text-left text-xs font-bold text-red-600">Remove image</button></div>)}
      </section>

      <section className={sectionClass}>
        <div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-display text-xl font-semibold text-[#17324d]">Video gallery</h3><p className="mt-1 text-xs text-ink/55">Add each video by URL or upload.</p></div><button type="button" onClick={() => addItem('galleryVideos', { title: '', url: '', file: null })} className={addButtonClass}>+ Add Video</button></div>
        {data.galleryVideos.map((item, index) => <div key={`video-${index}`} className="mt-4 grid gap-3 rounded-lg border border-[#dce7f2] bg-[#f7fbf8] p-4 sm:grid-cols-2"><label className="text-xs font-semibold text-ink/70">Video title<input value={item.title || ''} onChange={(event) => updateItem('galleryVideos', index, 'title', event.target.value)} className={inputClass} /></label><label className="text-xs font-semibold text-ink/70">Video URL<input type="url" value={item.url || ''} onChange={(event) => updateItem('galleryVideos', index, 'url', event.target.value)} placeholder="https://..." className={inputClass} /></label><label className="text-xs font-semibold text-ink/70 sm:col-span-2">Or upload video<input type="file" accept="video/*" onChange={(event) => updateItem('galleryVideos', index, 'file', event.target.files?.[0] || null)} className={inputClass} /></label><button type="button" onClick={() => removeItem('galleryVideos', index)} className="text-left text-xs font-bold text-red-600">Remove video</button></div>)}
      </section>
    </div>
  );
}
