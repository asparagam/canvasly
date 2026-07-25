import { useState, useEffect } from 'react';
import type { Project, Screen, FlowConnection, HistoryItem, DeviceType, AIProgressStep } from './types';
import { INITIAL_PROJECTS, INITIAL_HISTORY } from './data/seededData';
import { LandingDashboard } from './components/LandingDashboard';
import { TopToolbar } from './components/Workspace/TopToolbar';
import { LeftSidebar } from './components/Workspace/LeftSidebar';
import { InfiniteCanvas } from './components/Workspace/InfiniteCanvas';
import { AIPromptComposer } from './components/Workspace/AIPromptComposer';

// Modals
import { PrototypeModal } from './components/Modals/PrototypeModal';
import { CodeModal } from './components/Modals/CodeModal';
import { ShareModal } from './components/Modals/ShareModal';
import { FigmaExportModal } from './components/Modals/FigmaExportModal';
import { PublishModal } from './components/Modals/PublishModal';
import { SettingsModal } from './components/Modals/SettingsModal';
import { NeonDatabaseModal } from './components/Modals/NeonDatabaseModal';
import { GoogleCloudModal } from './components/Modals/GoogleCloudModal';
import { PricingPlanModal } from './components/Modals/PricingPlanModal';
import { NeonDatabaseService } from './services/neonService';

import { AlertTriangle } from 'lucide-react';

