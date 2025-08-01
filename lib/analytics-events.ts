// PostHog Analytics Events Configuration
// This file defines all analytics events used throughout the application

export const ANALYTICS_EVENTS = {
  // Authentication Events
  AUTH: {
    LOGIN_OTP_SENT: 'login_otp_sent',
    LOGIN_VALIDATION_ERROR: 'login_validation_error',
    LOGIN_OTP_SEND_FAILED: 'login_otp_send_failed',
    LOGIN_SUCCESS: 'login_success',
    LOGIN_FAILED: 'login_failed',
    LOGOUT: 'logout',
    
    REGISTRATION_STARTED: 'registration_started',
    REGISTRATION_OTP_SENT: 'registration_otp_sent',
    REGISTRATION_EXISTING_USER: 'registration_existing_user',
    REGISTRATION_VALIDATION_ERROR: 'registration_validation_error',
    REGISTRATION_OTP_SEND_FAILED: 'registration_otp_send_failed',
    REGISTRATION_COMPLETED: 'registration_completed_successfully',
    REGISTRATION_COMPLETION_VALIDATION_ERROR: 'registration_completion_validation_error',
    REGISTRATION_COMPLETION_FAILED: 'registration_completion_failed',
    
    OTP_VERIFICATION_SUCCESS_NEW_USER: 'otp_verification_success_new_user',
    OTP_VERIFICATION_SUCCESS_EXISTING_USER: 'otp_verification_success_existing_user',
    OTP_VERIFICATION_FAILED: 'otp_verification_failed',
    OTP_VERIFICATION_VALIDATION_ERROR: 'otp_validation_error',
    OTP_RESEND: 'otp_resend',
  },

  // Dashboard Events
  DASHBOARD: {
    PAGE_VIEW: 'dashboard_page_view',
    ACTION_CLICK: 'dashboard_action_click',
    STATS_CARD_CLICK: 'dashboard_stats_card_click',
    NEW_PURCHASE_REQUEST: 'new_purchase_request',
    ADD_PACKAGE: 'add_package',
    VIEW_EXPECTED_PACKAGES: 'view_colis_attendus',
    VIEW_WAREHOUSE_PACKAGES: 'view_en_entrepot',
    VIEW_SHIPPED_PACKAGES: 'view_envoyes',
    VIEW_PURCHASE_ASSISTANCE: 'view_achat_assiste',
  },

  // Package Management Events
  PACKAGES: {
    PAGE_VIEW: 'packages_page_view',
    CREATE_PACKAGE: 'package_create',
    CREATE_PACKAGE_SUCCESS: 'package_create_success',
    CREATE_PACKAGE_FAILED: 'package_create_failed',
    VIEW_PACKAGE_DETAILS: 'package_view_details',
    UPDATE_PACKAGE: 'package_update',
    UPDATE_PACKAGE_SUCCESS: 'package_update_success',
    UPDATE_PACKAGE_FAILED: 'package_update_failed',
    DELETE_PACKAGE: 'package_delete',
    DELETE_PACKAGE_SUCCESS: 'package_delete_success',
    DELETE_PACKAGE_FAILED: 'package_delete_failed',
    PACKAGE_STATUS_CHANGE: 'package_status_change',
    PACKAGE_FILTER: 'package_filter',
    PACKAGE_SEARCH: 'package_search',
  },

  // Purchase Request Events
  PURCHASES: {
    PAGE_VIEW: 'purchases_page_view',
    CREATE_PURCHASE_REQUEST: 'purchase_request_create',
    CREATE_PURCHASE_REQUEST_SUCCESS: 'purchase_request_create_success',
    CREATE_PURCHASE_REQUEST_FAILED: 'purchase_request_create_failed',
    VIEW_PURCHASE_DETAILS: 'purchase_request_view_details',
    UPDATE_PURCHASE_REQUEST: 'purchase_request_update',
    UPDATE_PURCHASE_REQUEST_SUCCESS: 'purchase_request_update_success',
    UPDATE_PURCHASE_REQUEST_FAILED: 'purchase_request_update_failed',
    DELETE_PURCHASE_REQUEST: 'purchase_request_delete',
    DELETE_PURCHASE_REQUEST_SUCCESS: 'purchase_request_delete_success',
    DELETE_PURCHASE_REQUEST_FAILED: 'purchase_request_delete_failed',
    PURCHASE_STATUS_CHANGE: 'purchase_request_status_change',
    PURCHASE_FILTER: 'purchase_request_filter',
    PURCHASE_SEARCH: 'purchase_request_search',

  },



  // Profile & Settings Events
  PROFILE: {
    PAGE_VIEW: 'profile_page_view',
    UPDATE_PROFILE: 'profile_update',
    UPDATE_PROFILE_SUCCESS: 'profile_update_success',
    UPDATE_PROFILE_FAILED: 'profile_update_failed',
    CHANGE_PASSWORD: 'password_change',
    CHANGE_PASSWORD_SUCCESS: 'password_change_success',
    CHANGE_PASSWORD_FAILED: 'password_change_failed',
    UPLOAD_AVATAR: 'avatar_upload',
    UPLOAD_AVATAR_SUCCESS: 'avatar_upload_success',
    UPLOAD_AVATAR_FAILED: 'avatar_upload_failed',
  },

  // Navigation Events
  NAVIGATION: {
    SIDEBAR_NAVIGATION: 'sidebar_navigation',
    BREADCRUMB_NAVIGATION: 'breadcrumb_navigation',
    MOBILE_MENU_OPEN: 'mobile_menu_open',
    MOBILE_MENU_CLOSE: 'mobile_menu_close',
    SEARCH_NAVIGATION: 'search_navigation',
  },

  // Search & Filter Events
  SEARCH: {
    SEARCH_PERFORMED: 'search_performed',
    SEARCH_RESULTS_VIEWED: 'search_results_viewed',
    SEARCH_RESULT_CLICKED: 'search_result_clicked',
    FILTER_APPLIED: 'filter_applied',
    FILTER_CLEARED: 'filter_cleared',
    SORT_CHANGED: 'sort_changed',
  },

  // File Upload Events
  FILES: {
    FILE_UPLOAD: 'file_upload',
    FILE_UPLOAD_SUCCESS: 'file_upload_success',
    FILE_UPLOAD_FAILED: 'file_upload_failed',
    FILE_DOWNLOAD: 'file_download',
    FILE_DELETE: 'file_delete',
    FILE_DELETE_SUCCESS: 'file_delete_success',
    FILE_DELETE_FAILED: 'file_delete_failed',
    FILE_PREVIEW: 'file_preview',
  },

  // Notification Events
  NOTIFICATIONS: {
    NOTIFICATION_RECEIVED: 'notification_received',
    NOTIFICATION_READ: 'notification_read',
    NOTIFICATION_CLICKED: 'notification_clicked',
    NOTIFICATION_DISMISSED: 'notification_dismissed',
    NOTIFICATION_SETTINGS_CHANGED: 'notification_settings_changed',
  },

  // Error Events
  ERRORS: {
    API_ERROR: 'api_error',
    VALIDATION_ERROR: 'validation_error',
    NETWORK_ERROR: 'network_error',
    AUTHENTICATION_ERROR: 'authentication_error',
    PERMISSION_ERROR: 'permission_error',
    NOT_FOUND_ERROR: 'not_found_error',
    SERVER_ERROR: 'server_error',
  },

  // Performance Events
  PERFORMANCE: {
    PAGE_LOAD_TIME: 'page_load_time',
    API_RESPONSE_TIME: 'api_response_time',
    IMAGE_LOAD_TIME: 'image_load_time',
    SLOW_INTERACTION: 'slow_interaction',
  },

  // Business Events
  BUSINESS: {
    PACKAGE_RECEIVED: 'package_received',
    PACKAGE_SHIPPED: 'package_shipped',
    PURCHASE_COMPLETED: 'purchase_completed',
    PAYMENT_RECEIVED: 'payment_received',
    CUSTOMER_SUPPORT_REQUESTED: 'customer_support_requested',
    FEEDBACK_SUBMITTED: 'feedback_submitted',
  },

  // Feature Usage Events
  FEATURES: {
    FEATURE_ENABLED: 'feature_enabled',
    FEATURE_DISABLED: 'feature_disabled',
    FEATURE_USED: 'feature_used',
    FEATURE_ABANDONED: 'feature_abandoned',
  },
} as const

