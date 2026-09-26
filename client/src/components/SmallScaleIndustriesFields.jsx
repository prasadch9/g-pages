import React from 'react';

const EMPTY_DATA = { aboutUs: '', aboutImageUrl: '', products: [], manufacturingCapabilities: [], whyChooseUs: [], industriesServed: '', certifications: '', galleryImages: [], galleryVideos: [] };

export default function SmallScaleIndustriesFields({ form, setForm, inputClass, logoFile, setLogoFile, existingLogo, aboutImageFile, setAboutImageFile, existingAboutImage }) {
  const savedData = form.smallScaleIndustries || {};
  const data = {
    ...EMPTY_DATA,
    ...savedData,
    whyChooseUs: Array.isArray(savedData.whyChooseUs) ? savedData.whyChooseUs : savedData.whyChooseUs ? [savedData.whyChooseUs] : [],
  };
  const update = (field, value) => setForm((current) => ({
    ...current,
    smallScaleIndustries: { ...EMPTY_DATA, ...current.smallScaleIndustries, [field]: value },
  }));
  const updateItem = (field, index, key, value) => update(field, data[field].map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item));
  const addItem = (field, item) => update(field, [...data[field], item]);
  const removeItem = (field, index) => update(field, data[field].filter((_, itemIndex) => itemIndex !== index));
  const sectionClass = 'col-span-2 rounded-xl border border-[#d4e1ec] bg-white p-5 shadow-sm sm:p-7';
  const addButtonClass = 'rounded-md bg-[#1769a8] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#125887]';

  return (
    <div className="col-span-2 space-y-5">
      <div className="rounded-xl bg-[#102e4d] p-5 text-white sm:p-7">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-sky-200">Small Scale Industries</p>
        <h2 className="mt-2 font-display text-2xl font-semibold">Manufacturing business details</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/75">Add products, manufacturing capabilities, served industries, certifications, and gallery media for your industrial business page.</p>
      </div>

      <section className={sectionClass}>
        <h3 className="font-display text-xl font-semibold text-[#17324d]">Business logo</h3>
        <p className="mt-1 text-xs text-ink/55">Upload a logo to show in the header of your business page.</p>
        {existingLogo && <img src={existingLogo} alt="Current business logo" className="mt-3 h-20 w-20 rounded-lg border border-[#dce7f2] bg-white object-contain p-2" />}
        <label className="mt-3 block text-sm text-ink/70">{existingLogo ? 'Replace logo' : 'Upload logo'}<input type="file" accept="image/*" onChange={(event) => setLogoFile(event.target.files?.[0] || null)} className={inputClass} /></label>
        {logoFile && <p className="mt-2 text-xs text-[#1769a8]">Selected: {logoFile.name}</p>}
      </section>

      <section className={sectionClass}>
        <h3 className="font-display text-xl font-semibold text-[#17324d]">About Us</h3>
        <p className="mt-1 text-xs text-ink/55">This description and image appear together in the About section of your public page.</p>
        <div className="mt-4 grid gap-5 lg:grid-cols-[1fr_280px]">
          <label className="text-sm text-ink/70">About your business<textarea rows={7} value={data.aboutUs || form.description || ''} onChange={(event) => update('aboutUs', event.target.value)} placeholder="Describe your company, manufacturing experience, and what makes your business different." className={inputClass} /></label>
          <div>
            {existingAboutImage && <img src={existingAboutImage} alt="Current About Us image" className="h-40 w-full rounded-lg border border-[#dce7f2] object-cover" />}
            <label className="mt-3 block text-sm text-ink/70">Image URL<input type="url" value={data.aboutImageUrl || ''} onChange={(event) => update('aboutImageUrl', event.target.value)} placeholder="https://example.com/about.jpg" className={inputClass} /></label>
            <label className="mt-3 block text-sm text-ink/70">Or upload About Us image<input type="file" accept="image/*" onChange={(event) => setAboutImageFile(event.target.files?.[0] || null)} className={inputClass} /></label>
            {aboutImageFile && <p className="mt-2 text-xs text-[#1769a8]">Selected: {aboutImageFile.name}</p>}
          </div>
        </div>
      </section>

      <section className={sectionClass}>
        <h3 className="font-display text-xl font-semibold text-[#17324d]">Products and services</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="text-sm text-ink/70">Industries served<input value={data.industriesServed} onChange={(event) => update('industriesServed', event.target.value)} placeholder="Automotive, agriculture, construction" className={inputClass} /></label>
          <label className="text-sm text-ink/70">Certifications<input value={data.certifications} onChange={(event) => update('certifications', event.target.value)} placeholder="ISO 9001, MSME, BIS" className={inputClass} /></label>
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3"><div><h4 className="text-sm font-bold text-[#17324d]">Products</h4><p className="mt-1 text-xs text-ink/55">For each product, enter an image URL or upload an image.</p></div><button type="button" onClick={() => addItem('products', { name: '', description: '', price: '', imageUrl: '', imageFile: null })} className={addButtonClass}>+ Add Product</button></div>
        {data.products.map((item, index) => <div key={`product-${index}`} className="mt-4 grid gap-3 rounded-lg border border-[#dce7f2] bg-[#f7faff] p-4 sm:grid-cols-2">
          <label className="text-xs font-semibold text-ink/70">Product / service name<input value={item.name || ''} onChange={(event) => updateItem('products', index, 'name', event.target.value)} className={inputClass} /></label>
          <label className="text-xs font-semibold text-ink/70">Price / MOQ<input value={item.price || ''} onChange={(event) => updateItem('products', index, 'price', event.target.value)} placeholder="Optional" className={inputClass} /></label>
          <label className="text-xs font-semibold text-ink/70 sm:col-span-2">Description<textarea rows={2} value={item.description || ''} onChange={(event) => updateItem('products', index, 'description', event.target.value)} className={inputClass} /></label>
          <label className="text-xs font-semibold text-ink/70">Product image URL<input type="url" value={item.imageUrl || (typeof item.image === 'string' ? item.image : '')} onChange={(event) => updateItem('products', index, 'imageUrl', event.target.value)} placeholder="https://example.com/product.jpg" className={inputClass} /></label>
          <label className="text-xs font-semibold text-ink/70">Or upload product image<input type="file" accept="image/*" onChange={(event) => updateItem('products', index, 'imageFile', event.target.files?.[0] || null)} className={inputClass} /></label>
          <button type="button" onClick={() => removeItem('products', index)} className="text-left text-xs font-bold text-red-600">Remove product</button>
        </div>)}
        {!data.products.length && <p className="mt-3 text-sm text-ink/50">No products added yet.</p>}
      </section>

      <section className={sectionClass}>
        <div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-display text-xl font-semibold text-[#17324d]">Why choose us</h3><p className="mt-1 text-xs text-ink/55">Add the strengths customers should notice first.</p></div><button type="button" onClick={() => addItem('whyChooseUs', '')} className={addButtonClass}>+ Add Reason</button></div>
        {data.whyChooseUs.map((reason, index) => <div key={`reason-${index}`} className="mt-3 flex items-center gap-3"><input value={typeof reason === 'string' ? reason : reason.title || ''} onChange={(event) => update('whyChooseUs', data.whyChooseUs.map((item, itemIndex) => itemIndex === index ? event.target.value : item))} className={inputClass} placeholder="e.g. Precision-built products" /><button type="button" onClick={() => removeItem('whyChooseUs', index)} className="shrink-0 text-xs font-bold text-red-600">Remove</button></div>)}
      </section>

      <section className={sectionClass}>
        <div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-display text-xl font-semibold text-[#17324d]">Manufacturing capabilities</h3><p className="mt-1 text-xs text-ink/55">Describe your equipment, process, or production strengths.</p></div><button type="button" onClick={() => addItem('manufacturingCapabilities', { title: '', text: '' })} className={addButtonClass}>+ Add Capability</button></div>
        {data.manufacturingCapabilities.map((item, index) => <div key={`capability-${index}`} className="mt-4 grid gap-3 rounded-lg border border-[#dce7f2] bg-[#f7faff] p-4 sm:grid-cols-2">
          <label className="text-xs font-semibold text-ink/70">Capability name<input value={item.title || ''} onChange={(event) => updateItem('manufacturingCapabilities', index, 'title', event.target.value)} className={inputClass} /></label>
          <label className="text-xs font-semibold text-ink/70">Details<input value={item.text || ''} onChange={(event) => updateItem('manufacturingCapabilities', index, 'text', event.target.value)} className={inputClass} /></label>
          <button type="button" onClick={() => removeItem('manufacturingCapabilities', index)} className="text-left text-xs font-bold text-red-600">Remove capability</button>
        </div>)}
      </section>

      <section className={sectionClass}>
        <div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-display text-xl font-semibold text-[#17324d]">Image gallery</h3><p className="mt-1 text-xs text-ink/55">Add one image per row using a URL or a file upload.</p></div><button type="button" onClick={() => addItem('galleryImages', { title: '', url: '', file: null })} className={addButtonClass}>+ Add Image</button></div>
        {data.galleryImages.map((item, index) => <div key={`image-${index}`} className="mt-4 grid gap-3 rounded-lg border border-[#dce7f2] bg-[#f7faff] p-4 sm:grid-cols-2">
          <label className="text-xs font-semibold text-ink/70">Image title<input value={item.title || ''} onChange={(event) => updateItem('galleryImages', index, 'title', event.target.value)} className={inputClass} /></label>
          <label className="text-xs font-semibold text-ink/70">Image URL<input type="url" value={item.url || ''} onChange={(event) => updateItem('galleryImages', index, 'url', event.target.value)} placeholder="https://example.com/image.jpg" className={inputClass} /></label>
          <label className="text-xs font-semibold text-ink/70 sm:col-span-2">Or upload image<input type="file" accept="image/*" onChange={(event) => updateItem('galleryImages', index, 'file', event.target.files?.[0] || null)} className={inputClass} /></label>
          <button type="button" onClick={() => removeItem('galleryImages', index)} className="text-left text-xs font-bold text-red-600">Remove image</button>
        </div>)}
      </section>

      <section className={sectionClass}>
        <div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-display text-xl font-semibold text-[#17324d]">Video gallery</h3><p className="mt-1 text-xs text-ink/55">Add each video separately using a video URL or a file upload.</p></div><button type="button" onClick={() => addItem('galleryVideos', { title: '', url: '', file: null })} className={addButtonClass}>+ Add Video</button></div>
        {data.galleryVideos.map((item, index) => <div key={`video-${index}`} className="mt-4 grid gap-3 rounded-lg border border-[#dce7f2] bg-[#f7faff] p-4 sm:grid-cols-2">
          <label className="text-xs font-semibold text-ink/70">Video title<input value={item.title || ''} onChange={(event) => updateItem('galleryVideos', index, 'title', event.target.value)} className={inputClass} /></label>
          <label className="text-xs font-semibold text-ink/70">Video URL<input type="url" value={item.url || ''} onChange={(event) => updateItem('galleryVideos', index, 'url', event.target.value)} placeholder="https://..." className={inputClass} /></label>
          <label className="text-xs font-semibold text-ink/70 sm:col-span-2">Or upload video<input type="file" accept="video/*" onChange={(event) => updateItem('galleryVideos', index, 'file', event.target.files?.[0] || null)} className={inputClass} /><span className="mt-1 block text-[11px] font-normal text-ink/50">Maximum file size: 50 MB.</span></label>
          <button type="button" onClick={() => removeItem('galleryVideos', index)} className="text-left text-xs font-bold text-red-600">Remove video</button>
        </div>)}
      </section>
    </div>
  );
}
