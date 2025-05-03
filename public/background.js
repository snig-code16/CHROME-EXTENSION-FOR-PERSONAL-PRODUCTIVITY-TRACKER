
// Background script for FlowState extension
let sessionStart = Date.now();
let currentDomain = null;
let trackingData = {};

console.log('FlowState background service worker loaded');

// Initialize data from storage
chrome.storage.local.get(['flowstate-tracking-data'], function(result) {
  if (result['flowstate-tracking-data']) {
    trackingData = result['flowstate-tracking-data'];
  }
  
  // Initialize today's data if not present
  const today = new Date().toISOString().split('T')[0];
  if (!trackingData[today]) {
    trackingData[today] = {
      domains: {},
      productiveMinutes: 0,
      distractingMinutes: 0,
      neutralMinutes: 0,
      tasksCompleted: 0,
    };
    
    // Save the initialized data
    chrome.storage.local.set({'flowstate-tracking-data': trackingData});
  }
});

// Helper to categorize domains
function getDomainCategory(domain) {
  // These categories would ideally be user-configurable
  const productiveDomains = ['github.com', 'stackoverflow.com', 'docs.google.com', 'notion.so', 'linear.app', 
                            'trello.com', 'asana.com', 'figma.com', 'slack.com', 'meet.google.com',
                            'zoom.us', 'miro.com', 'jira.com', 'atlassian.com', 'google.com/docs'];
                            
  const distractingDomains = ['youtube.com', 'facebook.com', 'twitter.com', 'instagram.com', 'reddit.com', 
                              'tiktok.com', 'netflix.com', 'twitch.tv', 'amazon.com', 'ebay.com',
                              'pinterest.com', 'buzzfeed.com', 'tumblr.com', 'discord.com'];
  
  if (productiveDomains.some(d => domain.includes(d))) {
    return 'productive';
  } else if (distractingDomains.some(d => domain.includes(d))) {
    return 'distracting';
  } else {
    return 'neutral';
  }
}

// Track active tab changes
chrome.tabs.onActivated.addListener(function(activeInfo) {
  chrome.tabs.get(activeInfo.tabId, function(tab) {
    if (tab && tab.url) {
      try {
        handleDomainChange(new URL(tab.url).hostname);
      } catch (e) {
        console.error('Error processing URL:', e);
      }
    }
  });
});

// Track URL changes in the same tab
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete' && tab.url) {
    try {
      handleDomainChange(new URL(tab.url).hostname);
    } catch (e) {
      console.error('Error processing URL:', e);
    }
  }
});

// Listen for when browser becomes active/idle
chrome.idle.onStateChanged.addListener(function(state) {
  if (state === 'active') {
    // Resume tracking
    sessionStart = Date.now();
    
    // Get current tab to start tracking
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (tabs[0]?.url) {
        try {
          currentDomain = new URL(tabs[0].url).hostname;
          sessionStart = Date.now();
        } catch (e) {
          console.error('Error processing URL:', e);
        }
      }
    });
  } else {
    // User is idle or locked, stop tracking current session
    if (currentDomain) {
      recordTimeSpent(currentDomain);
      currentDomain = null;
    }
  }
});

function handleDomainChange(newDomain) {
  // Record time spent on the previous domain
  if (currentDomain) {
    recordTimeSpent(currentDomain);
  }
  
  // Update the current domain and start time
  currentDomain = newDomain;
  sessionStart = Date.now();
  
  console.log(`Now tracking: ${currentDomain}`);
}

function recordTimeSpent(domain) {
  const timeSpent = Math.round((Date.now() - sessionStart) / 1000 / 60); // in minutes
  
  // Only record if at least 5 seconds have passed
  if (timeSpent < 0.1) return;
  
  const today = new Date().toISOString().split('T')[0];
  const category = getDomainCategory(domain);
  
  // Initialize domain data if needed
  if (!trackingData[today]) {
    trackingData[today] = {
      domains: {},
      productiveMinutes: 0,
      distractingMinutes: 0,
      neutralMinutes: 0,
      tasksCompleted: 0,
    };
  }
  
  if (!trackingData[today].domains[domain]) {
    trackingData[today].domains[domain] = {
      timeSpent: 0,
      category
    };
  }
  
  // Update time spent
  trackingData[today].domains[domain].timeSpent += timeSpent;
  
  // Update category totals
  trackingData[today][`${category}Minutes`] += timeSpent;
  
  // Save to storage
  chrome.storage.local.set({'flowstate-tracking-data': trackingData}, function() {
    console.log(`Recorded ${timeSpent} minutes for ${domain} (${category})`);
  });
}

// Handle messages from content scripts or popup
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  console.log('Message received:', message);
  
  if (message.action === 'getTrackingData') {
    sendResponse({ trackingData });
  } 
  else if (message.action === 'taskCompleted') {
    const today = new Date().toISOString().split('T')[0];
    if (trackingData[today]) {
      trackingData[today].tasksCompleted += 1;
      chrome.storage.local.set({'flowstate-tracking-data': trackingData});
    }
    sendResponse({ success: true });
  }
  else if (message.action === 'trackWebsite') {
    const { domain, timeSpent, category } = message.data;
    const today = new Date().toISOString().split('T')[0];
    
    if (!trackingData[today]) {
      trackingData[today] = {
        domains: {},
        productiveMinutes: 0,
        distractingMinutes: 0,
        neutralMinutes: 0,
        tasksCompleted: 0,
      };
    }
    
    if (!trackingData[today].domains[domain]) {
      trackingData[today].domains[domain] = {
        timeSpent: 0,
        category
      };
    }
    
    trackingData[today].domains[domain].timeSpent += timeSpent;
    trackingData[today][`${category}Minutes`] += timeSpent;
    
    chrome.storage.local.set({'flowstate-tracking-data': trackingData});
    sendResponse({ success: true });
  }
  else if (message.action === 'updateProductivity') {
    const today = new Date().toISOString().split('T')[0];
    
    if (!trackingData[today]) {
      trackingData[today] = {
        domains: {},
        productiveMinutes: 0,
        distractingMinutes: 0,
        neutralMinutes: 0,
        tasksCompleted: 0,
      };
    }
    
    // Update with new values
    Object.entries(message.data).forEach(([key, value]) => {
      trackingData[today][key] = (trackingData[today][key] || 0) + value;
    });
    
    chrome.storage.local.set({'flowstate-tracking-data': trackingData});
    sendResponse({ success: true });
  }
  
  return true; // Keep the message channel open for async response
});

// Set up an interval to periodically save current session
setInterval(function() {
  if (currentDomain) {
    recordTimeSpent(currentDomain);
    sessionStart = Date.now(); // Reset session start to avoid double counting
  }
}, 60000); // Every minute

