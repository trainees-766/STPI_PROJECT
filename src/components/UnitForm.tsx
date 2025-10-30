import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Unit {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  legalAgreements?: string[];
  aprReports: string[];
  softexDetails: string[];
  financialExpenses: { year: string; amount: string; description: string }[];
}

interface UnitFormProps {
  unit?: Unit | null;
  isStpi: boolean;
  onSubmit: (unit: Omit<Unit, "id">) => void;
  onCancel: () => void;
}

export const UnitForm = ({ unit, isStpi, onSubmit, onCancel }: UnitFormProps) => {
  const [formData, setFormData] = useState({
    name: unit?.name || "",
    startDate: unit?.startDate || "",
    endDate: unit?.endDate || "",
    legalAgreements: unit?.legalAgreements || (isStpi ? [""] : undefined),
    aprReports: unit?.aprReports || [""],
  softexDetails: unit?.softexDetails || [{ year: "", month: "", amount: "", mpr: "" }],
    financialExpenses: unit?.financialExpenses || [{ year: "", amount: "", description: "" }],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const cleanedData = {
      ...formData,
      legalAgreements: isStpi ? formData.legalAgreements?.filter(Boolean) : undefined,
      aprReports: formData.aprReports.filter(Boolean),
   softexDetails: formData.softexDetails.filter(
  (s) => s.year || s.month || s.amount || s.mpr
),

      financialExpenses: formData.financialExpenses.filter(exp => exp.year && exp.amount),
    };
    
    onSubmit(cleanedData);
  };

  const addArrayItem = (field: string) => {
    if (field === "financialExpenses") {
      setFormData(prev => ({
        ...prev,
        [field]: [...(prev[field] as any[]), { year: "", amount: "", description: "" }]
      }));
    } else if (field === "softexDetails") {
  setFormData(prev => ({
    ...prev,
    [field]: [...prev[field], { year: "", month: "", amount: "", mpr: "" }]
  }));
} else {
  setFormData(prev => ({
    ...prev,
    [field]: [...(prev[field] as string[]), ""]
  }));
}

  };

  const removeArrayItem = (field: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as any[]).filter((_, i) => i !== index)
    }));
  };

  const updateArrayItem = (field: string, index: number, value: string | { year: string; amount: string; description: string }) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as any[]).map((item, i) => i === index ? value : item)
    }));
  };
const tariffTable = [
  { amount: "0-12.5", label: "0 – 12.5 Lakhs", description: 4000 },
  { amount: "12.5-25", label: "12.5 – 25 Lakhs", description: 8000 },
  { amount: "25-50", label: "25 – 50 Lakhs", description: 16000 },
  { amount: "50-300", label: "50 Lakhs – 3 Crores", description: 55000 },
  { amount: "300-1000", label: "3 Crores – 10 Crores", description: 110000 },
  { amount: "1000-2500", label: "10 Crores – 25 Crores", description: 225000 },
  { amount: "2500-5000", label: "25 Crores – 50 Crores", description: 250000 },
  { amount: "5000-10000", label: "50 Crores – 100 Crores", description: 350000 },
  { amount: "10000-50000", label: "100 Crores – 500 Crores", description: 575000 },
  { amount: "50000-100000", label: "500 Crores – 1000 Crores", description: 600000 },
  { amount: "100000-INF", label: "More than 1000 Crores", description: 650000 },
];

