export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const start = Math.max(1, Math.min(page - 2, totalPages - 4));
  const end = Math.min(totalPages, start + 4);
  const pages = [];
  for (let p = start; p <= end; p++) pages.push(p);

  return (
    <nav className="pagination" aria-label="Pagination">
      <button disabled={page === 1} onClick={() => onChange(page - 1)}>«</button>
      {pages.map((p) => (
        <button key={p} className={p === page ? 'active' : ''} onClick={() => onChange(p)}>
          {p}
        </button>
      ))}
      <button disabled={page === totalPages} onClick={() => onChange(page + 1)}>»</button>
    </nav>
  );
}