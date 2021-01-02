import {
  SENTRY_DSN,
  // eslint-disable-next-line import/no-unresolved
} from '@env';

const sentryConfig = {
  dsn: SENTRY_DSN,
};

Object.freeze(sentryConfig);

export default sentryConfig;
