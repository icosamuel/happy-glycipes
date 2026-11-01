export default function(config) {
  config.addPassthroughCopy({'src/assets': 'assets'});
  config.addWatchTarget('content/');
  return {dir: {input: 'src', output: '_site'}, templateFormats: ['11ty.js'], pathPrefix: '/happy-glycipes/'};
}
