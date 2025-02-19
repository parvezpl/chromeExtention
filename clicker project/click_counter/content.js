//inject div in body 
const hostname = window.location.hostname;
console.log(hostname)

function elementsfun() {
  const div = document.createElement("div");
  div.id = "myInjectedDiv";
  div.style.position = "fixed";
  div.style.textAlign = "center";
  div.style.bottom = "10px";
  div.style.right = "10px";
  div.style.backgroundColor = "black";
  div.style.color = "white";
  div.style.padding = "10px";
  div.style.borderRadius = "5px";
  div.style.zIndex = "9999";

  const div1 = document.createElement("div");
  div1.id = "myInjectedDiv1";
  div1.textContent = "clicker";
  const btn = document.createElement("button");
  btn.id = "myInjectedDiv2";
  btn.textContent = "start";
  div.appendChild(div1)
  div.appendChild(btn)
  return document.body.appendChild(div)
}

if (hostname==='heliustime.onrender.com') {
  elementsfun()
}

// inject div function and action ........ 
const myInjectedDiv1 = document.getElementById("myInjectedDiv2");
myInjectedDiv1.addEventListener("click", ()=>{
  chrome.runtime.sendMessage({ action: "pupstart", action2:"start" })
  
})

let status1= false

document.onreadystatechange = function () {
  if (document.readyState === "complete") {
    status1=true
    console.log("Page has finished rendering.");
  }
};




// document.addEventListener("visibilitychange", () => {
//   if (document.visibilityState === "visible") {

//     chrome.runtime.onMessage.addListener((message, sender, sendResponse)=>{
//       if (message.action === "chake"){
//         console.log("click back on tabs")
//         sendResponse({reply:"click response"})
//       }
//     })
//   }
// });



function getXPath(element) {
  if (element.id) {
    // If the element has an ID, use it
    return `//*[@id="${element.id}"]`;
  }
  if (element === document.body) {
    // If the element is the body, return /html/body
    return "/html/body";
  }

  let index = 0;
  const siblings = element.parentNode.childNodes;

  // Count the index of the element among its siblings
  for (let i = 0; i < siblings.length; i++) {
    const sibling = siblings[i];
    if (sibling === element) {
      return (
        getXPath(element.parentNode) +
        "/" +
        element.tagName.toLowerCase() +
        `[${index + 1}]`
      );
    }
    if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {
      index++;
    }
  }
}



function insertTextAtXPath(xpath, newText) {
  let targetElement = getElementByXPath(xpath);

  if (targetElement) {
    console.log("Found element at XPath:", newText);

    // Modify the text content
    targetElement.innerHTML = newText;

  } else {
    console.warn("XPath element not found:", xpath);
  }
}

// Function to get an element by XPath
function getElementByXPath(xpath) {
  let result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
  return result.singleNodeValue;
}



// autoclick on given xpath ....................
 function autockick (message, sender, sendResponse){
  
  if (message.action === "backstart" ) {
    const targetXPath = '//*[@id="root"]/div[1]/a'
    if (true) {
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
        console.log("Element clicked!");

        // inject in mainpage ............
        const xpath = '//*[@id="root"]/div[2]/div/div[1]/div/div[1]/span[2]'
        insertTextAtXPath(xpath, message?.text);

        // send sms for countine click ............
        sendMessageAfterRender();
        // chrome.runtime.sendMessage({ action: "pupstart" })
        sendResponse({ reply: 1 });
      } else {
        console.log("Element not found.");
      }
    }
  }
}


async function waitForPageRender() {
  return new Promise((resolve) => {
    if (document.readyState === "complete") {
      resolve();
    } else {
      window.addEventListener("load", resolve);
    }
  });
}

async function sendMessageAfterRender() {
  await waitForPageRender();
  console.log("Page has finished rendering.");

  try {
    // Send message to background.js
    const response = await chrome.runtime.sendMessage({ action: "pupstart", action2:"start" })
    console.log("Response from background.js:", response);
  } catch (error) {
    console.error("Error sending message:", error);
  }
}


// recive sms ......... back and pupup
chrome.runtime.onMessage.addListener( async (message, sender, sendResponse) => {
  autockick(message, sender, sendResponse)
  
});


// other tab funck
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    console.log("work........")
    // chrome.runtime.onMessage.addListener((message, sender, sendResponse)=>{
    //   autockick(message, sender, sendResponse)
    // })
  }
});
