// User types
export interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  name: string;
  avatar?: string;
}

// Poll types
export interface Poll {
  id: string;
  title: string;
  description?: string;
  options: PollOption[];
  author: User;
  isActive: boolean;
  isPublic: boolean;
  allowMultipleVotes: boolean;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  totalVotes: number;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
  pollId: string;
}

export interface Vote {
  id: string;
  pollId: string;
  optionId: string;
  userId: string;
  createdAt: Date;
}

// Form types
export interface CreatePollForm {
  title: string;
  description?: string;
  options: string[];
  isPublic: boolean;
  allowMultipleVotes: boolean;
  expiresAt?: Date;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  username: string;
  name: string;
  password: string;
  confirmPassword: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Component props types
export interface PollCardProps {
  poll: Poll;
  onVote?: (pollId: string, optionId: string) => void;
  onEdit?: (pollId: string) => void;
  onDelete?: (pollId: string) => void;
}

export interface PollListProps {
  polls: Poll[];
  isLoading?: boolean;
  onPollClick?: (pollId: string) => void;
}

// Navigation types
export interface NavItem {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  requiresAuth?: boolean;
}
