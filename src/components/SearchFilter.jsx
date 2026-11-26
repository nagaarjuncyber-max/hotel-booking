import { useState } from 'react';

export default function SearchFilter({ onApply }) {
  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (minPrice !== '' && maxPrice !== '' && Number(minPrice) > Number(maxPrice)) {
      setError('Min price cannot be greater than max price');
      return;
    }
    setError('');
    onApply({ search: search.trim(), minPrice, maxPrice });
  };

  const reset = () => {
    setSearch(''); setMinPrice(''); setMaxPrice(''); setError('');
    onApply({ search: '', minPrice: '', maxPrice: '' });
  };

  return (
    <form className="card filters" onSubmit={submit}>
      <input
        type="search"
        placeholder="Search by title..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        aria-label="Search by title"
      />
      <input type="number" min="0" placeholder="Min price" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} aria-label="Minimum price" />
      <input type="number" min="0" placeholder="Max price" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} aria-label="Maximum price" />
      <button className="btn btn-primary" type="submit">Apply</button>
      <button className="btn btn-outline" type="button" onClick={reset}>Reset</button>
      {error && <span className="err full">{error}</span>}
    </form>
  );
}