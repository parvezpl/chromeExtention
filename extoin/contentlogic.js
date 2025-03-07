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

function Set_value_for_input() {
    let xpath =''
    document.addEventListener('click', function (e) {      
        try {
            document.getElementById('ignoreElement').remove()
        } catch (error) {
            null
        }

        if (e.target.matches('#ignoreElement' && '.tempbtn')) {
            e.stopPropagation();
            return;
        }
        xpath= getId_name_Xpath(e)
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
        popup.style.zIndex = '9999';
        popup.style.display = "flex"
        popup.style.flexDirection = "column"

        try {
            let button1 = ''
            chrome.storage.local.get(["setXlHeader"], (res) => {
                if (res) {
                    Object.values(res.setXlHeader).forEach((val, index) => {
                        button1 = document.createElement('button');
                        button1.className = "tempbtn"
                        button1.id = "tempbtn" + index
                        button1.innerText = val
                        popup.appendChild(button1);
                        button1.addEventListener("click", (e) => {
                            console.log(e.target.innerText, ",....", xpath)
                            // send sms to background with what u option select and where you click ist xpath 
    
                        })
                    })
                }
            })
            document.body.appendChild(popup);
        } catch (error) {
            console.log(error)
        }

    });
}


function getId_name_Xpath(event) {
    event.preventDefault(); // Prevent default action (optional)
    const element = event.target;
    // Get element ID (if exists)
    // const elementId = element.id ? `ID: ${element.id}` : "No ID";

    // // Get element name (if exists)
    // const elementName = element.getAttribute("name") ? `Name: ${element.getAttribute("name")}` : "No Name";

    // Get XPath of element
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