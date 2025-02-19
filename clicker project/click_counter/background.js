console.log('background')



// creaate new windows..................

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "openPopup") {
        chrome.windows.create(
            {
                url: "popup.html", // URL of the page to open
                type: "popup", // Open as a popup window
                width: 400,
                height: 300,
                focused: true // Ensure the popup is focused initially
            },
            (createdWindow) => {
                console.log("Popup window created:", createdWindow);
                sendResponse({ status: "Popup created" });
            }
        );
        return true; // Indicates asynchronous response
    }
});



// auto click start logic..................

let totalcount = 0
let remainCount = 0
let setCountValue = 0
let lastcount = 0
let startclick = true

// set value for all
chrome.storage.local.get("totalcount", (result) => {
    if (!result.totalcount) {
        chrome.storage.local.set({ totalcount: 0 })
    }
    lastcount = Number(result.totalcount)
    remainCount = 5000 - Number(result.totalcount)
    setCountValue = 5000 - remainCount
});

// start program here
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "stop" || setCountValue === totalcount) {
        startclick = false
    }
    if (message.action2 === "start") {
        startclick = true
    }

    if (message.action === "pupstart" && startclick === true && (lastcount + totalcount) <= 1000) {
        //sent sms to conect.js ............
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
            //send for content
            chrome.tabs.sendMessage(tabs[0].id, { action: "backstart", text: totalcount }, (response) => {
                totalcount = totalcount + response.reply
                chrome.storage.local.get("totalcount", (result) => {
                    chrome.storage.local.set({ totalcount: Number(result.totalcount) + response.reply })
                });
                remainCount =5000- (lastcount + totalcount)
                // send for popup
                chrome.runtime.sendMessage({ action: "backdata", text: totalcount, remainCount: remainCount })
                sendResponse({reply:"ok"})
            })
        })
    }

    // set count value from popop
    if (message.action === "sendCountValue") {
        setCountValue = Number(message.countvalue)
    }

    // rest all.........
    if (message.action === "restall") {
        totalcount = 0
        remainCount = 0
        setCountValue = 0
        startclick = false
    }
    return true
});



// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     if (message.action === "pupstart") {
//         console.log("Message received from popup.js:", message.payload);

//         // Forward the message to the active tab's content script
//         chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//             console.log("tab:", tabs)
//             if (tabs[0]?.id) {
//                 chrome.tabs.sendMessage(
//                     tabs[0].id,
//                     { action: "backstart", payload: message.payload },
//                     // respone from content.js
//                     (response) => {
//                         console.log("Response from content.js:", response);
//                         totalcount = totalcount + Number(response?.reply)

//                         // send data to popup for shwoing
//                         chrome.tabs.sendMessage({ action: "bachtopup", totalcount: totalcount }, (res) => {
//                             console.log(res)
//                         })
//                         sendResponse({ status: "Message forwarded to content.js" });
//                     }
//                 );
//             }
//         });

//         // Required to indicate the response will be sent asynchronously
//         return true;
//     }
// });


// this is test ............... aria...........

//   chrome.runtime.onMessage.addListener((message, sender, sendResponse)=>{
//     console.log(message)
//     // chrome.runtime.sendMessage({action:"backhit"})
//     chrome.tabs.query({active:true,currentWindow:true}, (tabs)=>{
//         console.log()
//         chrome.tabs.sendMessage(tabs[0].id, {action:"bachclick on tabs" })
//     })
//   })