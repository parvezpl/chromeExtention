

// here we are receiving the message 
let nameData = {
    AplicantName: "",
    fatherName: "",
    thana: ""
}

let setTabid = true
let targetTabId = 0

const fatherTitle = ["पिता", "पुत्र", "पुत्री", " सी/ओ", "पति", "पत्नी", "पत्नी", "माता",
    "बेटा", "बेटी", "पति", "पत्नी", "बेटी", "C/O", "D/O",
    "S/O", "W/O", "H/O", "C/O", "D/O", "S/O"];


let windowsId = [];
chrome.runtime.onMessage.addListener(function (request) {
    newWindows(request)
    if (request.engen === "excelmanager") {
        dataArray = request.data;
        fatherTitle.forEach(title => {
            if (dataArray[3].includes(title)) {
                nameData.fatherName = String(dataArray[3].split(title)[1].trim().split(" ")[0]);;
                nameData.AplicantName = String(dataArray[3].split(title)[0].split(" ")[0]);
                nameData.thana = dataArray[1];
            }
        });
        sendSmsFunction("content", nameData, request)
    }

    
    if (request.engen === "excelmanagerWindowData") {
        // console.log(request)
        if (request.isChecked) {
            windowsId.push(request.tabId)
        } else {
            windowsId = windowsId.filter(id => id !== request.tabId)
        }
        console.log(windowsId)
    }
});



function sendSmsFunction(isEngen, nameData, request = null) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (isEngen === "content") {
            request.tabIds.forEach(id => {
                chrome.tabs.sendMessage(Number(id), { isEngen: "datasender", data: nameData })
            })
        }
    })
}




function newWindows(message) {
    if (message.action === "openPopup") {
        chrome.windows.create(
            {
                url: "newpopup.html",
                type: "popup",
                width: 400,
                height: 500,
                focused: true
            },
        );
    }
}



// if (setTabid) {
//     targetTabId = tabs[0].id
// }

// if (isEngen === "content") {
//     // console.log(targetTabId)
//     chrome.tabs.sendMessage(targetTabId, { isEngen: "datasender", data: nameData })
//     setTabid = false
// }

// setTabid = false





// windowsId.tabIds.forEach(id => {
//     chrome.tabs.sendMessage(id, { isEngen: "datasender", data: message })
// })
