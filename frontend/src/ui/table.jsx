export default function Table({ columns, rows }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-900/60 text-slate-300">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="px-4 py-3 font-medium">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-800 bg-slate-950/40">
          {rows.map((r, idx) => (
            <tr key={idx} className="hover:bg-slate-900/30">
              {columns.map((c) => (
                <td key={c.key} className="px-4 py-3 text-slate-200">
                  {r[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}