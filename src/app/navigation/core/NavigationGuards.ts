import { NavigationGuardResult } from './NavigationTypes';

export type RouteGuard<TContext = unknown> = (
  context: TContext
) => NavigationGuardResult;

export function evaluateGuard<TContext>(
  guard: RouteGuard<TContext>,
  context: TContext
): NavigationGuardResult {
  return guard(context);
}

export const allowAllGuard: RouteGuard = () => ({ canNavigate: true });
