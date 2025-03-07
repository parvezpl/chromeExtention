
export async function excelSetting(params) {
    let storedata = {
        isSetup: false,
        isSync: false
    }
    await chrome.storage.local.get(['checkedState'], (res) => {
        console.log(Object.keys(res))
        if (Object.keys(res) == "checkedState") {
            // console.log(Object.keys(res))
            storedata.isSetup = res.checkedState.isSetup
            storedata.isSync = res.checkedState.isSync
            let set_input_fild = document.getElementById("set_input_fild")
            set_input_fild.checked = storedata.isSetup
            set_input_fild.addEventListener("change", async () => {
                storedata.isSetup = set_input_fild.checked
                await chrome.storage.local.set({ "checkedState": storedata })
                await chrome.runtime.sendMessage({ engen: "excel_setting", storedata })
            })

            let syncId = document.getElementById("sync_data")
            syncId.checked = storedata.isSync
            syncId.addEventListener("change", async () => {
                storedata.isSync = syncId.checked
                await chrome.storage.local.set({ "checkedState": storedata })
                await chrome.runtime.sendMessage({ engen: "excel_setting", storedata })
            })
        }

    })
}

excelSetting()


chrome.runtime.onMessage.addListener(async function (request) {
    if (request.action==='update_excel_seting') {
        console.log("page change", request)
        let set_input_fild = document.getElementById("set_input_fild")
        let syncId = document.getElementById("sync_data")
        await chrome.storage.local.get('pageData', (res) => {
            if (res.pageData) {
                console.log(res.pageData)
                let isavlable = false
                res.pageData.forEach(data => {
                    if (data.hostname===request.hostname) {
                        set_input_fild.checked = data.isSetup
                        syncId.checked = data.isSync
                        isavlable = true
                    }
                })
                if (!isavlable) {
                    set_input_fild.checked = false
                        syncId.checked = false
                   
                }
            }
        })
    }
})