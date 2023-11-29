document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.querySelector('[name="search-patient-input"]');
    const searchResults = document.getElementById("search-results");
    const searchForm = document.querySelector('.search-form');
    const patientName = document.getElementById("patient-name");
    const famName = document.getElementById("fam-name");
    const phoneN = document.getElementById("phone")
    const dob = document.getElementById("dob")

    searchForm.addEventListener("submit", async (event) => {
        if (searchInput.value !== '') {

            event.preventDefault();
            const query = searchInput.value;
            const response = await fetch(`/search_patient?query=${query}`);
            const data = await response.json();

            searchResults.innerHTML = '';

            if (data.length > 0) {
                data.forEach(patient => {
                    const listItem = document.createElement('li');
                    listItem.classList.add('list-group-item');
                    listItem.style.backgroundColor = "#f8f9fa";

                    listItem.textContent = patient.name + ' ' + patient.father + ' ' + patient.family;

                    listItem.addEventListener("click", () => {
                        searchInput.value = '';
                        patientName.innerHTML = patient.name;
                        famName.innerHTML = patient.family;
                        phoneN.innerHTML = patient.phone;
                        dob.innerHTML = patient.dob;
                        searchResults.innerHTML = '';

                        sendPatientIdToServer(patient.id)

                    });
                    searchResults.appendChild(listItem)
                })
            } else {
                const noresultItem = document.createElement('li');
                noresultItem.classList.add('list-group-item', 'text-muted');
                noresultItem.textContent = "No Matching patient found";
                searchResults.append(noresultItem)
            }

        } else {
            alert("please select a patient name")
        }


    });

    //function to send patient.id to server
    async function sendPatientIdToServer(patientId){
        const url = `/emr?patient_id=${patientId}`;
        try {
            const response = await fetch(url, {
                method:'GET',
            });
            if(response.ok){

            }else{
                console.error("Failed to send patient Id")
            }
        } catch(error){
            console.error('Error',error)
        }
    }

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
        };
        return data
    }


    //set time out function
    const successMessage = document.getElementById("success-message");

    function setTimeOut() {
        successMessage.style.display = 'block';
        setTimeout(function () {
            successMessage.style.display = 'none'
        }, 3000)
    }

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
    });

    //function to have fields mandatory before submitting the form
    function validation() {
        const medicalHistory = document.querySelector('[name="med-history"]');
        const physicalExam = document.querySelector('[name="physical-exam"]');

        return (
            medicalHistory.value.trim() !== '' &&
            physicalExam.value.trim() !== ''
        )
    };

    //function to clear input fields after submittion
    function clearInputFields() {
        const medicalHistory = document.querySelector('[name="med-history"]');
        const physicalExam = document.querySelector('[name="physical-exam"]');
        const prescription = document.querySelector('[name="prescription"]');
        medicalHistory.value = '';
        physicalExam.value = '';
        prescription.value = ''

    }

    //submit the medical form for all fields
    const saveButton = document.getElementById("saveButton");
    const medicalInfoForm = document.getElementById("medicalInfo");


    saveButton.addEventListener("click", function (event) {
        const lastChargeCodeRow = tableBody.querySelector('#last-charge-code-row');
        const rowsToRemove = tableBody.querySelectorAll('tr:not(#last-charge-code-row)');
        const pName = document.getElementById("patient-name");
        if (pName.innerHTML !== '' && validation()) {
            event.preventDefault();

            const medicalInforFormData = new FormData(medicalInfoForm);
            const chargeCodeData = submitChargeCode();

            const formData = {
                medicalInfo: Object.fromEntries(medicalInforFormData.entries()),
                chargeCode: chargeCodeData,
            }
            $.ajax({
                type: 'POST',
                url: '/emr',
                data: JSON.stringify(formData),
                contentType: 'application/json',
                success: function () {
                    rowsToRemove.forEach(row => {
                        if (row !== lastChargeCodeRow) {
                            row.remove()
                        }
                    });
                    setTimeOut()
                    clearInputFields()
                }
            })
        } else {
            alert("Please fill in mandatory fields")
        }
    })

//movable modal in bootstrap
    $(function () {
        $('#history-modal .modal-dialog').draggable({
            handle: ".modal-header"
        });
    });


    //expandable div for previous visits
    const plusSign = document.getElementById("plus-sign");
    const clickableEvent = document.querySelectorAll(".clickable-event");
    const medicalHistoryR = document.querySelector('[name="med-document"]');
    const physicalExamR = document.querySelector('[name="exam-document"]');
    const medicationsR = document.querySelector('[name="drug-document"]');
    const diagnosticsR = document.querySelector('[name="diagnostic-history"]');

    plusSign.addEventListener("click", function () {
        console.log("hello")
        $('#expandable-area').slideToggle();
        console.log("johny")
    });

    clickableEvent.forEach(event => {
        medicalHistoryR.textContent = event.getAttribute("data-med");
        physicalExamR.textContent = event.getAttribute("data-exam");
        medicationsR.textContent = event.getAttribute("data-prescription");
        diagnosticsR.textContent = event.getAttribute("data-diagnostics")
    })


})









