/**
 * エラーハンドリングユーティリティ
 * アプリケーション全体で一貫したエラー処理を提供
 */

export enum ErrorType {
  API_ERROR = 'API_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  PARSE_ERROR = 'PARSE_ERROR',
  AUTH_ERROR = 'AUTH_ERROR',
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export interface AppError {
  type: ErrorType;
  message: string;
  originalError?: Error | unknown;
  code?: string;
  retryable?: boolean;
  timestamp: Date;
}

/**
 * エラーの種類を判定
 */
export const classifyError = (error: unknown): ErrorType => {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    
    if (message.includes('network') || message.includes('fetch') || message.includes('timeout')) {
      return ErrorType.NETWORK_ERROR;
    }
    if (message.includes('validation') || message.includes('schema') || message.includes('zod')) {
      return ErrorType.VALIDATION_ERROR;
    }
    if (message.includes('parse') || message.includes('json')) {
      return ErrorType.PARSE_ERROR;
    }
    if (message.includes('api key') || message.includes('auth') || message.includes('unauthorized')) {
      return ErrorType.AUTH_ERROR;
    }
    if (message.includes('rate limit') || message.includes('quota') || message.includes('制限')) {
      return ErrorType.RATE_LIMIT_ERROR;
    }
    if (message.includes('api') || message.includes('request failed')) {
      return ErrorType.API_ERROR;
    }
  }
  
  return ErrorType.UNKNOWN_ERROR;
};

/**
 * エラーをAppError形式に変換
 */
export const createAppError = (
  error: unknown,
  customMessage?: string
): AppError => {
  const type = classifyError(error);
  const originalError = error instanceof Error ? error : new Error(String(error));
  
  let message = customMessage;
  if (!message) {
    if (error instanceof Error) {
      message = error.message;
    } else {
      message = '予期せぬエラーが発生しました';
    }
  }
  
  // ユーザーフレンドリーなメッセージに変換
  message = getUserFriendlyMessage(type, message);
  
  return {
    type,
    message,
    originalError,
    retryable: isRetryable(type),
    timestamp: new Date(),
  };
};

/**
 * ユーザーフレンドリーなエラーメッセージを生成
 */
const getUserFriendlyMessage = (type: ErrorType, originalMessage: string): string => {
  switch (type) {
    case ErrorType.NETWORK_ERROR:
      return 'ネットワークエラーが発生しました。インターネット接続を確認してください。';
    case ErrorType.VALIDATION_ERROR:
      return 'データの形式が正しくありません。しばらく待ってから再度お試しください。';
    case ErrorType.PARSE_ERROR:
      return 'AIからの応答を解析できませんでした。再度お試しください。';
    case ErrorType.AUTH_ERROR:
      return 'APIキーが無効です。設定画面でAPIキーを確認してください。';
    case ErrorType.RATE_LIMIT_ERROR:
      return 'API使用制限に達しています。しばらく待ってから再度お試しください。';
    case ErrorType.API_ERROR:
      return originalMessage.includes('失敗') 
        ? originalMessage 
        : `APIエラーが発生しました: ${originalMessage}`;
    default:
      return originalMessage || '予期せぬエラーが発生しました';
  }
};

/**
 * エラーがリトライ可能かどうかを判定
 */
const isRetryable = (type: ErrorType): boolean => {
  return [
    ErrorType.NETWORK_ERROR,
    ErrorType.API_ERROR,
    ErrorType.PARSE_ERROR,
  ].includes(type);
};

/**
 * エラーログを記録（ログユーティリティを使用）
 */
export const logError = (error: AppError, context?: string): void => {
  // ログユーティリティを使用（遅延インポートで循環依存を回避）
  import('./logger').then(({ log }) => {
    log.error(
      `${error.type}: ${error.message}`,
      context || 'ErrorHandler',
      {
        type: error.type,
        originalError: error.originalError,
        timestamp: error.timestamp,
        retryable: error.retryable,
      }
    );
  }).catch(() => {
    // フォールバック: ログユーティリティが利用できない場合
    const isDevelopment = process.env.NODE_ENV === 'development';
    if (isDevelopment) {
      console.error(`[Error] ${context || 'Unknown context'}:`, {
        type: error.type,
        message: error.message,
        originalError: error.originalError,
        timestamp: error.timestamp,
      });
    } else {
      console.error(`[Error] ${error.type}: ${error.message}`);
    }
  });
};

/**
 * エラーメッセージを安全に取得（null/undefined対応）
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return '予期せぬエラーが発生しました';
};

