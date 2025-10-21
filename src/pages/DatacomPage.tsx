import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Wifi,
  Network,
  Plus,
  Trash2,
  Edit2,
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

const API_BASE_URL = "http://10.1.2.10:5000/api"; // Change to your backend URL

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
  ipDetails: string;
  bandwidth: string;
  bridgeDetails: string;
  prtgGraphLink: string;
}

const DatacomPage = () => {
  const [rfCustomers, setRfCustomers] = useState<Customer[]>([]);
  const [lanCustomers, setLanCustomers] = useState<Customer[]>([]);
  const [activeTab, setActiveTab] = useState("rf");
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null);
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
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="rf" className="flex items-center gap-2">
              <Wifi className="h-4 w-4" />
              RF Customers
            </TabsTrigger>
            <TabsTrigger value="lan" className="flex items-center gap-2">
              <Network className="h-4 w-4" />
              LAN Customers
            </TabsTrigger>
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

            <div className="grid grid-cols-3 gap-4">
              {currentCustomers.map((customer) => (
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
            <div className="max-h-[70vh] overflow-y-auto pr-2">
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
                        Manager Information
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
                        Leader Information
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
                          <span className="font-semibold">IP Details:</span>{" "}
                          {viewingCustomer.ipDetails}
                        </p>
                        <p>
                          <span className="font-semibold">Bridge Details:</span>{" "}
                          {viewingCustomer.bridgeDetails}
                        </p>
                      </div>
                    </div>

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
