import { useCallback, useState } from 'react';
import { createAppError, logError, getErrorMessage, type AppError, ErrorType } from '@/utils/errorHandler';

interface UseErrorHandlerOptions {
  context?: string;
  onError?: (error: AppError) => void;
  showUserNotification?: boolean;
}

interface UseErrorHandlerReturn {
  error: AppError | null;
  handleError: (error: unknown, customMessage?: string) => AppError;
  clearError: () => void;
  isError: boolean;
}

/**
 * エラーハンドリング用カスタムフック
 * コンポーネント内で一貫したエラー処理を提供
 */
export const useErrorHandler = (
  options: UseErrorHandlerOptions = {}
): UseErrorHandlerReturn => {
  const { context, onError, showUserNotification = false } = options;
  const [error, setError] = useState<AppError | null>(null);

  const handleError = useCallback(
    (error: unknown, customMessage?: string): AppError => {
      const appError = createAppError(error, customMessage);
      
      logError(appError, context);
      setError(appError);
      
      if (onError) {
        onError(appError);
      }
      
      if (showUserNotification) {
        // 将来的にはトースト通知ライブラリと統合
        // toast.error(appError.message);
        console.warn('User notification:', appError.message);
      }
      
      return appError;
    },
    [context, onError, showUserNotification]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    handleError,
    clearError,
    isError: error !== null,
  };
};

/**
 * 非同期関数をエラーハンドリングでラップ
 */
export const withErrorHandling = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  errorHandler: (error: unknown) => AppError
): T => {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      errorHandler(error);
      throw error;
    }
  }) as T;
};

/**
 * エラーメッセージを安全に取得するヘルパー
 */
export const useErrorMessage = (error: unknown | null | undefined): string => {
  if (!error) return '';
  return getErrorMessage(error);
};

