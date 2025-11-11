import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Building,
  Building2,
  ArrowRight,
  Plus,
  Trash2,
  Edit2,
  Eye,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UnitForm } from "@/components/UnitForm";
import FinancialExpensesSection from "@/components/FinanceSection.jsx"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";


interface Unit {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  legalAgreements?: string[];
  aprReports: string[];
 softexDetails: {
  year: string;
  month: string;
  amount: string;
  mpr: string;
}[];
  financialExpenses: { year: string; amount: string; description: string }[];
  // new fields
  managerName?: string;
  managerEmail?: string;
  managerPhone?: string;
  managerDesignation?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  roc?: string;
  gst?: string;
  iec?: string;
  address?: string;
}

const API_BASE_URL = "http://localhost:5000/api";

const EximPage = () => {
  const [stpiUnits, setStpiUnits] = useState<Unit[]>([]);
  const [nonStpiUnits, setNonStpiUnits] = useState<Unit[]>([]);
  const [activeTab, setActiveTab] = useState("stpi");
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [viewingUnit, setViewingUnit] = useState<Unit | null>(null);
  const [softexFilterYear, setSoftexFilterYear] = useState("");
const [softexFilterMonth, setSoftexFilterMonth] = useState("");
const [filteredSoftex, setFilteredSoftex] = useState<
  { year: string; month: string; amount: string; mpr: string }[]
>([]);
useEffect(() => {
  if (!viewingUnit?.softexDetails) {
    setFilteredSoftex([]);
    return;
  }

  let list = [...viewingUnit.softexDetails];

  if (softexFilterYear) {
    list = list.filter((s) => s.year === softexFilterYear);
  }

  if (softexFilterMonth) {
    list = list.filter((s) => s.month === softexFilterMonth);
  }

  // optional: sort (latest year first, then month if you have numeric month)
  list.sort((a, b) => {
    const yearDiff = Number(b.year) - Number(a.year);
    if (yearDiff !== 0) return yearDiff;
    // try to sort month if months are numeric strings, else keep as-is
    return (Number(b.month) || 0) - (Number(a.month) || 0);
  });

  setFilteredSoftex(list);
}, [viewingUnit, softexFilterYear, softexFilterMonth]);

  const stpiLink =
    "https://onedrive.live.com/:x:/g/personal/48290514C262A261/EQyJdK9JxfxGj4Rv-c0uOBsBNc9EDPZAIzY-ghRP15lP2Q?resid=48290514C262A261!saf74890cc54946fc8f846ff9cd2e381b";
  const nonStpiLink =
    "https://onedrive.live.com/:x:/g/personal/48290514C262A261/EYlVHHos9nhOk2TP5y05NUUB5EeT71CgpPOOPuC1sQR8hA?resid=48290514C262A261!s7a1c5589f62c4e789364cfe72d393545";

  useEffect(() => {
    fetchUnits();
  }, []);

  const fetchUnits = async () => {
    try {
      const stpiRes = await fetch(`${API_BASE_URL}/exim/stpi`);
      const nonStpiRes = await fetch(`${API_BASE_URL}/exim/non-stpi`);
      const stpiData = await stpiRes.json();
      const nonStpiData = await nonStpiRes.json();
      console.log(stpiData);
      
      setStpiUnits(
        (Array.isArray(stpiData) ? stpiData : []).map((unit) => ({
          ...unit,
          id: unit._id,
          aprReports: Array.isArray(unit.aprReports) ? unit.aprReports : [],
          softexDetails: Array.isArray(unit.softexDetails)
            ? unit.softexDetails
            : [],
          financialExpenses: Array.isArray(unit.financialExpenses)
            ? unit.financialExpenses
            : [],
          legalAgreements: Array.isArray(unit.legalAgreements)
            ? unit.legalAgreements
            : [],
        }))
      );

      setNonStpiUnits(
        (Array.isArray(nonStpiData) ? nonStpiData : []).map((unit) => ({
          ...unit,
          id: unit._id,
          aprReports: Array.isArray(unit.aprReports) ? unit.aprReports : [],
          softexDetails: Array.isArray(unit.softexDetails)
            ? unit.softexDetails
            : [],
          financialExpenses: Array.isArray(unit.financialExpenses)
            ? unit.financialExpenses
            : [],
          legalAgreements: Array.isArray(unit.legalAgreements)
            ? unit.legalAgreements
            : [],
        }))
      );
    } catch (error) {
      console.error("Error fetching units:", error);
    }
  };



  const handleAddUnit = async (unitData: Omit<Unit, "id">) => {
    try {
      const response = await fetch(`${API_BASE_URL}/exim/${activeTab}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(unitData),
      });
      const newUnit = await response.json();
      if (activeTab === "stpi") {
        setStpiUnits([...stpiUnits, { ...newUnit, id: newUnit._id }]);
      } else {
        setNonStpiUnits([...nonStpiUnits, { ...newUnit, id: newUnit._id }]);
      }
      setShowForm(false);
    } catch (error) {
      console.error("Error adding unit:", error);
    }
  };

  const handleEditUnit = async (unitData: Omit<Unit, "id">) => {
    if (!editingUnit) return;
    try {
      const response = await fetch(
        `${API_BASE_URL}/exim/${activeTab}/${editingUnit.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(unitData),
        }
      );
      const updatedUnit = await response.json();
      if (activeTab === "stpi") {
        setStpiUnits((prev) =>
          prev.map((u) =>
            u.id === editingUnit.id ? { ...updatedUnit, id: updatedUnit._id } : u
          )
        );
      } else {
        setNonStpiUnits((prev) =>
          prev.map((u) =>
            u.id === editingUnit.id ? { ...updatedUnit, id: updatedUnit._id } : u
          )
        );
      }
      setEditingUnit(null);
      setShowForm(false);
    } catch (error) {
      console.error("Error updating unit:", error);
    }
  };

  const handleDeleteUnit = async (id: string) => {
    if (!confirm("ARE YOU SURE ?")) return;
    try {
      await fetch(`${API_BASE_URL}/exim/${activeTab}/${id}`, {
        method: "DELETE",
      });
      if (activeTab === "stpi") {
        setStpiUnits((prev) => prev.filter((u) => u.id !== id));
      } else {
        setNonStpiUnits((prev) => prev.filter((u) => u.id !== id));
      }
    } catch (error) {
      console.error("Error deleting unit:", error);
    }
  };

  const currentUnits = activeTab === "stpi" ? stpiUnits : nonStpiUnits;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20 p-6">
      <div className="max-w-8xl mx-auto space-y-8 lg:space-y-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button
                variant="outline"
                size="sm"
                className="hover:scale-105 transition-transform"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-extrabold text-sky-600">
                Exim Management
              </h1>
              <p className="text-sky-700/80 text-sm">
                Manage STPI and Non-STPI units
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="stpi">
              <Building className="h-4 w-4 mr-1" /> STPI Units
            </TabsTrigger>
            <TabsTrigger value="non-stpi">
              <Building2 className="h-4 w-4 mr-1" /> Non-STPI Units
            </TabsTrigger>
          </TabsList>

          {[{ key: "stpi" }, { key: "non-stpi" }].map(({ key }) => (
            <TabsContent key={key} value={key}>
              <div className="flex justify-between items-center mt-6">
                <h2 className="text-xl font-semibold capitalize">
                  {key} Units
                </h2>
                <Button
                  onClick={() => setShowForm(true)}
                  className="bg-gradient-primary"
                >
                  <Plus className="h-4 w-4 mr-2" /> Add {key.toUpperCase()} Unit
                </Button>
              </div>

              <div
              key={key}
                className="overflow-y-auto mt-4 pr-2"
                style={{ maxHeight: "calc(100vh - 250px)" }}
              >
                <div className="grid gap-4 grid-cols-3">
                  {(key === "stpi" ? stpiUnits : nonStpiUnits).map((unit) => (
                    <Card
                      key={unit.id}
                      className="shadow hover:shadow-lg transition"
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">{unit.name}</CardTitle>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setViewingUnit(unit)}
                            >
                              <Eye className="h-4 w-4 text-sky-600" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingUnit(unit);
                                setShowForm(true);
                              }}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteUnit(unit.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {unit.startDate} → {unit.endDate}
                        </p>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm">
                          <p><span className="font-medium">Manager:</span> {unit.managerName || '—'}</p>
                          <p><span className="font-medium">Contact:</span> {unit.contactEmail || unit.contactPhone || '—'}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Form */}
        {showForm && (
          <UnitForm
            unit={editingUnit}
            isStpi={activeTab === "stpi"}
            onSubmit={editingUnit ? handleEditUnit : handleAddUnit}
            onCancel={() => {
              setShowForm(false);
              setEditingUnit(null);
            }}
          />
        )}

        {/* View Unit Dialog */}
        <Dialog 
        open={!!viewingUnit} onOpenChange={() => setViewingUnit(null)}>
          <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-sky-600">
                Unit Details
              </DialogTitle>
            </DialogHeader>
           {viewingUnit && (
  <div className="space-y-8">
    {/* Basic Info */}
    <div className="space-y-4">
      <p>
        <strong>Name:</strong> {viewingUnit.name}
      </p>
      <p>
        <strong>Period:</strong> {viewingUnit.startDate} →{" "}
        {viewingUnit.endDate}
      </p>
    </div>

    {/* Director/Manager & Contact / Registrations */}
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-white border-2 border-orange-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
        <h3 className="text-lg font-bold text-orange-600 mb-4 flex items-center gap-2">
          <span className="text-2xl">👤</span> Director / Manager Details
        </h3>
        <div className="space-y-2 ml-2">
          <p className="text-base"><span className="font-semibold text-gray-700">Name:</span> <span className="text-gray-900">{viewingUnit.managerName || '—'}</span></p>
          <p className="text-base"><span className="font-semibold text-gray-700">Designation:</span> <span className="text-gray-900">{viewingUnit.managerDesignation || '—'}</span></p>
          <p className="text-base"><span className="font-semibold text-gray-700">Email:</span> <span className="text-blue-600">{viewingUnit.managerEmail || '—'}</span></p>
          <p className="text-base"><span className="font-semibold text-gray-700">Phone:</span> <span className="text-gray-900">{viewingUnit.managerPhone || '—'}</span></p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white border-2 border-green-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-lg font-bold text-green-600 mb-4 flex items-center gap-2">
            <span className="text-2xl">📞</span> Contact Details
          </h3>
          <div className="space-y-2 ml-2">
            <p className="text-base"><span className="font-semibold text-gray-700">Contact:</span> <span className="text-gray-900">{viewingUnit.contactName || '—'}</span></p>
            <p className="text-base"><span className="font-semibold text-gray-700">Email:</span> <span className="text-blue-600">{viewingUnit.contactEmail || '—'}</span></p>
            <p className="text-base"><span className="font-semibold text-gray-700">Phone:</span> <span className="text-gray-900">{viewingUnit.contactPhone || '—'}</span></p>
          </div>
        </div>

        <div className="bg-white border-2 border-amber-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-lg font-bold text-amber-600 mb-4 flex items-center gap-2">
            <span className="text-2xl">🏷️</span> Registrations & Address
          </h3>
          <div className="space-y-2 ml-2">
            <p className="text-base"><span className="font-semibold text-gray-700">ROC:</span> <span className="text-gray-900">{viewingUnit.roc || '—'}</span></p>
            <p className="text-base"><span className="font-semibold text-gray-700">GST:</span> <span className="text-gray-900">{viewingUnit.gst || '—'}</span></p>
            <p className="text-base"><span className="font-semibold text-gray-700">IEC:</span> <span className="text-gray-900">{viewingUnit.iec || '—'}</span></p>
            <div className="mt-3 pt-3 border-t border-amber-100">
              <p className="font-semibold text-gray-700 mb-2">Address:</p>
              <p className="text-base text-gray-800 whitespace-pre-wrap">{viewingUnit.address || '—'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Legal Agreements */}
    {viewingUnit.legalAgreements?.length > 0 && (
  <div>
    <h3 className="text-lg font-semibold text-sky-700">Agreements</h3>
    <ul className="list-disc pl-5  mt-2">
      {viewingUnit.legalAgreements.map((item, idx) => {
        const formatted = item.replace(/(Dated[:\-]?\s*)/i, "\n$1");
        return (
          <li
            key={idx}
            className="whitespace-pre-line leading-tight border rounded-md p-2 bg-muted/40"
          >
            {formatted}
          </li>
        );
      })}
    </ul>
  </div>
)}

    {/* APR Reports */}
    <div>
      <h4 className="font-semibold text-sky-600 mb-2">APR Report</h4>
      {viewingUnit.aprReports?.length > 0 ? (
        <ul className="list-disc pl-5 space-y-1">
          {viewingUnit.aprReports.map((file, i) => (
            <li key={i}>
              <p
                className="text-primary font-semibold hover:underline"
              >
                {file.split("/").pop()}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted-foreground italic">Null</p>
      )}
    </div>

    {/* Softex Details */}
  {/* ✅ SOFTEX DETAILS */}
{/* SOFTEX DETAILS with Year + Month filters */}
<div>
  <h4 className="font-semibold text-sky-600 mb-2">Softex Details</h4>

  {/* Filters */}
  <div className="flex gap-3 mb-3">
    <select
      className="input"
      value={softexFilterYear}
      onChange={(e) => setSoftexFilterYear(e.target.value)}
    >
      <option value="">Filter Year</option>
      {[...new Set(viewingUnit?.softexDetails?.map((x) => x.year))].map(
        (y, i) =>
          y && (
            <option key={i} value={y}>
              {y}
            </option>
          )
      )}
    </select>

    <select
      className="input"
      value={softexFilterMonth}
      onChange={(e) => setSoftexFilterMonth(e.target.value)}
    >
      <option value="">Filter Month</option>
      {[...new Set(viewingUnit?.softexDetails?.map((x) => x.month))].map(
        (m, i) =>
          m && (
            <option key={i} value={m}>
              {m}
            </option>
          )
      )}
    </select>

    {/* quick clear button */}
    <button
      type="button"
      className="ml-2 px-3 py-1 text-sm rounded border"
      onClick={() => {
        setSoftexFilterYear("");
        setSoftexFilterMonth("");
      }}
    >
      Clear
    </button>
  </div>

  {/* Table */}
  {filteredSoftex?.length > 0 ? (
    <div className="overflow-auto max-h-60 rounded-md border border-gray-200 shadow-sm">
      <table className="w-full text-sm border-collapse">
        <thead className="bg-sky-50 text-sky-700 font-semibold">
          <tr>
            <th className="px-4 py-2 text-left border-b">Year</th>
            <th className="px-4 py-2 text-left border-b">Month</th>
            <th className="px-4 py-2 text-left border-b">Softex Amount (₹ in lakhs)</th>
            <th className="px-4 py-2 text-left border-b">MPR Amount(₹ in lakhs)</th>
          </tr>
        </thead>

        <tbody>
          {filteredSoftex.map((item, index) => (
            <tr
              key={index}
              className="hover:bg-sky-50 transition-colors border-b last:border-0"
            >
              <td className="px-4 py-2">{item.year || "-"}</td>
              <td className="px-4 py-2">{item.month || "-"}</td>
              <td className="px-4 py-2 font-medium text-sky-700">
                ₹{item.amount || "0"}
              </td>
              <td className="px-4 py-2">{item.mpr || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex">
      <p className="mt-2 font-semibold p-5 text-sky-700">
        Total Softex: ₹
      {
  filteredSoftex
    .reduce((t, s) => t + (parseFloat(s.amount) || 0), 0)
    .toFixed(3)
}
      </p>
      <p className="mt-2 font-semibold p-5 text-sky-700">
        Total Mpr: ₹
       {
  filteredSoftex
    .reduce((t, s) => t + (Number(s.mpr) || 0), 0)
    .toFixed(3)
}
      </p>
      </div>
    </div>
    
  ) : (
    <p className="text-muted-foreground italic">
      No Softex details available for selected filter
    </p>
  )}
</div>



    {/* Financial Expenses Section */}
    <FinancialExpensesSection viewingUnit={viewingUnit} />
  </div>
)}

          </DialogContent>
        </Dialog>

        <a
          target="_blank"
          href={activeTab === "stpi" ? stpiLink : nonStpiLink}
        >
          <p className="flex gap-2 text-accent-foreground justify-center hover:underline group cursor-pointer mt-4">
            SEE ALL UNITS{" "}
            <ArrowRight className="group-hover:translate-x-2 transition-all" />
          </p>
        </a>
      </div>
    </div>
  );
};

export default EximPage;
