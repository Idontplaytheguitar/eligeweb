// Type definitions for the Estudio Elige application
// These types complement Prisma-generated types and provide additional type safety

// ============================================================================
// Database Model Types (simplified versions for component use)
// ============================================================================

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  published: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface BlogPostListItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  coverImage: string | null;
  publishedAt: Date | null;
}

export interface Workshop {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  price: number;
  coverImage: string | null;
  materialUrl: string | null;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkshopListItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  coverImage: string | null;
}

export interface WorkshopWithPurchaseCount extends Workshop {
  _count: {
    purchases: number;
  };
}

export interface Meeting {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  date: string;
  time: string;
  notes: string | null;
  googleEventId: string | null;
  googleMeetLink: string | null;
  status: string;
  createdAt: Date;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  area: string;
  message: string;
  createdAt: Date;
}

export interface Purchase {
  id: string;
  workshopId: string;
  email: string;
  name: string;
  paymentId: string;
  paymentStatus: string;
  downloadToken: string;
  downloadExpires: Date;
  createdAt: Date;
  workshop?: Workshop;
}

// ============================================================================
// Booking Configuration Types
// ============================================================================

export interface TimeSlot {
  start: string;
  end: string;
}

export interface DaySchedule {
  enabled: boolean;
  slots: TimeSlot[];
}

export interface RecurringSchedule {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export interface BookingException {
  date: string;
  type: "closed" | "custom";
  slots?: TimeSlot[];
}

export interface BookingConfig {
  enabled: boolean;
  recurring: RecurringSchedule;
  exceptions: BookingException[];
  meetingDuration: number;
}

// ============================================================================
// API Request/Response Types
// ============================================================================

// Auth API
export interface AuthCheckRequest {
  action: "check";
}

export interface AuthLoginRequest {
  action: "login";
  password: string;
}

export interface AuthLogoutRequest {
  action: "logout";
}

export interface AuthRequestOTPRequest {
  action: "request_otp";
  password: string;
}

export interface AuthChangePasswordRequest {
  action: "change_password";
  otp: string;
  newPassword: string;
}

export type AuthRequest =
  | AuthCheckRequest
  | AuthLoginRequest
  | AuthLogoutRequest
  | AuthRequestOTPRequest
  | AuthChangePasswordRequest;

export interface AuthResponse {
  authenticated?: boolean;
  success?: boolean;
  error?: string;
  message?: string;
}

// Blog API
export interface CreateBlogPostRequest {
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string | null;
  published: boolean;
}

export interface UpdateBlogPostRequest extends CreateBlogPostRequest {
  id: string;
}

export interface DeleteBlogPostRequest {
  id: string;
}

// Workshop/Talleres API
export interface CreateWorkshopRequest {
  title: string;
  description: string;
  content: string;
  price: number;
  coverImage?: string | null;
  materialUrl?: string | null;
  published: boolean;
}

export interface UpdateWorkshopRequest extends CreateWorkshopRequest {
  id: string;
}

export interface DeleteWorkshopRequest {
  id: string;
}

// Meeting/Booking API
export interface BookMeetingRequest {
  name: string;
  email: string;
  phone?: string;
  date: string;
  time: string;
  notes?: string;
}

export interface UpdateMeetingRequest {
  meetingId: string;
  action: "cancel" | "delete" | "update";
  status?: string;
}

// Contact API
export interface ContactFormRequest {
  name: string;
  email: string;
  phone?: string;
  area: string;
  message: string;
}

// Checkout API
export interface CheckoutRequest {
  workshopId: string;
  email?: string;
  name?: string;
}

export interface CheckoutResponse {
  id: string;
  init_point: string;
}

// AI API
export interface AIImproveRequest {
  action: "grammar" | "style" | "expand" | "summarize";
  text: string;
}

export interface AIImproveResponse {
  improvedText: string;
}

// ============================================================================
// Component Props Types
// ============================================================================

export interface NavItem {
  name: string;
  href: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  includes: string[];
  forWho: string;
  icon: string;
}

export interface TestimonialItem {
  initials: string;
  text: string;
  location: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface WhyChooseUsItem {
  title: string;
  description: string;
  icon: string;
}

export interface ProcessStep {
  step: number;
  title: string;
  description: string;
  icon: string;
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
}

// ============================================================================
// Utility Types
// ============================================================================

export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface AvailableSlot {
  time: string;
  available: boolean;
}

// ============================================================================
// Form Types (for react-hook-form)
// ============================================================================

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  area: string;
  message: string;
}

export interface BookingFormData {
  name: string;
  email: string;
  phone?: string;
  date: string;
  time: string;
  notes?: string;
}

export interface LoginFormData {
  password: string;
}

export interface ChangePasswordFormData {
  otp: string;
  newPassword: string;
  confirmPassword: string;
}
