
// initilizing ...........
const data = {
    hostname: 'yes',
    runStatus: false,
    isSwitch: false,
    isChecked: false,
    isStart: false,
    setValue: 0,
    count: {
        total: 0,
        remain: 0,
        last: 0
    }
}

if (!data) {
    chrome.storage.local.set({ data: data })
}
chrome.storage.local.get("data", (res) => {
    data.count.total = res.data.count.total
    data.count.remain = res.data.count.remain
    data.count.last = res.data.count.last
})


// receiver.............
let isChecked = false
let setTabid = true
let setcount = 0
let targetTabId = 0


chrome.runtime.onMessage.addListener((message) => {
    if (message.isEngen === "popup") {
        if (message.action === "stop") {
            data.isStart = false
        }
        if (message.action === "set") {
            console.log(message)
            data.setValue = message.setValue
        }
        if (message.action === "rest") {
            data.setValue = 0
            data.count.total=0
            
        }
        if (message.action === "hardrest") {
            data.setValue = 0
            data.count.total=0
            data.count.last=0
            data.hostname="nothing to set"
            targetTabId=0
            setTabid=true
            
        }
        if (message.action === "switch") {
            sendSmsFunction("popup", message)

        }

    }

    if (message.isEngen === "render") {

        sendSmsFunction("render", message)
    }

    if (message.isEngen === "setWindow") {
        data.isSwitch = message.isSwitch
        data.hostname = message.hostname
        chrome.storage.local.set({data:data})
    }
    if (message.isEngen === "start") {
        if (data.hostname = message.hostname) {
            sendSmsFunction("start", message)
        }
    }
    if (message.isEngen === "stop") {
        if (data.hostname = message.hostname) {
            sendSmsFunction("stop", message)
        }
    }
    if (message.isEngen === "counter") {
        data.count.total = data.count.total + message.num
        data.count.last = data.count.last + message.num
        data.count.remain = 5000 - data.count.last
        if (data.setValue > 0) {
            data.setValue = data.setValue - message.num
        }
        chrome.storage.local.set({ data: data })
        chrome.runtime.sendMessage({ isEngen: "counter", data: data })
    }

    if (data.isSwitch) {
        isChecked = message.isChecked
        if (isChecked) {
            if (message.isEngen === "content") {

                // count area........
                if (message.isStart && message.isRender) {

                }
                // automation fun
                if (message.isStart) {
                    let hostname
                    let last
                    chrome.storage.local.get("data", (res) => {
                        hostname = res.data.hostname
                        last = data.count.last
                    })

                    if (hostname === message.hostname) {
                        if (last <= 5000) {
                            sendSmsFunction('content')
                        }
                    }
                }

            }

        }
    }
})


function sendSmsFunction(isEngen, message) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {

        if (setTabid) {
            targetTabId = tabs[0].id
        }
        if (isEngen === "content") {
            chrome.tabs.sendMessage(targetTabId, { background: "background", data: data })
            setTabid = false

            // sms set to popup....
            // chrome.runtime.sendMessage({ background: "background", data: data })
        }

        if (isEngen === "render") {
            chrome.tabs.sendMessage(targetTabId, { background: "background", data: data })
            // chrome.runtime.sendMessage(targetTabId, { background: "background", isEngen:"render", data: data })
        }

        if (isEngen === "start") {
            setTabid = true
            data.isStart = message.isStart
            chrome.tabs.sendMessage(targetTabId, { background: "background", data: data })
        }
        if (isEngen === "stop") {
            data.isStart = message.isStart
            chrome.tabs.sendMessage(targetTabId, { background: "background", data: data })
        }


        if (isEngen === "popup") {
            if (message.action==='switch') {
                data.isSwitch = message.isSwitch
            }
            if (message.setWindow) {
                chrome.tabs.sendMessage(targetTabId, { setWindow: "background", background: "background", data: data })
            }
        }


        setTabid = false


    })


}






