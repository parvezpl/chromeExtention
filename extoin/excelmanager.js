export async function excelmanager(params) {
    document.addEventListener("DOMContentLoaded", () => {
        document.getElementById("fileInput").addEventListener("change", function (event) {
            let file = event.target.files[0];
            if (!file) return;
            let reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onload = function (e) {
                let data = new Uint8Array(e.target.result);
                let workbook = XLSX.read(data, { type: "array" });
                let sheetName = workbook.SheetNames[0]; // Get first sheet
                let sheet = workbook.Sheets[sheetName];

                let rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

                displayTable(rows);
            };
        });
    })

    function displayTable(rows) {
        // console.log(rows);
        let tableHead = document.querySelector("#dataTable thead");
        let tableBody = document.querySelector("#dataTable tbody");
        tableHead.innerHTML = "";
        tableBody.innerHTML = "";

        if (rows.length === 0) return;
        // Create table header
        let headerRow = document.createElement("tr");
        rows[0]?.forEach(header => {
            let th = document.createElement("th");
            th.textContent = header;
            headerRow.appendChild(th);
        });
        tableHead.appendChild(headerRow);

        // Create table body (top 10 rows)
        // for (let i = 1; i <= Math.min(10, rows.length - 1); i++) {
        for (let i = 1; i <= rows.length; i++) {
            let tr = document.createElement("tr");
            tr.style.cursor = "pointer";

            rows[i]?.forEach((cell, idex) => {

                tr.setAttribute("id", "row" + rows[i][0]);

                if (idex === 0 || idex === 1 || idex === 3) {
                }
                let td = document.createElement("td");
                td.textContent = cell;
                tr.appendChild(td);
            });
            tableBody.appendChild(tr);
            tr.addEventListener("click", function (event) {
                // console.log(rows[i]);
                const tabIdsList = getActiveWinData()
                try {
                    chrome.runtime.sendMessage({ engen: "excelmanager", data: rows[i], tabIds: tabIdsList });
                    tr.style.backgroundColor = "#195127";
                    tr.style.color="white"
                } catch (error) {
                    console.log(error);
                }
            });
        }
    }
}

excelmanager()


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
                            // console.log("checked", url.hostname, this.checked)
                            chrome.runtime.sendMessage({
                                engen: "excelmanagerWindowData",
                                isChecked: this.checked,
                                tabId: tab.id,
                                hostname: url.hostname
                            });
                        })
                        let syncId =document.getElementById("sync_data")
                        console.log(syncId)
                        syncId.addEventListener("change", ()=>{
                            console.log("check", syncId.checked)
                            chrome.runtime.sendMessage({engen:"sync", isSync: syncId.checked})
                        })

                        if (url.hostname !== "newtab" && url.hostname.includes(".")) {
                            const li = document.createElement("li")
                            li.innerHTML = url.hostname
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


