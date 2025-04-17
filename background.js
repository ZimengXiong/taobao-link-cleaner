// Listen for the command
chrome.commands.onCommand.addListener(async (command) => {
  console.log(`Command "${command}" triggered`);
  if (command === 'extract-taobao-link') {
    const tabs = await chrome.tabs.query({active: true, currentWindow: true});
    const tab = tabs && tabs.length > 0 ? tabs[0] : null;
    if (!tab || !tab.url) return;
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
        console.log('Clean item link:', cleanUrl);
        await chrome.scripting.executeScript({
          target: {tabId: tab.id},
          func: (text) => {
            navigator.clipboard.writeText(text);
          },
          args: [cleanUrl]
        });
      }
    }
  }
});
