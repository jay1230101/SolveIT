document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.querySelector('[name="search-patient-input"]');
    const searchResults = document.getElementById("search-results");
    const searchForm = document.querySelector('.search-form');
    const patientName = document.getElementById("patient-name");
    const famName = document.getElementById("fam-name");
    const phoneN = document.getElementById("phone")
    const dob = document.getElementById("dob")

    searchForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const query = searchInput.value;
        console.log("query", query)
        const response = await fetch(`/search_patient?query=${query}`);
        const data = await response.json();

        searchResults.innerHTML = '';

        if (data.length > 0) {
            data.forEach(patient => {
                const listItem = document.createElement('li');
                listItem.classList.add('list-group-item');
                listItem.style.width = '200px';
                listItem.textContent = patient.name + ' ' + patient.father + ' ' + patient.family;

                listItem.addEventListener("click", () => {
                    searchInput.value = '';
                    patientName.innerHTML = patient.name;
                    famName.innerHTML = patient.family;
                    phoneN.innerHTML = patient.phone;
                    dob.innerHTML = patient.dob;

                    searchResults.innerHTML = ''
                });
                searchResults.appendChild(listItem)
            })
        } else {
            const noresultItem = document.createElement('li');
            noresultItem.classList.add('list-group-item', 'text-muted');
            noresultItem.textContent = "No Matching patient found";
            searchResults.append(noresultItem)
        }


    });
