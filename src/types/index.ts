export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  department: string;
  fullName?: string;
}

export type UserRole = 'admin' | 'user' | 'viewer' | 'manager';

export interface UserProfile extends User {
  documentsCount: number;
  storageUsed: number;
  storageLimit: number;
  document_count: number;
  total_upload_size: number;
  last_activity?: string;
}

export interface UserCreateData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive?: boolean;
}

export interface UserUpdateData {
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  isActive?: boolean;
}

export interface UserProfileUpdate {
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  usersByRole: Record<UserRole, number>;
  recentRegistrations: User[];
}

export interface UserActivity {
  id: string;
  userId: string;
  user: User;
  action: UserAction;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export type UserAction =
  | 'login'
  | 'logout'
  | 'register'
  | 'profile_update'
  | 'password_change'
  | 'document_upload'
  | 'document_download'
  | 'document_view'
  | 'document_update'
  | 'document_delete';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    documentUpdates: boolean;
    securityAlerts: boolean;
  };
  pageSize: number;
  defaultView: 'grid' | 'list';
  autoSave: boolean;
  downloadFormat: 'original' | 'pdf';
}

export interface UserInvitation {
  id: string;
  email: string;
  role: UserRole;
  invitedBy: string;
  invitedByUser: User;
  token: string;
  expiresAt: string;
  acceptedAt?: string;
  createdAt: string;
}

export interface UserInvitationCreate {
  email: string;
  role: UserRole;
  message?: string;
}

export interface UserSession {
  id: string;
  userId: string;
  userAgent: string;
  ipAddress: string;
  lastActivity: string;
  expiresAt: string;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  confirmPassword: string;
}

