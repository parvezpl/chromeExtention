const relationtitle = ["पिता", "पुत्र", "पुत्री", " सी/ओ", "पति", "पत्नी", "पत्नी", "माता",
    "बेटा", "बेटी", "पति", "पत्नी", "बेटी", "C/O", "D/O",
    "S/O", "W/O", "H/O", "C/O", "D/O", "S/O"];

export async function excelmanager(params) {
    document.addEventListener("DOMContentLoaded", () => {
        document.getElementById("fileInput").addEventListener("change", function (event) {
            let file = event.target.files[0];
            if (!file) return;
            let reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onload = async function (e) {
                let data = new Uint8Array(e.target.result);
                let workbook = XLSX.read(data, { type: "array" });
                let sheetName = workbook.SheetNames[0]; // Get first sheet
                let sheet = workbook.Sheets[sheetName];

                let rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
                try {
                    await chrome.storage.local.set({ "exceldata": rows })
                } catch (error) {
                    throw error
                }
                displayTable(rows);
            };
        });
    })
}
let data = { delete: "delete" }
function displayTable(rows) {
    let tableHead = document.querySelector("#dataTable thead");
    let tableBody = document.querySelector("#dataTable tbody");
    tableHead.innerHTML = "";
    tableBody.innerHTML = "";
    if (rows?.length === 0) return;
    // Create table header
    let headerRow = document.createElement("tr");
    headerRow.style.background = "#0e1d33"
    rows[0]?.forEach((header, id) => {
        let th = document.createElement("th");
        // th.style.display="flex"
        th.style.minWidth = "45px"

        let thdiv = document.createElement("div")
        thdiv.style.display = "flex"
        thdiv.style.justifyContent = "center"
        thdiv.className = "setting"

        let levl = document.createElement("label")
        levl.setAttribute("for", id)

        let icondiv = document.createElement("div")
        icondiv.style.cursor = "pointer"
        icondiv.id = id
        icondiv.className = "icondiv"

        let icon = document.createElement("i")
        icon.className = "fa fa-cog"
        icon.style.marginLeft = "5px"
        icon.style.color = "white"
        // icon.style.cursor="pointer"
        icon.id = id
        icondiv.appendChild(icon)


        let checkbox_head = document.createElement("input")
        checkbox_head.type = "checkbox"
        checkbox_head.id = id
        checkbox_head.className = "head_checkbox"
        checkbox_head.style.display = "none"
        levl.textContent = header;
        thdiv.appendChild(levl)
        thdiv.appendChild(checkbox_head);
        thdiv.appendChild(icondiv)
        th.appendChild(thdiv)
        headerRow.appendChild(th);

        checkbox_head.addEventListener("change", async (e) => {
            // chrome.storage.local.get(['setHeaderIsChecked'], async (res) => {
            //     if (!res.setHeaderIsChecked) {
            //         res.setHeaderIsChecked = {}
            //     }
            //     res.setHeaderIsChecked[id] = checkbox_head.checked
            //     await chrome.storage.local.set({ "setHeaderIsChecked": res.setHeaderIsChecked })
            // })
            // chrome.storage.local.set({ "setHeaderIsChecked": { [id]: checkbox_head.checked } })
            if (!checkbox_head.checked) {
                await chrome.storage.local.get(['setXlHeader'], async (res) => {
                    delete res.setXlHeader[id]
                    await chrome.storage.local.set({ "setXlHeader": res.setXlHeader })
                })
                return
            }
            // get
            getInputNameForInputbox(id)
        })
    });

    chrome.storage.local.set({ "setXlHeader": data })
    tableHead.appendChild(headerRow);


    for (let i = 1; i <= rows.length; i++) {
        let tr = document.createElement("tr");
        tr.style.cursor = "pointer";

        // this will be send row 4 data only
        rows[i]?.forEach((cell, idex) => {

            tr.setAttribute("id", "row" + rows[i][0]);

            if (idex === 0 || idex === 1 || idex === 3) {
            }
            let td = document.createElement("td");
            td.textContent = cell;
            tr.appendChild(td);
        });
        tableBody.appendChild(tr);

        // row data send at click 
        tr.addEventListener("click", function (event) {
            let cellData = {}
            document.querySelectorAll(".head_checkbox").forEach((checkbox_head_item) => {
                if (checkbox_head_item.checked) {
                    let cell = rows[i][Number(checkbox_head_item.id)]
                    const tabIdsList = getActiveWinData()
                    try {
                        Object.keys(data).forEach((key) => {
                            if (Number(key) === Number(checkbox_head_item.id)) {
                                chrome.storage.local.get('excelHeaderSettingData', (res) => {
                                    if (res.excelHeaderSettingData) {
                                        res.excelHeaderSettingData?.forEach((header) => {
                                            if (Number(checkbox_head_item.id) === Number(header.id)) { // prevent only selected cell interaction
                                                if (header.issplit) {
                                                    if (relationtitle.includes(header.splitby)) {
                                                        relationtitle.forEach((title) => {
                                                            if (cell.includes(title)) {
                                                                let item = cell.split(title)
                                                                data[key].forEach((itemName, indexid) => {
                                                                    cellData[itemName] = item[indexid]
                                                                })
                                                            }
                                                        })
                                                    } else {
                                                        let item = cell.split(header.splitby)
                                                        data[key].forEach((itemName, indexid) => {
                                                            cellData[itemName] = item[indexid]
                                                        })
                                                    }
                                                }
                                                if (header.issplit === false) {
                                                    cellData[data[key]] = cell
                                                }
                                            }
                                        })
                                    } else {
                                        chrome.storage.local.set({ excelHeaderSettingData: [] })
                                    }
                                })
                            }
                        })

                        // define to which one data sent to background .............
                        // check which head checked for send data 
                        let collectdata = []
                        chrome.storage.local.get("setXlHeader", (res) => {
                            Object.keys(res.setXlHeader).forEach((key) => {
                                if (Number(key)) {
                                    collectdata.push(rows[i][Number(key)])
                                }
                            })
                            // if setting for only first word filter sentent 
                            const firstword= document.getElementById("firstWord")
                            if (firstword.checked) {
                                Object.keys(cellData).forEach(key=>{
                                    cellData[key]=cellData[key].trim().split(" ")[0]
                                })
                            }

                            chrome.runtime.sendMessage({ engen: "ExeelRowsData", data: collectdata, tabIds: tabIdsList, cellData });
                            tr.style.backgroundColor = "#195127";
                            tr.style.color = "white"

                        })
                    } catch (error) {
                        console.log(error);
                    }
                }
            })
            cellData = {}
        });
    }
}

