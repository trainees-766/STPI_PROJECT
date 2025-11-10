import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Wifi,
  Network,
  Plus,
  Trash2,
  Edit2,
  ArrowRight,
  Eye,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CustomerForm } from "@/components/CustomerForm";
import { useToast } from "@/hooks/use-toast";
import { log } from "console";

const API_BASE_URL = "http://localhost:5000/api"; 

interface Customer {
  _id: string;
  id?: string;
  companyName: string;
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

const DatacomPage = () => {
  const [rfCustomers, setRfCustomers] = useState<Customer[]>([]);
  const [lanCustomers, setLanCustomers] = useState<Customer[]>([]);
  const [activeTab, setActiveTab] = useState("rf");
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null);
  const [showBridgeDialog, setShowBridgeDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const rfResponse = await fetch(`${API_BASE_URL}/datacom/rf`);
      const lanResponse = await fetch(`${API_BASE_URL}/datacom/lan`);
      const rfData = await rfResponse.json();
      const lanData = await lanResponse.json();
      setRfCustomers(rfData);
      setLanCustomers(lanData);
    } catch (error) {
      console.error("Error fetching customers:", error);
      toast({
        title: "Error",
        description: "Failed to fetch customers",
        variant: "destructive",
      });
    }
  };
  const handleAddCustomer = async (customerData: Omit<Customer, "id">) => {
    try {
      const response = await fetch(`${API_BASE_URL}/datacom/${activeTab}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customerData),
      });
      const newCustomer = await response.json();

      if (activeTab === "rf") {
        setRfCustomers([...rfCustomers, newCustomer]);
      } else {
        setLanCustomers([...lanCustomers, newCustomer]);
      }

      setShowForm(false);
      toast({
        title: "Success",
        description: "Customer added successfully",
      });
    } catch (error) {
      console.error("Error adding customer:", error);
      toast({
        title: "Error",
        description: "Failed to add customer",
        variant: "destructive",
      });
    }
  };

  const handleEditCustomer = async (customerData: Omit<Customer, "id">) => {
    if (editingCustomer) {
      try {
        console.log(editingCustomer);

        console.log(
          `${API_BASE_URL}/datacom/${activeTab}/${editingCustomer._id}`
        );

        const response = await fetch(
          `${API_BASE_URL}/datacom/${activeTab}/${editingCustomer._id}`,
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
          throw new Error(err.error || "Update failed");
        }
        const updatedCustomer = await response.json();

        if (activeTab === "rf") {
          setRfCustomers(
            rfCustomers.map((c) =>
              c._id === editingCustomer._id ? updatedCustomer : c
            )
          );
        } else {
          setLanCustomers(
            lanCustomers.map((c) =>
              c._id === editingCustomer._id ? updatedCustomer : c
            )
          );
        }

        setEditingCustomer(null);
        setShowForm(false);
        toast({
          title: "Success",
          description: "Customer updated successfully",
        });
      } catch (error) {
        console.error("Error updating customer:", error);
        toast({
          title: "Error",
          description: "Failed to update customer",
          variant: "destructive",
        });
      }
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    let ok = confirm("ARE YOU SURE ?");
    if (!ok) {
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/datacom/${activeTab}/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(err.error || "Delete failed");
      }

      if (activeTab === "rf") {
        setRfCustomers(rfCustomers.filter((c) => c._id !== id));
      } else {
        setLanCustomers(lanCustomers.filter((c) => c._id !== id));
      }

      toast({
        title: "Success",
        description: "Customer deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting customer:", error);
      toast({
        title: "Error",
        description: "Failed to delete customer",
        variant: "destructive",
      });
    }
  };

  const currentCustomers = activeTab === "rf" ? rfCustomers : lanCustomers;

  // Parse possible key/value pairs from ipDetails into structured fields
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20 p-6">
      <div className="max-w-8xl mx-auto space-y-8 lg:space-y-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 w-full">
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
                Datacom Management
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-sky-700/80">
                Manage RF and LAN customers
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="rf" className="flex items-center gap-2">
              <Wifi className="h-4 w-4" />
              RF Customers
            </TabsTrigger>
            <TabsTrigger value="lan" className="flex items-center gap-2">
              <Network className="h-4 w-4" />
              LAN Customers
            </TabsTrigger>
            <div className="ml-2">
              <a
                target="_blank"
                href="https://onedrive.live.com/:x:/g/personal/48290514C262A261/EUwO93NDugFEp3Bo5z2LSXIBNlWvypY45KHPGmWtxI2TMA?resid=48290514C262A261!s73f70e4cba434401a77068e73d8b4972&ithint=file%2Cxlsx&e=8CkHLh&migratedtospo=true&redeem=aHR0cHM6Ly8xZHJ2Lm1zL3gvYy80ODI5MDUxNGMyNjJhMjYxL0VVd085M05EdWdGRXAzQm81ejJMU1hJQk5sV3Z5cFk0NUtIUEdtV3R4STJUTUE_ZT04Q2tITGg"
              >
                <p className="bg-transparent flex gap-2 text-black justify-center hover:underline group cursor-pointer">
                  SEE AMC LIST{" "}
                  <ArrowRight className="group-hover:translate-x-2 transition-all ease" />
                </p>
              </a>
            </div>
          </TabsList>

          <TabsContent value="rf" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">RF Customers</h2>
              <Button
                onClick={() => setShowForm(true)}
                className="bg-gradient-primary hover:opacity-90 transition-opacity"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add RF Customer
              </Button>
            </div>

            <div className="overflow-y-auto pr-2" style={{ maxHeight: 'calc(100vh - 350px)' }}>
              <div className="grid grid-cols-3 gap-4">
                {rfCustomers.map((customer) => (
                  <Card
                    key={customer._id}
                    className="shadow-card hover:shadow-card-hover transition-shadow"
                  >
                    <CardHeader className="pb-2">
                      <div className="grid grid-cols-2 md:grid-cols-2 items-center">
                        <div className="flex justify-center md:justify-start">
                          <div className="w-11/12 md:w-full text-center md:text-left">
                            <CardTitle className="text-lg font-semibold">
                              {customer.companyName}
                            </CardTitle>
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
                            onClick={() => handleDeleteCustomer(customer._id)}
                            className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p>
                            <span className="font-medium">Customer Name:</span>{" "}
                            {customer.companyName}
                          </p>
                          <p>
                            <span className="font-medium">Manager:</span>{" "}
                            {customer.managerName}
                          </p>
                          <p>
                            <span className="font-medium">Email:</span>{" "}
                            {customer.managerEmail}
                          </p>
                          <p>
                            <span className="font-medium">Phone:</span>{" "}
                            {customer.managerPhone}
                          </p>
                        </div>
                        <div>
                          <p>
                            <span className="font-medium">Leader:</span>{" "}
                            {customer.leaderName} ({customer.leaderDesignation})
                          </p>
                          <p>
                            <span className="font-medium">Period:</span>{" "}
                            {customer.startDate} to {customer.endDate}
                          </p>
                          <p>
                            <span className="font-medium">Bandwidth:</span>{" "}
                            {customer.bandwidth}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="lan" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">LAN Customers</h2>
              <Button
                onClick={() => setShowForm(true)}
                className="bg-gradient-primary hover:opacity-90 transition-opacity"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add LAN Customer
              </Button>
            </div>
            <div className="overflow-y-auto pr-2" style={{ maxHeight: 'calc(100vh - 350px)' }}>
              <div className="grid gap-4 grid-cols-3">
                {currentCustomers.map((customer) => (
                  <Card
                    key={customer._id}
                    className="shadow-card hover:shadow-card-hover transition-shadow"
                  >
                    <CardHeader className="pb-0">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">
                          {customer.companyName}
                        </CardTitle>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setViewingCustomer(customer)}
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
                            onClick={() => handleDeleteCustomer(customer._id)}
                            className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p>
                            <span className="font-medium">Customer Name:</span>{" "}
                            {customer.companyName}
                          </p>
                          <p>
                            <span className="font-medium">Manager:</span>{" "}
                            {customer.managerName} (
                            {customer.managerDesignation})
                          </p>
                          <p>
                            <span className="font-medium">Email:</span>{" "}
                            {customer.managerEmail}
                          </p>
                          <p>
                            <span className="font-medium">Phone:</span>{" "}
                            {customer.managerPhone}
                          </p>
                        </div>
                        <div>
                          <p>
                            <span className="font-medium">Leader:</span>{" "}
                            {customer.leaderName} ({customer.leaderDesignation})
                          </p>
                          <p>
                            <span className="font-medium">Period:</span>{" "}
                            {customer.startDate} to {customer.endDate}
                          </p>
                          <p>
                            <span className="font-medium">Bandwidth:</span>{" "}
                            {customer.bandwidth}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Customer Form */}
        {showForm && (
          <CustomerForm
            customer={
              editingCustomer
                ? { ...editingCustomer, id: editingCustomer._id }
                : null
            }
            onSubmit={editingCustomer ? handleEditCustomer : handleAddCustomer}
            onCancel={() => {
              setShowForm(false);
              setEditingCustomer(null);
            }}
          />
        )}

        {/* View Details Dialog */}
        <Dialog
          open={!!viewingCustomer}
          onOpenChange={() => setViewingCustomer(null)}
        >
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-sky-600">
                Customer Details
              </DialogTitle>
            </DialogHeader>
            {viewingCustomer && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
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

                    {/* Bandwidth Details - separate section */}
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
                    {viewingCustomer.prtgGraphLink && (
                      <div>
                        <h3 className="font-semibold text-sky-600 mb-2">
                          Monitoring
                        </h3>
                        <a
                          href={viewingCustomer.prtgGraphLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-base text-sky-600 hover:underline"
                        >
                          View PRTG Graph →
                        </a>
                      </div>
                    )}
                    {/* Bridge Details Dialog */}
                    <Dialog open={showBridgeDialog} onOpenChange={setShowBridgeDialog}>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>Bridge Details — {viewingCustomer.companyName}</DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold mb-2">STPI Side</h4>
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
                            <h4 className="font-semibold mb-2">{viewingCustomer.companyName} Side</h4>
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
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default DatacomPage;
