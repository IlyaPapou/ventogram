import {
  SENTRY_DSN,
  SENTRY_ORG,
  SENTRY_PROJECT,
  SENTRY_AUTH_TOKEN,
  // eslint-disable-next-line import/no-unresolved
} from '@env';

const sentryConfig = {
  dsn: SENTRY_DSN,
  organization: SENTRY_ORG,
  project: SENTRY_PROJECT,
  authToken: SENTRY_AUTH_TOKEN,
};

Object.freeze(sentryConfig);

export default sentryConfig;
