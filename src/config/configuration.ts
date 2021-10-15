export default () => ({
  port:
    process.env.NODE_ENV === 'production'
      ? 3333
      : process.env.NODE_ENV === 'staging'
      ? 3334
      : process.env.NODE_ENV === 'local'
      ? 3335
      : null,
  aws: {
    region: 'eu-central-1',
    bucketName: {
      fine:
        process.env.NODE_ENV === 'production'
          ? 'production-images-fine'
          : 'development-images-fine',
      decent:
        process.env.NODE_ENV === 'production'
          ? 'production-images-decent'
          : 'development-images-decent',
      poor:
        process.env.NODE_ENV === 'production'
          ? 'production-images-poor'
          : 'development-images-poor',
    },
  },
});
