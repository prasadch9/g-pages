import React from 'react';

const ic = 'mt-1 w-full rounded border border-line bg-white px-3 py-2.5 text-[15px] outline-none focus:border-ink/40';
const tc = `${ic} resize-y`;

function Section({ label, step, accent = 'amber', children }) {
  const colors = {
    amber:  { border: 'border-amber-200',  label: 'text-amber-700' },
    orange: { border: 'border-orange-200', label: 'text-orange-700' },
    rose:   { border: 'border-rose-200',   label: 'text-rose-700' },
    stone:  { border: 'border-stone-300',  label: 'text-stone-700' },
    emerald:{ border: 'border-emerald-200',label: 'text-emerald-700' },
    purple: { border: 'border-purple-200', label: 'text-purple-700' },
    blue:   { border: 'border-blue-200',   label: 'text-blue-700' },
    slate:  { border: 'border-slate-200',  label: 'text-slate-600' },
  };
  const c = colors[accent] || colors.amber;
  return (
    <div className={`rounded-[1.25rem] border ${c.border} bg-white p-5 shadow-sm sm:p-7`}>
      <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${c.label}`}>{step}</p>
      <h3 className="mt-1 font-display text-xl font-semibold text-slate-800">{label}</h3>
      <div className="mt-4 grid grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function F({ label, col = 2, children }) {
  return (
    <div className={col === 1 ? 'col-span-2 sm:col-span-1' : 'col-span-2'}>
      <label className="text-sm font-medium text-ink/75">{label}</label>
      {children}
    </div>
  );
}

export default function SculptureRegistrationFields({
  form,
  categoryData = {},
  update,
  updateCategoryData,
  uploadedFiles = {},
  renderSingleImageUpload,
  handleLocalFiles,
  removeUploadedImage,
}) {
  const lf = (key, label, ph, rows = 2) => (
    <F label={label} col={2}>
      <textarea
        rows={rows}
        value={categoryData[key] || ''}
        onChange={(e) => updateCategoryData(key, e.target.value)}
        placeholder={ph}
        className={tc}
      />
    </F>
  );

  const tf = (key, label, ph, col = 1) => (
    <F label={label} col={col}>
      <input
        value={categoryData[key] || ''}
        onChange={(e) => updateCategoryData(key, e.target.value)}
        placeholder={ph}
        className={ic}
      />
    </F>
  );

  return (
    <div className="col-span-2 space-y-5">
      {/* Hero Banner */}
      <div className="overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-[#3b2414] via-[#5c371d] to-[#1f1208] px-6 py-7 text-white shadow-lg">
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-amber-300">Arts & Creative · Sculptures & Art Studio Registration</p>
        <h2 className="mt-2 font-display text-2xl font-semibold">Fill in your sculpture studio & artist details</h2>
        <p className="mt-2 text-sm text-white/70">These details will appear on your public art showcase page — sculpture specializations, stone/metal mediums, custom order process, exhibitions, and gallery portfolio.</p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
          {['01 Studio & Artist', '02 Art Styles', '03 Materials', '04 Custom Work', '05 Exhibitions & Awards', '06 Pricing & Catalog', '07 Portfolio', '08 Social'].map((s) => (
            <span key={s} className="rounded-full bg-white/10 px-3 py-1.5">{s}</span>
          ))}
        </div>
      </div>

      {/* Step 1 — Basic Studio Identity */}
      <Section label="Sculpture Studio & Master Artist Identity" step="Step 1 · Studio & Artist" accent="amber">
        <F label="Studio / Brand name *" col={2}>
          <input required value={form.name || ''} onChange={update('name')} placeholder="e.g. Silpa Kala Mandir, StoneCraft Studios, Chola Bronze Art Studio" className={ic} />
        </F>
        {tf('masterArtist', 'Master Sculptor / Lead Sthapathi *', 'e.g. Sthapathi K. Viswanatha Achari, Master Artist Ravi Varma', 1)}
        {tf('artLineage', 'Artistic Lineage / Tradition', 'e.g. Traditional Shilpa Shastra, 4th Generation Shilpi, Contemporary Fine Art', 1)}
        {tf('establishedYear', 'Established year', 'e.g. 1988', 1)}
        <F label="Studio phone / commission inquiry *" col={1}><input type="tel" value={form.phone || ''} onChange={update('phone')} placeholder="+91 98765 43210" className={ic} /></F>
        <F label="Studio email *" col={1}><input type="email" value={form.email || ''} onChange={update('email')} placeholder="studio@sculptureart.com" className={ic} /></F>
        <F label="Portfolio website" col={1}><input type="url" value={form.website || ''} onChange={update('website')} placeholder="https://sculptureart.com" className={ic} /></F>
        <F label="Studio / Workshop address *" col={1}><input value={form.address || ''} onChange={update('address')} placeholder="Workshop address, industrial / craft cluster, city" className={ic} /></F>
        <F label="Artist bio & creative philosophy *" col={2}>
          <textarea rows={4} value={form.description || ''} onChange={update('description')} placeholder="Describe your artistic journey, mastery of sculpture arts, inspirations, craft lineage, and what makes your creations unique..." className={tc} />
        </F>
      </Section>

      {/* Step 2 — Sculpture Specializations & Styles */}
      <Section label="Sculpture Specializations & Art Forms" step="Step 2 · Art Styles" accent="orange">
        {lf('sculptureStyles', 'Sculpture styles offered (one per line) *', 'Traditional Hindu Temple Idols (Agamic Vigrahas)\nBronze / Panchaloha Lost-Wax Casting Statues\nContemporary & Modern Abstract Sculptures\nArchitectural & Garden Stone Sculptures\nPortrait Busts & Life-Size Statues\nBas-Relief Wall Murals & Panels\nMonuments & Public Art Installations', 6)}
        {lf('deityArt', 'Deity & iconographic specializations', 'Lord Shiva, Lord Venkateswara, Ganesha, Goddess Durga, Buddha, Jain Tirthankaras, Traditional Temple Dwarapalakas', 2)}
        {tf('sculptureSizes', 'Size range crafted', 'Miniatures (6 inches) to Gigantic Monumental Statues (60+ feet)', 2)}
      </Section>

      {/* Step 3 — Materials & Mediums */}
      <Section label="Materials, Mediums & Craftsmanship" step="Step 3 · Materials" accent="amber">
        {lf('materials', 'Primary materials & stone types used (one per line) *', 'Krishna Shila (Black Granite Stone)\nWhite Makrana & Ambaji Marble\nPanchaloha (Traditional 5-Metal Sacred Alloy)\nBronze & Brass Metal Casting\nRed Sandstone & Pink Marble\nTeakwood & Rosewood Carving\nTerracotta, Clay & Ceramic\nFiberglass & Cold Cast Bronze Resin', 6)}
        {lf('finishingTechniques', 'Finishing & detailing techniques', 'Hand chiseling, High-gloss mirror polish, Matte antique patina finish, Gold leaf (24K) gilding, Weatherproof protective coating', 2)}
        {tf('workshopDetails', 'Workshop area & artisan team size', '10,000 sq ft sculpting yard with 25 master craftsmen and apprentices', 2)}
      </Section>

      {/* Step 4 — Custom Orders & Project Process */}
      <Section label="Custom Commissions & Architectural Projects" step="Step 4 · Custom Work" accent="rose">
        {lf('commissionProcess', 'Custom order & sculpting process (one per line) *', 'Client consultation & iconographic reference selection\nPreliminary clay maquette / 3D design sketch approval\nRaw stone / metal ingot selection and consecration\nHand carving and rough sculpting phase\nFine detailing, facial features & ornamentation\nPolishing, chemical patina and final finishing\nCrate packaging, transport & on-site installation', 6)}
        {lf('architecturalProjects', 'Architectural & temple projects undertaken', 'Temple Gopuram carvings, Resort entrance art, Villa garden fountains, Corporate lobby centerpieces, Municipal heritage parks', 3)}
        {tf('deliveryTime', 'Average delivery timeline', 'Small idols: 2-3 weeks | Custom temple vigrahas: 1-3 months | Monuments: 3-6 months', 1)}
        {tf('shippingCoverage', 'Shipping & installation coverage', 'Pan-India safe wooden crate shipping & international export packing with crane installation', 1)}
      </Section>

      {/* Step 5 — Exhibitions, Awards & Heritage Recognition */}
      <Section label="Exhibitions, Awards & Prominent Works" step="Step 5 · Heritage & Awards" accent="purple">
        {lf('exhibitions', 'Exhibitions & art galleries participated in (one per line)', 'National Crafts Museum & Hastkala Expo, New Delhi\nState Art Gallery Annual Shilpa Exhibition\nInternational Stone Art Biennale\nIndia Art Fair, Mumbai', 3)}
        {lf('awards', 'Awards, titles & master craftsman honors', 'National Master Craftsman Award (Ministry of Textiles)\nState Shilpa Guru Puraskaram\nHeritage Artisan of the Year\nHonorary Sthapathi Title', 3)}
        {lf('notableInstallations', 'Notable clients & temple installations', 'Installed 12-foot Black Granite Idol at Tirupati; Life-size bronze statue at Central University; Commissioned works in USA, UK & Australia temples', 3)}
      </Section>

      {/* Step 6 — Pricing, Catalog & Art Workshops */}
      <Section label="Pricing, Catalog & Workshops" step="Step 6 · Pricing & Workshops" accent="emerald">
        {tf('startingPrice', 'Starting price range', 'Sculptures starting from ₹5,000 to custom monument contracts', 1)}
        {tf('catalogAvailable', 'Catalog / ready stock availability', 'Catalog PDF available on WhatsApp / Ready stock gallery open for visit', 1)}
        {lf('workshops', 'Sculpting workshops & apprenticeship courses', 'Traditional stone sculpting weekend masterclass; Clay idol sculpting for youth; 6-month classical Shilpa Shastra apprenticeship program', 3)}
        {tf('paymentTerms', 'Payment terms & milestones', '30% advance on order booking, 40% on mid-carving review, 30% on dispatch', 2)}
      </Section>

      {/* Step 7 — Portfolio Visuals & Media */}
      <Section label="Sculpture Portfolio & Studio Visuals" step="Step 7 · Visuals" accent="slate">
        <div className="col-span-2 text-xs text-ink/50">Upload studio brand logo, workshop/carving yard cover photo, and gallery photos of sculptures, raw material, and completed idols.</div>
        <div className="col-span-2 grid gap-4 sm:grid-cols-2">
          {renderSingleImageUpload?.('logo', 'Studio logo / Signature stamp')}
          {renderSingleImageUpload?.('coverImage', 'Workshop / Studio cover photo', false)}
          {renderSingleImageUpload?.('aboutImage', 'Master sculptor / Featured artwork photo', false)}
        </div>
        <div className="col-span-2">
          <label className="text-sm font-medium text-ink/75">Sculpture gallery & past creations (statues, idols, wall murals)</label>
          <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {(uploadedFiles.galleryImages || []).map((img, i) => (
              <div key={i} className="overflow-hidden rounded border border-line bg-white">
                <img src={img} alt={`Sculpture ${i + 1}`} className="h-24 w-full object-contain" />
                <button type="button" onClick={() => removeUploadedImage?.('galleryImages', i)} className="w-full border-t border-line bg-red-50 px-2 py-2 text-[11px] font-medium text-red-500 hover:bg-red-100">Remove</button>
              </div>
            ))}
            <label className="flex min-h-[110px] cursor-pointer items-center justify-center rounded border border-dashed border-line bg-white px-3 py-4 text-center text-xs text-ink/60 hover:border-ink/40">
              Add photos<input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleLocalFiles?.('galleryImages', e.target.files, true)} />
            </label>
          </div>
        </div>
        <F label="Studio Tour / Carving Process Video URL (optional)" col={2}>
          <input type="url" value={form.videoUrls || ''} onChange={update('videoUrls')} placeholder="https://youtube.com/watch?v=..." className={ic} />
          <p className="mt-1 text-xs text-ink/40">Paste a YouTube video link demonstrating stone carving, bronze lost-wax casting, or studio gallery tour.</p>
        </F>
      </Section>

      {/* Step 8 — Social Links */}
      <Section label="Studio Social & Digital Presence" step="Step 8 · Contact & Social" accent="blue">
        <F label="WhatsApp catalog & inquiry" col={1}><input value={form.whatsapp || ''} onChange={update('whatsapp')} placeholder="https://wa.me/91..." className={ic} /></F>
        <F label="Instagram art portfolio" col={1}><input value={form.instagram || ''} onChange={update('instagram')} placeholder="https://instagram.com/sculpturestudio" className={ic} /></F>
        <F label="YouTube channel" col={1}><input value={form.youtube || ''} onChange={update('youtube')} placeholder="https://youtube.com/@sculpturestudio" className={ic} /></F>
        <F label="Facebook page" col={1}><input value={form.facebook || ''} onChange={update('facebook')} placeholder="https://facebook.com/sculpturestudio" className={ic} /></F>
      </Section>
    </div>
  );
}
