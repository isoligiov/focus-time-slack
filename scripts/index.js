const PROJECT_NAME = 'Calendly'
const SENSITIVE_CHANNELS = [
]

let previousState = {};

(async () => {
  while(true) {
    try {
      const currentState = {}
      const chatItems = document.querySelectorAll("div.c-virtual_list__scroll_container > div.p-channel_sidebar__static_list__item div.p-channel_sidebar__channel--unread")
      for(let chatItem of chatItems) {
        const dataItemKey = chatItem.getAttribute('data-item-key')
        if(dataItemKey === 'pagesListSpacer' ||
          dataItemKey.endsWith('-huddles') ||
          dataItemKey.startsWith('sectionHeading-')
        ) {
          continue
        }
          
        try {
          const header = chatItem.querySelector('.p-channel-sidebar__name').textContent
          const badgeElement = chatItem.querySelector('.p-channel-sidebar__badge').textContent
          let badge = null
          if(badgeElement) badge = badgeElement.textContent
          else if(SENSITIVE_CHANNELS.includes(header)) badge = 'channel'
          if(badge)
            currentState[header] = { badge }
        } catch(err) {}
      }
      let text = ''
      for(let header in currentState) {
        if(currentState[header].badge !== previousState[header].badge) {
          text += `*${header} @ ${PROJECT_NAME}* sent ${badge} message on Slack\n`
        }
      }
      if(text.length > 0) {
        await chrome.runtime.sendMessage({
          message_type: 'sendUpdate',
          text,
        })
      }
      previousState = currentState
    } catch(err) {
    }
    await sleep(1000)
  }
})()