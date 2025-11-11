import { useState, useEffect, ReactNode } from "react";
import { ArrowLeft, Lightbulb, Plus, Trash2, Edit2, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomerForm } from "@/components/CustomerForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface IncubationCustomer {
  companyName: string;
  id: string;
  managerName: string;
  managerPhone: string;
  managerEmail: string;
  managerDesignation: string;
  leaderName: string;
  leaderPhone: string;
  leaderEmail: string;
  leaderDesignation: string;
  startDate: string;
  endDate: string;
  ipDetails: string | {
    gateway?: string;
    networkIp?: string;
    startIp?: string;
    lastIp?: string;
    subnetMask?: string;
  };
  bandwidth: string;
  bridgeDetails: string | {
    stpi?: {
      bridgeIp?: string;
      frequency?: string;
      ssid?: string;
      wpa2PreSharedKey?: string;
      peakRssi?: string;
      channelBandwidth?: string;
    };
    customer?: {
      bridgeIp?: string;
      frequency?: string;
      ssid?: string;
      wpa2PreSharedKey?: string;
      peakRssi?: string;
      channelBandwidth?: string;
    };
  };
  prtgGraphLink: string;
  servicePeriods?: { date: string; bandwidth: string }[];
  bandwidthDetails?: { free: number; purchased: number; total: number };
}

const API_BASE_URL = "http://localhost:5000/api"; 

