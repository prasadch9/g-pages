import React from 'react';

const EMPTY_DATA = {
  aboutUs: '',
  aboutImageUrl: '',
  promoBackgroundUrl: '',
  productCategories: [],
  brands: [],
  supplyCapabilities: [],
  marketsServed: [],
  catalogue: [],
  galleryImages: [],
  galleryVideos: [],
};

export default function TradingBusinessesFields({ form, setForm, inputClass, logoFile, setLogoFile, existingLogo, aboutImageFile, setAboutImageFile, existingAboutImage }) {
  const saved = form.tradingBusinesses || {};
  const data = { ...EMPTY_DATA, ...saved };
  const update = (field, value) => setForm((current) => ({
    ...current,
    tradingBusinesses: { ...EMPTY_DATA, ...current.tradingBusinesses, [field]: value },
  }));
  const updateItem = (field, index, key, value) => update(field, data[field].map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item));
  const addItem = (field, item) => update(field, [...data[field], item]);
  const removeItem = (field, index) => update(field, data[field].filter((_, itemIndex) => itemIndex !== index));
  const sectionClass = 'col-span-2 rounded-xl border border-[#d5e2ef] bg-white p-5 shadow-sm sm:p-7';
  const addButtonClass = 'rounded-md bg-[#0879ee] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#0069d8]';

  return (
    <div className="col-span-2 space-y-5">
      <div className="rounded-xl bg-[#061a35] p-5 text-white sm:p-7">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-sky-200">Trading Businesses</p>
        <h2 className="mt-2 font-display text-2xl font-semibold">Trading business details</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/75">Add the categories, brands, supply capabilities, markets and catalogue products shown on your trading page.</p>
      </div>

      <section className={sectionClass}>
        <h3 className="font-display text-xl font-semibold text-[#17324d]">Business branding and overview</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            {existingLogo && <img src={existingLogo} alt="Current business logo" className="h-20 w-20 rounded-lg border border-[#dce7f2] bg-white object-contain p-2" />}
            <label className="mt-3 block text-sm text-ink/70">{existingLogo ? 'Replace logo' : 'Business logo'}<input type="file" accept="image/*" onChange={(event) => setLogoFile(event.target.files?.[0] || null)} className={inputClass} /></label>
            {logoFile && <p className="mt-2 text-xs text-[#0879ee]">Selected: {logoFile.name}</p>}
          </div>
          <label className="text-sm text-ink/70">Tagline<input value={form.tagline || ''} onChange={(event) => setForm((current) => ({ ...current, tagline: event.target.value }))} placeholder="Your trusted trading partner" className={inputClass} /></label>
          <label className="text-sm text-ink/70 sm:col-span-2">About your trading business<textarea rows={4} value={data.aboutUs || form.description || ''} onChange={(event) => update('aboutUs', event.target.value)} placeholder="Describe your business, products and customer service." className={inputClass} /></label>
          <div className="sm:col-span-2">
            {existingAboutImage && <img src={existingAboutImage} alt="Current About Us image" className="h-40 w-full rounded-lg border border-[#dce7f2] object-cover sm:max-w-md" />}
            <label className="mt-3 block text-sm text-ink/70">About Us image URL<input type="url" value={data.aboutImageUrl || ''} onChange={(event) => update('aboutImageUrl', event.target.value)} placeholder="https://example.com/about.jpg" className={inputClass} /></label>
            <label className="mt-3 block text-sm text-ink/70">Or upload About Us image<input type="file" accept="image/*" onChange={(event) => setAboutImageFile(event.target.files?.[0] || null)} className={inputClass} /></label>
            {aboutImageFile && <p className="mt-2 text-xs text-[#0879ee]">Selected: {aboutImageFile.name}</p>}
          </div>
          <div className="sm:col-span-2 rounded-lg border border-[#d5e2ef] bg-[#f7faff] p-4">
            <h4 className="text-sm font-bold text-[#17324d]">Product range banner background</h4>
            <p className="mt-1 text-xs text-ink/55">This image appears behind “Top Brands. Best Deals.”</p>
            {data.promoBackgroundUploadIndex !== undefined && !data.promoBackgroundImage && !data.promoBackgroundUrl && <p className="mt-2 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-800">The previous upload was not linked to this banner. Select the image again or enter its URL, then save.</p>}
            <label className="mt-3 block text-sm text-ink/70">Background image URL<input type="url" value={data.promoBackgroundUrl || ''} onChange={(event) => update('promoBackgroundUrl', event.target.value)} placeholder="https://example.com/banner.jpg" className={inputClass} /></label>
            <label className="mt-3 block text-sm text-ink/70">Or upload background image<input type="file" accept="image/*" onChange={(event) => update('promoBackgroundFile', event.target.files?.[0] || null)} className={inputClass} /></label>
            {data.promoBackgroundFile && <p className="mt-2 text-xs text-[#0879ee]">Selected: {data.promoBackgroundFile.name}</p>}
          </div>
        </div>
      </section>

      <section className={sectionClass}>
        <div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-display text-xl font-semibold text-[#17324d]">Product categories</h3><p className="mt-1 text-xs text-ink/55">Categories are shown as tiles on your trading page.</p></div><button type="button" onClick={() => addItem('productCategories', { name: '', imageUrl: '', imageFile: null })} className={addButtonClass}>+ Add Category</button></div>
        {data.productCategories.map((item, index) => <div key={`category-${index}`} className="mt-4 grid gap-3 rounded-lg border border-[#d5e2ef] bg-[#f7faff] p-4 sm:grid-cols-2">
          <label className="text-xs font-semibold text-ink/70">Category name<input value={typeof item === 'string' ? item : item.name || ''} onChange={(event) => updateItem('productCategories', index, typeof item === 'string' ? 'name' : 'name', event.target.value)} className={inputClass} /></label>
          <label className="text-xs font-semibold text-ink/70">Category image URL<input type="url" value={typeof item === 'string' ? '' : item.imageUrl || item.image || ''} onChange={(event) => updateItem('productCategories', index, 'imageUrl', event.target.value)} placeholder="https://example.com/category.jpg" className={inputClass} /></label>
          <label className="text-xs font-semibold text-ink/70 sm:col-span-2">Or upload category image<input type="file" accept="image/*" onChange={(event) => updateItem('productCategories', index, 'imageFile', event.target.files?.[0] || null)} className={inputClass} /></label>
          <button type="button" onClick={() => removeItem('productCategories', index)} className="text-left text-xs font-bold text-red-600">Remove category</button>
        </div>)}
      </section>

      <section className={sectionClass}>
        <div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-display text-xl font-semibold text-[#17324d]">Brands</h3><p className="mt-1 text-xs text-ink/55">Add the brands your business supplies.</p></div><button type="button" onClick={() => addItem('brands', { name: '' })} className={addButtonClass}>+ Add Brand</button></div>
        {data.brands.map((item, index) => <div key={`brand-${index}`} className="mt-3 flex items-center gap-3"><input value={typeof item === 'string' ? item : item.name || ''} onChange={(event) => update('brands', data.brands.map((brand, itemIndex) => itemIndex === index ? { name: event.target.value } : brand))} placeholder="Brand name" className={inputClass} /><button type="button" onClick={() => removeItem('brands', index)} className="shrink-0 text-xs font-bold text-red-600">Remove</button></div>)}
      </section>

      <section className={sectionClass}>
        <div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-display text-xl font-semibold text-[#17324d]">Supply capabilities</h3><p className="mt-1 text-xs text-ink/55">Explain your wholesale, delivery or sourcing capabilities.</p></div><button type="button" onClick={() => addItem('supplyCapabilities', { title: '', description: '' })} className={addButtonClass}>+ Add Capability</button></div>
        {data.supplyCapabilities.map((item, index) => <div key={`capability-${index}`} className="mt-4 grid gap-3 rounded-lg border border-[#d5e2ef] bg-[#f7faff] p-4 sm:grid-cols-2"><label className="text-xs font-semibold text-ink/70">Capability<input value={typeof item === 'string' ? item : item.title || item.name || ''} onChange={(event) => updateItem('supplyCapabilities', index, typeof item === 'string' ? 'title' : 'title', event.target.value)} className={inputClass} /></label><label className="text-xs font-semibold text-ink/70">Description<input value={typeof item === 'string' ? '' : item.description || ''} onChange={(event) => updateItem('supplyCapabilities', index, 'description', event.target.value)} className={inputClass} /></label><button type="button" onClick={() => removeItem('supplyCapabilities', index)} className="text-left text-xs font-bold text-red-600">Remove capability</button></div>)}
      </section>

      <section className={sectionClass}>
        <div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-display text-xl font-semibold text-[#17324d]">Markets served</h3><p className="mt-1 text-xs text-ink/55">Add regions, customer types or industries you serve.</p></div><button type="button" onClick={() => addItem('marketsServed', '')} className={addButtonClass}>+ Add Market</button></div>
        {data.marketsServed.map((item, index) => <div key={`market-${index}`} className="mt-3 flex items-center gap-3"><input value={typeof item === 'string' ? item : item.name || item.title || ''} onChange={(event) => update('marketsServed', data.marketsServed.map((market, itemIndex) => itemIndex === index ? event.target.value : market))} placeholder="Market or service area" className={inputClass} /><button type="button" onClick={() => removeItem('marketsServed', index)} className="shrink-0 text-xs font-bold text-red-600">Remove</button></div>)}
      </section>

      <section className={sectionClass}>
        <div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-display text-xl font-semibold text-[#17324d]">Product catalogue</h3><p className="mt-1 text-xs text-ink/55">Each catalogue product can have an image URL or an uploaded image.</p></div><button type="button" onClick={() => addItem('catalogue', { name: '', description: '', category: '', price: '', imageUrl: '', imageFile: null })} className={addButtonClass}>+ Add Product</button></div>
        {data.catalogue.map((item, index) => <div key={`product-${index}`} className="mt-4 grid gap-3 rounded-lg border border-[#d5e2ef] bg-[#f7faff] p-4 sm:grid-cols-2"><label className="text-xs font-semibold text-ink/70">Product name<input value={item.name || item.title || ''} onChange={(event) => updateItem('catalogue', index, 'name', event.target.value)} className={inputClass} /></label><label className="text-xs font-semibold text-ink/70">Category<input value={item.category || ''} onChange={(event) => updateItem('catalogue', index, 'category', event.target.value)} className={inputClass} /></label><label className="text-xs font-semibold text-ink/70">Price / range<input value={item.price || ''} onChange={(event) => updateItem('catalogue', index, 'price', event.target.value)} className={inputClass} /></label><label className="text-xs font-semibold text-ink/70">Product image URL<input type="url" value={item.imageUrl || item.image || ''} onChange={(event) => updateItem('catalogue', index, 'imageUrl', event.target.value)} placeholder="https://example.com/product.jpg" className={inputClass} /></label><label className="text-xs font-semibold text-ink/70 sm:col-span-2">Description<textarea rows={2} value={item.description || ''} onChange={(event) => updateItem('catalogue', index, 'description', event.target.value)} className={inputClass} /></label><label className="text-xs font-semibold text-ink/70 sm:col-span-2">Or upload product image<input type="file" accept="image/*" onChange={(event) => updateItem('catalogue', index, 'imageFile', event.target.files?.[0] || null)} className={inputClass} /></label><button type="button" onClick={() => removeItem('catalogue', index)} className="text-left text-xs font-bold text-red-600">Remove product</button></div>)}
      </section>

      <section className={sectionClass}>
        <div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-display text-xl font-semibold text-[#17324d]">Image gallery</h3><p className="mt-1 text-xs text-ink/55">Add each gallery image by URL or upload.</p></div><button type="button" onClick={() => addItem('galleryImages', { title: '', url: '', file: null })} className={addButtonClass}>+ Add Image</button></div>
        {data.galleryImages.map((item, index) => <div key={`image-${index}`} className="mt-4 grid gap-3 rounded-lg border border-[#d5e2ef] bg-[#f7faff] p-4 sm:grid-cols-2"><label className="text-xs font-semibold text-ink/70">Image title<input value={item.title || ''} onChange={(event) => updateItem('galleryImages', index, 'title', event.target.value)} className={inputClass} /></label><label className="text-xs font-semibold text-ink/70">Image URL<input type="url" value={item.url || ''} onChange={(event) => updateItem('galleryImages', index, 'url', event.target.value)} placeholder="https://example.com/image.jpg" className={inputClass} /></label><label className="text-xs font-semibold text-ink/70 sm:col-span-2">Or upload image<input type="file" accept="image/*" onChange={(event) => updateItem('galleryImages', index, 'file', event.target.files?.[0] || null)} className={inputClass} /></label><button type="button" onClick={() => removeItem('galleryImages', index)} className="text-left text-xs font-bold text-red-600">Remove image</button></div>)}
      </section>

      <section className={sectionClass}>
        <div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-display text-xl font-semibold text-[#17324d]">Video gallery</h3><p className="mt-1 text-xs text-ink/55">Add each video by URL or upload.</p></div><button type="button" onClick={() => addItem('galleryVideos', { title: '', url: '', file: null })} className={addButtonClass}>+ Add Video</button></div>
        {data.galleryVideos.map((item, index) => <div key={`video-${index}`} className="mt-4 grid gap-3 rounded-lg border border-[#d5e2ef] bg-[#f7faff] p-4 sm:grid-cols-2"><label className="text-xs font-semibold text-ink/70">Video title<input value={item.title || ''} onChange={(event) => updateItem('galleryVideos', index, 'title', event.target.value)} className={inputClass} /></label><label className="text-xs font-semibold text-ink/70">Video URL<input type="url" value={item.url || ''} onChange={(event) => updateItem('galleryVideos', index, 'url', event.target.value)} placeholder="https://..." className={inputClass} /></label><label className="text-xs font-semibold text-ink/70 sm:col-span-2">Or upload video<input type="file" accept="video/*" onChange={(event) => updateItem('galleryVideos', index, 'file', event.target.files?.[0] || null)} className={inputClass} /></label><button type="button" onClick={() => removeItem('galleryVideos', index)} className="text-left text-xs font-bold text-red-600">Remove video</button></div>)}
      </section>
    </div>
  );
}