export default function App() {
  // Local storage state initialization
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('canvasly_projects');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_PROJECTS;
  });

  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'dashboard' | 'workspace'>('dashboard');

  // Selected screen on canvas
  const [selectedScreenId, setSelectedScreenId] = useState<string | null>('screen-saas-dashboard');
  
  // Workspace mode
  const [activeMode, setActiveMode] = useState<'design' | 'prototype' | 'tokens'>('design');

  // Sidebar collapse
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  // History timeline
  const [history, setHistory] = useState<HistoryItem[]>(INITIAL_HISTORY);

  // AI Generation Engine state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatingScreenId, setGeneratingScreenId] = useState<string | null>(null);
  const [progressSteps, setProgressSteps] = useState<AIProgressStep[]>([]);

  // User Subscription Plan state
  const [currentPlan, setCurrentPlan] = useState<'starter' | 'professional' | 'organization'>('starter');
  const [pricingLimitNotice, setPricingLimitNotice] = useState<string | undefined>(undefined);

  // Active Modals
  const [activeModal, setActiveModal] = useState<
    'prototype' | 'code' | 'share' | 'figma' | 'publish' | 'settings' | 'neon' | 'gcs' | 'pricing' | null
  >(null);

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  // Screen for targeted code inspection or edit
  const [targetedScreenForCode, setTargetedScreenForCode] = useState<Screen | null>(null);

  // Mobile viewport detection
  const [isMobileScreen, setIsMobileScreen] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobileScreen(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Save projects to LocalStorage
  useEffect(() => {
    localStorage.setItem('canvasly_projects', JSON.stringify(projects));
  }, [projects]);

  // Auto-sync project to Neon Serverless Postgres in background
  useEffect(() => {
    if (activeProject) {
      NeonDatabaseService.syncProjectToNeon(activeProject);
    }
  }, [activeProject]);

  // Helper to update active project
  const updateActiveProject = (updater: (prevProj: Project) => Project) => {
    setProjects((prevProjects) =>
      prevProjects.map((p) => (p.id === activeProject.id ? updater(p) : p))
    );
  };

  // Open Project Workspace
  const handleOpenProject = (projectId: string) => {
    setActiveProjectId(projectId);
    setActiveView('workspace');
    const proj = projects.find((p) => p.id === projectId);
    if (proj && proj.screens.length > 0) {
      setSelectedScreenId(proj.screens[0].id);
    }
  };

  // Create New Project from Dashboard Prompt
  const handleCreateProjectFromPrompt = (prompt: string, deviceType: DeviceType, _imageAttachment?: string) => {
    if (currentPlan === 'starter' && projects.length >= 3) {
      setPricingLimitNotice('Starter Plan limit reached (3 files to try out).');
      setActiveModal('pricing');
      return;
    }
    const newId = `proj-${Date.now()}`;
    const newProject: Project = {
      id: newId,
      name: prompt.length > 30 ? prompt.substring(0, 30) + '...' : prompt,
      description: `Generated from prompt: "${prompt}"`,
      deviceType: deviceType,
      createdAt: new Date().toISOString(),
      updatedAt: 'Just now',
      thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      screens: [
        {
          id: `screen-dash-${Date.now()}`,
          title: 'Generated SaaS Dashboard',
          type: 'saas-dashboard',
          device: deviceType === 'mobile' ? 'mobile' : 'web',
          x: 60,
          y: 60,
          width: deviceType === 'mobile' ? 380 : 1100,
          height: deviceType === 'mobile' ? 720 : 700,
          theme: 'dark',
          thumbnail: '',
          code: `// Generated code for ${prompt}`
        },
        {
          id: `screen-onboarding-${Date.now()}`,
          title: 'Mobile Onboarding',
          type: 'onboarding',
          device: 'mobile',
          x: deviceType === 'mobile' ? 480 : 1220,
          y: 60,
          width: 380,
          height: 720,
          theme: 'violet',
          thumbnail: '',
          code: `// Mobile onboarding`
        }
      ],
      flowConnections: [
        {
          id: `conn-${Date.now()}`,
          sourceScreenId: `screen-onboarding-${Date.now()}`,
          targetScreenId: `screen-dash-${Date.now()}`,
          sourceLabel: 'Get Started CTA',
          targetLabel: 'Dashboard',
          color: '#8b5cf6'
        }
      ],
      comments: []
    };

    setProjects([newProject, ...projects]);
    setActiveProjectId(newId);
    setActiveView('workspace');
    setSelectedScreenId(newProject.screens[0].id);

    // Trigger AI generation streaming animation
    simulateAIGeneration(prompt);
  };

  // AI Generation Simulation with real-time steps & canvas updates
  const simulateAIGeneration = (prompt: string, targetScreen?: Screen) => {
    setIsGenerating(true);
    setProgressSteps([]);

    const steps: { msg: string; delay: number }[] = [
      { msg: 'Parsing natural language prompt & intent tokens...', delay: 400 },
      { msg: 'Synthesizing responsive component grid layout...', delay: 1100 },
      { msg: 'Applying obsidian charcoal & violet design system tokens...', delay: 1800 },
      { msg: 'Generating React + Tailwind TSX component code...', delay: 2500 },
      { msg: 'Rendering high-fidelity screen onto infinite canvas!', delay: 3200 }
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        const stepItem: AIProgressStep = {
          id: `step-${idx}`,
          message: step.msg,
          status: idx === steps.length - 1 ? 'completed' : 'active',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        };

        setProgressSteps((prev) => {
          const updated = prev.map((s) => ({ ...s, status: 'completed' as const }));
          return [...updated, stepItem];
        });

        if (idx === steps.length - 1) {
          setIsGenerating(false);
          setGeneratingScreenId(null);

          // Add generated screen or update existing
          if (targetScreen) {
            updateActiveProject((proj) => ({
              ...proj,
              updatedAt: 'Just now',
              screens: proj.screens.map((s) =>
                s.id === targetScreen.id
                  ? { ...s, title: `${s.title} (AI Revised)` }
                  : s
              )
            }));
          } else {
            const newScreenId = `screen-gen-${Date.now()}`;
            const newScreen: Screen = {
              id: newScreenId,
              title: prompt.length > 20 ? prompt.substring(0, 20) + ' Screen' : prompt,
              type: prompt.toLowerCase().includes('profile') ? 'mobile-profile' : prompt.toLowerCase().includes('checkout') ? 'checkout' : 'custom',
              device: prompt.toLowerCase().includes('mobile') ? 'mobile' : 'web',
              x: (activeProject.screens.length % 3) * 450 + 60,
              y: Math.floor(activeProject.screens.length / 3) * 750 + 60,
              width: prompt.toLowerCase().includes('mobile') ? 380 : 1000,
              height: prompt.toLowerCase().includes('mobile') ? 720 : 680,
              theme: 'dark',
              thumbnail: '',
              code: `// Code for ${prompt}`
            };

            updateActiveProject((proj) => ({
              ...proj,
              updatedAt: 'Just now',
              screens: [...proj.screens, newScreen]
            }));

            setSelectedScreenId(newScreenId);
          }

          // Add to History
          setHistory((prev) => [
            {
              id: `hist-${Date.now()}`,
              timestamp: 'Just now',
              description: `Generated screen: "${prompt.substring(0, 30)}"`,
              screensCount: activeProject.screens.length + 1,
              actionType: 'ai-generate'
            },
            ...prev
          ]);
        }
      }, step.delay);
    });
  };

  const handleCancelGeneration = () => {
    setIsGenerating(false);
    setProgressSteps((prev) => [
      ...prev,
      {
        id: `step-cancel`,
        message: 'Generation cancelled by user',
        status: 'cancelled',
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
  };

  // Screen Manipulations
  const handleMoveScreen = (screenId: string, x: number, y: number) => {
    updateActiveProject((proj) => ({
      ...proj,
      screens: proj.screens.map((s) => (s.id === screenId ? { ...s, x, y } : s))
    }));
  };

  const handleResizeScreen = (screenId: string, width: number, height: number) => {
    updateActiveProject((proj) => ({
      ...proj,
      screens: proj.screens.map((s) => (s.id === screenId ? { ...s, width, height } : s))
    }));
  };

  const handleAddBlankScreen = (device: 'web' | 'mobile') => {
    const newId = `screen-blank-${Date.now()}`;
    const newScreen: Screen = {
      id: newId,
      title: device === 'mobile' ? 'New Mobile Screen' : 'New Web Canvas',
      type: 'custom',
      device: device,
      x: (activeProject.screens.length % 3) * 450 + 60,
      y: Math.floor(activeProject.screens.length / 3) * 750 + 60,
      width: device === 'mobile' ? 380 : 1000,
      height: device === 'mobile' ? 720 : 680,
      theme: 'dark',
      thumbnail: '',
      code: `// New ${device} screen`
    };

    updateActiveProject((proj) => ({
      ...proj,
      screens: [...proj.screens, newScreen]
    }));
    setSelectedScreenId(newId);
  };

  const handleDuplicateScreen = (screenId: string) => {
    const target = activeProject.screens.find((s) => s.id === screenId);
    if (!target) return;

    const dupId = `screen-copy-${Date.now()}`;
    const dupScreen: Screen = {
      ...target,
      id: dupId,
      title: `${target.title} (Copy)`,
      x: target.x + 40,
      y: target.y + 40
    };

    updateActiveProject((proj) => ({
      ...proj,
      screens: [...proj.screens, dupScreen]
    }));
    setSelectedScreenId(dupId);
  };

  const handleDeleteScreen = (screenId: string) => {
    if (activeProject.screens.length <= 1) return;
    updateActiveProject((proj) => ({
      ...proj,
      screens: proj.screens.filter((s) => s.id !== screenId),
      flowConnections: proj.flowConnections.filter(
        (c) => c.sourceScreenId !== screenId && c.targetScreenId !== screenId
      )
    }));
    setSelectedScreenId(activeProject.screens[0].id);
  };

  // Center screen focus
  const handleFocusScreen = (screenId: string) => {
    setSelectedScreenId(screenId);
  };

  // Connect prototype flow
  const handleConnectFlow = (sourceScreenId: string) => {
    const targetScreen = activeProject.screens.find((s) => s.id !== sourceScreenId);
    if (!targetScreen) return;

    const newConn: FlowConnection = {
      id: `conn-${Date.now()}`,
      sourceScreenId: sourceScreenId,
      targetScreenId: targetScreen.id,
      sourceLabel: 'Action Hotspot',
      targetLabel: targetScreen.title,
      color: '#8b5cf6'
    };

    updateActiveProject((proj) => ({
      ...proj,
      flowConnections: [...proj.flowConnections, newConn]
    }));

    setActiveMode('prototype');
  };

  // Project Rename / Duplicate / Delete
  const handleRenameProject = (projectId: string, newName: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, name: newName } : p))
    );
  };

  const handleDuplicateProject = (projectId: string) => {
    const target = projects.find((p) => p.id === projectId);
    if (!target) return;

    const newId = `proj-copy-${Date.now()}`;
    const dup: Project = {
      ...target,
      id: newId,
      name: `${target.name} (Copy)`,
      updatedAt: 'Just now'
    };
    setProjects([dup, ...projects]);
  };

  const handleDeleteProject = (projectId: string) => {
    if (projects.length <= 1) return;
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
  };

  const selectedScreen = activeProject.screens.find((s) => s.id === selectedScreenId);

  return (
    <div className="min-h-screen bg-[#0a0b10] text-slate-100 flex flex-col font-sans select-none overflow-hidden">
      {/* Mobile Screen Friendly Notice Banner */}
      {isMobileScreen && activeView === 'workspace' && (
        <div className="bg-amber-950/80 border-b border-amber-500/40 p-2.5 px-4 text-xs text-amber-200 flex items-center justify-between z-50">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Full canvas multi-screen editing is best experienced on a larger screen.</span>
          </div>
          <button
            onClick={() => setActiveModal('prototype')}
            className="px-2 py-1 bg-amber-500 text-black font-bold rounded text-[10px]"
          >
            Launch Prototype
          </button>
        </div>
      )}

      {/* Main View Router */}
      {activeView === 'dashboard' ? (
        <LandingDashboard
          projects={projects}
          onOpenProject={handleOpenProject}
          onCreateProjectFromPrompt={handleCreateProjectFromPrompt}
          onDuplicateProject={handleDuplicateProject}
          onDeleteProject={handleDeleteProject}
          onRenameProject={handleRenameProject}
        />
      ) : (
        /* Workspace View */
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          {/* Top Navigation Bar */}
          <TopToolbar
            project={activeProject}
            onUpdateProjectTitle={(title) => handleRenameProject(activeProject.id, title)}
            activeMode={activeMode}
            onChangeMode={setActiveMode}
            onOpenShareModal={() => setActiveModal('share')}
            onOpenPrototypeModal={() => setActiveModal('prototype')}
            onOpenCodeModal={() => {
              setTargetedScreenForCode(selectedScreen || null);
              setActiveModal('code');
            }}
            onOpenFigmaModal={() => setActiveModal('figma')}
            onOpenPublishModal={() => setActiveModal('publish')}
            onOpenNeonModal={() => setActiveModal('neon')}
            onOpenGcsModal={() => setActiveModal('gcs')}
            onOpenPricingModal={() => {
              setPricingLimitNotice(undefined);
              setActiveModal('pricing');
            }}
            onBackToDashboard={() => setActiveView('dashboard')}
            currentPlanName={currentPlan === 'starter' ? 'Starter' : currentPlan === 'professional' ? 'Professional' : 'Organization'}
          />

          {/* Main 3-Panel Creative Layout */}
          <div className="flex-1 flex overflow-hidden relative">
            {/* Left Sidebar */}
            <LeftSidebar
              project={activeProject}
              selectedScreenId={selectedScreenId}
              onSelectScreen={setSelectedScreenId}
              onFocusScreen={handleFocusScreen}
              onAddBlankScreen={handleAddBlankScreen}
              onDuplicateScreen={handleDuplicateScreen}
              onDeleteScreen={handleDeleteScreen}
              onNewProject={() => setActiveView('dashboard')}
              history={history}
              onRestoreHistory={() => {}}
              onOpenSettings={() => setActiveModal('settings')}
              collapsed={sidebarCollapsed}
              onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
            />

            {/* Infinite Creative Canvas */}
            <InfiniteCanvas
              screens={activeProject.screens}
              flowConnections={activeProject.flowConnections}
              comments={activeProject.comments}
              selectedScreenId={selectedScreenId}
              onSelectScreen={setSelectedScreenId}
              onMoveScreen={handleMoveScreen}
              onResizeScreen={handleResizeScreen}
              onButtonClickInScreen={(_srcId, targetType) => {
                if (targetType) {
                  const targetScreen = activeProject.screens.find((s) => s.type === targetType);
                  if (targetScreen) setSelectedScreenId(targetScreen.id);
                }
              }}
              onDuplicateScreen={handleDuplicateScreen}
              onDeleteScreen={handleDeleteScreen}
              onEditScreenWithAI={(screen) => {
                setSelectedScreenId(screen.id);
              }}
              onViewScreenCode={(screen) => {
                setTargetedScreenForCode(screen);
                setActiveModal('code');
              }}
              onConnectFlow={handleConnectFlow}
              activeMode={activeMode}
              onPlayPrototype={() => setActiveModal('prototype')}
              isGenerating={isGenerating}
              activeGeneratingScreenId={generatingScreenId}
            />

            {/* Floating AI Prompt Composer */}
            <AIPromptComposer
              onGenerate={(prompt) => simulateAIGeneration(prompt, selectedScreen || undefined)}
              isGenerating={isGenerating}
              onCancelGeneration={handleCancelGeneration}
              progressSteps={progressSteps}
              selectedScreenTitle={selectedScreen?.title}
            />
          </div>
        </div>
      )}

      {/* Render Active Modals */}
      {activeModal === 'prototype' && (
        <PrototypeModal
          screens={activeProject.screens}
          flowConnections={activeProject.flowConnections}
          initialScreenId={selectedScreenId || undefined}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'code' && (
        <CodeModal
          project={activeProject}
          selectedScreen={targetedScreenForCode}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'share' && (
        <ShareModal
          projectName={activeProject.name}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'figma' && (
        <FigmaExportModal
          project={activeProject}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'publish' && (
        <PublishModal
          projectName={activeProject.name}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'settings' && (
        <SettingsModal
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'neon' && (
        <NeonDatabaseModal
          onClose={() => setActiveModal(null)}
          onSyncNow={() => {
            if (activeProject) {
              NeonDatabaseService.syncProjectToNeon(activeProject);
            }
          }}
        />
      )}

      {activeModal === 'gcs' && (
        <GoogleCloudModal
          project={activeProject}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'pricing' && (
        <PricingPlanModal
          onClose={() => setActiveModal(null)}
          onUpgradePlan={(planName) => {
            if (planName.toLowerCase().includes('professional')) {
              setCurrentPlan('professional');
            } else if (planName.toLowerCase().includes('organization')) {
              setCurrentPlan('organization');
            }
          }}
          currentPlan={currentPlan}
          limitNotice={pricingLimitNotice}
        />
      )}
    </div>
  );
}
