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
  ipDetails: string;
  bandwidth: string;
  bridgeDetails: string;
  prtgGraphLink: string;
}

const API_BASE_URL = "http://10.1.2.10:5000/api";

const IncubationPage = () => {
  const [customers, setCustomers] = useState<IncubationCustomer[]>([]);
  const [editingCustomer, setEditingCustomer] =
    useState<IncubationCustomer | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [viewingCustomer, setViewingCustomer] =
    useState<IncubationCustomer | null>(null);

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
    let ok = confirm("ARE YOU SURE ?");
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
        <div className="max-h-[75vh] overflow-y-auto pr-2">
          <div className="grid gap-4 md:grid-cols-3 h-50">
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
                      <div className="flex justify-center md:justify-start">
                        <div className="w-11/12 md:w-1/2 text-center md:text-left">
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
                        Company Name
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
                        Technical Details
                      </h3>
                      <div className="space-y-1 text-base">
                        <p>
                          <span className="font-semibold">IP Details:</span>{" "}
                          {viewingCustomer.ipDetails}
                        </p>
                        <p>
                          <span className="font-semibold">Bandwidth:</span>{" "}
                          {viewingCustomer.bandwidth}
                        </p>
                        <p>
                          <span className="font-semibold">Bridge Details:</span>{" "}
                          {viewingCustomer.bridgeDetails}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
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
                    <div>
                      <h3 className="font-semibold text-sky-600 mb-2">
                        Project Timeline
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
                        {viewingCustomer.prtgGraphLink && (
                          <p>
                            <span className="font-semibold">PRTG Graph:</span>
                            <a
                              href={viewingCustomer.prtgGraphLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sky-600 hover:underline ml-1"
                            >
                              View Graph
                            </a>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Customer Form */}
        {showForm && (
          <CustomerForm
            customer={editingCustomer}
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
