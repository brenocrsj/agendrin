export default function Table({ columns, rows }) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-soft">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="data-grid-header text-slate-500">
            <tr>
              {columns.map((c) => (
                <th key={c.key} className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em]">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 bg-white">
            {rows.map((r, idx) => (
              <tr key={idx} className="transition hover:bg-copper-50/30">
                {columns.map((c) => (
                  <td key={c.key} className="px-5 py-4 text-slate-700">
                    {r[c.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}