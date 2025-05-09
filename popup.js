const status = document.createElement('div');
status.id = 'copy-status';
status.style.color = '#388e3c';
status.style.fontWeight = 'bold';
status.style.marginBottom = '10px';
document.getElementById('copy-link-btn').before(status);

async function handleCopyClick() {
  const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
  if (!tab || !tab.url) {
    status.textContent = 'No active tab or URL found.';
    status.style.color = '#c62828';
    return;
  }
  try {
    const url = new URL(tab.url);
    if (
      (url.hostname.endsWith('taobao.com') && url.pathname.startsWith('/item.')) ||
      (url.hostname.endsWith('tmall.com') && url.pathname === '/item.htm')
    ) {
      const id = url.searchParams.get('id');
      if (id) {
        let cleanUrl;
        if (url.hostname.endsWith('taobao.com')) {
          cleanUrl = `https://item.taobao.com/item.html?id=${id}`;
        } else if (url.hostname.endsWith('tmall.com')) {
          cleanUrl = `https://detail.tmall.com/item.htm?id=${id}`;
        }
        await navigator.clipboard.writeText(cleanUrl);
        status.textContent = 'Copied!';
        status.style.color = '#388e3c';
      } else {
        status.textContent = 'No item id found in the URL.';
        status.style.color = '#c62828';
      }
    } else {
      status.textContent = 'This is not a Taobao or Tmall item page.';
      status.style.color = '#c62828';
    }
  } catch (e) {
    status.textContent = 'Invalid URL.';
    status.style.color = '#c62828';
  }
}

document.getElementById('copy-link-btn').addEventListener('click', handleCopyClick);