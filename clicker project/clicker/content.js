
// .........................

let ab=false
async function getData() {
  let result = await chrome.storage.local.get(["data"]);
  console.log("Data retrieved:", result);
  return result;
}

async function main() {
  let data = await getData(); // Waits until getData() completes
  console.log("Next line after getData:", data);
}


console.log("heloo", ab)
main();
console.log("heloo222", ab)

// const hostname = window.location.hostname;
// console.log(hostname1)

let hostname

let switchStatus

// for tabs set windows............
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('1', message)
  if (message.setWindow === "background") {
    switchStatus = message.switchStatus
    hostname = window.location.hostname;
    console.log(switchStatus, "status")
    const ckickerdisplays = document.getElementById("myInjectedDiv");
    if (switchStatus) {
      ckickerdisplays.style.display = "block"
    }
    if (!switchStatus) {
      console.log("else")
      ckickerdisplays.style.display = "none"
    }

    sendResponse({ hostname: hostname, switchStatus: switchStatus })
  }

  if (message.background === "background") {
    clicker.textContent = message.data.count.total
    const states = onclicklocation()
    console.log("enter", states)
    if (states) {
      sendResponse({ num: 1 })
    }
    if (!states) {
      sendResponse({ num: 0 })

    }
  }

})



chrome.storage.local.get("currentTab", (res) => {
  recvSms()
  if (!res.currentTab) {
    chrome.storage.local.set({ currentTab: { hostname: "", switchStatus: false } })
  }
  if (res.currentTab) {
    elementsfun()
    clickerdisplaybtn()
    if (!res.currentTab.switchStatus) {
      // recvSms()
      const ckickerdisplays = document.getElementById("myInjectedDiv");
      chrome.storage.local.get("currentTab", (ress) => {
        console.log(ress.currentTab.switchStatus)
        if (!ress.currentTab.switchStatus) {
          ckickerdisplays.style.display = "none"
        }
      })
    }
  }

})





// .....................


// inject action button  function and action ........ 
function clickerdisplaybtn(params) {
  const start = document.getElementById("myInjectedDiv2");
  const stops = document.getElementById("stops");
  start.addEventListener("click", () => {
    const hostname = window.location.hostname;
    runStatus = true
    chrome.runtime.sendMessage({ content: "content", start: "start", hostname: hostname })
    console.log("send to start and started", hostname)
  })


  stops.addEventListener("click", () => {
    const hostname = window.location.hostname;
    console.log("stop")
    chrome.runtime.sendMessage({ content: "content", stop: "stop", hostname: hostname })

  })

}


document.onreadystatechange = function () {
  if (document.readyState === "complete") {
    console.log("Page has finished rendering.");
    sendsms("background")
    const clicker = document.getElementById("clicker");
    chrome.storage.local.get("data", (res) => {
      console.log(res.data.count.last)
      if (clicker) {
        clicker.textContent = res.data.count.last

      }
    })
  }
};





function sendsms(sendto) {
  if (sendto == "background") {
    chrome.runtime.sendMessage({ content: "content", hostname: hostname, isrender: true })
  }
}




function recvSms() {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(message)
    let clicker = document.getElementById("clicker");
    if (message.background === "background") {
      clicker.textContent = message.data.count.total
      const states = onclicklocation()
      console.log("enter", states)
      sendResponse({ reply: 'backgroun sms recv in content', num: 4 })
      if (states) {
      }
    }
  })
}



function onclicklocation(params) {
  console.log("onclick")
  const targetXPath = '//button[@name="policesearchbtn"]'
  const element = document.evaluate(
    targetXPath,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;
  // If the element is found, trigger a click event
  if (element) {
    element.click();
    console.log("Element clicked!", element);
    return true
  } else {
    console.log("Element not found.", element);
    return false
  }

}


document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    console.log("work........")
    sendsms("background")

  }
});



// butoon inject in web page..............

function elementsfun() {
  const divfst = document.createElement("div");
  divfst.id = "myInjectedDiv";
  divfst.style.position = "fixed";
  divfst.style.bottom = "10px";
  divfst.style.right = "10px";
  divfst.style.backgroundColor = "black";
  divfst.style.color = "white";
  divfst.style.padding = "10px";
  divfst.style.borderRadius = "5px";
  divfst.style.width = "214px"
  divfst.style.zIndex = "9999";


  const div = document.createElement("div");
  div.style.display = "flex";
  div.style.textAlign = "center";
  div.style.gap = "4px"

  const div1 = document.createElement("div");
  div1.id = "clicker";
  div1.textContent = "clicker";
  div1.style.padding = "10px";
  div1.style.width = "72px"

  const btn = document.createElement("button");
  btn.id = "myInjectedDiv2";
  btn.textContent = "start";
  btn.style.display = "block";
  btn.style.width = "71px"

  const stop = document.createElement("button");
  stop.id = "stops";
  stop.textContent = "stop";
  stop.style.display = "block";
  stop.style.width = "71px"


  const newdiv = divfst.appendChild(div)
  newdiv.appendChild(div1)
  newdiv.appendChild(btn)
  newdiv.appendChild(stop)
  document.body.appendChild(divfst)
}