const handleRangeSelect = (index, selectedValue) => {
  const selectedRange = tariffTable.find(r => r.value === selectedValue);

  const updated = [...formData.financialExpenses];
  updated[index] = {
    ...updated[index],
    amount: selectedValue,                 // ✅ range stored in amount
    description: selectedRange ? selectedRange.sc : "",   // ✅ charge auto-fill
  };

  setFormData(prev => ({ ...prev, financialExpenses: updated }));
};





  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-card-hover animate-scale-in">
        <CardHeader className="flex-row justify-between items-center pb-4">
          <CardTitle className="text-xl">
            {unit ? "Edit" : "Add New"} {isStpi ? "STPI" : "Non-STPI"} Unit
          </CardTitle>
          <Button variant="outline" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary">Basic Details</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Unit Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Legal Agreements (STPI only) */}
            {isStpi && formData.legalAgreements && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-primary">Legal Agreements</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayItem("legalAgreements")}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Agreement
                  </Button>
                </div>
                <div className="space-y-3">
                  {formData.legalAgreements.map((agreement, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={agreement}
                        onChange={(e) => updateArrayItem("legalAgreements", index, e.target.value)}
                        placeholder="Legal agreement document/reference"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayItem("legalAgreements", index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* APR Reports */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-primary">APR Reports</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayItem("aprReports")}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Report
                </Button>
              </div>
              <div className="space-y-3">
                {formData.aprReports.map((report, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={report}
                      onChange={(e) => updateArrayItem("aprReports", index, e.target.value)}
                      placeholder="APR report document/reference"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem("aprReports", index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Softex Details */}
          {/* Softex Details */}
<div className="space-y-4">
  <div className="flex justify-between items-center">
    <h3 className="text-lg font-semibold text-primary">Softex Details</h3>
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() => addArrayItem("softexDetails")}
    >
      <Plus className="h-4 w-4 mr-2" />
      Add Detail
    </Button>
  </div>

  <div className="space-y-3">
    {formData.softexDetails.map((detail, index) => (
      <div key={index} className="flex flex-col md:flex-row gap-2 w-full items-center">

        {/* Year */}
        <Input
          placeholder="Year"
          value={detail.year}
          onChange={(e) => {
            const updated = [...formData.softexDetails];
            updated[index].year = e.target.value;
            setFormData({ ...formData, softexDetails: updated });
          }}
        />

        {/* Month */}
        <Input
          placeholder="Month"
          value={detail.month}
          onChange={(e) => {
            const updated = [...formData.softexDetails];
            updated[index].month = e.target.value;
            setFormData({ ...formData, softexDetails: updated });
          }}
        />

        {/* Amount */}
        <Input
          type="number"
          placeholder="Amount"
          value={detail.amount}
          onChange={(e) => {
            const updated = [...formData.softexDetails];
            updated[index].amount = e.target.value;
            setFormData({ ...formData, softexDetails: updated });
          }}
        />

        {/* MPR */}
        <Input
          placeholder="MPR"
          value={detail.mpr}
          onChange={(e) => {
            const updated = [...formData.softexDetails];
            updated[index].mpr = e.target.value;
            setFormData({ ...formData, softexDetails: updated });
          }}
        />

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => removeArrayItem("softexDetails", index)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ))}
  </div>
</div>


            {/* Financial Expenses */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-primary">Financial Revenue</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayItem("financialExpenses")}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
              <div className="space-y-3">
     {formData.financialExpenses.map((item, index) => (
  <div
    key={index}
    className="flex flex-col md:flex-row gap-2 mb-3 w-full"
  >
    {/* Year */}
    <Input
      type="text"
      value={item.year}
      placeholder="Year"
      className="input w-full "
      onChange={(e) => {
        const updated = [...formData.financialExpenses];
        updated[index].year = e.target.value;
        setFormData({ ...formData, financialExpenses: updated });
      }}
    />

    {/* Range Dropdown */}
    <select
      className="input w-full bg-gray-600 text-white"
      value={
        tariffTable.find((t) => t.label === item.amount)?.amount || ""
      }
      onChange={(e) => {
        const selected = tariffTable.find(
          (t) => t.amount === e.target.value
        );

        const updated = [...formData.financialExpenses];

        updated[index].amount = selected?.label || ""; // store label
        updated[index].description = selected?.description || ""; // charge

        setFormData({ ...formData, financialExpenses: updated });
      }}
    >
      <option value="">Select Range</option>
      {tariffTable.map((t, i) => (
        <option key={i} value={t.amount}>
          {t.label}
        </option>
      ))}
    </select>

    {/* Service Charge auto */}
    <Input
      type="text"
      value={item.description}
      placeholder="Service Charge"
      className="input w-full"
     
    />
  </div>
))}



              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-6">
              <Button type="submit" className="bg-gradient-primary hover:opacity-90 transition-opacity">
                {unit ? "Update Unit" : "Add Unit"}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};