import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  ipDetails: string;
  bandwidth: string;
  bridgeDetails: string;
  prtgGraphLink: string;
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
    ipDetails: customer?.ipDetails || "",
    bandwidth: customer?.bandwidth || "",
    bridgeDetails: customer?.bridgeDetails || "",
    prtgGraphLink: customer?.prtgGraphLink || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
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
                Manager Details
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
                Leader Details
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
                  <Label htmlFor="ipDetails">IP Details *</Label>
                  <Input
                    id="ipDetails"
                    value={formData.ipDetails}
                    onChange={(e) => handleChange("ipDetails", e.target.value)}
                    placeholder="e.g., 192.168.1.100/24"
                    required
                  />
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
                  <Input
                    id="bridgeDetails"
                    value={formData.bridgeDetails}
                    onChange={(e) =>
                      handleChange("bridgeDetails", e.target.value)
                    }
                    placeholder="Bridge configuration details"
                  />
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
