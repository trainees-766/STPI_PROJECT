import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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

interface CoLocationFormProps {
  coLocation?: CoLocation | null;
  onSubmit: (coLocation: Omit<CoLocation, "id">) => void;
  onCancel: () => void;
}

export const CoLocationForm = ({ coLocation, onSubmit, onCancel }: CoLocationFormProps) => {
  const [formData, setFormData] = useState({
    customerName: coLocation?.customerName || "",
    managerName: coLocation?.managerName || "",
    managerEmail: coLocation?.managerEmail || "",
    managerPhone: coLocation?.managerPhone || "",
    managerDesignation: coLocation?.managerDesignation || "",
    adminName: coLocation?.adminName || "",
    adminEmail: coLocation?.adminEmail || "",
    adminPhone: coLocation?.adminPhone || "",
    adminDesignation: coLocation?.adminDesignation || "",
    rackSpaceUnits: coLocation?.rackSpaceUnits || 0,
    dataTransferGB: coLocation?.dataTransferGB || 0,
    activationDate: coLocation?.activationDate || "",
    agreementEntered: coLocation?.agreementEntered || false,
    totalAnnualCharges: coLocation?.totalAnnualCharges || 0,
    quarterlyCharges: coLocation?.quarterlyCharges || 0,
    remarks: coLocation?.remarks || "",
    prtgGraphLink: coLocation?.prtgGraphLink || "",
    ipDetails: coLocation?.ipDetails || { gateway: "", networkIp: "", startIp: "", lastIp: "", subnetMask: "" },
    bandwidthDetails: coLocation?.bandwidthDetails || { free: 0, purchased: 0, total: 0 },
    servicePeriods: coLocation?.servicePeriods || [{ date: "", bandwidth: "" }],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" >
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-scroll shadow-card-hover animate-scale-in ">
        <CardHeader className="flex-row justify-between items-center pb-4">
          <CardTitle className="text-xl">
            {coLocation ? "Edit Co Location" : "Add New Co Location"}
          </CardTitle>
          <Button variant="outline" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Co Location Details */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name *</Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) => handleChange("customerName", e.target.value)}
                  required
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="managerName">Manager/Director Name *</Label>
                  <Input id="managerName" value={formData.managerName} onChange={(e) => handleChange("managerName", e.target.value)} required />
                  <Label htmlFor="managerEmail">Manager Email *</Label>
                  <Input id="managerEmail" value={formData.managerEmail} onChange={(e) => handleChange("managerEmail", e.target.value)} required />
                  <Label htmlFor="managerPhone">Manager Phone *</Label>
                  <Input id="managerPhone" value={formData.managerPhone} onChange={(e) => handleChange("managerPhone", e.target.value)} required />
                  <Label htmlFor="managerDesignation">Manager Designation *</Label>
                  <Input id="managerDesignation" value={formData.managerDesignation} onChange={(e) => handleChange("managerDesignation", e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adminName">System Admin Name *</Label>
                  <Input id="adminName" value={formData.adminName} onChange={(e) => handleChange("adminName", e.target.value)} required />
                  <Label htmlFor="adminEmail">System Admin Email *</Label>
                  <Input id="adminEmail" value={formData.adminEmail} onChange={(e) => handleChange("adminEmail", e.target.value)} required />
                  <Label htmlFor="adminPhone">System Admin Phone *</Label>
                  <Input id="adminPhone" value={formData.adminPhone} onChange={(e) => handleChange("adminPhone", e.target.value)} required />
                  <Label htmlFor="adminDesignation">System Admin Designation *</Label>
                  <Input id="adminDesignation" value={formData.adminDesignation} onChange={(e) => handleChange("adminDesignation", e.target.value)} required />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rackSpaceUnits">Rack Space (Units) *</Label>
                  <Input id="rackSpaceUnits" type="text" value={formData.rackSpaceUnits} onChange={(e) => handleChange("rackSpaceUnits", e.target.value)} required />
                  <Label htmlFor="dataTransferGB">Data Transfer (GB) *</Label>
                  <Input id="dataTransferGB" type="number" value={formData.dataTransferGB} onChange={(e) => handleChange("dataTransferGB", Number(e.target.value))} required />
                  <Label htmlFor="activationDate">Date of Activation *</Label>
                  <Input id="activationDate" type="date" value={formData.activationDate} onChange={(e) => handleChange("activationDate", e.target.value)} required />
                  <Label htmlFor="agreementEntered">Agreement Entered *</Label>
                  <select id="agreementEntered" value={formData.agreementEntered ? "yes" : "no"} onChange={(e) => handleChange("agreementEntered", e.target.value === "yes") } required className="input">
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalAnnualCharges">Total Annual Charges *</Label>
                  <Input id="totalAnnualCharges" type="number" value={formData.totalAnnualCharges} onChange={(e) => handleChange("totalAnnualCharges", Number(e.target.value))} required />
                  <Label htmlFor="quarterlyCharges">Quarterly Charges *</Label>
                  <Input id="quarterlyCharges" type="number" value={formData.quarterlyCharges} onChange={(e) => handleChange("quarterlyCharges", Number(e.target.value))} required />
                  <Label htmlFor="remarks">Remarks</Label>
                  <Textarea id="remarks" value={formData.remarks} onChange={(e) => handleChange("remarks", e.target.value)} />
                  <Label htmlFor="prtgGraphLink">Monitoring Link (PRTG Graph)</Label>
                  <Input id="prtgGraphLink" value={formData.prtgGraphLink} onChange={(e) => handleChange("prtgGraphLink", e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-md font-semibold text-primary">IP Pool Details</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <Input placeholder="Gateway" value={formData.ipDetails.gateway} onChange={(e) => setFormData(prev => ({ ...prev, ipDetails: { ...prev.ipDetails, gateway: e.target.value } }))} />
                  <Input placeholder="Network IP" value={formData.ipDetails.networkIp} onChange={(e) => setFormData(prev => ({ ...prev, ipDetails: { ...prev.ipDetails, networkIp: e.target.value } }))} />
                  <Input placeholder="Start IP" value={formData.ipDetails.startIp} onChange={(e) => setFormData(prev => ({ ...prev, ipDetails: { ...prev.ipDetails, startIp: e.target.value } }))} />
                  <Input placeholder="Last IP" value={formData.ipDetails.lastIp} onChange={(e) => setFormData(prev => ({ ...prev, ipDetails: { ...prev.ipDetails, lastIp: e.target.value } }))} />
                  <Input placeholder="Subnet Mask" value={formData.ipDetails.subnetMask} onChange={(e) => setFormData(prev => ({ ...prev, ipDetails: { ...prev.ipDetails, subnetMask: e.target.value } }))} />
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-md font-semibold text-primary">Bandwidth Details</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <Input placeholder="Free" type="number" value={formData.bandwidthDetails.free} onChange={(e) => setFormData(prev => ({ ...prev, bandwidthDetails: { ...prev.bandwidthDetails, free: Number(e.target.value), total: Number(e.target.value) + (prev.bandwidthDetails.purchased || 0) } }))} />
                  <Input placeholder="Purchased" type="number" value={formData.bandwidthDetails.purchased} onChange={(e) => setFormData(prev => ({ ...prev, bandwidthDetails: { ...prev.bandwidthDetails, purchased: Number(e.target.value), total: (prev.bandwidthDetails.free || 0) + Number(e.target.value) } }))} />
                  <Input placeholder="Total" type="number" value={formData.bandwidthDetails.total} readOnly />
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-md font-semibold text-primary">Service Periods</h4>
                {formData.servicePeriods.map((sp, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <Input placeholder="Date" type="date" value={sp.date} onChange={(e) => {
                      const next = [...formData.servicePeriods];
                      next[idx].date = e.target.value;
                      setFormData(prev => ({ ...prev, servicePeriods: next }));
                    }} />
                    <Input placeholder="Bandwidth" value={sp.bandwidth} onChange={(e) => {
                      const next = [...formData.servicePeriods];
                      next[idx].bandwidth = e.target.value;
                      setFormData(prev => ({ ...prev, servicePeriods: next }));
                    }} />
                    <Button type="button" variant="outline" size="sm" onClick={() => {
                      const next = [...formData.servicePeriods];
                      next.splice(idx, 1);
                      setFormData(prev => ({ ...prev, servicePeriods: next.length ? next : [{ date: "", bandwidth: "" }] }));
                    }}>❌</Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => setFormData(prev => ({ ...prev, servicePeriods: [...prev.servicePeriods, { date: "", bandwidth: "" }] }))}>Add Service Period</Button>
              </div>
            </div>
            {/* Action Buttons */}
            <div className="flex gap-3 pt-6">
              <Button type="submit" className="bg-gradient-primary hover:opacity-90 transition-opacity">
                {coLocation ? "Update Co Location" : "Create Co Location"}
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