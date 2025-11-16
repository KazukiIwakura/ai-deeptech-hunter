/**
 * ログ管理ユーティリティ
 * 開発環境と本番環境で適切なログレベルを管理
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4,
}

interface LogEntry {
  level: LogLevel;
  message: string;
  context?: string;
  data?: unknown;
  timestamp: Date;
}

class Logger {
  private logLevel: LogLevel;
  private logs: LogEntry[] = [];
  private maxLogs = 100; // メモリ内に保持する最大ログ数

  constructor() {
    // 環境変数からログレベルを取得（デフォルトは開発環境ではDEBUG、本番環境ではERROR）
    const envLogLevel = process.env.VITE_LOG_LEVEL;
    if (envLogLevel) {
      this.logLevel = LogLevel[envLogLevel as keyof typeof LogLevel] ?? LogLevel.ERROR;
    } else {
      this.logLevel = process.env.NODE_ENV === 'development' ? LogLevel.DEBUG : LogLevel.ERROR;
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.logLevel;
  }

  private formatMessage(level: LogLevel, message: string, context?: string, data?: unknown): string {
    const prefix = context ? `[${context}]` : '';
    const levelName = LogLevel[level];
    return `${prefix} [${levelName}] ${message}`;
  }

  private log(level: LogLevel, message: string, context?: string, data?: unknown): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const entry: LogEntry = {
      level,
      message,
      context,
      data,
      timestamp: new Date(),
    };

    // メモリ内にログを保存（デバッグ用）
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // コンソールに出力
    const formattedMessage = this.formatMessage(level, message, context);
    
    switch (level) {
      case LogLevel.DEBUG:
        if (data) {
          console.debug(formattedMessage, data);
        } else {
          console.debug(formattedMessage);
        }
        break;
      case LogLevel.INFO:
        if (data) {
          console.info(formattedMessage, data);
        } else {
          console.info(formattedMessage);
        }
        break;
      case LogLevel.WARN:
        if (data) {
          console.warn(formattedMessage, data);
        } else {
          console.warn(formattedMessage);
        }
        break;
      case LogLevel.ERROR:
        if (data) {
          console.error(formattedMessage, data);
        } else {
          console.error(formattedMessage);
        }
        // 本番環境では外部ログサービスに送信（将来的な拡張）
        if (process.env.NODE_ENV === 'production') {
          // sendToErrorTrackingService(entry);
        }
        break;
    }
  }

  debug(message: string, context?: string, data?: unknown): void {
    this.log(LogLevel.DEBUG, message, context, data);
  }

  info(message: string, context?: string, data?: unknown): void {
    this.log(LogLevel.INFO, message, context, data);
  }

  warn(message: string, context?: string, data?: unknown): void {
    this.log(LogLevel.WARN, message, context, data);
  }

  error(message: string, context?: string, data?: unknown): void {
    this.log(LogLevel.ERROR, message, context, data);
  }

  /**
   * ログレベルを動的に変更
   */
  setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  /**
   * 保存されたログを取得（デバッグ用）
   */
  getLogs(level?: LogLevel): LogEntry[] {
    if (level !== undefined) {
      return this.logs.filter(log => log.level === level);
    }
    return [...this.logs];
  }

  /**
   * ログをクリア
   */
  clearLogs(): void {
    this.logs = [];
  }

  /**
   * パフォーマンス測定用のログ
   */
  performance(label: string, duration: number, context?: string): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      this.debug(`${label}: ${duration.toFixed(2)}ms`, context);
    }
  }

  /**
   * API呼び出しのログ
   */
  apiCall(endpoint: string, method: string, status?: number, duration?: number, context?: string): void {
    const message = `API ${method} ${endpoint}${status ? ` [${status}]` : ''}${duration ? ` (${duration.toFixed(2)}ms)` : ''}`;
    if (status && status >= 400) {
      this.error(message, context);
    } else if (this.shouldLog(LogLevel.DEBUG)) {
      this.debug(message, context);
    }
  }
}

// シングルトンインスタンス
export const logger = new Logger();

/**
 * 簡易ログ関数（グローバルに使用可能）
 */
export const log = {
  debug: (message: string, context?: string, data?: unknown) => logger.debug(message, context, data),
  info: (message: string, context?: string, data?: unknown) => logger.info(message, context, data),
  warn: (message: string, context?: string, data?: unknown) => logger.warn(message, context, data),
  error: (message: string, context?: string, data?: unknown) => logger.error(message, context, data),
  performance: (label: string, duration: number, context?: string) => logger.performance(label, duration, context),
  apiCall: (endpoint: string, method: string, status?: number, duration?: number, context?: string) => 
    logger.apiCall(endpoint, method, status, duration, context),
};

