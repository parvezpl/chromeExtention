
const data = {
    hostname: 'yes',
    runStatus: false,
    count: {
        total: 0,
        remain: 0,
        last: 0
    }
}

if (!data) {
    chrome.storage.local.set({ data:  data })
}


chrome.storage.local.get("data", (res)=>{
    data.count.last=res.data.count.last
})

chrome.storage.local.get("currentTab", (res)=>{
    data.hostname=res.currentTab.hostname
})

// const displayStatus = {
//     start: "block",
//     stops: "none"
// }


// chrome.storage.local.get("displayStatus", (res) => {
//     if (!res) {
//         chrome.storage.local.set({ displayStatus: displayStatus })
//     }
//     displayStatus.start = res.displayStatus.stops
//     displayStatus.stops = res.displayStatus.start
// })




// chake funciton 
function validationFunction(hostname, runStatus) {
    if (data.hostname === hostname && runStatus === true) {
        return true
    }

    return false
}



// main fuction ...


function countfunction(params) {

}



let recvCount = 0


function mainclicker(){
    sendSmsFunction("content")

}


let setTabid= true
let setcount=0
chrome.runtime.onMessage.addListener((message) => {

    if (message.content === "content") {
        console.log(message)
        if (message.start==='start') {
            data.runStatus = true
            setTabid=true
        }
        if (message.stop==='stop') {
            data.runStatus=false
        }
        
        if (message.hostname===data.hostname) {
            if (data.runStatus && data.count.last<=5000) {
                if (0===setcount || 1<setcount) {
                    mainclicker()
                }
                
            }
        }
    }

    if (message.popup === "popup") {
        setcount=Number(message.setcount)
    }

    if (message.setWindow === "popup") {
        console.log("popup")
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { setWindow:"background", switchStatus:message.switchStatus}, (res)=>{
                chrome.storage.local.set({ currentTab: { hostname: res.hostname, switchStatus: res.switchStatus } })
                console.log(res.hostname)
            })
        })
    }
})




let targetTabId=0
function sendSmsFunction(sendto) {
    if (sendto === "content") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            // console.log("setTabid", setTabid, targetTabId)
            if (setTabid) {
                targetTabId=tabs[0].id
            }
            chrome.tabs.sendMessage(targetTabId, { background: "background", data: data }, (response) => {
                console.log("response", response)
                if (response.num) {
                    recvCount=recvCount+response?.num
                    if (setcount) {
                        setcount=setcount-response?.num
                    }
                    data.count.total=recvCount
                    data.count.last=data.count.last+response?.num
                    data.count.remain=5000-data.count.last
                    chrome.storage.local.set({ data:  data })
                }
                console.log("hello", recvCount)
            })
            setTabid=false

            // sms set to popup....
            chrome.runtime.sendMessage({ background: "background", data: data })

        })
    }
    if (sendto === "popup") {
        chrome.runtime.sendMessage({ background: "background", data: data })
    }

}



