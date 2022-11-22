chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: 'OFF',
  });
});

const allowedSites = ['https://app.betrybe.com'];

chrome.action.onClicked.addListener(async (tab) => {
  if (allowedSites.some((site) => tab.url.startsWith(site))) {
    // Retrieve the action badge to check if the extension is 'ON' or 'OFF'
    const prevState = await chrome.action.getBadgeText({ tabId: tab.id });

    // Next state will always be the opposite
    const nextState = prevState === 'ON' ? 'OFF' : 'ON';

    // Set the action badge to the next state
    await chrome.action.setBadgeText({
      tabId: tab.id,
      text: nextState,
    });

    chrome.storage.local.set({ darkModeState: nextState });

    if (nextState === 'ON') {
      // Insert the CSS file when the user turns the extension on
      await chrome.scripting.insertCSS({
        files: ['darkMode.css'],
        target: { tabId: tab.id },
      });
    } else if (nextState === 'OFF') {
      // Remove the CSS file when the user turns the extension off
      await chrome.scripting.removeCSS({
        files: ['darkMode.css'],
        target: { tabId: tab.id },
      });
    }
  }
});

chrome.webNavigation.onCommitted.addListener(async (tab) => {
  if (allowedSites.some((site) => tab.url.startsWith(site))) {
    chrome.storage.local.get(
      ['darkModeState'],
      async function ({ darkModeState }) {
        // Set the action badge to the next state
        await chrome.action.setBadgeText({
          tabId: tab.id,
          text: darkModeState,
        });

        console.log(tab);

        if (darkModeState === 'ON') {
          // Insert the CSS file when the user turns the extension on
          await chrome.scripting.insertCSS({
            files: ['darkMode.css'],
            target: { tabId: tab.tabId },
          });
        } else if (darkModeState === 'OFF') {
          // Remove the CSS file when the user turns the extension off
          await chrome.scripting.removeCSS({
            files: ['darkMode.css'],
            target: { tabId: tab.tabId },
          });
        }
      },
    );
  }
});
