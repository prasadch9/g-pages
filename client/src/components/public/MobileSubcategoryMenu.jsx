import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const readItems = (header) => {
  const links = [...header.querySelectorAll('nav a[href^="#"]')];
  const unique = new Map();
  links.forEach((link) => {
    const href = link.getAttribute('href');
    const label = link.textContent.trim();
    if (href && href.length > 1 && label) unique.set(href, [label, href]);
  });
  if (!unique.size) {
    document.querySelectorAll('main section[id], main [id]').forEach((section) => {
      const heading = section.querySelector('h1, h2, h3');
      if (section.id && heading?.textContent.trim()) unique.set(`#${section.id}`, [heading.textContent.trim(), `#${section.id}`]);
    });
  }
  return [...unique.values()];
};

export default function MobileSubcategoryMenu() {
  const [header, setHeader] = useState(null);
  const [menuTarget, setMenuTarget] = useState(null);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [footerIdentities, setFooterIdentities] = useState([]);

  useEffect(() => {
    const findHeader = () => {
      const candidate = document.querySelector('header');
      if (!candidate) return;
      [...candidate.querySelectorAll('a[href="/"]')].forEach((link) => {
        if (!link.closest('nav') && /back to (home|g-pages)/i.test(link.textContent)) link.dataset.mobileHideHome = 'true';
      });
      [...candidate.querySelectorAll('a[href^="#"]')].forEach((link) => {
        if (!link.closest('nav') && /apply online/i.test(link.textContent)) link.dataset.mobileMenuAction = 'true';
      });
      const hasMenu = [...candidate.querySelectorAll('button')].some((button) =>
        !String(button.getAttribute('aria-label') || '').includes('subcategory navigation')
        && /menu|navigation|☰|≡/i.test(`${button.getAttribute('aria-label') || ''} ${button.textContent}`),
      );
      setHeader(hasMenu ? null : candidate);
      const mobileNav = hasMenu ? [...candidate.querySelectorAll('nav')].find((nav) => {
        if (!/(^|\s)(sm|md|lg):hidden(\s|$)/.test(nav.className) || window.getComputedStyle(nav).display === 'none') return false;
        return ![...nav.querySelectorAll('a[href="/"]')].some((link) => !link.hasAttribute('data-mobile-home-link'));
      }) : null;
      setMenuTarget(mobileNav || null);
      setItems(readItems(candidate));

      const brandLink = [...candidate.querySelectorAll('a')].find((link) => link.querySelector('img') && link.textContent.trim())
        || [...candidate.querySelectorAll('a[href="#home"], a[href="#top"]')].find((link) => !link.closest('nav'));
      const nameNode = brandLink?.querySelector('strong, h1, h2, [class*="font-bold"]');
      const businessName = nameNode?.textContent.trim()
        || brandLink?.textContent.trim().split(/\s{2,}/)[0]
        || document.querySelector('main h1')?.textContent.trim()
        || '';
      const logo = brandLink?.querySelector('img')?.src || '';
      const nextFooterIdentities = businessName
        ? [...document.querySelectorAll('footer[data-mobile-footer-layout="columns"]')].flatMap((footer) => {
          const layout = footer.firstElementChild;
          if (!layout) return [];
          let mount = layout.querySelector(':scope > [data-category-footer-identity]');
          const firstSection = mount?.nextElementSibling || layout.firstElementChild;
          const firstText = firstSection?.textContent || '';
          const alreadyBranded = firstText.includes(businessName)
            && (firstSection.querySelector('img, strong, h1, h2') || firstSection.children.length > 1);
          if (alreadyBranded) {
            mount?.remove();
            return [];
          }
          if (!mount) {
            mount = document.createElement('div');
            mount.dataset.categoryFooterIdentity = 'true';
            layout.prepend(mount);
          }
          return [{ mount, businessName, logo }];
        })
        : [];
      setFooterIdentities((current) => current.length === nextFooterIdentities.length
        && current.every((item, index) => item.mount === nextFooterIdentities[index].mount
          && item.businessName === nextFooterIdentities[index].businessName
          && item.logo === nextFooterIdentities[index].logo)
        ? current
        : nextFooterIdentities);
    };
    findHeader();
    const observer = new MutationObserver(findHeader);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!header || window.getComputedStyle(header).position !== 'static') return undefined;
    const previousPosition = header.style.position;
    header.style.position = 'relative';
    return () => { header.style.position = previousPosition; };
  }, [header]);

  if (!header && !menuTarget && !footerIdentities.length) return null;
  return <>
    {footerIdentities.map(({ mount, businessName, logo }, index) => createPortal(
      <div className="category-footer-identity">
        {logo && <img src={logo} alt="" />}
        <strong>{businessName}</strong>
      </div>,
      mount,
      `${businessName}-${index}`,
    ))}
    {header && createPortal(
    <div className="absolute right-4 top-1/2 z-[60] -translate-y-1/2 lg:hidden">
      <button type="button" onClick={() => setOpen((value) => !value)} aria-label={open ? 'Close subcategory navigation' : 'Open subcategory navigation'} aria-expanded={open} className="grid h-10 w-10 place-items-center rounded-lg border border-slate-300 bg-white text-slate-800 shadow-sm">
        <span className="sr-only">{open ? 'Close navigation' : 'Open navigation'}</span>
        {open ? <span aria-hidden="true" className="relative h-4 w-4"><span className="absolute left-0 top-1/2 h-0.5 w-4 -rotate-45 bg-current" /><span className="absolute left-0 top-1/2 h-0.5 w-4 rotate-45 bg-current" /></span> : <span aria-hidden="true" className="flex w-4 flex-col gap-[3px]"><span className="h-0.5 w-full bg-current" /><span className="h-0.5 w-full bg-current" /><span className="h-0.5 w-full bg-current" /></span>}
      </button>
      {open && <nav className="absolute right-0 top-full mt-2 max-h-[75vh] w-64 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 text-slate-800 shadow-xl">
        {items.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)} className="block border-b border-slate-100 px-3 py-3 text-sm font-semibold">{label}</a>)}
        <a href="/" onClick={() => setOpen(false)} className="mt-1 block rounded-lg bg-slate-900 px-3 py-3 text-sm font-bold text-white">← Back to G-Pages</a>
      </nav>}
    </div>,
    header,
    )}
    {menuTarget && createPortal(<a data-mobile-home-link="true" href="/" className="mt-1 block px-3 py-3 text-sm font-bold">Back to G-Pages</a>, menuTarget)}
  </>;
}
