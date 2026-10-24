const STORAGE_SHIM = `<script>
const __createPreviewStorage = () => {
  const values = new Map();
  return {
    get length() {
      return values.size;
    },
    clear() {
      values.clear();
    },
    getItem(key) {
      const normalizedKey = String(key);
      return values.has(normalizedKey) ? values.get(normalizedKey) : null;
    },
    key(index) {
      return Array.from(values.keys())[index] ?? null;
    },
    removeItem(key) {
      values.delete(String(key));
    },
    setItem(key, value) {
      values.set(String(key), String(value));
    },
  };
};

window.__previewLocalStorage = __createPreviewStorage();
window.__previewSessionStorage = __createPreviewStorage();

try {
  Object.defineProperty(window, 'localStorage', { value: window.__previewLocalStorage });
} catch {}

try {
  Object.defineProperty(window, 'sessionStorage', { value: window.__previewSessionStorage });
} catch {}

const localStorage = window.__previewLocalStorage;
const sessionStorage = window.__previewSessionStorage;
</script>`;

export const preparePreviewHtml = (html) => {
  const compatibleHtml = html
    .replace(/\b(?:window|globalThis|self)\.localStorage\b/g, 'window.__previewLocalStorage')
    .replace(/\b(?:window|globalThis|self)\.sessionStorage\b/g, 'window.__previewSessionStorage');

  if (/<head(?:\s[^>]*)?>/i.test(compatibleHtml)) {
    return compatibleHtml.replace(/<head(?:\s[^>]*)?>/i, (head) => `${head}${STORAGE_SHIM}`);
  }

  if (/<html(?:\s[^>]*)?>/i.test(compatibleHtml)) {
    return compatibleHtml.replace(
      /<html(?:\s[^>]*)?>/i,
      (htmlTag) => `${htmlTag}<head>${STORAGE_SHIM}</head>`,
    );
  }

  return `${STORAGE_SHIM}${compatibleHtml}`;
};