const IncubationPage = () => {
  const [customers, setCustomers] = useState<IncubationCustomer[]>([]);
  const [editingCustomer, setEditingCustomer] =
    useState<IncubationCustomer | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [viewingCustomer, setViewingCustomer] =
    useState<IncubationCustomer | null>(null);
  const [showBridgeDialog, setShowBridgeDialog] = useState(false);

  // Fetch customers on mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/incubation`);
      const data = await res.json();
      setCustomers(
        (Array.isArray(data) ? data : []).map((customer) => ({
          ...customer,
          id: customer._id,
        }))
      );
    } catch (error) {
      console.error("Error fetching incubation customers:", error);
    }
  };

  // Parse possible key/value pairs from ipDetails into structured fields (same logic as DatacomPage)
  const parseIpDetails = (ipDetails: any) => {
    const result: {
      gateway?: string;
      networkIp?: string;
      startIp?: string;
      lastIp?: string;
      subnetMask?: string;
    } = {};
    if (!ipDetails) return result;
    if (typeof ipDetails === "object") {
      return {
        gateway: ipDetails.gateway || "",
        networkIp: ipDetails.networkIp || "",
        startIp: ipDetails.startIp || "",
        lastIp: ipDetails.lastIp || "",
        subnetMask: ipDetails.subnetMask || "",
      };
    }
    const normalized = ipDetails.replace(/\n|;|\|/g, ",").toLowerCase();
    const parts = normalized.split(",").map((p) => p.trim()).filter(Boolean);
    for (const part of parts) {
      const [k, v] = part.split(/[:=]/).map((s) => s?.trim());
      if (!k || !v) continue;
      if (k.includes("gate")) result.gateway = v;
      else if (k.includes("network")) result.networkIp = v;
      else if (k.includes("start")) result.startIp = v;
      else if (k.includes("last") || k.includes("end")) result.lastIp = v;
      else if (k.includes("mask") || k.includes("subnet")) result.subnetMask = v;
    }
    return result;
  };

  // Prepare editing customer object for CustomerForm (convert legacy strings to expected objects)
  const editingCustomerForForm = editingCustomer
    ? {
        ...editingCustomer,
        ipDetails:
          typeof editingCustomer.ipDetails === "string"
            ? parseIpDetails(editingCustomer.ipDetails)
            : editingCustomer.ipDetails,
        bridgeDetails:
          typeof editingCustomer.bridgeDetails === "string"
            ? {
                stpi: { bridgeIp: editingCustomer.bridgeDetails || "", frequency: "", ssid: "", wpa2PreSharedKey: "", peakRssi: "", channelBandwidth: "" },
                customer: { bridgeIp: "", frequency: "", ssid: "", wpa2PreSharedKey: "", peakRssi: "", channelBandwidth: "" },
              }
            : editingCustomer.bridgeDetails,
        routerDetails: editingCustomer.routerDetails && Array.isArray(editingCustomer.routerDetails)
          ? editingCustomer.routerDetails
          : [{ name: "", port: "" }],
        pathDiagram: editingCustomer.pathDiagram || "",
      }
    : null;

  const handleAddCustomer = async (
    customerData: Omit<IncubationCustomer, "id">
  ) => {
    try {
      const response = await fetch(`${API_BASE_URL}/incubation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customerData),
      });
      if (!response.ok) {
        const err = await response
          .json()
          .catch(() => ({ error: "Unknown error" }));
        console.error("Create failed:", err);
        return;
      }
      const newCustomer = await response.json();
      setCustomers([...customers, { ...newCustomer, id: newCustomer._id }]);
      setShowForm(false);
    } catch (error) {
      console.error("Error adding incubation customer:", error);
    }
  };

  const handleEditCustomer = async (
    customerData: Omit<IncubationCustomer, "id">
  ) => {
    if (editingCustomer) {
      try {
        const response = await fetch(
          `${API_BASE_URL}/incubation/${editingCustomer.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(customerData),
          }
        );
        if (!response.ok) {
          const err = await response
            .json()
            .catch(() => ({ error: "Unknown error" }));
          console.error("Update failed:", err);
          return;
        }
        const updatedCustomer = await response.json();
        setCustomers(
          customers.map((c) =>
            c.id === editingCustomer.id
              ? { ...updatedCustomer, id: updatedCustomer._id }
              : c
          )
        );
        setEditingCustomer(null);
        setShowForm(false);
      } catch (error) {
        console.error("Error updating incubation customer:", error);
      }
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    const ok = confirm("ARE YOU SURE ?");
    if (!ok) {
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/incubation/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Unknown error" }));
        console.error("Delete failed:", err);
        return;
      }
      setCustomers(customers.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Error deleting incubation customer:", error);
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
                Incubation Management
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-sky-700/80">
                Manage incubation customers
              </p>
            </div>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-sky-600 text-white hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </div>

        {/* Customers Grid */}
        <div className="overflow-y-auto pr-2" style={{ maxHeight: 'calc(100vh - 250px)' }}>
          <div className="grid gap-4 md:grid-cols-3">
            {customers.length === 0 ? (
              <Card className="shadow-card text-center py-12">
                <CardContent>
                  <Lightbulb className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">
                    No incubation customers yet
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Add your first incubation customer to get started.
                  </p>
                  <Button
                    onClick={() => setShowForm(true)}
                    className="bg-sky-600 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Customer
                  </Button>
                </CardContent>
              </Card>
            ) : (
              customers.map((customer) => (
                <Card
                  key={customer.id}
                  className="shadow-card hover:shadow-card-hover transition-shadow"
                >
                  <CardHeader className="pb-2">
                    <div className="grid grid-cols-1 md:grid-cols-1 items-center">
                      <div className="flex">
                        <div className="w-11/12 md:w-full text-center md:text-left">
                          <CardTitle className="text-lg flex items-center gap-2 font-semibold">
                            <Lightbulb className="h-5 w-5 text-sky-600" />
                            {customer.companyName}
                          </CardTitle>
                          <div className="mt-2 text-sm text-slate-700 space-y-1">
                            <p>
                              <span className="font-semibold">
                                Designation:
                              </span>{" "}
                              {customer.managerDesignation}
                            </p>
                            <p>
                              <span className="font-semibold">Email:</span>{" "}
                              {customer.managerEmail}
                            </p>
                            <p>
                              <span className="font-semibold">Phone:</span>{" "}
                              {customer.managerPhone}
                            </p>
                            <p>
                              <span className="font-semibold">Leader:</span>{" "}
                              {customer.leaderName}
                            </p>
                            <p>
                              <span className="font-semibold">Period:</span>{" "}
                              {customer.startDate} - {customer.endDate}
                            </p>
                            <p>
                              <span className="font-semibold">Bandwidth:</span>{" "}
                              {customer.bandwidth}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-center md:justify-end gap-2 mt-3 md:mt-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setViewingCustomer(customer)}
                          className="text-sky-600 hover:bg-sky-50"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingCustomer(customer);
                            setShowForm(true);
                          }}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteCustomer(customer.id)}
                          className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* View Details Dialog */}
        <Dialog
          open={!!viewingCustomer}
          onOpenChange={() => setViewingCustomer(null)}
        >
          <DialogContent className="max-w-7xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-sky-600">
                Customer Details
              </DialogTitle>
            </DialogHeader>
            {viewingCustomer && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-sky-600">
                        Customer Name
                      </h3>
                      <p>
                        <span className="font-semibold">Name:</span>{" "}
                        {viewingCustomer.companyName}
                      </p>
                      <h3 className="font-semibold text-sky-600 mb-2">
                        Director/Management Information
                      </h3>
                      <div className="space-y-1 text-base">
                        <p>
                          <span className="font-semibold">Name:</span>{" "}
                          {viewingCustomer.managerName}
                        </p>
                        <p>
                          <span className="font-semibold">Designation:</span>{" "}
                          {viewingCustomer.managerDesignation}
                        </p>
                        <p>
                          <span className="font-semibold">Email:</span>{" "}
                          {viewingCustomer.managerEmail}
                        </p>
                        <p>
                          <span className="font-semibold">Phone:</span>{" "}
                          {viewingCustomer.managerPhone}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-sky-600 mb-2">
                        System Admin Information
                      </h3>
                      <div className="space-y-1 text-base">
                        <p>
                          <span className="font-semibold">Name:</span>{" "}
                          {viewingCustomer.leaderName}
                        </p>
                        <p>
                          <span className="font-semibold">Designation:</span>{" "}
                          {viewingCustomer.leaderDesignation}
                        </p>
                        <p>
                          <span className="font-semibold">Email:</span>{" "}
                          {viewingCustomer.leaderEmail}
                        </p>
                        <p>
                          <span className="font-semibold">Phone:</span>{" "}
                          {viewingCustomer.leaderPhone}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-sky-600 mb-2">
                        Service Period
                      </h3>
                      <div className="space-y-1 text-base">
                        <p>
                          <span className="font-semibold">Start Date:</span>{" "}
                          {viewingCustomer.startDate}
                        </p>
                        <p>
                          <span className="font-semibold">End Date:</span>{" "}
                          {viewingCustomer.endDate}
                        </p>
                        {Array.isArray(viewingCustomer.servicePeriods) && viewingCustomer.servicePeriods.length > 0 && (
                          <div className="mt-2">
                            <p className="font-semibold">Date → Bandwidth</p>
                            <ul className="list-disc ml-5 mt-1 space-y-1">
                              {viewingCustomer.servicePeriods.map((sp, idx) => (
                                <li key={idx}>
                                  {sp.date || "—"} → {sp.bandwidth || "—"}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-sky-600 mb-2">
                        Technical Details
                      </h3>
                      <div className="space-y-1 text-base">
                        <p>
                          <span className="font-semibold">Bandwidth:</span>{" "}
                          {viewingCustomer.bandwidth}
                        </p>
                        <p>
                          <span className="font-bold text-blue-600">IP Details:</span>{" "}
                          
                        </p>
                        {/* IP Details subsection */}
                        {(() => {
                          const parsed = parseIpDetails(viewingCustomer.ipDetails);
                          const hasAny =
                            parsed.gateway ||
                            parsed.networkIp ||
                            parsed.startIp ||
                            parsed.lastIp ||
                            parsed.subnetMask;
                          return hasAny ? (
                            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                              {parsed.gateway && (
                                <p>
                                  <span className="font-semibold">Gateway:</span>{" "}
                                  {parsed.gateway}
                                </p>
                              )}
                              {parsed.networkIp && (
                                <p>
                                  <span className="font-semibold">Network IP:</span>{" "}
                                  {parsed.networkIp}
                                </p>
                              )}
                              {parsed.startIp && (
                                <p>
                                  <span className="font-semibold">Start IP:</span>{" "}
                                  {parsed.startIp}
                                </p>
                              )}
                              {parsed.lastIp && (
                                <p>
                                  <span className="font-semibold">Last IP:</span>{" "}
                                  {parsed.lastIp}
                                </p>
                              )}
                              {parsed.subnetMask && (
                                <p>
                                  <span className="font-semibold">Subnet Mask:</span>{" "}
                                  {parsed.subnetMask}
                                </p>
                              )}
                            </div>
                          ) : null;
                        })()}
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">Bridge Details:</span>
                          <Button size="sm" variant="outline" onClick={() => setShowBridgeDialog(true)}>
                            View Bridge Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                        <div>
                        {viewingCustomer.bandwidthDetails && (
                          <div>
                            <h3 className="font-semibold text-sky-600 mb-2">
                              Bandwidth Details
                            </h3>
                            <div className="space-y-1 text-base">
                              <p>
                                <span className="font-semibold">Total:</span>{" "}
                                {viewingCustomer.bandwidthDetails.total}
                              </p>
                              <p>
                                <span className="font-semibold">Free:</span>{" "}
                                {viewingCustomer.bandwidthDetails.free}
                              </p>
                              <p>
                                <span className="font-semibold">Purchased:</span>{" "}
                                {viewingCustomer.bandwidthDetails.purchased}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Router Details */}
                        {viewingCustomer.routerDetails && Array.isArray(viewingCustomer.routerDetails) && viewingCustomer.routerDetails.length > 0 && (
                          <div>
                            <h3 className="font-semibold text-sky-600 mb-2">Router Details</h3>
                            <div className="space-y-1 text-base">
                              <ul className="list-disc ml-5">
                                {viewingCustomer.routerDetails.map((r: any, i: number) => (
                                  <li key={i}>
                                    <span className="font-semibold">{r.name || '—'}</span>
                                    {r.port ? ` · ${r.port}` : ''}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}

                        {viewingCustomer.pathDiagram && (
                          <div className="mt-2">
                            <h3 className="font-semibold text-sky-600 mb-2">Path Diagram</h3>
                            <p className="text-base">{viewingCustomer.pathDiagram}</p>
                          </div>
                        )}

                        {viewingCustomer.prtgGraphLink && (
                          <div>
                            <h3 className="font-semibold text-sky-600 mb-2">
                              Monitoring
                            </h3>
                            <a
                              href={viewingCustomer.prtgGraphLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-base text-sky-600 hover:underline ml-1"
                            >
                              View Graph -
                            </a>
                          </div>
                        )}
                        </div>
                </div>
                {/* Bridge Details Dialog */}
                <Dialog open={showBridgeDialog} onOpenChange={setShowBridgeDialog}>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle className="text-blue-600 text-2xl font-bold">Bridge Details — {viewingCustomer.companyName}</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-2 text-primary">STPI Side</h4>
                        <div className="space-y-2">
                          <p><span className="font-semibold">Bridge IP:</span> {typeof viewingCustomer.bridgeDetails === 'string' ? viewingCustomer.bridgeDetails : viewingCustomer.bridgeDetails?.stpi?.bridgeIp || '—'}</p>
                          <p><span className="font-semibold">Frequency:</span> {typeof viewingCustomer.bridgeDetails === 'string' ? '—' : viewingCustomer.bridgeDetails?.stpi?.frequency || '—'}</p>
                          <p><span className="font-semibold">SSID:</span> {typeof viewingCustomer.bridgeDetails === 'string' ? '—' : viewingCustomer.bridgeDetails?.stpi?.ssid || '—'}</p>
                          <p><span className="font-semibold">WPA2 Pre-Shared Key:</span> {typeof viewingCustomer.bridgeDetails === 'string' ? '—' : viewingCustomer.bridgeDetails?.stpi?.wpa2PreSharedKey || '—'}</p>
                          <p><span className="font-semibold">Peak RSSI:</span> {typeof viewingCustomer.bridgeDetails === 'string' ? '—' : viewingCustomer.bridgeDetails?.stpi?.peakRssi || '—'}</p>
                          <p><span className="font-semibold">Channel Bandwidth:</span> {typeof viewingCustomer.bridgeDetails === 'string' ? '—' : viewingCustomer.bridgeDetails?.stpi?.channelBandwidth || '—'}</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2 text-primary">{viewingCustomer.companyName} Side</h4>
                        <div className="space-y-2">
                          <p><span className="font-semibold">Bridge IP:</span> {typeof viewingCustomer.bridgeDetails === 'string' ? viewingCustomer.bridgeDetails : viewingCustomer.bridgeDetails?.customer?.bridgeIp || '—'}</p>
                          <p><span className="font-semibold">Frequency:</span> {typeof viewingCustomer.bridgeDetails === 'string' ? '—' : viewingCustomer.bridgeDetails?.customer?.frequency || '—'}</p>
                          <p><span className="font-semibold">SSID:</span> {typeof viewingCustomer.bridgeDetails === 'string' ? '—' : viewingCustomer.bridgeDetails?.customer?.ssid || '—'}</p>
                          <p><span className="font-semibold">WPA2 Pre-Shared Key:</span> {typeof viewingCustomer.bridgeDetails === 'string' ? '—' : viewingCustomer.bridgeDetails?.customer?.wpa2PreSharedKey || '—'}</p>
                          <p><span className="font-semibold">Peak RSSI:</span> {typeof viewingCustomer.bridgeDetails === 'string' ? '—' : viewingCustomer.bridgeDetails?.customer?.peakRssi || '—'}</p>
                          <p><span className="font-semibold">Channel Bandwidth:</span> {typeof viewingCustomer.bridgeDetails === 'string' ? '—' : viewingCustomer.bridgeDetails?.customer?.channelBandwidth || '—'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end mt-4">
                      <Button variant="outline" onClick={() => setShowBridgeDialog(false)}>Close</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Customer Form */}
        {showForm && (
          <CustomerForm
            customer={editingCustomer ? editingCustomerForForm : null}
            onSubmit={editingCustomer ? handleEditCustomer : handleAddCustomer}
            onCancel={() => {
              setShowForm(false);
              setEditingCustomer(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default IncubationPage;
