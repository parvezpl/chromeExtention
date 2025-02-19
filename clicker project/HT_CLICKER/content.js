
document.onreadystatechange = function () {
  if (document.readyState === "complete") {
    console.log("Page has finished rendering.");
    chrome.runtime.sendMessage({ isEngen: "render", isRender: true })
  }
};



mainfunction()
// for tabs set windows............
function mainfunction(params) {
  elementsfun()
  clickerdisplaybtn()
  chrome.runtime.onMessage.addListener((message) => {
    console.log(message)
    ckickerdisplays(message)
    if (message.data.isSwitch) {
      if (true) {
        if (message.setWindow === "background") {
          hostname = window.location.hostname;
          chrome.runtime.sendMessage({ isEngen: "setWindow", hostname: hostname, isSwitch:message.data.isSwitch })
        }


        if (message.background === "background") {
          if (message.data.isStart && message.data.count.last <= 5000) {
            if (message.data.setValue === 0) {
              // onclicklocation()
              
              // location.reload()
              // send for count 
              if (onclicklocation()) {
                chrome.runtime.sendMessage({ isEngen: "counter", num: 1, data:message.data })
              }
            }

            if (message.data.setValue > 1) {
              // onclicklocation()
              // location.reload()
              // send for count 
              if (onclicklocation()) {
                chrome.runtime.sendMessage({ isEngen: "counter", num: 1, data:message.data })
                
              }
            }
          }
        }

      }
    }
  })
}


function ckickerdisplays(message) {
  console.log(message)
  const ckickerdisplays = document.getElementById("myInjectedDiv");
  const clicker = document.getElementById("clicker");
  if (message.data.isSwitch) {
    ckickerdisplays.style.display = "block"
    clicker.textContent=message.data.count.total
  }
  if (!message.data.isSwitch) {
    ckickerdisplays.style.display = "none"
  }
}




// inject action button  function and action ........ 
function clickerdisplaybtn() {
  const start = document.getElementById("myInjectedDiv2");
  const stops = document.getElementById("stops");

  start.addEventListener("click", () => {
    const hostname = window.location.hostname;
    chrome.runtime.sendMessage({ isEngen: "start", hostname: hostname, isStart: true })
  })

  stops.addEventListener("click", () => {
    const hostname = window.location.hostname;
    chrome.runtime.sendMessage({ isEngen: "stop", hostname: hostname, isStart: false })
  })

}





function onclicklocation(params) {
  // console.log("onclick")
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
    // sendsms("background")
    // chrome.runtime.sendMessage({ isEngen: "render", isRender: true })

  }
});



// butoon inject in web page..............

function elementsfun() {
  const divfst = document.createElement("div");
  divfst.id = "myInjectedDiv";
  divfst.style.display = "none"
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
  div1.textContent = 0
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


