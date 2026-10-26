import { LinkingOptions } from '@react-navigation/native';

export function createLinkingConfig<ParamList extends object>(
  prefixes: string[],
  config: LinkingOptions<ParamList>['config']
): LinkingOptions<ParamList> {
  return {
    prefixes,
    config,
  };
}