// Event properties interfaces for type safety
export interface AuthEventProperties {
  phoneNumber?: string
  userId?: string
  error?: string
  missing_fields?: string[]
  hasEmail?: boolean
  country?: string
  otp_length?: number
}

export interface DashboardEventProperties {
  user_id?: string
  has_stats?: boolean
  total_packages?: number
  action?: string
  stats_card?: string
}

export interface PackageEventProperties {
  packageId?: string
  status?: string
  weight?: number
  dimensions?: string
  trackingNumber?: string
  error?: string
  filter_type?: string
  search_query?: string
}

export interface PurchaseEventProperties {
  purchaseId?: string
  status?: string
  amount?: number
  currency?: string
  items_count?: number
  error?: string
  filter_type?: string
  search_query?: string
}



export interface ProfileEventProperties {
  field_updated?: string
  error?: string
  avatar_size?: number
  hasEmail?: boolean
  country?: string
}

export interface NavigationEventProperties {
  from_page?: string
  to_page?: string
  navigation_type?: string
}

export interface SearchEventProperties {
  query?: string
  results_count?: number
  search_type?: string
  filter_applied?: string
  sort_by?: string
}

export interface FileEventProperties {
  fileName?: string
  fileSize?: number
  fileType?: string
  uploadProgress?: number
  error?: string
}

export interface NotificationEventProperties {
  notificationType?: string
  notificationId?: string
  action?: string
}

export interface ErrorEventProperties {
  error_message?: string
  error_code?: string
  endpoint?: string
  user_agent?: string
  stack_trace?: string
}

export interface PerformanceEventProperties {
  load_time?: number
  response_time?: number
  page_size?: number
  interaction_type?: string
}

export interface BusinessEventProperties {
  packageId?: string
  purchaseId?: string
  
  amount?: number
  currency?: string
  status?: string
}

export interface FeatureEventProperties {
  feature_name?: string
  feature_version?: string
  user_id?: string
  context?: string
} 