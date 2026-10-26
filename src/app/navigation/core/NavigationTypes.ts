import React from 'react';

export type ScreenDescriptor<ParamList extends Record<string, object | undefined>, RouteName extends keyof ParamList> = {
  name: RouteName;
  component: React.ComponentType<{ route: { params: ParamList[RouteName] }; navigation: unknown }>;
  options?: Record<string, unknown>;
  guard?: (context: unknown) => boolean;
};

export type TabDescriptor = {
  key: string;
  name: string;
  label: string;
  icon: (focused: boolean) => React.ReactNode;
};

export type NavigationGuardResult = {
  canNavigate: boolean;
  redirectTo?: string;
  redirectParams?: Record<string, unknown>;
};