export interface RegisterRequest {
  email: string;
  first_name: string;
  last_name: string;
  department: string;
  role?: UserRole;
  password: string;
  confirm_password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface TokenPayload {
  sub: string;
  email: string;
  role: UserRole;
  exp: number;
  iat: number;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AuthState {
  user: User | null;
  accessToken?: string | null;
  refreshToken?: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error?: string | null;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshAuthToken?: () => Promise<void>;
  updateProfile?: (data: Partial<User>) => Promise<void>;
  changePassword?: (data: ChangePasswordData) => Promise<void>;
  resetPassword?: (email: string) => Promise<void>;
  confirmResetPassword?: (data: PasswordResetConfirm) => Promise<void>;
}


export interface Document {
  id: string;
  title: string;
  description?: string;
  fileName: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  mimeType: string;
  checksum: string;
  createdBy: string;
  department: string;
  isActive: boolean;
  status: DocumentStatus;
  version: number;
  ownerId: string;
  owner: User;
  tags: Tag[];
  metadata?: DocumentMetadata;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  download_url?: string;
  can_edit: boolean;
  can_delete: boolean;
  uploader: any;
  version_count: number;
  latest_version: number;
  file_name: string;
  file_path: string;
  created_at: string;
  updated_at: string;
  creator?: User;
}

export interface DocumentVersion {
  id: string;
  documentId: string;
  version: number;
  fileName: string;
  fileType: string;
  fileSize: number;
  filePath: string;
  changeDescription?: string;
  createdBy: string;
  createdAt: string;
  version_number: number;
  created_at: string;
  change_notes?: string;
  creator?: User;
  download_url?: string;
}

export interface DocumentMetadata {
  pages?: number;
  dimensions?: {
    width?: number;
    height?: number;
  };
  duration?: number;
  author?: string;
  subject?: string;
  keywords?: string[];
  created?: string;
  modified?: string;
  custom?: Record<string, any>;
}

export type DocumentStatus = 'active' | 'archived' | 'deleted' | 'pending';

export interface DocumentUpload {
  file: File;
  title: string;
  description?: string;
  tags?: string[];
  metadata?: Partial<DocumentMetadata>;
}

export interface DocumentUploadData {
  title: string;
  description?: string;
  department: string;
  tag_ids: string[];
  permissions?: Permission[];
  file: File;
}

export interface DocumentUpdate {
  title?: string;
  description?: string;
  tags?: string[];
  status?: DocumentStatus;
}

export interface DocumentSearchParams {
  q?: string;
  fileType?: string;
  tags?: string[];
  dateFrom?: string;
  dateTo?: string;
  ownerId?: string;
  status?: DocumentStatus;
  sortBy?: 'createdAt' | 'updatedAt' | 'title' | 'fileSize';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  query?: string;
  department?: string;
  created_by?: string;
}

export interface DocumentSearchResults {
  documents: Document[];
  totalCount: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

export interface DocumentStats {
  totalDocuments: number;
  totalSize: number;
  byFileType: Record<string, number>;
  byStatus: Record<DocumentStatus, number>;
  byDepartment?: Record<string, number>;
  recentUploads: Document[];
  storageUsage: {
    used: number;
    limit: number;
    percentage: number;
  };
  // total_documents: number;
  // total_size: number;
  // documents_by_type: Record<string, number>;
  // documents_by_department: Record<string, number>;
}

export interface DocumentPermission {
  userId: string;
  documentId: string;
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canShare: boolean;
  canDownload: boolean;
  grantedBy: string;
  grantedAt: string;
  expiresAt?: string;
}

export interface ShareSettings {
  isPublic: boolean;
  allowDownload: boolean;
  allowComments: boolean;
  expirationDate?: string;
  password?: string;
  permissions: DocumentPermission[];
}

export interface DocumentActivity {
  id: string;
  documentId: string;
  userId: string;
  user: User;
  action: DocumentAction;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export type DocumentAction = 
  | 'upload'
  | 'download'
  | 'view'
  | 'update'
  | 'delete'
  | 'restore'
  | 'share'
  | 'comment'
  | 'version_create'
  | 'version_restore';

export interface DocumentComment {
  id: string;
  documentId: string;
  userId: string;
  user: User;
  content: string;
  parentId?: string;
  replies: DocumentComment[];
  createdAt: string;
  updatedAt: string;
  isEdited: boolean;
}

export interface DocumentResponse {
  success: boolean;
  data: Document;
  message?: string;
}

export interface DocumentsResponse {
  success: boolean;
  data: Document[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
}

export interface DeleteDocumentResponse {
  success: boolean;
  message: string;
  deletedDocument?: Document;
}

export interface Tag {
  id: string;
  name: string;
  color?: string;
  description?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  documentCount?: number;
  created_at: string;
}

export interface TagCreate {
  name: string;
  color?: string;
  description?: string;
}

export interface TagUpdate {
  name?: string;
  color?: string;
  description?: string;
}

export interface TagStats {
  totalTags: number;
  mostUsedTags: TagUsage[];
  recentlyCreatedTags: Tag[];
}

export interface TagUsage {
  tag: Tag;
  count: number;
  lastUsed: string;
}

export interface TagCloudItem {
  tag: Tag;
  count: number;
  weight: number;
}

export interface TagsResponse {
  success: boolean;
  data: Tag[];
  pagination?: PaginationInfo;
  message?: string;
}

export interface TagResponse {
  success: boolean;
  data: Tag;
  message?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error_code?: string;
  details?: any;
  error?: string;
  errors?: Record<string, string[]>;
  pagination?: PaginationInfo;
  metadata?: Record<string, any>;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiError {
  message: string;
  code: string;
  statusCode: number;
  details?: Record<string, any>;
  timestamp: string;
  status: number;
}

export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  params?: Record<string, any>;
  data?: any;
  timeout?: number;
  responseType?: 'json' | 'blob' | 'arraybuffer' | 'text';
  onUploadProgress?: (progressEvent: ProgressEvent) => void;
  onDownloadProgress?: (progressEvent: ProgressEvent) => void;
}

export interface ApiConfig {
  baseURL: string;
  timeout?: number;
  withCredentials?: boolean;
  headers?: Record<string, string>;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
  speed?: number;
  estimatedTime?: number;
}

export interface DownloadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface ApiEndpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  description: string;
  requiresAuth: boolean;
  requiredParams?: string[];
  optionalParams?: string[];
  requestBody?: any;
  response: any;
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
}

export interface ApiHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  version: string;
  timestamp: string;
  uptime: number;
  database: {
    status: 'connected' | 'disconnected';
    latency: number;
  };
  storage: {
    status: 'available' | 'unavailable';
    freeSpace: number;
    totalSpace: number;
  };
  services: Record<string, ServiceStatus>;
}

export type ServiceStatus = 'ok' | 'warning' | 'error' | 'unknown';

export interface ApiMetrics {
  requests: {
    total: number;
    successful: number;
    failed: number;
    byEndpoint: Record<string, number>;
    byMethod: Record<string, number>;
    byStatus: Record<number, number>;
  };
  responseTimes: {
    average: number;
    p95: number;
    p99: number;
    max: number;
  };
  activeConnections: number;
  memoryUsage: number;
  cpuUsage: number;
}

export interface BatchRequest {
  requests: Array<{
    id: string;
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    url: string;
    headers?: Record<string, string>;
    body?: any;
  }>;
}

export interface BatchResponse {
  responses: Array<{
    id: string;
    status: number;
    headers: Record<string, string>;
    body: any;
  }>;
  errors?: Array<{
    id: string;
    error: ApiError;
  }>;
}

export interface WebSocketMessage<T = any> {
  type: string;
  data: T;
  timestamp: string;
  id?: string;
}

export interface RealTimeUpdate<T = any> {
  event: 'create' | 'update' | 'delete' | 'status_change';
  entity: string;
  data: T;
  timestamp: string;
  userId?: string;
}

export interface NavigationItem {
  label: string;
  path: string;
  icon: React.ComponentType;
  requiredRole?: UserRole;
}

export interface TableColumn<T = any> {
  field: keyof T;
  headerName: string;
  width?: number;
  sortable?: boolean;
  filterable?: boolean;
  renderCell?: (params: { value: any; row: T }) => React.ReactNode;
}

export interface FileCategory {
  name: string;
  extensions: string[];
  icon: React.ComponentType;
  color: string;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: string;
}

export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface FormState<T = any> {
  data: T;
  values: T;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isValid: boolean;
  isSubmitting: boolean;
  submitCount: number;
  isDirty: boolean;
}

export interface Permission {
  permission_type: 'read' | 'write' | 'delete';
  target_type: 'user' | 'department' | 'role';
  target_value: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterParams {
  search?: string;
  filters?: Record<string, any>;
  dateRange?: {
    from?: string;
    to?: string;
  };
}

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  icon?: string;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  createdAt: string;
  read: boolean;
}

export interface FileInfo {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  extension: string;
}

export interface UploadFile extends FileInfo {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
  id: string;
}

export interface DownloadFile {
  id: string;
  name: string;
  url: string;
  progress: number;
  status: 'pending' | 'downloading' | 'completed' | 'error';
  error?: string;
  size?: number;
}

export interface KeyValuePair {
  key: string;
  value: any;
}

export interface Duration {
  years?: number;
  months?: number;
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number;
  altitudeAccuracy?: number;
  heading?: number;
  speed?: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  coordinates?: GeoLocation;
}

export interface ContactInfo {
  email: string;
  phone?: string;
  website?: string;
  address?: Address;
}

export interface SocialLinks {
  twitter?: string;
  linkedin?: string;
  github?: string;
  facebook?: string;
  instagram?: string;
}

export interface SystemInfo {
  os: string;
  browser: string;
  device: string;
  screen: {
    width: number;
    height: number;
  };
  language: string;
  timezone: string;
}

export interface AuditLog {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  userId: string;
  user: User;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
}

export interface ExportOptions {
  format: 'json' | 'csv' | 'xml' | 'pdf';
  include: string[];
  filters?: FilterParams;
  compression?: boolean;
  password?: string;
}

export interface ImportOptions {
  format: 'json' | 'csv' | 'xml';
  mapping: Record<string, string>;
  onConflict: 'skip' | 'overwrite' | 'merge';
  validateOnly?: boolean;
}

export interface StatsSummary {
  total: number;
  completed: number;
  pending: number;
  failed: number;
  percentage: number;
}

export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }>;
}

export interface TimeSeriesData {
  timestamp: string;
  value: number;
}

export interface HeatmapData {
  x: string;
  y: string;
  value: number;
}

export interface TreeStructure {
  id: string;
  name: string;
  type: string;
  children?: TreeStructure[];
  expanded?: boolean;
  selected?: boolean;
}

export interface DragAndDropItem {
  id: string;
  type: string;
  data: any;
  index?: number;
}

export interface ClipboardItem {
  type: string;
  data: any;
  timestamp: string;
}

export interface CacheItem<T = any> {
  key: string;
  value: T;
  expiresAt: number;
  createdAt: number;
}

export interface QueueItem<T = any> {
  id: string;
  data: T;
  priority: number;
  attempts: number;
  maxAttempts: number;
  delay?: number;
  timeout?: number;
  createdAt: number;
}

export interface UsersResponse {
  success: boolean;
  data: User[];
  pagination?: PaginationInfo;
  message?: string;
}

export interface UserResponse {
  success: boolean;
  data: User;
  message?: string;
}