import { useState } from "react";

export default function FinancialExpensesSection({ viewingUnit }) {
  const [filterYear, setFilterYear] = useState("");
  const [filterSlab, setFilterSlab] = useState("");

  // ✅ Filter + sort (latest year first)
  const filteredExpenses = (
    viewingUnit?.financialExpenses?.filter((e) => {
      const matchYear = filterYear ? e.year === filterYear : true;
      const matchSlab = filterSlab ? e.amount === filterSlab : true;
      return matchYear && matchSlab;
    }) ?? []
  ).sort((a, b) => Number(b.year) - Number(a.year));

  // ✅ Unique sorted dropdown values
  const years = [
    ...new Set(viewingUnit?.financialExpenses?.map((e) => e.year) || []),
  ].sort((a, b) => Number(b) - Number(a));

  const slabs = [
    ...new Set(
      viewingUnit?.financialExpenses
        ?.map((e) => e.amount) // ✅ slab stored in amount
        .filter(Boolean) || []
    ),
  ];

  return (
    <div>
      <h4 className="font-semibold text-sky-600 mb-3">
        Financial Revenue
      </h4>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center mb-4">
        <select
          className="border rounded-md px-3 py-2 text-sm"
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
        >
          <option value="">All Years</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <select
          className="border rounded-md px-3 py-2 text-sm"
          value={filterSlab}
          onChange={(e) => setFilterSlab(e.target.value)}
        >
          <option value="">All Slabs</option>
          {slabs.map((slab) => (
            <option key={slab} value={slab}>
              {slab}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-md border border-gray-200 shadow-sm">
        <table className="w-full text-sm border-collapse max-h-60">
          <thead className="bg-sky-50 text-sky-700 font-semibold">
            <tr>
              <th className="px-4 py-2 text-left border-b">Year</th>
              <th className="px-4 py-2 text-left border-b">Slab</th>
              <th className="px-4 py-2 text-left border-b">Revenue (₹)</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.length > 0 ? (
              filteredExpenses.map((e, i) => (
                <tr
                  key={i}
                  className="hover:bg-sky-50 transition-colors border-b last:border-0"
                >
                  <td className="px-4 py-2">{e.year}</td>
                  <td className="px-4 py-2">{e.amount || "-"}</td>
                  <td className="px-4 py-2 font-medium text-sky-700">
                    ₹{e.description}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={3}
                  className="text-center text-muted-foreground py-4 italic"
                >
                  No financial data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
