import { environment } from '../environments/environment';
import { Configuration } from '../libs/api/v2';
import { apiConfigFactory } from './app.config';

describe('apiConfigFactory', () => {
  it('should create a Configuration instance with the correct parameters', () => {
    const config = apiConfigFactory();
    expect(config).toBeInstanceOf(Configuration);
    expect(config.basePath).toBe(environment.basePath);
    expect(config.apiKeys).toEqual({ APIKeyQueryParam: environment.accessKey });
  });
});
