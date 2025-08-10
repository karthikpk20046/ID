import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';

import ProjectFilters from './components/ProjectFilters';
import ProjectTable from './components/ProjectTable';
import ProjectForm from './components/ProjectForm';
import ProjectStats from './components/ProjectStats';
import BulkActions from './components/BulkActions';
import ProjectPagination from './components/ProjectPagination';
import GanttChart from './components/GanttChart';

const ProjectManagement = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [showGanttChart, setShowGanttChart] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    client: '',
    teamMember: '',
    startDateFrom: '',
    startDateTo: '',
    deadlineFrom: '',
    deadlineTo: '',
    minProgress: '',
    maxProgress: ''
  });

  // Mock project data
  const mockProjects = [
    {
      id: 'PRJ-001',
      name: 'E-commerce Platform Redesign',
      description: 'Complete overhaul of the existing e-commerce platform with modern UI/UX',
      client: 'Acme Corporation',
      status: 'active',
      progress: 65,
      startDate: '2024-01-15',
      deadline: '2024-04-30',
      budget: '$125,000',
      team: [
        { id: 'john-doe', name: 'John Doe', role: 'Project Manager' },
        { id: 'jane-smith', name: 'Jane Smith', role: 'UI/UX Designer' },
        { id: 'mike-johnson', name: 'Mike Johnson', role: 'Frontend Developer' }
      ],
      milestones: [
        { id: 1, title: 'Requirements Gathering', date: '2024-01-30', completed: true },
        { id: 2, title: 'Design Phase', date: '2024-02-28', completed: true },
        { id: 3, title: 'Development Phase', date: '2024-04-15', completed: false }
      ],
      tags: ['E-commerce', 'UI/UX', 'React']
    },
    {
      id: 'PRJ-002',
      name: 'Mobile App Development',
      description: 'Native mobile application for iOS and Android platforms',
      client: 'Tech Solutions Inc',
      status: 'planning',
      progress: 15,
      startDate: '2024-02-01',
      deadline: '2024-07-15',
      budget: '$200,000',
      team: [
        { id: 'sarah-wilson', name: 'Sarah Wilson', role: 'Mobile Developer' },
        { id: 'david-brown', name: 'David Brown', role: 'Backend Developer' }
      ],
      milestones: [
        { id: 1, title: 'Project Planning', date: '2024-02-15', completed: true },
        { id: 2, title: 'Wireframing', date: '2024-03-01', completed: false }
      ],
      tags: ['Mobile', 'iOS', 'Android', 'React Native']
    },
    {
      id: 'PRJ-003',
      name: 'Data Analytics Dashboard',
      description: 'Business intelligence dashboard with real-time analytics',
      client: 'Global Industries',
      status: 'completed',
      progress: 100,
      startDate: '2023-10-01',
      deadline: '2024-01-31',
      budget: '$85,000',
      team: [
        { id: 'lisa-garcia', name: 'Lisa Garcia', role: 'Data Analyst' },
        { id: 'john-doe', name: 'John Doe', role: 'Full Stack Developer' }
      ],
      milestones: [
        { id: 1, title: 'Data Collection', date: '2023-11-15', completed: true },
        { id: 2, title: 'Dashboard Development', date: '2023-12-31', completed: true },
        { id: 3, title: 'Testing & Deployment', date: '2024-01-31', completed: true }
      ],
      tags: ['Analytics', 'Dashboard', 'Data Visualization']
    },
    {
      id: 'PRJ-004',
      name: 'Cloud Migration Project',
      description: 'Migration of legacy systems to cloud infrastructure',
      client: 'Innovate Systems',
      status: 'on-hold',
      progress: 40,
      startDate: '2023-12-01',
      deadline: '2024-06-30',
      budget: '$300,000',
      team: [
        { id: 'mike-johnson', name: 'Mike Johnson', role: 'DevOps Engineer' },
        { id: 'sarah-wilson', name: 'Sarah Wilson', role: 'Cloud Architect' },
        { id: 'david-brown', name: 'David Brown', role: 'System Administrator' }
      ],
      milestones: [
        { id: 1, title: 'Infrastructure Assessment', date: '2023-12-31', completed: true },
        { id: 2, title: 'Migration Planning', date: '2024-02-15', completed: false }
      ],
      tags: ['Cloud', 'Migration', 'AWS', 'DevOps']
    },
    {
      id: 'PRJ-005',
      name: 'Security Audit & Compliance',
      description: 'Comprehensive security audit and compliance implementation',
      client: 'Digital Dynamics',
      status: 'active',
      progress: 80,
      startDate: '2024-01-01',
      deadline: '2024-03-31',
      budget: '$75,000',
      team: [
        { id: 'jane-smith', name: 'Jane Smith', role: 'Security Specialist' },
        { id: 'lisa-garcia', name: 'Lisa Garcia', role: 'Compliance Officer' }
      ],
      milestones: [
        { id: 1, title: 'Security Assessment', date: '2024-01-31', completed: true },
        { id: 2, title: 'Vulnerability Testing', date: '2024-02-28', completed: true },
        { id: 3, title: 'Compliance Documentation', date: '2024-03-31', completed: false }
      ],
      tags: ['Security', 'Compliance', 'Audit']
    },
    {
      id: 'PRJ-006',
      name: 'API Integration Platform',
      description: 'Unified API platform for third-party integrations',
      client: 'Acme Corporation',
      status: 'cancelled',
      progress: 25,
      startDate: '2023-11-01',
      deadline: '2024-02-29',
      budget: '$150,000',
      team: [
        { id: 'david-brown', name: 'David Brown', role: 'Backend Developer' },
        { id: 'mike-johnson', name: 'Mike Johnson', role: 'API Developer' }
      ],
      milestones: [
        { id: 1, title: 'API Design', date: '2023-12-01', completed: true },
        { id: 2, title: 'Core Development', date: '2024-01-15', completed: false }
      ],
      tags: ['API', 'Integration', 'Backend']
    }
  ];

  useEffect(() => {
    const loadProjects = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setProjects(mockProjects);
        setFilteredProjects(mockProjects);
      } catch (error) {
        console.error('Error loading projects:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, []);

  // Filter and sort projects
  const processedProjects = useMemo(() => {
    let filtered = [...projects];

    // Apply filters
    if (filters?.search) {
      const searchTerm = filters?.search?.toLowerCase();
      filtered = filtered?.filter(project =>
        project?.name?.toLowerCase()?.includes(searchTerm) ||
        project?.description?.toLowerCase()?.includes(searchTerm) ||
        project?.client?.toLowerCase()?.includes(searchTerm)
      );
    }

    if (filters?.status) {
      filtered = filtered?.filter(project => project?.status === filters?.status);
    }

    if (filters?.client) {
      filtered = filtered?.filter(project => 
        project?.client?.toLowerCase()?.replace(/\s+/g, '-')?.includes(filters?.client)
      );
    }

    if (filters?.teamMember) {
      filtered = filtered?.filter(project =>
        project?.team?.some(member => member?.id === filters?.teamMember)
      );
    }

    if (filters?.startDateFrom) {
      filtered = filtered?.filter(project => 
        new Date(project.startDate) >= new Date(filters.startDateFrom)
      );
    }

    if (filters?.startDateTo) {
      filtered = filtered?.filter(project => 
        new Date(project.startDate) <= new Date(filters.startDateTo)
      );
    }

    if (filters?.deadlineFrom) {
      filtered = filtered?.filter(project => 
        new Date(project.deadline) >= new Date(filters.deadlineFrom)
      );
    }

    if (filters?.deadlineTo) {
      filtered = filtered?.filter(project => 
        new Date(project.deadline) <= new Date(filters.deadlineTo)
      );
    }

    if (filters?.minProgress) {
      filtered = filtered?.filter(project => project?.progress >= parseInt(filters?.minProgress));
    }

    if (filters?.maxProgress) {
      filtered = filtered?.filter(project => project?.progress <= parseInt(filters?.maxProgress));
    }

    // Apply sorting
    filtered?.sort((a, b) => {
      let aValue = a?.[sortConfig?.key];
      let bValue = b?.[sortConfig?.key];

      if (sortConfig?.key === 'startDate' || sortConfig?.key === 'deadline') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (typeof aValue === 'string') {
        aValue = aValue?.toLowerCase();
        bValue = bValue?.toLowerCase();
      }

      if (aValue < bValue) {
        return sortConfig?.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig?.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return filtered;
  }, [projects, filters, sortConfig]);

  // Pagination
  const paginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return processedProjects?.slice(startIndex, startIndex + itemsPerPage);
  }, [processedProjects, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(processedProjects?.length / itemsPerPage);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev?.key === key && prev?.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: '',
      client: '',
      teamMember: '',
      startDateFrom: '',
      startDateTo: '',
      deadlineFrom: '',
      deadlineTo: '',
      minProgress: '',
      maxProgress: ''
    });
    setCurrentPage(1);
  };

  const handleSelectProject = (projectId) => {
    setSelectedProjects(prev =>
      prev?.includes(projectId)
        ? prev?.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const handleSelectAll = () => {
    setSelectedProjects(
      selectedProjects?.length === paginatedProjects?.length
        ? []
        : paginatedProjects?.map(project => project?.id)
    );
  };

  const handleClearSelection = () => {
    setSelectedProjects([]);
  };

  const handleCreateProject = () => {
    setEditingProject(null);
    setShowProjectForm(true);
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setShowProjectForm(true);
  };

  const handleSaveProject = async (projectData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (editingProject) {
        // Update existing project
        setProjects(prev =>
          prev?.map(project =>
            project?.id === editingProject?.id
              ? { ...project, ...projectData }
              : project
          )
        );
      } else {
        // Create new project
        const newProject = {
          ...projectData,
          id: `PRJ-${String(projects?.length + 1)?.padStart(3, '0')}`,
          team: projectData?.team?.map(memberId => {
            const memberNames = {
              'john-doe': 'John Doe',
              'jane-smith': 'Jane Smith',
              'mike-johnson': 'Mike Johnson',
              'sarah-wilson': 'Sarah Wilson',
              'david-brown': 'David Brown',
              'lisa-garcia': 'Lisa Garcia'
            };
            return { id: memberId, name: memberNames?.[memberId] || memberId };
          })
        };
        setProjects(prev => [...prev, newProject]);
      }

      setShowProjectForm(false);
      setEditingProject(null);
    } catch (error) {
      console.error('Error saving project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = async (project) => {
    if (window.confirm(`Are you sure you want to delete "${project?.name}"?`)) {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setProjects(prev => prev?.filter(p => p?.id !== project?.id));
        setSelectedProjects(prev => prev?.filter(id => id !== project?.id));
      } catch (error) {
        console.error('Error deleting project:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleViewTimeline = (project) => {
    console.log('Viewing timeline for:', project?.name);
    // Could open a detailed timeline view or navigate to project details
  };

  const handleGenerateReport = async (project) => {
    console.log('Generating report for:', project?.name);
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert(`Report generated for ${project?.name}`);
  };

  const handleBulkAction = async (action, actionData) => {
    console.log('Bulk action:', action, actionData, 'for projects:', selectedProjects);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    switch (action) {
      case 'update-status':
        setProjects(prev =>
          prev?.map(project =>
            selectedProjects?.includes(project?.id)
              ? { ...project, status: actionData?.status }
              : project
          )
        );
        break;
      case 'assign-team':
        setProjects(prev =>
          prev?.map(project =>
            selectedProjects?.includes(project?.id)
              ? { 
                  ...project, 
                  team: actionData?.teamMembers?.map(memberId => ({
                    id: memberId,
                    name: memberId?.replace('-', ' ')?.replace(/\b\w/g, l => l?.toUpperCase())
                  }))
                }
              : project
          )
        );
        break;
      case 'set-deadline':
        setProjects(prev =>
          prev?.map(project =>
            selectedProjects?.includes(project?.id)
              ? { ...project, deadline: actionData?.deadline }
              : project
          )
        );
        break;
      case 'export-reports':
        alert(`Exporting ${actionData?.format?.toUpperCase()} reports for ${selectedProjects?.length} projects`);
        break;
      case 'archive':
        alert(`Archived ${selectedProjects?.length} projects`);
        break;
      case 'delete':
        if (window.confirm(`Are you sure you want to delete ${selectedProjects?.length} projects?`)) {
          setProjects(prev => prev?.filter(project => !selectedProjects?.includes(project?.id)));
        }
        break;
    }

    setSelectedProjects([]);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedProjects([]);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    setSelectedProjects([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Project Management - ERP CRM</title>
        <meta name="description" content="Comprehensive project management with timeline tracking, team coordination, and progress monitoring" />
      </Helmet>
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Project Management</h1>
              <p className="text-muted-foreground">
                Track deliverables, manage timelines, and coordinate team efforts across all projects
              </p>
            </div>
            <div className="flex items-center space-x-3 mt-4 sm:mt-0">
              <Button
                variant="outline"
                onClick={() => setShowGanttChart(true)}
                iconName="Calendar"
                iconPosition="left"
              >
                Timeline View
              </Button>
              <Button
                onClick={handleCreateProject}
                iconName="Plus"
                iconPosition="left"
              >
                New Project
              </Button>
            </div>
          </div>

          {/* Project Statistics */}
          <ProjectStats projects={processedProjects} />

          {/* Filters */}
          <ProjectFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
          />

          {/* Bulk Actions */}
          <BulkActions
            selectedProjects={selectedProjects}
            onBulkAction={handleBulkAction}
            onClearSelection={handleClearSelection}
          />

          {/* Project Table */}
          {isLoading ? (
            <div className="bg-card rounded-lg border border-border p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading projects...</p>
            </div>
          ) : (
            <>
              <ProjectTable
                projects={paginatedProjects}
                selectedProjects={selectedProjects}
                onSelectProject={handleSelectProject}
                onSelectAll={handleSelectAll}
                onEditProject={handleEditProject}
                onDeleteProject={handleDeleteProject}
                onViewTimeline={handleViewTimeline}
                onGenerateReport={handleGenerateReport}
                sortConfig={sortConfig}
                onSort={handleSort}
              />

              {/* Pagination */}
              <div className="mt-6">
                <ProjectPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={processedProjects?.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={handlePageChange}
                  onItemsPerPageChange={handleItemsPerPageChange}
                />
              </div>
            </>
          )}
        </div>
      </main>
      {/* Project Form Modal */}
      {showProjectForm && (
        <ProjectForm
          project={editingProject}
          onSave={handleSaveProject}
          onCancel={() => {
            setShowProjectForm(false);
            setEditingProject(null);
          }}
          isLoading={isLoading}
        />
      )}
      {/* Gantt Chart Modal */}
      {showGanttChart && (
        <GanttChart
          projects={processedProjects}
          onClose={() => setShowGanttChart(false)}
        />
      )}
    </div>
  );
};

export default ProjectManagement;