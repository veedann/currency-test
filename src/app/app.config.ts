import { environment } from '../environments/environment';
import { Configuration, ConfigurationParameters } from '../libs/api/v2';

export function apiConfigFactory(): Configuration {
  const params: ConfigurationParameters = {
    basePath: environment.basePath,
    apiKeys: {
      APIKeyQueryParam: environment.accessKey,
    },
  };
  return new Configuration(params);
}
