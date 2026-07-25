export type DeviceType = 'web' | 'mobile' | 'responsive';

export type ScreenType = 
  | 'saas-dashboard' 
  | 'onboarding' 
  | 'analytics' 
  | 'mobile-profile' 
  | 'settings' 
  | 'checkout' 
  | 'custom';

export interface Screen {
  id: string;
  title: string;
  type: ScreenType;
  device: DeviceType;
  x: number;
  y: number;
  width: number;
  height: number;
  theme: 'dark' | 'light' | 'violet' | 'emerald';
  code: string;
  thumbnail: string;
  isGenerating?: boolean;
}

export interface FlowConnection {
  id: string;
  sourceScreenId: string;
  targetScreenId: string;
  sourceLabel: string;
  targetLabel: string;
  color?: string;
}

export interface Comment {
  id: string;
  screenId: string;
  x: number;
  y: number;
  author: string;
  avatar: string;
  text: string;
  timestamp: string;
  resolved: boolean;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  deviceType: DeviceType;
  createdAt: string;
  updatedAt: string;
  thumbnail: string;
  screens: Screen[];
  flowConnections: FlowConnection[];
  comments: Comment[];
}

export interface HistoryItem {
  id: string;
  timestamp: string;
  description: string;
  screensCount: number;
  actionType: 'create' | 'edit' | 'delete' | 'ai-generate';
}

export interface AIProgressStep {
  id: string;
  message: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  timestamp: string;
}
