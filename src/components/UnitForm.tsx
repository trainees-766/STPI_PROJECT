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
    softexDetails: unit?.softexDetails || [""],
    financialExpenses: unit?.financialExpenses || [{ year: "", amount: "", description: "" }],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const cleanedData = {
      ...formData,
      legalAgreements: isStpi ? formData.legalAgreements?.filter(Boolean) : undefined,
      aprReports: formData.aprReports.filter(Boolean),
      softexDetails: formData.softexDetails.filter(Boolean),
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
                  <div key={index} className="flex gap-2">
                    <Input
                      value={detail}
                      onChange={(e) => updateArrayItem("softexDetails", index, e.target.value)}
                      placeholder="Softex detail/reference"
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
                <h3 className="text-lg font-semibold text-primary">Financial Expenses</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayItem("financialExpenses")}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Expense
                </Button>
              </div>
              <div className="space-y-3">
                {formData.financialExpenses.map((expense, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={expense.year}
                      onChange={(e) => updateArrayItem("financialExpenses", index, { ...expense, year: e.target.value })}
                      placeholder="Year (e.g., 2024)"
                      className="w-32"
                    />
                    <Input
                      value={expense.amount}
                      onChange={(e) => updateArrayItem("financialExpenses", index, { ...expense, amount: e.target.value })}
                      placeholder="Amount (e.g., $10,000)"
                      className="w-40"
                    />
                    <Input
                      value={expense.description}
                      onChange={(e) => updateArrayItem("financialExpenses", index, { ...expense, description: e.target.value })}
                      placeholder="Month"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem("financialExpenses", index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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