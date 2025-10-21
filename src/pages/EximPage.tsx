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
  softexDetails: string[];
  financialExpenses: { year: string; amount: string; description: string }[];
}

const API_BASE_URL = "http://10.1.2.10:5000/api";

const EximPage = () => {
  const [stpiUnits, setStpiUnits] = useState<Unit[]>([]);
  const [nonStpiUnits, setNonStpiUnits] = useState<Unit[]>([]);
  const [activeTab, setActiveTab] = useState("stpi");
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [viewingUnit, setViewingUnit] = useState<Unit | null>(null);
  const stpiLink =
    "https://onedrive.live.com/:x:/g/personal/48290514C262A261/EQyJdK9JxfxGj4Rv-c0uOBsBNc9EDPZAIzY-ghRP15lP2Q?resid=48290514C262A261!saf74890cc54946fc8f846ff9cd2e381b&ithint=file%2Cxlsx&e=KFrTW6&migratedtospo=true&redeem=aHR0cHM6Ly8xZHJ2Lm1zL3gvYy80ODI5MDUxNGMyNjJhMjYxL0VReUpkSzlKeGZ4R2o0UnYtYzB1T0JzQk5jOUVEUFpBSXpZLWdoUlAxNWxQMlE_ZT1LRnJUVzY";
  const nonStpiLink =
    "https://onedrive.live.com/:x:/g/personal/48290514C262A261/EYlVHHos9nhOk2TP5y05NUUB5EeT71CgpPOOPuC1sQR8hA?resid=48290514C262A261!s7a1c5589f62c4e789364cfe72d393545&ithint=file%2Cxlsx&e=SO8ITk&migratedtospo=true&redeem=aHR0cHM6Ly8xZHJ2Lm1zL3gvYy80ODI5MDUxNGMyNjJhMjYxL0VZbFZISG9zOW5oT2syVFA1eTA1TlVVQjVFZVQ3MUNncFBPT1B1QzFzUVI4aEE_ZT1TTzhJVGs";

  // Fetch units on mount
  useEffect(() => {
    fetchUnits();
  }, []);

  const fetchUnits = async () => {
    try {
      const stpiRes = await fetch(`${API_BASE_URL}/exim/stpi`);
      const nonStpiRes = await fetch(`${API_BASE_URL}/exim/non-stpi`);
      const stpiData = await stpiRes.json();
      const nonStpiData = await nonStpiRes.json();
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
    if (editingUnit) {
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
          setStpiUnits(
            stpiUnits.map((u) =>
              u.id === editingUnit.id
                ? { ...updatedUnit, id: updatedUnit._id }
                : u
            )
          );
        } else {
          setNonStpiUnits(
            nonStpiUnits.map((u) =>
              u.id === editingUnit.id
                ? { ...updatedUnit, id: updatedUnit._id }
                : u
            )
          );
        }
        setEditingUnit(null);
        setShowForm(false);
      } catch (error) {
        console.error("Error updating unit:", error);
      }
    }
  };

  const handleDeleteUnit = async (id: string) => {
    let ok = confirm("ARE YOU SURE ?");
    if (!ok) {
      return;
    }
    try {
      await fetch(`${API_BASE_URL}/exim/${activeTab}/${id}`, {
        method: "DELETE",
      });
      if (activeTab === "stpi") {
        setStpiUnits(stpiUnits.filter((u) => u.id !== id));
      } else {
        setNonStpiUnits(nonStpiUnits.filter((u) => u.id !== id));
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
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-sky-600">
                Exim Management
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-sky-700/80">
                Manage STPI and Non-STPI units
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="stpi" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              STPI Units
            </TabsTrigger>
            <TabsTrigger value="non-stpi" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Non-STPI Units
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stpi" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">STPI Units</h2>
              <Button
                onClick={() => setShowForm(true)}
                className="bg-gradient-primary hover:opacity-90 transition-opacity"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add STPI Unit
              </Button>
            </div>

            <div className="grid gap-4 grid-cols-3">
              {currentUnits.map((unit) => (
                <Card
                  key={unit.id}
                  className="shadow-card hover:shadow-card-hover transition-shadow"
                >
                  <CardHeader className="pb-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 items-center">
                      <div className="flex justify-center md:justify-start">
                        <div className="w-11/12 md:w-full text-center md:text-left">
                          <CardTitle className="text-lg font-semibold">
                            {unit.name}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            {unit.startDate} → {unit.endDate}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-center md:justify-end gap-2 mt-3 md:mt-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setViewingUnit(unit)}
                          className="text-sky-600 hover:bg-sky-50"
                        >
                          <Eye className="h-4 w-4" />
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
                          className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="non-stpi" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Non-STPI Units</h2>
              <Button
                onClick={() => setShowForm(true)}
                className="bg-gradient-primary hover:opacity-90 transition-opacity"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Non-STPI Unit
              </Button>
            </div>

            <div className="grid gap-4 grid-cols-3">
              {currentUnits.map((unit) => (
                <Card
                  key={unit.id}
                  className="shadow-card hover:shadow-card-hover transition-shadow"
                >
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{unit.name}</CardTitle>
                      <div className="flex gap-2">
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
                          className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 text-sm">
                      <div>
                        <p>
                          <span className="font-medium">Period:</span>{" "}
                          {unit.startDate} to {unit.endDate}
                        </p>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="font-medium mb-2">APR Reports:</p>
                          <div className="space-y-1">
                            {unit.aprReports.map((report, idx) => (
                              <p
                                key={idx}
                                className="text-xs bg-muted px-2 py-1 rounded"
                              >
                                {report}
                              </p>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="font-medium mb-2">Softex Details:</p>
                          <div className="space-y-1">
                            {unit.softexDetails.map((detail, idx) => (
                              <p
                                key={idx}
                                className="text-xs bg-muted px-2 py-1 rounded"
                              >
                                {detail}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="font-medium mb-2">Financial Expenses:</p>
                        <div className="grid gap-2">
                          {unit.financialExpenses.map((expense, idx) => (
                            <div
                              key={idx}
                              className="flex justify-between items-center bg-muted px-3 py-2 rounded text-xs"
                            >
                              <span>{expense.year}</span>
                              <span className="font-medium">
                                {expense.amount}
                              </span>
                              <span className="text-muted-foreground">
                                {expense.description}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Unit Form */}
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

        {/* View Details Dialog */}
        <Dialog open={!!viewingUnit} onOpenChange={() => setViewingUnit(null)}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-sky-600">
                Unit Details
              </DialogTitle>
            </DialogHeader>
            {viewingUnit && (
              <div className="space-y-6">
                <div className="space-y-4 text-base">
                  <div>
                    <h4 className="font-semibold text-sky-600">General</h4>
                    <p>
                      <span className="font-semibold">Name:</span>{" "}
                      {viewingUnit.name}
                    </p>
                    <p>
                      <span className="font-semibold">Period:</span>{" "}
                      {viewingUnit.startDate} → {viewingUnit.endDate}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sky-600">
                      Legal Agreements
                    </h4>
                    <div className="space-y-1">
                      {viewingUnit.legalAgreements?.map((a, i) => (
                        <p
                          key={i}
                          className="text-sm bg-muted px-2 py-1 rounded"
                        >
                          {a}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sky-600">APR Reports</h4>
                    <div className="space-y-1">
                      {viewingUnit.aprReports.map((r, i) => (
                        <p
                          key={i}
                          className="text-sm bg-muted px-2 py-1 rounded"
                        >
                          {r}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sky-600">
                      Softex Details
                    </h4>
                    <div className="space-y-1">
                      {viewingUnit.softexDetails.map((s, i) => (
                        <p
                          key={i}
                          className="text-sm bg-muted px-2 py-1 rounded"
                        >
                          {s}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sky-600">
                      Financial Expenses
                    </h4>
                    <div className="space-y-2">
                      {viewingUnit.financialExpenses.map((e, i) => (
                        <div
                          key={i}
                          className="flex justify-between items-center bg-muted px-3 py-2 rounded text-sm"
                        >
                          <span>{e.year}</span>
                          <span className="font-medium">{e.amount}</span>
                          <span className="text-muted-foreground">
                            {e.description}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <a
        target="_blank"
        href={`${activeTab == "stpi" ? stpiLink : nonStpiLink}`}
      >
        <p className="flex gap-2 text-accent-foreground justify-center hover:underline group cursor-pointer">
          SEE ALL UNITS{" "}
          <ArrowRight className="group-hover:translate-x-2 transition-all ease" />
        </p>
      </a>
    </div>
  );
};

export default EximPage;
