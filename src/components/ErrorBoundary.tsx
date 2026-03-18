import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import ErrorBox from "./ErrorBox";


/**
 * ErrorBoundary – catches render errors in child components.
 * - Renders a fallback UI instead of breaking the app.
 * - Logs errors to console (can extend to backend).
 */
export type ErrorBoundaryProps = {
  children: ReactNode;
  fallback?: ReactNode;
};


export type ErrorBoundaryState = {
  hasError: boolean;
  error?: Error;
};


export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }


  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }


  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
    // TODO: send to monitoring service
  }


  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return <ErrorBox message={this.state.error?.message || "Something went wrong."} />;
    }
    return this.props.children;
  }
}