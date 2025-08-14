import React from 'react';
import { Slot } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export const unstable_settings = {
  initialRouteName: "(signUp)/index", // 수정된 경로
};

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Slot /> {/* 여기는 그대로 두세요! */}
    </QueryClientProvider>
  );
}
