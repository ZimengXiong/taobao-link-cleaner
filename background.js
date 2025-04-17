// Listen for the command
chrome.commands.onCommand.addListener(async (command) => {
  console.log(`Command "${command}" triggered`);
  if (command === 'extract-taobao-link') {
    const tabs = await chrome.tabs.query({active: true, currentWindow: true});
    const tab = tabs && tabs.length > 0 ? tabs[0] : null;
    if (!tab || !tab.url) return;
    const url = new URL(tab.url);
    if (url.hostname.endsWith('taobao.com') && url.pathname.startsWith('/item.')) {
      const id = url.searchParams.get('id');
      if (id) {
        const cleanUrl = `https://item.taobao.com/item.html?id=${id}`;
        console.log('Clean Taobao link:', cleanUrl);
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