//search for lab tests and radiology and add it to the diagnostics table
    const inputCode = document.querySelector('[name="search-code"]');
    const searchF = document.querySelector('.search-diagnostics');
    const tableBody = document.querySelector("tbody");
    let data = [];

    searchF.addEventListener("submit", async (event) => {
        event.preventDefault();
        const searchQueryCode = inputCode.value;
        const response = await fetch(`/search_proc?query=${searchQueryCode}`);
        const newRowsData = await response.json();


        if (newRowsData.length > 0) {
            newRowsData.forEach((code) => {
                const existsInData = data.some((existingRow) => existingRow.code === code.code);
                if (!existsInData) {
                    data.push(code);
                    console.log("DATA", data);
                    const newRow = document.createElement('tr');
                    newRow.classList.add('new-row-class');
                    newRow.innerHTML = ` 
                             <td class="charge-code">${code.code}</td>
             <td class="description-c" style="text-align: center">${code.description}</td>
             <td class="priceA-c" style="text-align: center">${code.priceA}</td>
             <td class="priceB-c" style="text-align: center">${code.priceB}</td>
             <td class="priceC-c" style="text-align: center">${code.priceC}</td>
             <td class="nssf-reimb" style="text-align: center">${code.nssfReimb}</td>
             <td style="text-align: center"><i class="fas fa-trash-alt"></i></td>
            
             `;

                    const lastChargeCodeRow = tableBody.querySelector('#last-charge-code-row')
                    tableBody.insertBefore(newRow, lastChargeCodeRow.previousSibling);

                    newRow.querySelector('.fa-trash-alt').addEventListener("click", () => {
                        newRow.remove();
                        const index = data.indexOf(code);
                        if (index !== -1) {
                            data.splice(index, 1);
                        }
                    })
                }
            })
            inputCode.value = ''
        } else {
            //i do not want to submit the form in case of wrong code or description !!!
            alert("No Matching Code")
            inputCode.value = '';
            event.stopImmediatePropagation()
        }

    });

    //submit the charge code to the server
    function submitChargeCode() {
        const chargeCode = document.querySelectorAll('.charge-code');
        const descriptionC = document.querySelectorAll('.description-c');
        const priceA = document.querySelectorAll('.priceA-c');
        const priceB = document.querySelectorAll('.priceB-c');
        const priceC = document.querySelectorAll('.priceC-c');

        const chargeCodes = [];
        const descriptions = [];
        const priceCenterA = [];
        const priceCenterB = [];
        const priceCenterC = [];

        chargeCode.forEach((element) => {
            chargeCodes.push(element.textContent);
        });

        descriptionC.forEach((element) => {
            descriptions.push(element.textContent);
        });

        priceA.forEach((element) => {
            priceCenterA.push(element.textContent);
        });

        priceB.forEach((element) => {
            priceCenterB.push(element.textContent);
        });

        priceC.forEach((element) => {
            priceCenterC.push(element.textContent);
        });

        const patientName = document.getElementById("patient-name").innerHTML;
        const famName = document.getElementById("fam-name").innerHTML;
        const phoneN = document.getElementById("phone").innerHTML;
        const dob = document.getElementById("dob").innerHTML

        data = {
            charge_c: chargeCodes,
            description_c: descriptions,
            price_a: priceCenterA,
            price_b: priceCenterB,
            price_c: priceCenterC,
            patientName: patientName,
            famName: famName,
            phoneN: phoneN,
            dob: dob
        }
    }


    //set time out function
    function setTimeOut() {
        successMessage.style.display = 'block';
        setTimeout(function () {
            successMessage.style.display = 'none'
        }, 3000)
    }

    //if you click on center A
    const centerA = document.getElementById('centerA_Prices');
    const lastChargeCodeRow = tableBody.querySelector('#last-charge-code-row');
    const successMessage = document.getElementById("success-message");
    centerA.addEventListener("click", function (event) {
        const rowsToRemove = tableBody.querySelectorAll('tr:not(#last-charge-code-row)');
        const hiddenA = document.querySelector('[name="centerA"]');
        const patientName = document.getElementById("patient-name");
        if (patientName.innerHTML !== '') {
            hiddenA.value = 'centerA';
            event.preventDefault();
            submitChargeCode();
            $.ajax({
                type: 'POST',
                url: '/emr',
                data: JSON.stringify({hiddenA: hiddenA.value, data: data}),
                contentType: 'application/json',
                success: function () {
                    rowsToRemove.forEach(row => {
                        if (row !== lastChargeCodeRow) {
                            row.remove();
                        }
                    });
                    setTimeOut()
                },
                error: function (xhr, textStatus, errorThrown) {
                    console.error(errorThrown)
                }
            })
        } else {
            alert("Please select the patient name")
        }

    });

    // if you click on center B
    const centerB = document.getElementById('centerB_Prices');
    centerB.addEventListener("click", function (event) {
        const rowsToRemove = tableBody.querySelectorAll('tr:not(#last-charge-code-row)');
        const hiddenB = document.querySelector('[name="centerB"]');
        const patientName = document.getElementById("patient-name");
        if (patientName.innerHTML !== '') {
            hiddenB.value = 'centerB';
            event.preventDefault();
            submitChargeCode();
            $.ajax({
                type: 'POST',
                url: '/emr',
                data: JSON.stringify({hiddenB: hiddenB.value, data: data}),
                contentType: 'application/json',
                success: function () {
                    rowsToRemove.forEach(row => {
                        if (row !== lastChargeCodeRow) {
                            row.remove()
                        }
                    });
                    setTimeOut()
                }
            })
        } else {
            alert("Please select patient name")
        }

    });

    // if you click on center C
    const centerC = document.getElementById('centerC_Prices');
    centerC.addEventListener("click", function (event) {
        const rowsToRemove = tableBody.querySelectorAll('tr:not(#last-charge-code-row)');
        const hiddenC = document.querySelector('[name="centerC"]');
        const patientName = document.getElementById("patient-name");
        if (patientName.innerHTML !== '') {
            hiddenC.value = 'centerC';
            event.preventDefault();
            submitChargeCode();
            $.ajax({
                type: 'POST',
                url: '/emr',
                data: JSON.stringify({hiddenC: hiddenC.value, data: data}),
                contentType: 'application/json',
                success: function () {
                    rowsToRemove.forEach(row => {
                        if (row !== lastChargeCodeRow) {
                            row.remove()
                        }
                    });
                    setTimeOut()
                }
            })
        } else {
            alert("Please select the patient name")
        }
    });

    //if you click on print button
    const printButton = document.getElementById("print-button");
    const patHeader = document.getElementById("pat");
    const famHeader = document.getElementById("fam");
    const dobHeader = document.getElementById('doby');
    const phoneHeader = document.getElementById('phony');
    const orderTableBody = document.getElementById('order-table-body');

    printButton.addEventListener("click", function (event) {
        event.preventDefault();
        if (patientName.innerHTML !== '') {
            $('#print-modal').modal('show');
            patHeader.textContent = patientName.innerHTML;
            famHeader.textContent = famName.innerHTML;
            dobHeader.textContent = dob.innerHTML;
            phoneHeader.textContent = phoneN.innerHTML;

            const printedData = []
            while (orderTableBody.firstChild) {
                orderTableBody.removeChild(orderTableBody.firstChild);
            }

            data.forEach(code => {
                const existsInPrintedData = printedData.some((existingRow) => existingRow.code === code.code);
                if (!existsInPrintedData) {
                    printedData.push(code);
                    const newRow = document.createElement('tr');
                    newRow.innerHTML = `
    <td class="charge-co">${code.code}</td>
    <td class="description-co">${code.description}</td>
    <td class="nssf-reim">${code.nssfReimb}</td>
`;
                    orderTableBody.appendChild(newRow);

                }
            });

        } else {
            alert("Please select a patient name")
        }
    })

})









