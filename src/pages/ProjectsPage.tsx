import { useState, useEffect } from "react";
import {
  ArrowLeft,
  FolderOpen,
  Plus,
  Trash2,
  Edit2,
  Calendar,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectForm } from "@/components/ProjectForm";
import { useToast } from "@/hooks/use-toast";

interface Project {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
}

const API_BASE_URL = "http://10.1.2.10:5000/api";

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  // Fetch projects on mount
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/projects`);
      const data = await res.json();
      // Normalize backend `_id` to `id` for consistency with the rest of the app
      setProjects(
        (Array.isArray(data) ? data : []).map((p: any) => ({
          ...p,
          id: p._id ?? p.id,
        }))
      );
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleAddProject = async (projectData: Omit<Project, "id">) => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData),
      });
      const newProject = await response.json();
      // Ensure new project has `id` (normalize from backend `_id`)
      setProjects([
        ...projects,
        { ...newProject, id: newProject._id ?? newProject.id },
      ]);
      setShowForm(false);
    } catch (error) {
      console.error("Error adding project:", error);
    }
  };

  const handleEditProject = async (projectData: Omit<Project, "id">) => {
    if (editingProject) {
      try {
        const response = await fetch(
          `${API_BASE_URL}/projects/${editingProject.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(projectData),
          }
        );
        if (!response.ok) {
          const err = await response
            .json()
            .catch(() => ({ error: "Unknown error" }));
          toast({
            title: "Update failed",
            description: err.error || "Failed to update project",
            variant: "destructive",
          });
          return;
        }
        const updatedProject = await response.json();
        // Normalize id on updated project
        const normalized = {
          ...updatedProject,
          id: updatedProject._id ?? updatedProject.id,
        };
        setProjects(
          projects.map((p) => (p.id === editingProject.id ? normalized : p))
        );
        setEditingProject(null);
        setShowForm(false);
        toast({
          title: "Success",
          description: "Project updated",
          variant: "success",
        });
      } catch (error) {
        console.error("Error updating project:", error);
        toast({
          title: "Error",
          description: "Failed to update project",
          variant: "destructive",
        });
      }
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/projects/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Unknown error" }));
        console.error("Delete failed:", err);
        toast({
          title: "Delete failed",
          description: err.error || "Failed to delete project",
          variant: "destructive",
        });
        return;
      }
      setProjects(projects.filter((p) => p.id !== id));
      toast({ title: "Deleted", description: "Project deleted successfully" });
    } catch (error) {
      console.error("Error deleting project:", error);
      toast({
        title: "Error",
        description: "Failed to delete project",
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
                Projects Management
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-sky-700/80">
                Manage your projects and initiatives
              </p>
            </div>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-sky-600 text-white hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        </div>

        {/* Projects Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.length === 0 ? (
            <div className="col-span-full">
              <Card className="shadow-card text-center py-16">
                <CardContent>
                  <FolderOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">
                    No projects yet
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Create your first project to get started.
                  </p>
                  <Button
                    onClick={() => setShowForm(true)}
                    className="bg-gradient-primary"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Project
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            projects.map((project) => (
              <Card
                key={project.id}
                className="shadow-card hover:shadow-card-hover transition-shadow group"
              >
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg flex items-center gap-2 group-hover:text-primary transition-colors">
                      <FolderOpen className="h-5 w-5" />
                      {project.name}
                    </CardTitle>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingProject(project);
                          setShowForm(true);
                        }}
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteProject(project.id)}
                        className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {project.description}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {project.startDate} → {project.endDate}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-xs text-muted-foreground">
                      Active Project
                    </span>
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Project Form */}
        {showForm && (
          <ProjectForm
            project={editingProject}
            onSubmit={editingProject ? handleEditProject : handleAddProject}
            onCancel={() => {
              setShowForm(false);
              setEditingProject(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
