// components/SignalErrorBoundary.tsx
'use client';
import { Component, ReactNode } from 'react';
import { Token } from '../lib/interface';

interface State {
  hasError: boolean;
}

interface Props {
  children: ReactNode;
}

export class SignalErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="border rounded-lg p-4 bg-red-50 text-red-800">
          <h3 className="font-bold">Signal Error</h3>
          <p>Couldn't load signal data</p>
        </div>
      );
    }

    return this.props.children;
  }
}