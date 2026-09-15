import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';
import PlaceCard from '../components/PlaceCard';

const CATEGORY_IMAGES = {
  schools: ['https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=240&q=80', 'School building'],
  colleges: ['https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&w=240&q=80', 'College campus'],
  universities: ['https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=240&q=80', 'University campus'],
  hospitals: ['https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=240&q=80', 'Hospital building'],
  clinics: ['https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=240&q=80', 'Clinic interior'],
  pharmacies: ['https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&w=240&q=80', 'Pharmacy'],
  restaurants: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=240&q=80', 'Restaurant'],
  hotels: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=240&q=80', 'Hotel'],
  'fashion-stores': ['https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=240&q=80', 'Fashion store'],
  'shopping-malls': ['https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?auto=format&fit=crop&w=240&q=80', 'Shopping mall'],
  banks: ['https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=240&q=80', 'Bank office'],
  gyms: ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=240&q=80', 'Gym'],
  salons: ['https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=240&q=80', 'Salon'],
  theatres: ['https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=240&q=80', 'Theatre'],
  'tourist-places': ['https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=240&q=80', 'Tourist place'],
  temples: ['https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=240&q=80', 'Temple'],
  parks: ['https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?auto=format&fit=crop&w=240&q=80', 'Park'],
  'it-companies': ['https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=240&q=80', 'IT office'],
  'coaching-centers': ['https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=240&q=80', 'Learning center'],
  libraries: ['https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=240&q=80', 'Library'],
  'automobile-dealers': ['https://images.unsplash.com/photo-1562141961-b7f7c7d1b5a6?auto=format&fit=crop&w=240&q=80', 'Automobile showroom'],
  'government-offices': ['https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=240&q=80', 'Government office'],
  'real-estate': ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=240&q=80', 'Real estate property'],
};

export default function CategoryPlacesPage() {
  const { category: slug } = useParams();
  const [category, setCategory] = useState(null);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const categoryImage = CATEGORY_IMAGES[slug];

  useEffect(() => {
    setLoading(true);
    api.get(`/categories/${slug}`).then(({ data }) => {
      setCategory(data.data);
      return api.get('/places', { params: { category: data.data._id, limit: 48, sort: 'rating' } });
    }).then(({ data }) => setPlaces(data.data)).catch(() => { setCategory(null); setPlaces([]); }).finally(() => setLoading(false));
  }, [slug]);

  return (
    <div className="container-page py-12">
      <Link to="/categories" className="text-sm text-ink/50 hover:text-ink">← All categories</Link>
      <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-vermilion">Directory results</p><div className="mt-2 flex items-center gap-4"><h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">{category?.name || 'Category places'}</h1>{categoryImage && <img src={categoryImage[0]} alt={categoryImage[1]} className="h-14 w-20 rounded-lg object-cover shadow-sm sm:h-16 sm:w-24" />}</div><p className="mt-2 text-ink/55">Browse verified {category?.name?.toLowerCase() || 'places'} across our available cities.</p></div>
        <Link to="/explore" className="rounded-lg border border-line px-4 py-2 text-sm text-ink/70 hover:border-ink/30 hover:text-ink">Choose a city</Link>
      </div>
      {loading ? <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-64 animate-pulse rounded-2xl bg-ink/5" />)}</div> : places.length ? <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{places.map((place) => <PlaceCard key={place._id} place={place} />)}</div> : <div className="mt-10 rounded-2xl border border-dashed border-line p-12 text-center text-ink/50">No approved places in this category yet.</div>}
    </div>
  );
}
