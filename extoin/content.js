console.log("content.jss");


let input_ids = []
function getInputFild(params) {
    document.querySelectorAll('input[type="text"]:not([type="hidden"]').forEach((input) => {
        if (!input.value) {
            input.value = ""
            input_ids.push(input.id)
        }
    });
    return input_ids
}
getInputFild()

let submitbnt = []
document.querySelectorAll('input[type="submit"]').forEach((input) => {
    submitbnt.push(input.id)
});

function getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}


chrome.runtime.onMessage.addListener(function (request) {
    // console.log(request);
    if (request.isEngen === "datasender") {
        console.log("input id", input_ids)
        let namefild = document.getElementById(input_ids[0])
        let fatherNamefild = document.getElementById(input_ids[1])
        namefild.value = request.data.AplicantName
        fatherNamefild.value = request.data.fatherName
        let sumbbtn = document.getElementById(submitbnt[0])
        sumbbtn.click()
    }

    if (request.isEngen === "syncHendler") {
        console.log(request)
        const result = document.evaluate(request.path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
        let inputElement = result.singleNodeValue
        console.log("inputElement", inputElement)
        inputElement.value = request.data.accname
        // request.setInputData.forEach((res) => {
        //     res.path.forEach((path) => {
        //         if (path.type === request.data.placeholder) {
        //             const result = document.evaluate(path.xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
        //             let inputElement = result.singleNodeValue
        //             console.log("inputElement", inputElement, path.xpath)
        //             inputElement.value = request.data.accname
        //         }
        //     })
        //     // if (res.hostname === window.location.hostname) {
        //     //     let paths = res.path
        //     //     paths.forEach((path) => {
        //     //         if (path.type === request.data.placeholder) {
        //     //             let inputElement = getElementByXpath(path.xpath)
        //     //             inputElement.value = request.data.accname
        //     //         }
        //     //     })
        //     // }
        // })
    }

    if (request.action === "excel_head_value_input_setup") {
        console.log("hello", request)
        Set_value_for_input(request.isInputValueSetup)
    }

    if (request.isEngen === "ExeelRowsData") {
        let hostname = window.location.hostname
        request.setInputData.forEach((element) => {
            if (hostname === element.hostname) {
                let paths = element.path
                paths.forEach((path) => {
                    Object.keys(request.cellData).forEach((key) => {
                        if (key === path.type) {
                            let inputElement = getElementByXpath(path.xpath)
                            inputElement.value = request.cellData[key]
                        }
                    }
                    )
                })
            }
        })
    }

});

function getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}
let settimer;
const delay = 500;
document.addEventListener("click", (event) => {
    if (event.target.id) {
        // set input what us want to set for copy
        Set_value_for_input(Set_value_for_input_is_active)
        // console.log(Set_value_for_input_is_active)
        if (Set_value_for_input_is_active) {
            console.log("hello")
            // Set_value_for_input(Set_value_for_input_is_active)
        }

        let id = event.target.id
        let namefild = document.getElementById(id)
        // console.log(namefild)

        if (namefild) {
            namefild.addEventListener("input", async (event) => {
                let accname = event.target.value
                let hostname = window.location.hostname
                // console.log({ accname: accname, element_id: id, hostname, placeholder: event.target.placeholder })
                clearTimeout(settimer)
                settimer = setTimeout(() => {
                    chrome.runtime.sendMessage({ engen: "for_win_conection", data: { accname: accname, placeholder: event.target.placeholder } });
                }, delay)
            })
        }
    }
})


document.addEventListener("click", () => {
    const res = getTableColumn()
    if (res.class) {
        const table = document.querySelector(`.${res.class}`)
        const rows = table.querySelectorAll('tbody tr')
        let tableData = [];

        rows.forEach((row) => {
            let rowData = [];
            const columns = row.querySelectorAll('td, th')
            columns.forEach((col, index) => {
                console.log(col, index)
                if (res.colIndex === index) {
                    let text = col.querySelector('span') ? col.querySelector('span').textContent.trim() : col.textContent.trim();
                    rowData.push(text);
                    let elemnts = col.querySelector('span') ? col.querySelector('span') : col;
                    elemnts.style.background = "red"
                }
            });

            tableData.push(rowData);
            if (!rowData.length) {
            }
        })
        console.log(tableData);
    }
})


