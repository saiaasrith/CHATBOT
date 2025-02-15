export function seo(data = {}) {
  data.title = data.title || 'Chat with Strangers Online';
  data.metaDescription = data.metaDescription || 'Talk to random people around the world. Chat with strangers live, get connected, and create engaging communications.';

  document.title = data.title;
  document.querySelector('meta[name="description"]').setAttribute('content', data.metaDescription);
}
