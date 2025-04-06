

function getTableColumn() {
    let etribult_And_index = { class: "", colIndex: 0 }
    document.addEventListener('click', function (event) {
        var table = event.target.closest('table');
        if (table) {
            var td = event.target.closest('td');
            if (td) {
                // var rowIndex = td.parentNode.rowIndex - 1; 
                // Get the column index
                var colIndex = td.cellIndex;
                etribult_And_index.class = table.className
                etribult_And_index.colIndex = colIndex
            }
        }
    });
    return etribult_And_index
}


let setInputData = [
    {
        hostname: null,
        path: [
            {
                type: null,
                xpath: null,
            }
        ]
    }
]


let Set_value_for_input_is_active = false
chrome.storage.local.set({ "isInputValueSetup": false })
function Set_value_for_input(isActive = false) {
    let xpath = ''
    document.addEventListener('click', async function (e) {
        await chrome.storage.local.get("isInputValueSetup", (res) => {
            Set_value_for_input_is_active = res.isInputValueSetup
            // remove input popup 
            try {
                document.getElementById('ignoreElement').remove()
            } catch (error) {
                null
            }

            if (Set_value_for_input_is_active) {
                if (e.target.matches('#ignoreElement' && '.tempbtn')) {
                    e.stopPropagation();
                    return;
                }
                if (e.target.matches('input' || 'textarea' || '[contenteditable="true"]') || e.target.closest("[contenteditable='true']")) {

                    xpath = getId_name_Xpath(e)
                    let x = e.clientX;
                    let y = e.clientY;

                    // Create the popup div
                    let popup = document.createElement('div');
                    popup.id = "ignoreElement"
                    popup.style.position = 'absolute';
                    popup.style.left = (x + 10) + 'px';  // Positioned to the right of the click
                    popup.style.top = y + 'px';
                    popup.style.padding = '10px';
                    popup.style.backgroundColor = 'lightgrey';
                    popup.style.border = '1px solid #ccc';
                    popup.style.borderRadius = '5px';
                    popup.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.2)';
                    popup.style.zIndex = '999999';
                    popup.style.display = "flex"
                    popup.style.flexDirection = "column"


                    try {
                        let button1 = ''
                        chrome.storage.local.get(["setXlHeader", "setInputData"], (res) => {
                            if (res.setInputData) {
                                setInputData = res.setInputData
                            }
                            if (res.setXlHeader) {
                                Object.values(res.setXlHeader).forEach((val, index) => {
                                    // button1 = document.createElement('button');
                                    // button1.className = "tempbtn"
                                    if (typeof (val) !== 'string') {

                                        val.forEach((item, ind) => {
                                            button1 = document.createElement('button');
                                            button1.className = "tempbtn"
                                            button1.id = `${"tempbtn" + index}` + ind
                                            button1.innerText = item
                                            popup.appendChild(button1);

                                        })
                                        // return
                                    } else {
                                        button1 = document.createElement('button');
                                        button1.className = "tempbtn"
                                        button1.id = "tempbtn" + index
                                        button1.innerText = val
                                        popup.appendChild(button1);
                                    }

                                    // popup.appendChild(button1);
                                    let classdata = document.querySelectorAll(".tempbtn")
                                    classdata.forEach((btn) => {
                                        btn.addEventListener("click", async (e) => {
                                            if (e.target.innerText === 'delete') {
                                                setInputData.forEach((data) => {
                                                    if (data.hostname === window.location.hostname) {
                                                        data.path.forEach((path, index) => {
                                                            if (path.xpath === xpath) {
                                                                let InputElement = getElementByXpath(xpath)
                                                                InputElement.placeholder = ""
                                                                data.path.splice(index, 1)
                                                            }
                                                        })
                                                    }
                                                })
                                                await chrome.storage.local.set({ "setInputData": setInputData })
                                                return
                                            }
                                            let isavlable = true
                                            setInputData.forEach((data) => {
                                                if (data.hostname === window.location.hostname) {
                                                    data.path.forEach((path) => {
                                                        if (path.xpath === xpath) {
                                                            path.type = e.target.innerText
                                                            isavlable = false
                                                        }
                                                    })
                                                    if (isavlable) {
                                                        data.path.push({
                                                            type: e.target.innerText,
                                                            xpath: xpath
                                                        })
                                                    }

                                                    isavlable = false
                                                }
                                            })
                                            if (isavlable) {
                                                setInputData.push({
                                                    hostname: window.location.hostname,
                                                    path: [{
                                                        type: e.target.innerText,
                                                        xpath: xpath
                                                    }]
                                                })
                                            }
                                            getElementByXpath(xpath).placeholder = e.target.innerText
                                            await chrome.storage.local.set({ "setInputData": setInputData })

                                        })
                                    })

                                })
                            }

                        })
                        document.body.appendChild(popup);
                    } catch (error) {
                        console.log(error)
                    }
                    return
                }

            }
        })


    });
}

Auto_set_input()

async function Auto_set_input() {
    try {
        await chrome.storage.local.get(["setInputData"], (res) => {
            if (res.setInputData) {
                setInputData = res.setInputData
                setInputData.forEach((setInputDatas) => {
                    if (setInputDatas.hostname === window.location.hostname) {
                        setInputDatas.path.forEach(async (path) => {
                            const waitForElement = setInterval(() => {
                                const newElement = getElementByXpath(path.xpath)
                                if (newElement) {
                                    newElement.placeholder = path.type
                                    clearInterval(waitForElement);                                }
                            }, 500);
                        })
                    }
                })
            }
        })
    } catch (error) {
        console.log("error", error)

    }
}

function getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}



function getId_name_Xpath(event) {
    event.preventDefault(); // Prevent default action (optional)
    const element = event.target;
    const elementXPath = getXPath(element);
    return elementXPath

    // Function to get XPath of an element
    function getXPath(element) {
        if (element.id) return `//*[@id="${element.id}"]`;
        const pathParts = [];
        while (element && element.nodeType === Node.ELEMENT_NODE) {
            let index = 0, sibling = element;
            while (sibling) {
                if (sibling.nodeName === element.nodeName) index++;
                sibling = sibling.previousElementSibling;
            }
            pathParts.unshift(`${element.nodeName}[${index}]`);
            element = element.parentNode;
        }
        return "/" + pathParts.join("/");
    }

}