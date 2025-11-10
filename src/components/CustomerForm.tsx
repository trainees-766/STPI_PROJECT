import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { log } from "console";

interface Customer {
  id: string;
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
  ipDetails: {
    gateway?: string;
    networkIp?: string;
    startIp?: string;
    lastIp?: string;
    subnetMask?: string;
  };
  bandwidth: string;
  bridgeDetails: {
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
  // New fields
  servicePeriods?: { date: string; bandwidth: string }[];
  bandwidthDetails?: { free: number; purchased: number; total: number };
}

interface CustomerFormProps {
  customer?: Customer | null;
  onSubmit: (customer: Omit<Customer, "id">) => void;
  onCancel: () => void;
}

export const CustomerForm = ({
  customer,
  onSubmit,
  onCancel,
}: CustomerFormProps) => {
  const [formData, setFormData] = useState({
    companyName: customer?.companyName || "",
    managerName: customer?.managerName || "",
    managerPhone: customer?.managerPhone || "",
    managerEmail: customer?.managerEmail || "",
    managerDesignation: customer?.managerDesignation || "",
    leaderName: customer?.leaderName || "",
    leaderPhone: customer?.leaderPhone || "",
    leaderEmail: customer?.leaderEmail || "",
    leaderDesignation: customer?.leaderDesignation || "",
    startDate: customer?.startDate || "",
    endDate: customer?.endDate || "XXXX",
  ipDetails: customer?.ipDetails || { gateway: "", networkIp: "", startIp: "", lastIp: "", subnetMask: "" },
    bandwidth: customer?.bandwidth || "",
  bridgeDetails: customer?.bridgeDetails || { stpi: { bridgeIp: "", frequency: "", ssid: "", wpa2PreSharedKey: "", peakRssi: "", channelBandwidth: "" }, customer: { bridgeIp: "", frequency: "", ssid: "", wpa2PreSharedKey: "", peakRssi: "", channelBandwidth: "" } },
    prtgGraphLink: customer?.prtgGraphLink || "",
    servicePeriods: customer?.servicePeriods && customer.servicePeriods.length > 0
      ? customer.servicePeriods
      : [{ date: "", bandwidth: "" }],
    bandwidthDetails: customer?.bandwidthDetails
      ? customer.bandwidthDetails
      : { free: 0, purchased: 0, total: 0 },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleIpChange = (
    field: "gateway" | "networkIp" | "startIp" | "lastIp" | "subnetMask",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      ipDetails: { ...(prev.ipDetails || {}), [field]: value },
    }));
  };

