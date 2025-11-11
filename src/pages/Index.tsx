import {
  Wifi,
  Network,
  Building,
  Building2,
  Lightbulb,
  FolderOpen,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const sections = [
  {
    title: "Datacom",
    description: "Manage RF and LAN customers with technical details",
    icon: Wifi,
    path: "/datacom",
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Exim",
    description: "Handle STPI and Non-STPI units with compliance data",
    icon: Building,
    path: "/exim",
    color: "from-green-500 to-emerald-500",
  },
  {
    title: "Incubation",
    description: "Support startup customers and innovation projects",
    icon: Lightbulb,
    path: "/incubation",
    color: "from-yellow-500 to-orange-500",
  },
  {
    title: "Co Location",
    description: "Track and manage co location customers and racks",
    icon: FolderOpen,
    path: "/projects",
    color: "from-purple-500 to-pink-500",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20 p-6">
      <div className="max-w-8xl mx-auto space-y-10 md:space-y-20">
        <div className="flex flex-col items-center gap-3 lg:flex-row w-full lg:items-end lg:justify-between absolute top-0 left-0">
          <div className="flex items-center gap-4 bg-background w-full pt-7">
            <img src="/stpilogo.png" alt="STPI Logo" className="h-32 w-32" />
            <div className="text-left">
              <h1 className="text-3xl sm:text-4xl lg:text-4xl font-extrabold text-sky-600">
                SOFTWARE TECHNOLOGY PARKS OK INDIA - KAKINADA
              </h1>
              <p className="mt-1 text-sm sm:text-base lg:text-lg text-sky-700/80 max-w-3xl">
                Centralized platform for managing customers, units, and co location
                across all departments
              </p>
            </div>
          </div>
        </div>
        <div
          className="grid md:grid-cols-2 gap-20 p-20 pt-25 overflow-y-auto"
          style={{ maxHeight: 'calc(100vh - 180px)' }}
        >
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <Link key={section.title} to={section.path}>
                <Card className="shadow-card hover:shadow-card-hover transition-all duration-300 group cursor-pointer p-4 sm:p-6 h-full">
                  <CardHeader className="text-center pb-2">
                    <div
                      className={`w-18 h-18 p-2 mx-auto rounded-full bg-gradient-to-r ${section.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="h-25 w-25 text-white" />
                    </div>
                    <CardTitle className="text-lg sm:text-xl lg:text-2xl group-hover:text-sky-600 transition-colors">
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-muted-foreground text-sm sm:text-base lg:text-lg leading-relaxed">
                      {section.description}
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4 w-full group-hover:bg-sky-600 group-hover:text-white transition-colors"
                    >
                      Manage {section.title}
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Index;
