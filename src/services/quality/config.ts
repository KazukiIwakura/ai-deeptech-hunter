/**
 * Quality system configuration
 */

export interface QualitySystemConfig {
  parallelProcessing: {
    enabled: boolean;
    timeoutMs: number;
  };
  stageGating: {
    enabled: boolean;
    criticalThreshold: number;
  };
  cache: {
    enabled: boolean;
    maxSize: number;
    ttlMs: number;
  };
  logging: {
    enableDetailedLogging: boolean;
    enablePerformanceLogging: boolean;
  };
}

// Default configuration
export const CURRENT_QUALITY_CONFIG: QualitySystemConfig = {
  parallelProcessing: {
    enabled: true,
    timeoutMs: 5000, // 5 seconds timeout for parallel processing
  },
  stageGating: {
    enabled: true,
    criticalThreshold: 40, // If source reliability is below 40, skip detailed analysis
  },
  cache: {
    enabled: true,
    maxSize: 100, // Maximum number of cached items
    ttlMs: 3600000, // 1 hour cache TTL
  },
  logging: {
    enableDetailedLogging: false,
    enablePerformanceLogging: true,
  }
};

// Legacy export for backward compatibility
export const DEFAULT_QUALITY_CONFIG = CURRENT_QUALITY_CONFIG;

// Fast mode configuration for performance testing
export const FAST_MODE_CONFIG: QualitySystemConfig = {
  ...CURRENT_QUALITY_CONFIG,
  parallelProcessing: {
    enabled: true,
    timeoutMs: 2000, // 2 seconds timeout for fast mode
  },
  cache: {
    enabled: true,
    maxSize: 50, // Smaller cache for fast mode
    ttlMs: 1800000, // 30 minutes cache TTL
  }
};

// Precision mode configuration for accuracy testing
export const PRECISION_MODE_CONFIG: QualitySystemConfig = {
  ...CURRENT_QUALITY_CONFIG,
  parallelProcessing: {
    enabled: false, // Disable parallel processing for precision
    timeoutMs: 10000, // 10 seconds timeout for precision mode
  },
  logging: {
    enableDetailedLogging: true,
    enablePerformanceLogging: true,
  }
};