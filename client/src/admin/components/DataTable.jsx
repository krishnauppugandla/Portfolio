export default function DataTable({ columns, data, loading, emptyMessage = 'No items found', emptyAction }) {
  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton h-14 rounded-xl" />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-12 h-12 bg-background-alt rounded-2xl flex items-center justify-center mb-3">
          <span className="text-2xl">📭</span>
        </div>
        <p className="font-body text-muted text-sm mb-4">{emptyMessage}</p>
        {emptyAction}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-background-alt">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left font-mono text-xs text-muted font-medium whitespace-nowrap"
                style={{ width: col.width }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-white">
          {data.map((row, i) => (
            <tr key={row.id || i} className="hover:bg-background-alt transition-colors">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 font-body text-ink whitespace-nowrap">
                  {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
