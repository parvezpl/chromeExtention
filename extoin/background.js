let pageData = []

// here we are receiving the message 
let hostname
chrome.tabs.onActivated.addListener(activeInfo => {
    chrome.tabs.get(activeInfo.tabId, async function (tab) {
        if (tab.url) {
            hostname = new URL(tab.url).hostname;
            try {
                await chrome.storage.local.get('pageData', async (res) => {
                    pageData = res.pageData || []
                })
                await chrome.runtime.sendMessage({ action: "update_excel_seting", hostname, id: tab.id })
            } catch (error) {
                null
            }
        }
    });
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status === "loading") {
        hostname = new URL(tab.url).hostname;
        try {
            await chrome.storage.local.get('pageData', async (res) => {
                pageData = res.pageData || []
            })
            await chrome.runtime.sendMessage({ action: "update_excel_seting", hostname, id: tab.id })
        } catch (error) {
            null
        }
    }
});



let nameData = {
    AplicantName: "",
    fatherName: "",
    thana: "",
    element_id: "",
    // isSync: false
}

let setTabid = true
let targetTabId = 0

const fatherTitle = ["पिता", "पुत्र", "पुत्री", " सी/ओ", "पति", "पत्नी", "पत्नी", "माता",
    "बेटा", "बेटी", "पति", "पत्नी", "बेटी", "C/O", "D/O",
    "S/O", "W/O", "H/O", "C/O", "D/O", "S/O"];

const sirName = ["मोहम्मद", "श्री", "स्वर्गीय", "स्व0", "मु0"]

let windowsId = [];
chrome.runtime.onMessage.addListener(function (request) {
    newWindows(request)
    // if (request.engen === "ExeelRowsData") {
    //     let dataArray = request.data;
    //     fatherTitle.forEach(title => {
    //         if (dataArray[3].includes(title)) {
    //             const accusName = String(dataArray[3].split(title)[1].trim().split(" ")[0]);
    //             const accusfater = String(dataArray[3].split(title)[0].split(" ")[0]);
    //             if (sirName.includes(accusName)) {
    //                 nameData.fatherName = String(dataArray[3].split(title)[1].trim().split(" ")[1])
    //                 if (sirName.includes(accusfater)) {
    //                     nameData.AplicantName = String(dataArray[3].split(title)[0].split(" ")[1]);
    //                     return
    //                 }
    //                 return
    //             }

    //             nameData.fatherName = accusName
    //             nameData.AplicantName = accusfater
    //             nameData.thana = dataArray[1];
    //         }
    //     });
    //     sendSmsFunction("content", nameData, request)
    // }

    if (request.engen === "ExeelRowsData") {
        // console.log(request)
        sendSmsFunction("ExeelRowsData", null, request)
    }

    if (request.engen === "excelmanagerWindowData") {
        if (request.isChecked) {
            windowsId.push({ tabid: request.tabId, hostname: request.hostname })
        } else {
            windowsId = windowsId.filter(id => id.tabid !== request.tabId)
        }
    }

    if (request.engen === "for_win_conection") {
        syncSender(request)

        // chrome.storage.local.get("setInputData", (res) => {
        //     if (res.setInputData) {
        //         res.setInputData.forEach((element) => {
        //             element.path.forEach(pat=>{
        //                 if (pat.type === request.data.placeholder) {
        //                     syncSender(request)
        //                 }
        //             })
        //         })
        //     }
        // })


        // pageData.forEach(object => {
        //     if (object.hostname === request.data.hostname) {
        //         if (object.isSync) {
        //             // nameData.AplicantName = request.data.accname
        //             // nameData.element_id = request.data.element_id
        //             syncSender(request)
        //         }
        //     }
        // })
    }


    // exel apge
    if (request.engen === "excel_setting") {
        store_excel_setting(request)
    }

});



function sendSmsFunction(isEngen, nameData = null, request = null) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (isEngen === "content") {
            request.tabIds.forEach(id => {
                chrome.tabs.sendMessage(Number(id), { isEngen: "datasender", data: nameData, windowsId })
            })
        }
        if (isEngen === "ExeelRowsData") {
            chrome.storage.local.get("setInputData",  (res) => {
                request.tabIds.forEach( async id => {
                    await chrome.tabs.sendMessage(Number(id), { isEngen: "ExeelRowsData", cellData: request.cellData, setInputData: res.setInputData })
                })
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
                width: 900,
                height: 500,
                focused: true
            },
        );
    }
}




async function syncSender(request) {
    await chrome.storage.local.get("setInputData", (res) => {
        if (res.setInputData) {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                windowsId?.forEach(async id => {
                    res.setInputData.forEach((element) => {
                        if (id.hostname === element.hostname) {
                            element.path.forEach(async path => {
                                if (path.type === request.data.placeholder) {

                                    await chrome.tabs.sendMessage(Number(id.tabid), { isEngen: "syncHendler", data: request.data, path: path.xpath })
                                }
                            })
                        }

                    })
                })
            })
        }
    })

}




async function store_excel_setting(request) {
    await chrome.storage.local.get('pageData', async (res) => {
        if (Object.keys(res)[0] === "pageData") {
            pageData = res.pageData
            let isavlable = false
            pageData.forEach(data => {
                if (data.hostname === hostname) {
                    data.isSetup = request.storedata.isSetup
                    data.isSync = request.storedata.isSync
                    isavlable = true
                    return
                }
            })
            if (!isavlable) {
                pageData.push({ hostname: hostname, ...request.storedata })
            }
        }
        if (!pageData.length) {
            pageData.push({ hostname: hostname, ...request.storedata })
        }
        await chrome.storage.local.set({ pageData })
    })
}


