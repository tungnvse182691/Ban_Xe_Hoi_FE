import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { router } from '@/routes';
import ErrorBoundary from '@/components/common/ErrorBoundary';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#1677ff',
              borderRadius: 8,
            },
          }}
        >
          <ErrorBoundary>
            <RouterProvider router={router} />
          </ErrorBoundary>
          <Toaster position="top-right" />
        </ConfigProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}
