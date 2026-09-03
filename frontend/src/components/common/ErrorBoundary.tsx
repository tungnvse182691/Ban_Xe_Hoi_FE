import { Component, type ReactNode } from 'react';
import { Button, Result } from 'antd';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' };

  static getDerivedStateFromError(err: unknown): State {
    return { hasError: true, message: err instanceof Error ? err.message : 'Có lỗi xảy ra' };
  }

  componentDidCatch(err: unknown) {
    console.error('[ErrorBoundary]', err);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Result
          status="500"
          title="Có lỗi xảy ra"
          subTitle={this.state.message}
          extra={
            <Button type="primary" onClick={() => window.location.reload()}>
              Tải lại trang
            </Button>
          }
        />
      );
    }
    return this.props.children;
  }
}
