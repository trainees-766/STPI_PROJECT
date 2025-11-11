import { useState, useEffect } from "react";
import {
  ArrowLeft,
  FolderOpen,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  Eye,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CoLocationForm } from "@/components/ProjectForm";
import { useToast } from "@/hooks/use-toast";

interface CoLocation {
  id: string;
  customerName: string;
  managerName: string;
  managerEmail: string;
  managerPhone: string;
  managerDesignation: string;
  adminName: string;
  adminEmail: string;
  adminPhone: string;
  adminDesignation: string;
  rackSpaceUnits: number;
  dataTransferGB: number;
  activationDate: string;
  agreementEntered: boolean;
  totalAnnualCharges: number;
  quarterlyCharges: number;
  remarks: string;
  prtgGraphLink: string;
  ipDetails: {
    gateway?: string;
    networkIp?: string;
    startIp?: string;
    lastIp?: string;
    subnetMask?: string;
  };
  bandwidthDetails?: { free: number; purchased: number; total: number };
  servicePeriods?: { date: string; bandwidth: string }[];
}

const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api`;

const CoLocationPage = () => {
  const [coLocations, setCoLocations] = useState<CoLocation[]>([]);
  const [editingCoLocation, setEditingCoLocation] = useState<CoLocation | null>(null);
  const [viewingCoLocation, setViewingCoLocation] = useState<CoLocation | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  // Fetch projects on mount
  useEffect(() => {
    fetchCoLocations();
  }, []);

  const fetchCoLocations = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/projects`);
      const data = await res.json();
      setCoLocations(
        (Array.isArray(data) ? data : []).map((p: CoLocation) => ({
          ...p,
          id: (p as unknown as { _id?: string; id?: string })._id ?? p.id,
        }))
      );
    } catch (error) {
      console.error("Error fetching co-locations:", error);
    }
  };

  const handleAddCoLocation = async (coLocationData: Omit<CoLocation, "id">) => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(coLocationData),
      });
      const newCoLocation = await response.json();
      setCoLocations([
        ...coLocations,
        { ...newCoLocation, id: newCoLocation._id ?? newCoLocation.id },
      ]);
      setShowForm(false);
    } catch (error) {
      console.error("Error adding co-location:", error);
    }
  };

  const handleEditCoLocation = async (coLocationData: Omit<CoLocation, "id">) => {
    if (editingCoLocation) {
      try {
        const response = await fetch(
          `${API_BASE_URL}/projects/${editingCoLocation.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(coLocationData),
          }
        );
        if (!response.ok) {
          const err = await response
            .json()
            .catch(() => ({ error: "Unknown error" }));
          toast({
            title: "Update failed",
            description: err.error || "Failed to update co-location",
            variant: "destructive",
          });
          return;
        }
        const updatedCoLocation = await response.json();
        const normalized = {
          ...updatedCoLocation,
          id: updatedCoLocation._id ?? updatedCoLocation.id,
        };
        setCoLocations(
          coLocations.map((p) => (p.id === editingCoLocation.id ? normalized : p))
        );
        setEditingCoLocation(null);
        setShowForm(false);
        toast({
          title: "Success",
          description: "Co Location updated",
          variant: "success",
        });
      } catch (error) {
        console.error("Error updating co-location:", error);
        toast({
          title: "Error",
          description: "Failed to update co-location",
          variant: "destructive",
        });
      }
    }
  };

  const handleDeleteCoLocation = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/projects/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Unknown error" }));
        console.error("Delete failed:", err);
        toast({
          title: "Delete failed",
          description: err.error || "Failed to delete co-location",
          variant: "destructive",
        });
        return;
      }
      setCoLocations(coLocations.filter((p) => p.id !== id));
      toast({ title: "Deleted", description: "Co Location deleted successfully" });
    } catch (error) {
      console.error("Error deleting co-location:", error);
      toast({
        title: "Error",
        description: "Failed to delete co-location",
        variant: "destructive",
      });
    }
  };

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
                Co Location Management
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-sky-700/80">
                Manage your co location customers and racks
              </p>
            </div>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-sky-600 text-white hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Co Location
          </Button>
        </div>

        {/* Co Location Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {coLocations.length === 0 ? (
            <div className="col-span-full">
              <Card className="shadow-card text-center py-16">
                <CardContent>
                  <FolderOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">
                    No co location entries yet
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Create your first co location entry to get started.
                  </p>
                  <Button
                    onClick={() => setShowForm(true)}
                    className="bg-gradient-primary"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Co Location
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            coLocations.map((coLocation) => (
              <Card
                key={coLocation.id}
                className="shadow-card hover:shadow-card-hover transition-shadow group"
              >
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg flex items-center gap-2 group-hover:text-primary transition-colors">
                      <FolderOpen className="h-5 w-5" />
                      {coLocation.customerName}
                    </CardTitle>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewingCoLocation(coLocation)}
                        className="text-sky-600 hover:bg-sky-50"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingCoLocation(coLocation);
                          setShowForm(true);
                        }}
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteCoLocation(coLocation.id)}
                        className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    Manager: {coLocation.managerName} | System Admin: {coLocation.adminName}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {coLocation.activationDate}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-xs text-muted-foreground">
                      Rack Space: {coLocation.rackSpaceUnits} units
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Data Transfer: {coLocation.dataTransferGB} GB
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Co Location Form */}
        {showForm && (
          <CoLocationForm
            coLocation={editingCoLocation}
            onSubmit={editingCoLocation ? handleEditCoLocation : handleAddCoLocation}
            onCancel={() => {
              setShowForm(false);
              setEditingCoLocation(null);
            }}
          />
        )}

        {/* View Details Dialog */}
        <Dialog
          open={!!viewingCoLocation}
          onOpenChange={() => setViewingCoLocation(null)}
        >
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-slate-50 to-white">
            <DialogHeader className="bg-gradient-to-r from-sky-600 to-sky-700 px-6 py-4 rounded-lg -mx-6 -mt-6 mb-4">
              <DialogTitle className="text-3xl font-bold text-white">
                {viewingCoLocation?.customerName} - Co Location Details
              </DialogTitle>
            </DialogHeader>
            {viewingCoLocation && (
              <div className="space-y-6 px-2">
                {/* Customer Header Card */}
                <div className="bg-gradient-to-r from-blue-50 to-sky-50 border-2 border-sky-300 rounded-lg p-5">
                  <h2 className="text-xl font-bold text-sky-700 mb-3">Customer Information</h2>
                  <p className="text-lg"><span className="font-bold text-gray-700">Customer Name:</span> <span className="text-sky-700 font-semibold">{viewingCoLocation.customerName}</span></p>
                </div>

                {/* Main Grid - 2 Columns */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    {/* Manager Details Card */}
                    <div className="bg-white border-2 border-orange-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
                      <h3 className="text-lg font-bold text-orange-600 mb-4 flex items-center gap-2">
                        <span className="text-2xl">👤</span> Manager Details
                      </h3>
                      <div className="space-y-3 ml-2">
                        <p className="text-base"><span className="font-semibold text-gray-700">Name:</span> <span className="text-gray-900">{viewingCoLocation.managerName}</span></p>
                        <p className="text-base"><span className="font-semibold text-gray-700">Designation:</span> <span className="text-gray-900">{viewingCoLocation.managerDesignation}</span></p>
                        <p className="text-base"><span className="font-semibold text-gray-700">Email:</span> <span className="text-blue-600">{viewingCoLocation.managerEmail}</span></p>
                        <p className="text-base"><span className="font-semibold text-gray-700">Phone:</span> <span className="text-gray-900">{viewingCoLocation.managerPhone}</span></p>
                      </div>
                    </div>

                    {/* System Admin Card */}
                    <div className="bg-white border-2 border-purple-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
                      <h3 className="text-lg font-bold text-purple-600 mb-4 flex items-center gap-2">
                        <span className="text-2xl">⚙️</span> System Admin
                      </h3>
                      <div className="space-y-3 ml-2">
                        <p className="text-base"><span className="font-semibold text-gray-700">Name:</span> <span className="text-gray-900">{viewingCoLocation.adminName}</span></p>
                        <p className="text-base"><span className="font-semibold text-gray-700">Designation:</span> <span className="text-gray-900">{viewingCoLocation.adminDesignation}</span></p>
                        <p className="text-base"><span className="font-semibold text-gray-700">Email:</span> <span className="text-blue-600">{viewingCoLocation.adminEmail}</span></p>
                        <p className="text-base"><span className="font-semibold text-gray-700">Phone:</span> <span className="text-gray-900">{viewingCoLocation.adminPhone}</span></p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    {/* Activation & Agreement Card */}
                    <div className="bg-white border-2 border-green-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
                      <h3 className="text-lg font-bold text-green-600 mb-4 flex items-center gap-2">
                        <span className="text-2xl">📅</span> Activation & Agreement
                      </h3>
                      <div className="space-y-3 ml-2">
                        <p className="text-base"><span className="font-semibold text-gray-700">Activation Date:</span> <span className="text-gray-900">{viewingCoLocation.activationDate}</span></p>
                        <p className="text-base"><span className="font-semibold text-gray-700">Agreement Entered:</span> <span className={viewingCoLocation.agreementEntered ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>{viewingCoLocation.agreementEntered ? "Yes" : "No"}</span></p>
                      </div>
                    </div>

                    {/* Rack & Data Transfer Card */}
                    <div className="bg-white border-2 border-indigo-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
                      <h3 className="text-lg font-bold text-indigo-600 mb-4 flex items-center gap-2">
                        <span className="text-2xl">🖥️</span> Rack & Data
                      </h3>
                      <div className="space-y-3 ml-2">
                        <p className="text-base"><span className="font-semibold text-gray-700">Rack Space (Units):</span> <span className="text-gray-900">{viewingCoLocation.rackSpaceUnits}</span></p>
                        <p className="text-base"><span className="font-semibold text-gray-700">Data Transfer (GB):</span> <span className="text-gray-900">{viewingCoLocation.dataTransferGB}</span></p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Charges Section */}
                <div className="bg-white border-2 border-red-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-bold text-red-600 mb-4 flex items-center gap-2">
                    <span className="text-2xl">💰</span> Charges
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4 ml-2">
                    <p className="text-base"><span className="font-semibold text-gray-700">Total Annual Charges:</span> <span className="text-gray-900">₹{viewingCoLocation.totalAnnualCharges}</span></p>
                    <p className="text-base"><span className="font-semibold text-gray-700">Quarterly Charges:</span> <span className="text-gray-900">₹{viewingCoLocation.quarterlyCharges}</span></p>
                  </div>
                </div>

                {/* Additional Details Section */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* IP & Bandwidth Card */}
                  <div className="bg-white border-2 border-cyan-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-bold text-cyan-600 mb-4 flex items-center gap-2">
                      <span className="text-2xl">🌐</span> IP & Bandwidth Details
                    </h3>
                    <div className="space-y-3 ml-2">
                      {viewingCoLocation.ipDetails && (
                        <>
                          <p className="text-base"><span className="font-semibold text-gray-700">Gateway:</span> <span className="text-gray-900 font-mono">{viewingCoLocation.ipDetails.gateway || "N/A"}</span></p>
                          <p className="text-base"><span className="font-semibold text-gray-700">Network IP:</span> <span className="text-gray-900 font-mono">{viewingCoLocation.ipDetails.networkIp || "N/A"}</span></p>
                          <p className="text-base"><span className="font-semibold text-gray-700">Start IP:</span> <span className="text-gray-900 font-mono">{viewingCoLocation.ipDetails.startIp || "N/A"}</span></p>
                          <p className="text-base"><span className="font-semibold text-gray-700">Last IP:</span> <span className="text-gray-900 font-mono">{viewingCoLocation.ipDetails.lastIp || "N/A"}</span></p>
                          <p className="text-base"><span className="font-semibold text-gray-700">Subnet Mask:</span> <span className="text-gray-900 font-mono">{viewingCoLocation.ipDetails.subnetMask || "N/A"}</span></p>
                        </>
                      )}
                      {viewingCoLocation.bandwidthDetails && (
                        <>
                          <p className="text-base pt-2 border-t border-cyan-100"><span className="font-semibold text-gray-700">Free Bandwidth:</span> <span className="text-gray-900">{viewingCoLocation.bandwidthDetails.free} Mbps</span></p>
                          <p className="text-base"><span className="font-semibold text-gray-700">Purchased Bandwidth:</span> <span className="text-gray-900">{viewingCoLocation.bandwidthDetails.purchased} Mbps</span></p>
                          <p className="text-base"><span className="font-semibold text-gray-700">Total Bandwidth:</span> <span className="text-gray-900 font-bold">{viewingCoLocation.bandwidthDetails.total} Mbps</span></p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Remarks & Links Card */}
                  <div className="bg-white border-2 border-pink-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-bold text-pink-600 mb-4 flex items-center gap-2">
                      <span className="text-2xl">📝</span> Remarks & Links
                    </h3>
                    <div className="space-y-3 ml-2">
                      <p className="text-base"><span className="font-semibold text-gray-700">Remarks:</span> <span className="text-gray-900">{viewingCoLocation.remarks || "N/A"}</span></p>
                      {viewingCoLocation.prtgGraphLink && (
                        <p className="text-base"><span className="font-semibold text-gray-700">Monitoring Link:</span> <a href={viewingCoLocation.prtgGraphLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{viewingCoLocation.prtgGraphLink}</a></p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Service Periods */}
                {Array.isArray(viewingCoLocation.servicePeriods) && viewingCoLocation.servicePeriods.length > 0 && (
                  <div className="bg-white border-2 border-yellow-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-bold text-yellow-600 mb-4 flex items-center gap-2">
                      <span className="text-2xl">📊</span> Service Periods
                    </h3>
                    <ul className="space-y-2">
                      {viewingCoLocation.servicePeriods.map((sp, idx) => (
                        <li key={idx} className="text-base bg-yellow-50 px-3 py-2 rounded">
                          <span className="font-semibold">{sp.date}</span> → <span className="text-yellow-700 font-semibold">{sp.bandwidth}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CoLocationPage;
