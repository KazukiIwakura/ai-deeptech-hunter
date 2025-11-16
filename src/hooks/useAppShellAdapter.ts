/**
 * useAppShellのZustand版アダプター
 * 既存のuseAppShellインターフェースを維持しつつ、Zustandストアを使用
 */

import { useCallback, useEffect, useMemo } from 'react';
import { useAppShellStore, useAiClient } from '@/stores/appStore';
import { getDiscoverySuggestions } from '@/services/geminiService';
import { encryptApiKey, decryptApiKey, validateApiKeyFormat } from '@/utils/encryption';
import { useApiUsageMonitor } from '@/hooks/useApiUsageMonitor';
import { useErrorHandler } from '@/hooks/useErrorHandler';

/**
 * useAppShellのZustand版実装
 * 既存のインターフェースを維持
 */
export const useAppShellAdapter = () => {
  const { handleError } = useErrorHandler({ context: 'useAppShell' });
  const { usage, limits, trackApiCall, resetUsage, isLimitReached } = useApiUsageMonitor();
  
  // Zustandストアから状態を取得
  const userApiKey = useAppShellStore((state) => state.userApiKey);
  const effectiveApiKey = useAppShellStore((state) => state.effectiveApiKey);
  const isApiKeyConfigured = useAppShellStore((state) => state.isApiKeyConfigured);
  const useDemoData = useAppShellStore((state) => state.useDemoData);
  const isSidebarOpen = useAppShellStore((state) => state.isSidebarOpen);
  const isHowItWorksModalOpen = useAppShellStore((state) => state.isHowItWorksModalOpen);
  const initialModalTab = useAppShellStore((state) => state.initialModalTab);
  const discoverySuggestions = useAppShellStore((state) => state.discoverySuggestions);
  const isDiscoveryLoading = useAppShellStore((state) => state.isDiscoveryLoading);
  const discoveryError = useAppShellStore((state) => state.discoveryError);
  
  // Zustandストアのアクションを取得
  const setUserApiKeyStore = useAppShellStore((state) => state.setUserApiKey);
  const clearUserApiKeyStore = useAppShellStore((state) => state.clearUserApiKey);
  const setUseDemoDataStore = useAppShellStore((state) => state.setUseDemoData);
  const toggleSidebarStore = useAppShellStore((state) => state.toggleSidebar);
  const setSidebarOpenStore = useAppShellStore((state) => state.setSidebarOpen);
  const openHowItWorksModalStore = useAppShellStore((state) => state.openHowItWorksModal);
  const closeHowItWorksModalStore = useAppShellStore((state) => state.closeHowItWorksModal);
  const setDiscoverySuggestionsStore = useAppShellStore((state) => state.setDiscoverySuggestions);
  const setDiscoveryLoadingStore = useAppShellStore((state) => state.setDiscoveryLoading);
  const setDiscoveryErrorStore = useAppShellStore((state) => state.setDiscoveryError);
  
  // APIキーの復号化処理（初期化時）
  useEffect(() => {
    try {
      const encryptedKey = localStorage.getItem('userApiKey');
      if (encryptedKey && !userApiKey) {
        const decryptedKey = decryptApiKey(encryptedKey);
        if (decryptedKey) {
          // ストアに設定（暗号化されたキーは既にlocalStorageにあるため、復号化したキーを設定）
          setUserApiKeyStore(decryptedKey);
        }
      }
    } catch (e) {
      handleError(e, 'APIキーの読み込みに失敗しました');
    }
  }, []); // 初回のみ実行
  
  // APIキー設定（暗号化対応）
  const setUserApiKey = useCallback((key: string) => {
    if (key && key.trim()) {
      const trimmedKey = key.trim();
      
      if (!validateApiKeyFormat(trimmedKey)) {
        return false;
      }
      
      // 暗号化して保存
      const encryptedKey = encryptApiKey(trimmedKey);
      localStorage.setItem('userApiKey', encryptedKey);
      
      // ストアに設定
      return setUserApiKeyStore(trimmedKey);
    }
    return false;
  }, [setUserApiKeyStore]);
  
  // APIキー削除
  const clearUserApiKey = useCallback(() => {
    localStorage.removeItem('userApiKey');
    clearUserApiKeyStore();
  }, [clearUserApiKeyStore]);
  
  // 発見提案の取得
  const fetchDiscoverySuggestions = useCallback(async (isLive?: boolean) => {
    setDiscoveryLoadingStore(true);
    setDiscoveryErrorStore(null);
    
    const demoMode = isLive !== undefined ? !isLive : useDemoData;
    
    if (!effectiveApiKey && !demoMode) {
      setDiscoveryErrorStore('APIキーが設定されていないため、提案を取得できません。');
      setDiscoveryLoadingStore(false);
      return;
    }
    
    try {
      if (!demoMode && !trackApiCall()) {
        setDiscoveryErrorStore('API使用制限に達しています。');
        setDiscoveryLoadingStore(false);
        return;
      }
      
      const suggestions = await getDiscoverySuggestions(effectiveApiKey, demoMode);
      if (suggestions.length === 0) {
        setDiscoveryErrorStore("AIから有効な提案を取得できませんでした。");
      }
      setDiscoverySuggestionsStore(suggestions);
    } catch (err) {
      const appError = handleError(err, '提案の読み込み中にエラーが発生しました');
      setDiscoveryErrorStore(appError.message);
      setDiscoverySuggestionsStore([]);
    } finally {
      setDiscoveryLoadingStore(false);
    }
  }, [
    useDemoData,
    effectiveApiKey,
    trackApiCall,
    setDiscoveryLoadingStore,
    setDiscoveryErrorStore,
    setDiscoverySuggestionsStore,
    handleError,
  ]);
  
  // APIキー変更時の処理
  useEffect(() => {
    if (isApiKeyConfigured && useDemoData) {
      setUseDemoDataStore(false);
      fetchDiscoverySuggestions(true);
    } else if (!isApiKeyConfigured && !useDemoData) {
      setUseDemoDataStore(true);
      fetchDiscoverySuggestions(false);
    }
  }, [isApiKeyConfigured, useDemoData, setUseDemoDataStore, fetchDiscoverySuggestions]);
  
  // 初回読み込み
  useEffect(() => {
    if (isApiKeyConfigured || useDemoData) {
      fetchDiscoverySuggestions();
    }
  }, [isApiKeyConfigured, useDemoData]); // fetchDiscoverySuggestionsは依存配列に含めない
  
  // デモモード切り替え
  const onToggleDemoData = useCallback(() => {
    if (!isApiKeyConfigured) {
      return;
    }
    const newState = !useDemoData;
    setUseDemoDataStore(newState);
    fetchDiscoverySuggestions(!newState);
  }, [isApiKeyConfigured, useDemoData, setUseDemoDataStore, fetchDiscoverySuggestions]);
  
  // レスポンシブサイドバー
  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    const handleMediaQueryChange = () => setSidebarOpenStore(mediaQuery.matches);
    handleMediaQueryChange();
    mediaQuery.addEventListener('change', handleMediaQueryChange);
    return () => mediaQuery.removeEventListener('change', handleMediaQueryChange);
  }, [setSidebarOpenStore]);
  
  return {
    useDemoData,
    isApiKeyConfigured,
    userApiKey,
    effectiveApiKey,
    isSidebarOpen,
    isHowItWorksModalOpen,
    initialModalTab,
    discoverySuggestions,
    usage,
    limits,
    isLimitReached,
    resetUsage,
    isDiscoveryLoading,
    discoveryError,
    setUserApiKey,
    clearUserApiKey,
    onToggleDemoData,
    onToggleSidebar: toggleSidebarStore,
    handleOpenHowItWorksModal: openHowItWorksModalStore,
    handleCloseHowItWorksModal: closeHowItWorksModalStore,
    fetchDiscoverySuggestions,
  };
};

