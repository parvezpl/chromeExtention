let excelHeaderSettingData = [
    {
        "id": '',
        "headername": "",
        "issplit": true,
        "splitby": " "
    },
]
const relationtitle = ["पिता", "पुत्र", "पुत्री", " सी/ओ", "पति", "पत्नी", "पत्नी", "माता",
    "बेटा", "बेटी", "पति", "पत्नी", "बेटी", "C/O", "D/O",
    "S/O", "W/O", "H/O", "C/O", "D/O", "S/O"];

document.addEventListener('click', function (e) {
    let settingElement = document.querySelector(".settinbox")
    if (e.target.closest('.icondiv')) {
        let id = e.target.closest('.icondiv').querySelector("[id]").id
        let headername = e.target.parentElement.parentElement.textContent
        selectOptionFuc(id, headername)
    }
    if (!e.target.closest(".settinbox")) {
        settingElement.style.display = "none"
    }
});

function selectOptionFuc(id, headername) {
    let settingElement = document.querySelector(".settinbox")
    chrome.storage.local.get("exceldata", (res) => {
        let cellvalue = res.exceldata[1][Number(id)].split(" ")
        let selectElemnt = document.getElementById("cell")
        let alloption = document.querySelectorAll(".option")
        //remove all option ............. 
        alloption.forEach(opt => {
            if (opt.value !== "none") {
                opt.remove(0)
            }
        })

        cellvalue.forEach(val => {
            let optionElemnet = document.createElement("option")
            optionElemnet.value = val
            optionElemnet.className = "option"
            optionElemnet.textContent = val
            selectElemnt.appendChild(optionElemnet)
        })

        chrome.storage.local.get("excelHeaderSettingData", (res) => {
            if (res.excelHeaderSettingData) {
                let updateExlheaderSettingData = res.excelHeaderSettingData
                let isvalue = false
                res.excelHeaderSettingData.forEach(data => {
                    if (data.id === id) {
                        selectElemnt.value = data.splitby
                        isvalue = true
                    }
                })

                if (!isvalue) {
                    updateExlheaderSettingData.push({ id: id, headername: headername, splitby: selectElemnt.value })
                    chrome.storage.local.set({ excelHeaderSettingData: updateExlheaderSettingData })
                }
                settingElement.style.display = "block"
            } else {
                settingElement.style.display = "block"
                chrome.storage.local.set({ excelHeaderSettingData: [{ id: id, headername: headername, splitby: selectElemnt.value, issplit: false }] })
            }
        })

        selectElemnt.addEventListener("change", () => {
            chrome.storage.local.get("excelHeaderSettingData", (res) => {
                let isvalue = false
                console.log(res.excelHeaderSettingData)
                if (res.excelHeaderSettingData) {
                    let updateExlheaderSettingData = res.excelHeaderSettingData.map((data) => {
                        if (selectElemnt.value !== "none") {
                            return data.id === id ? { ...data, splitby: selectElemnt.value, issplit: true } : data
                        } else {
                            return data.id === id ? { ...data, splitby: selectElemnt.value, issplit: false } : data
                        }
                    }
                    )
                    console.log(updateExlheaderSettingData)
                    chrome.storage.local.set({ excelHeaderSettingData: updateExlheaderSettingData })
                }
            })
        })

    })
}