excelmanager()

async function getInputNameForInputbox(id) {
    const associatedLabel = document.querySelector(`label[for="${id}"]`);
    if (associatedLabel) {
        let values = associatedLabel.textContent
        await chrome.storage.local.get(['excelHeaderSettingData'], async (res) => {
            if (res.excelHeaderSettingData) {
                res.excelHeaderSettingData.forEach(async (header) => {
                    if (Number(header.id) === Number(id)) {

                        if (header.issplit) {
                            let headersname = []
                            await chrome.storage.local.get(['setXlHeader'], async (res) => {
                                for (let index = 1; index < 3; index++) {
                                    headersname.push(values + index)
                                }
                                res.setXlHeader[id] = headersname
                                data = res.setXlHeader
                                await chrome.storage.local.set({ "setXlHeader": res.setXlHeader })
   
                            })
                        } else {
                            await chrome.storage.local.get(['setXlHeader'], async (res) => {
                                res.setXlHeader[id] = values
                                data = res.setXlHeader
                                chrome.storage.local.set({ "setXlHeader": res.setXlHeader })

                            })

                        }
                    }
                })
            }
        })

    }

}


try {
    await chrome.storage.local.get(["exceldata"], (res) => {
        if (res.exceldata) {
            displayTable(res.exceldata)
        }
    })
} catch (error) {
    throw error
}


const winlist = document.getElementById("windowslist")

function getAllWindowsData(params) {
    chrome.windows.getAll({ populate: true }, (windows) => {
        windows.forEach((win) => {
            win.tabs.forEach((tab) => {
                if (tab.url) {
                    try {
                        const url = new URL(tab.url);
                        const inputbtn = document.createElement("input")
                        inputbtn.setAttribute("type", "checkbox")
                        inputbtn.setAttribute("id", tab.id)
                        inputbtn.setAttribute("class", "checkbox")
                        inputbtn.addEventListener("change", function () {
                            chrome.runtime.sendMessage({
                                engen: "excelmanagerWindowData",
                                isChecked: this.checked,
                                tabId: tab.id,
                                hostname: url.hostname
                            });
                        })

                        if (url.hostname !== "newtab" && url.hostname.includes(".")) {
                            const li = document.createElement("li")
                            li.style.display = "flex"
                            li.style.justifyContent = "space-between"
                            const div = document.createElement("div")
                            div.innerHTML = url.hostname
                            li.appendChild(div)
                            li.appendChild(inputbtn)
                            winlist.appendChild(li)
                        }

                    } catch (e) {
                        console.log(`    Tab ID: ${tab.id}, Unable to parse URL`);
                    }
                } else {
                    console.log(`    Tab ID: ${tab.id}, No URL`);
                }
            });
        });
    });
}

getAllWindowsData()

function getActiveWinData() {
    const activeWinList = []
    document.querySelectorAll(".checkbox").forEach((checkbox) => {
        if (checkbox.checked) {
            activeWinList.push(Number(checkbox.id))
            chrome.storage.local.set({ checkedwind: activeWinList })
        }
    })
    return activeWinList
}


export function setHeadInputButton(params) {
    let inputButton = document.getElementById('inputButton')
    let isInputValueSetup = false
    inputButton.addEventListener('click', function () {
        let head_checkbox = document.querySelectorAll(".head_checkbox")
        let windowsIdList = getActiveWinData()
        if (inputButton.innerHTML === "Enable") {
            inputButton.innerHTML = "Disable"
            isInputValueSetup = true
            head_checkbox.forEach((resin) => {
                resin.style.display = "table-row"
                // chrome.storage.local.get("setHeaderIsChecked", (res) => {
                //     if (res.setHeaderIsChecked) {
                //         resin.checked = res.setHeaderIsChecked[resin.id]
                //         if (resin.checked) {
                //             getInputNameForInputbox(resin.id)
                //         }
                //     } else {
                //         resin.checked = false
                //     }
                // })

            })
            chrome.storage.local.set({ "isInputValueSetup": true })
        } else {
            inputButton.innerHTML = "Enable"
            isInputValueSetup = false
            head_checkbox.forEach((resin) => {
                resin.style.display = "none"

            })
            chrome.storage.local.set({ "isInputValueSetup": false })
        }

        windowsIdList.forEach((id) => {
            chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
                await chrome.tabs.sendMessage(id, { action: 'excel_head_value_input_setup', isInputValueSetup });
            });
        })
    });
}
setHeadInputButton()