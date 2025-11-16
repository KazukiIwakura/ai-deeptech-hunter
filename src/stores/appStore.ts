import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { GoogleGenAI } from '@google/genai';
import { GoogleGenAI as GoogleGenAIClass } from '@google/genai';

/**
 * アプリケーション全体の状態管理ストア
 * Zustandを使用して状態管理を簡素化
 */

interface AppShellState {
  // API Key Management
  userApiKey: string | null;
  effectiveApiKey: string | null;
  isApiKeyConfigured: boolean;
  
  // Demo Mode
  useDemoData: boolean;
  
  // UI State
  isSidebarOpen: boolean;
  isHowItWorksModalOpen: boolean;
  initialModalTab: 'flow' | 'model' | 'api_key';
  
  // Discovery Suggestions
  discoverySuggestions: string[];
  isDiscoveryLoading: boolean;
  discoveryError: string | null;
  
  // Actions
  setUserApiKey: (key: string) => boolean;
  clearUserApiKey: () => void;
  setUseDemoData: (value: boolean) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  openHowItWorksModal: (tab?: 'flow' | 'model' | 'api_key') => void;
  closeHowItWorksModal: () => void;
  setDiscoverySuggestions: (suggestions: string[]) => void;
  setDiscoveryLoading: (loading: boolean) => void;
  setDiscoveryError: (error: string | null) => void;
}

/**
 * アプリケーションシェル状態ストア
 */
export const useAppShellStore = create<AppShellState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial State
        userApiKey: null,
        effectiveApiKey: null,
        isApiKeyConfigured: false,
        useDemoData: true,
        isSidebarOpen: true,
        isHowItWorksModalOpen: false,
        initialModalTab: 'flow',
        discoverySuggestions: [],
        isDiscoveryLoading: true,
        discoveryError: null,
        
        // Actions
        setUserApiKey: (key: string) => {
          if (!key || !key.trim()) return false;
          
          const trimmedKey = key.trim();
          // APIキー形式の簡易検証
          if (!trimmedKey.startsWith('AIza') || trimmedKey.length !== 39) {
            return false;
          }
          
          set({ 
            userApiKey: trimmedKey,
            effectiveApiKey: trimmedKey,
            isApiKeyConfigured: true,
            useDemoData: false,
          });
          return true;
        },
        
        clearUserApiKey: () => {
          set({
            userApiKey: null,
            effectiveApiKey: null,
            isApiKeyConfigured: false,
            useDemoData: true,
          });
        },
        
        setUseDemoData: (value: boolean) => {
          if (!get().isApiKeyConfigured && !value) {
            // APIキーがない場合はデモモードを強制
            return;
          }
          set({ useDemoData: value });
        },
        
        toggleSidebar: () => {
          set((state) => ({ isSidebarOpen: !state.isSidebarOpen }));
        },
        
        setSidebarOpen: (open: boolean) => {
          set({ isSidebarOpen: open });
        },
        
        openHowItWorksModal: (tab = 'flow') => {
          set({
            isHowItWorksModalOpen: true,
            initialModalTab: tab,
          });
        },
        
        closeHowItWorksModal: () => {
          set({ isHowItWorksModalOpen: false });
        },
        
        setDiscoverySuggestions: (suggestions: string[]) => {
          set({ discoverySuggestions: suggestions });
        },
        
        setDiscoveryLoading: (loading: boolean) => {
          set({ isDiscoveryLoading: loading });
        },
        
        setDiscoveryError: (error: string | null) => {
          set({ discoveryError: error });
        },
      }),
      {
        name: 'app-shell-storage',
        partialize: (state) => ({
          userApiKey: state.userApiKey,
          useDemoData: state.useDemoData,
          isSidebarOpen: state.isSidebarOpen,
        }),
      }
    ),
    { name: 'AppShellStore' }
  )
);

/**
 * AI Clientを生成するセレクター
 */
export const useAiClient = () => {
  const effectiveApiKey = useAppShellStore((state) => state.effectiveApiKey);
  
  if (!effectiveApiKey) {
    return null;
  }
  
  return new GoogleGenAIClass({ apiKey: effectiveApiKey });
};

/**
 * メディアクエリに基づいてサイドバーの開閉を管理
 */
export const useResponsiveSidebar = () => {
  const setSidebarOpen = useAppShellStore((state) => state.setSidebarOpen);
  
  // このフックはコンポーネント内で使用する必要があるため、
  // useEffectはコンポーネント側で実装
  return { setSidebarOpen };
};

