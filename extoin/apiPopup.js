
export async function excelSetting(params) {
    let storedata = {
        isSetup: false,
        isSync: false
    }
    await chrome.storage.local.get(['checkedState'], (res) => {
        if (Object.keys(res) == "checkedState") {
            storedata.isSetup = res.checkedState.isSetup
            storedata.isSync = res.checkedState.isSync
            update_excel_setting(storedata)
            return
        }
        update_excel_setting(storedata)
    })

}

export async function update_excel_setting(storedata) {
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

excelSetting()



chrome.runtime.onMessage.addListener(async function (request) {
    if (request.action === 'update_excel_seting') {
        let set_input_fild = document.getElementById("set_input_fild")
        let syncId = document.getElementById("sync_data")
        await chrome.storage.local.get('pageData', (res) => {
            if (res.pageData) {
                let isavlable = false
                res.pageData.forEach(data => {
                    if (data.hostname === request.hostname) {
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
        // add tab name and url
        const inputbtn = document.createElement("input")
        inputbtn.setAttribute("type", "checkbox")
        inputbtn.setAttribute("id", request.id)
        inputbtn.setAttribute("class", "checkbox")
        let li = document.querySelectorAll("li")
        const winlist = document.getElementById("windowslist")

        let isPersent = false
        li.forEach((li) => {
            if (li.firstChild.innerHTML === request.hostname) {
                isPersent = true
            }
        })
        if (!isPersent) {
            const li = document.createElement("li")
            li.style.display = "flex"
            li.style.justifyContent = "space-between"
            const div = document.createElement("div")
            div.innerHTML = request.hostname
            li.appendChild(div)
            li.appendChild(inputbtn)
            winlist.appendChild(li)
        }

        // remove tab name and url if not have in chrome tab
        chrome.windows.getAll({ populate: true }, (windows) => {
            li.forEach((li_item) => {
                let ismatch = false
                windows[0].tabs.forEach((tab) => {
                    const url = new URL(tab.url);
                    if (url.hostname.includes(".")) {
                        if (li_item.firstChild.innerHTML === url.hostname) {
                            ismatch = true
                        }
                    }
                })
                if (!ismatch) {
                    li_item.remove()
                }
            })
        })

    }
})


export function sidebar() {
    let sideBar = document.getElementById("sideBar")
    let sidebarBtn = document.getElementById("windowslist")
    sideBar.addEventListener("click", () => {
        if (sidebarBtn.style.display === "none") {
            sidebarBtn.style.display = "block"
        } else {
            sidebarBtn.style.display = "none"
        }
    })
}
sidebar()