  const handleServicePeriodChange = (index: number, field: "date" | "bandwidth", value: string) => {
    setFormData((prev) => {
      const next = [...(prev.servicePeriods || [])];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, servicePeriods: next };
    });
  };

  const [bridgeDialogOpen, setBridgeDialogOpen] = useState(false);

  const handleBridgeChange = (
    side: "stpi" | "customer",
    field:
      | "bridgeIp"
      | "frequency"
      | "ssid"
      | "wpa2PreSharedKey"
      | "peakRssi"
      | "channelBandwidth",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      bridgeDetails: {
        ...(prev.bridgeDetails || {}),
        [side]: { ...(prev.bridgeDetails?.[side] || {}), [field]: value },
      },
    }));
  };

  const addServicePeriodRow = () => {
    setFormData((prev) => {
      const next = [...(prev.servicePeriods || [])];
      next.push({ date: "", bandwidth: "" });
      return { ...prev, servicePeriods: next };
    });
  };

  const removeServicePeriodRow = (index: number) => {
    setFormData((prev) => {
      const next = [...(prev.servicePeriods || [])];
      next.splice(index, 1);
      return { ...prev, servicePeriods: next.length ? next : [{ date: "", bandwidth: "" }] };
    });
  };

  const handleBandwidthDetailsChange = (field: "free" | "purchased", value: string) => {
    const numeric = Number(value);
    setFormData((prev) => {
      const current = prev.bandwidthDetails || { free: 0, purchased: 0, total: 0 };
      const updated = { ...current, [field]: isNaN(numeric) ? 0 : numeric };
      updated.total = (Number(updated.free) || 0) + (Number(updated.purchased) || 0);
      return { ...prev, bandwidthDetails: updated };
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    style={{
      margin : 0
    }}
    >
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-card-hover animate-scale-in">
        <CardHeader className="flex-row justify-between items-center pb-4">
          <CardTitle className="text-xl">
            {customer ? "Edit Customer" : "Add New Customer"}
          </CardTitle>
          <Button variant="outline" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Manager Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary">
                Comapany Name
              </h3>
              <div className="space-y-2">
                <Label htmlFor="comapnayName">Name *</Label>
                <Input
                  id="comapanyName"
                  value={formData.companyName}
                  onChange={(e) => handleChange("companyName", e.target.value)}
                  required
                />
              </div>
              <h3 className="text-lg font-semibold text-primary">
                Director/Manager details
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="managerName">Name *</Label>
                  <Input
                    id="managerName"
                    value={formData.managerName}
                    onChange={(e) =>
                      handleChange("managerName", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="managerDesignation">Designation *</Label>
                  <Input
                    id="managerDesignation"
                    value={formData.managerDesignation}
                    onChange={(e) =>
                      handleChange("managerDesignation", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="managerEmail">Email *</Label>
                  <Input
                    id="managerEmail"
                    type="text"
                    value={formData.managerEmail}
                    onChange={(e) =>
                      handleChange("managerEmail", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="managerPhone">Phone *</Label>
                  <Input
                    id="managerPhone"
                    value={formData.managerPhone}
                    onChange={(e) =>
                      handleChange("managerPhone", e.target.value)
                    }
                    required
                  />
                </div>
              </div>
            </div>

            {/* Leader Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary">
                System Administrator details
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="leaderName">Name *</Label>
                  <Input
                    id="leaderName"
                    value={formData.leaderName}
                    onChange={(e) => handleChange("leaderName", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="leaderDesignation">Designation *</Label>
                  <Input
                    id="leaderDesignation"
                    value={formData.leaderDesignation}
                    onChange={(e) =>
                      handleChange("leaderDesignation", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="leaderEmail">Email *</Label>
                  <Input
                    id="leaderEmail"
                    type="text"
                    value={formData.leaderEmail}
                    onChange={(e) =>
                      handleChange("leaderEmail", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="leaderPhone">Phone *</Label>
                  <Input
                    id="leaderPhone"
                    value={formData.leaderPhone}
                    onChange={(e) =>
                      handleChange("leaderPhone", e.target.value)
                    }
                    required
                  />
                </div>
              </div>
            </div>

            {/* Technical Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary">
                Technical Details
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleChange("startDate", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ipDetails">IP Details</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="gateway">Gateway</Label>
                      <Input
                        id="gateway"
                        value={formData.ipDetails.gateway}
                        onChange={(e) => handleIpChange("gateway", e.target.value)}
                        placeholder="e.g., 192.168.1.1"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="networkIp">Network IP</Label>
                      <Input
                        id="networkIp"
                        value={formData.ipDetails.networkIp}
                        onChange={(e) => handleIpChange("networkIp", e.target.value)}
                        placeholder="e.g., 192.168.1.0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="startIp">Start IP</Label>
                      <Input
                        id="startIp"
                        value={formData.ipDetails.startIp}
                        onChange={(e) => handleIpChange("startIp", e.target.value)}
                        placeholder="e.g., 192.168.1.100"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastIp">Last IP</Label>
                      <Input
                        id="lastIp"
                        value={formData.ipDetails.lastIp}
                        onChange={(e) => handleIpChange("lastIp", e.target.value)}
                        placeholder="e.g., 192.168.1.150"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subnetMask">Subnet Mask</Label>
                      <Input
                        id="subnetMask"
                        value={formData.ipDetails.subnetMask}
                        onChange={(e) => handleIpChange("subnetMask", e.target.value)}
                        placeholder="e.g., 255.255.255.0"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bandwidth">Bandwidth *</Label>
                  <Input
                    id="bandwidth"
                    value={formData.bandwidth}
                    onChange={(e) => handleChange("bandwidth", e.target.value)}
                    placeholder="e.g., 100 Mbps"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bridgeDetails">Bridge Details</Label>
                  <div className="flex items-center gap-2">
                    <Button type="button" onClick={() => setBridgeDialogOpen(true)}>
                      Edit Bridge Details
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      {formData.bridgeDetails?.stpi?.bridgeIp || "—"}
                      {formData.bridgeDetails?.customer?.bridgeIp ? ` · ${formData.bridgeDetails.customer.bridgeIp}` : ""}
                    </span>
                  </div>

                  <Dialog open={bridgeDialogOpen} onOpenChange={setBridgeDialogOpen}>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle className="text-blue-600 text-3xl ">Bridge Details</DialogTitle>
                      </DialogHeader>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-2 text-primary">STPI Side</h4>
                          <div className="space-y-2">
                            <Label>Bridge IP</Label>
                            <Input
                              value={formData.bridgeDetails?.stpi?.bridgeIp || ""}
                              onChange={(e) => handleBridgeChange("stpi", "bridgeIp", e.target.value)}
                            />
                            <Label>Frequency</Label>
                            <Input
                              value={formData.bridgeDetails?.stpi?.frequency || ""}
                              onChange={(e) => handleBridgeChange("stpi", "frequency", e.target.value)}
                            />
                            <Label>SSID</Label>
                            <Input
                              value={formData.bridgeDetails?.stpi?.ssid || ""}
                              onChange={(e) => handleBridgeChange("stpi", "ssid", e.target.value)}
                            />
                            <Label>WPA2 Pre-Shared Key</Label>
                            <Input
                              value={formData.bridgeDetails?.stpi?.wpa2PreSharedKey || ""}
                              onChange={(e) => handleBridgeChange("stpi", "wpa2PreSharedKey", e.target.value)}
                            />
                            <Label>Peak RSSI</Label>
                            <Input
                              value={formData.bridgeDetails?.stpi?.peakRssi || ""}
                              onChange={(e) => handleBridgeChange("stpi", "peakRssi", e.target.value)}
                            />
                            <Label>Channel Bandwidth</Label>
                            <Input
                              value={formData.bridgeDetails?.stpi?.channelBandwidth || ""}
                              onChange={(e) => handleBridgeChange("stpi", "channelBandwidth", e.target.value)}
                            />
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2 text-primary">Customer Side</h4>
                          <div className="space-y-2">
                            <Label>Bridge IP</Label>
                            <Input
                              value={formData.bridgeDetails?.customer?.bridgeIp || ""}
                              onChange={(e) => handleBridgeChange("customer", "bridgeIp", e.target.value)}
                            />
                            <Label>Frequency</Label>
                            <Input
                              value={formData.bridgeDetails?.customer?.frequency || ""}
                              onChange={(e) => handleBridgeChange("customer", "frequency", e.target.value)}
                            />
                            <Label>SSID</Label>
                            <Input
                              value={formData.bridgeDetails?.customer?.ssid || ""}
                              onChange={(e) => handleBridgeChange("customer", "ssid", e.target.value)}
                            />
                            <Label>WPA2 Pre-Shared Key</Label>
                            <Input
                              value={formData.bridgeDetails?.customer?.wpa2PreSharedKey || ""}
                              onChange={(e) => handleBridgeChange("customer", "wpa2PreSharedKey", e.target.value)}
                            />
                            <Label>Peak RSSI</Label>
                            <Input
                              value={formData.bridgeDetails?.customer?.peakRssi || ""}
                              onChange={(e) => handleBridgeChange("customer", "peakRssi", e.target.value)}
                            />
                            <Label>Channel Bandwidth</Label>
                            <Input
                              value={formData.bridgeDetails?.customer?.channelBandwidth || ""}
                              onChange={(e) => handleBridgeChange("customer", "channelBandwidth", e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" onClick={() => setBridgeDialogOpen(false)}>Close</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prtgGraphLink">PRTG Graph Link</Label>
                  <Input
                    id="prtgGraphLink"
                    type="url"
                    value={formData.prtgGraphLink}
                    onChange={(e) =>
                      handleChange("prtgGraphLink", e.target.value)
                    }
                    placeholder="https://..."
                  />
                </div>
              </div>

              {/* Service Period - Dynamic rows: date -> bandwidth */}
              <div className="mt-6 space-y-3">
                <h4 className="text-md font-semibold text-primary">Service Period</h4>
                <div className="space-y-3">
                  {(formData.servicePeriods || []).map((row, index) => (
                    <div key={index} className="grid md:grid-cols-3 gap-3 items-end">
                      <div className="space-y-2">
                        <Label htmlFor={`serviceDate-${index}`}>Date</Label>
                        <Input
                          id={`serviceDate-${index}`}
                          type="date"
                          value={row.date}
                          onChange={(e) => handleServicePeriodChange(index, "date", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`serviceBandwidth-${index}`}>Bandwidth</Label>
                        <Input
                          id={`serviceBandwidth-${index}`}
                          placeholder="e.g., 50 Mbps"
                          value={row.bandwidth}
                          onChange={(e) => handleServicePeriodChange(index, "bandwidth", e.target.value)}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button type="button" variant="outline" onClick={() => removeServicePeriodRow(index)}>
                          Remove
                        </Button>
                        {index === (formData.servicePeriods?.length || 0) - 1 && (
                          <Button type="button" onClick={addServicePeriodRow}>
                            Add Row
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bandwidth Details - free, purchased, total */}
              <div className="mt-6 space-y-3">
                <h4 className="text-md font-semibold text-primary">Bandwidth Details</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bwFree">Free</Label>
                    <Input
                      id="bwFree"
                      type="number"
                      value={formData.bandwidthDetails?.free ?? 0}
                      onChange={(e) => handleBandwidthDetailsChange("free", e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bwPurchased">Purchased</Label>
                    <Input
                      id="bwPurchased"
                      type="number"
                      value={formData.bandwidthDetails?.purchased ?? 0}
                      onChange={(e) => handleBandwidthDetailsChange("purchased", e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bwTotal">Total</Label>
                    <Input
                      id="bwTotal"
                      type="number"
                      value={formData.bandwidthDetails?.total ?? 0}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-6">
              <Button
                type="submit"
                className="bg-gradient-primary hover:opacity-90 transition-opacity"
              >
                {customer ? "Update Customer" : "Add Customer"}
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
