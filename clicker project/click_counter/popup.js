// for new windows creating 
document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("btn");
  button.addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "openPopup" }, (response) => {
    })
  });
});


// for set counter numbers
let num = 0
document.addEventListener("DOMContentLoaded", () => {
  const minus = document.getElementById("minus");
  const plus = document.getElementById("plus");
  const set = document.getElementById("set");
  const rest = document.getElementById("rest");
  const setdesplay = document.getElementById("setdesplay");
  const setnum = document.getElementById("setnum");
  const lastcount = document.getElementById("lastcount");
  chrome.storage.local.get("totalcount", (result) => {
    lastcount.innerHTML=result.totalcount
  });
  // add or decreac value num 
  plus.addEventListener('click', (event) => {
    event.preventDefault()
    num = num + 1
    if (num <= 5000) {
      setnum.value = num
    }
  })
  minus.addEventListener('click', (event) => {
    event.preventDefault()
    num = num - 1
    if (num >= 0) {
      setnum.value = num
    }
  })

  //set the num for auto click 
  set.addEventListener('click', () => {
    const val = Number(setnum.value)
    if (val >= 0 & val <= 5000) {
      setdesplay.innerHTML = setnum.value + "  :  time set auto click"
      chrome.runtime.sendMessage({ action: "sendCountValue", countvalue:val })
      
    }
  })

  // rest section 
  rest.addEventListener('click', () => {
    setnum.value = null
    const countbox = document.getElementById("countbox");
    const remainbox = document.getElementById("remainbox");
      countbox.innerHTML = 0
      remainbox.innerHTML=0
      chrome.runtime.sendMessage({ action: "restall" })
      chrome.storage.local.set({ totalcount:  0 })
  })

  // s tart click section ............

  const start = document.getElementById("start");
  const stop = document.getElementById("stop");
  start.addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "pupstart", action2:"start" })
  });
  stop.addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "stop" })
  });
});


// receive sms 
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "bachtopup") {
    document.addEventListener("DOMContentLoaded", () => {
      const countbox = document.getElementById("countbox");
      countbox.innerHTML = message.totalcount
    })
  }

  if (message.action==='backdata') {
    const countbox = document.getElementById("countbox");
    const remainbox = document.getElementById("remainbox");
      countbox.innerHTML = message.text
      remainbox.innerHTML=message.remainCount
  }
  return true
})


