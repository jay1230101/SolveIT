document.addEventListener('DOMContentLoaded', function () {
    var Calendar = FullCalendar.Calendar;
    var Draggable = FullCalendar.Draggable;
    var calendarEl = document.getElementById('calendar');
    const lastUsedEncounterIds = {};
    const firstThreeDraggableEvents = [];
    let eventLabelIndex = 0;

    var calendar = new Calendar(calendarEl, {
        timeZone: 'local',
        initialView: 'timeGridWeek',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        expandRows: true,
        contentHeight: 1000,
        weekends: true,
        hiddenDays: [0],
        slotMinTime: "07:00:00",
        slotMaxTime: "19:00:00",
        navLinks: true,
        selectable: true,
        editable: true,
        droppable: true,

        drop: function (info) {
            const encounterId = info.draggedEl.dataset.encounterId;
            console.log("the encounter id is ", encounterId)
            const patientName = info.draggedEl.dataset.patientName;
            const familyName = info.draggedEl.dataset.familyName;
            const phone = info.draggedEl.dataset.phone;
            const physician = info.draggedEl.dataset.treating_physician;
            const event_id_a = info.draggedEl.dataset.event_id_a;
            const event_id_b = info.draggedEl.dataset.event_id_b;
            const event_id_c = info.draggedEl.dataset.event_id_c;

            const eventLabels = [event_id_a, event_id_b, event_id_c]


            if (eventLabelIndex < eventLabels.length) {
                const eventLabel = eventLabels[eventLabelIndex]
                console.log("the event lab index", eventLabelIndex)
                eventLabelIndex++;

                const date = info.date;
                const dateString = date.toISOString().slice(0, 10);
                const startHour = date.getHours().toString().padStart(2, '0');
                const startMinutes = date.getMinutes().toString().padStart(2, '0');
                const startFinal = startHour + ":" + startMinutes;
                const startStr = info.dateStr;
                console.log("the date str is", startStr)

                const labeledEncounterId = eventLabel;
                console.log("the labeled encounter is", labeledEncounterId)

                if (!lastUsedEncounterIds[labeledEncounterId]) {
                    lastUsedEncounterIds[labeledEncounterId] = parseInt(encounterId);
                }

                const draggableEventDetails = {
                    encounter_id: labeledEncounterId,
                    startTime: startFinal,
                    date: dateString,
                    startStr: startStr
                };
                firstThreeDraggableEvents.push(draggableEventDetails);
                console.log("the draggable event details", draggableEventDetails);

                $('[name="first-name-reminder"]').val(patientName);
                $('[name="family-name-reminder"]').val(familyName);
                $('[name="phone-reminder"]').val(phone);
                $('[name="physician-reminder"]').val(physician);
                $('[name="original_event_id"]').val(encounterId);

                if (eventLabel === event_id_a) {
                    console.log("event label a", eventLabel)
                    $('[name="event_id_reminder1"]').val(firstThreeDraggableEvents[0].encounter_id);
                    $('[name="date1"]').val(firstThreeDraggableEvents[0].date);
                    $('[name="time1"]').val(firstThreeDraggableEvents[0].startTime);
                    $('[name="hidden_time1"]').val(firstThreeDraggableEvents[0].startStr);
                } else if (eventLabel === event_id_b) {
                    console.log("event label b", eventLabel)
                    const dateDiv2 = document.getElementById("date2div");
                    const timeDiv2 = document.getElementById("time2div");
                    dateDiv2.style.display = 'block';
                    timeDiv2.style.display = 'block';
                    $('[name="event_id_reminder1"]').val(firstThreeDraggableEvents[0].encounter_id);
                    $('[name="date1"]').val(firstThreeDraggableEvents[0].date);
                    $('[name="time1"]').val(firstThreeDraggableEvents[0].startTime);
                    $('[name="hidden_time1"]').val(firstThreeDraggableEvents[0].startStr);

                    $('[name="event_id_reminder2"]').val(firstThreeDraggableEvents[1].encounter_id);
                    $('[name="date2"]').val(firstThreeDraggableEvents[1].date);
                    $('[name="time2"]').val(firstThreeDraggableEvents[1].startTime);
                    $('[name="hidden_time2"]').val(firstThreeDraggableEvents[1].startStr);

                } else if (eventLabel === event_id_c) {
                    console.log("event label c", eventLabel)
                    const dateDiv2 = document.getElementById("date2div");
                    const timeDiv2 = document.getElementById("time2div");
                    const dateDiv3 = document.getElementById("date3div");
                    const timeDiv3 = document.getElementById("time3div");
                    dateDiv2.style.display = 'block';
                    timeDiv2.style.display = 'block';
                    dateDiv3.style.display = 'block';
                    timeDiv3.style.display = 'block';
                    $('[name="event_id_reminder1"]').val(firstThreeDraggableEvents[0].encounter_id);
                    $('[name="date1"]').val(firstThreeDraggableEvents[0].date);
                    $('[name="time1"]').val(firstThreeDraggableEvents[0].startTime);
                    $('[name="hidden_time1"]').val(firstThreeDraggableEvents[0].startStr);

                    $('[name="event_id_reminder2"]').val(firstThreeDraggableEvents[1].encounter_id);
                    $('[name="date2"]').val(firstThreeDraggableEvents[1].date);
                    $('[name="time2"]').val(firstThreeDraggableEvents[1].startTime);
                    $('[name="hidden_time2"]').val(firstThreeDraggableEvents[1].startStr);

                    $('[name="event_id_reminder3"]').val(firstThreeDraggableEvents[2].encounter_id);
                    $('[name="date3"]').val(firstThreeDraggableEvents[2].date);
                    $('[name="time3"]').val(firstThreeDraggableEvents[2].startTime);
                    $('[name="hidden_time3"]').val(firstThreeDraggableEvents[2].startStr);

                }
                $("#reminderModal").modal('show');

                const suggestMoreAppts = document.querySelector('[name="submit-button"]');
                suggestMoreAppts.addEventListener("click", function () {
                    $('#reminderModal').modal('hide')
                })


                if (checkbox.checked) {
                    // if so, remove the element from the "Draggable Events" list
                    info.draggedEl.parentNode.removeChild(info.draggedEl);
                }
            } else {
                alert("You cannot drag more than 3 events")
                info.revert()
            }

        },


        select: function (info) {

            const calendarDate = info.start;
            const dateISO = calendarDate.toISOString().slice(0, 10);
            const startHour = info.start.getHours().toString().padStart(2, '0')
            const startMin = info.start.getMinutes().toString().padStart(2, '0')
            const startTime = startHour + ":" + startMin;


            const endHour = info.end.getHours().toString().padStart(2, '0')
            const endMin = info.end.getMinutes().toString().padStart(2, '0')
            const endTime = endHour + ":" + endMin;


            var startStr = info.startStr
            var endStr = info.endStr

            $('[name="hidden-start"]').val(startStr);
            $('[name="hidden-end"]').val(endStr)
            $('[name="date"]').val(dateISO);
            $('[name="start-time"]').val(startTime);
            $('[name="end-time"]').val(endTime);
            $("#appointmentModal").modal('show');
        }
        ,

        eventResize: function (info) {
            var event_id = info.event.id
            if (event_id.includes("-a") || event_id.includes("-b") || event_id.includes("-c")) {
                info.revert()
            } else {
                $("#resizeModal").modal('show')
                editAppointment(info)
            }

        }
        ,
        eventDrop: function (info) {
            var event_id = info.event.id
            if (event_id.includes("-a") || event_id.includes("-b") || event_id.includes("-c")) {
                info.revert()
            } else {
                $("#resizeModal").modal('show');
                editAppointment(info)
            }


        }
        ,
        eventClick: function (info) {
            var event_id = info.event.id;
            console.log("the evento ido ", event_id)
            var get_event_id = calendar.getEventById(event_id);

            if (event_id.includes("-a") || event_id.includes("-b") || event_id.includes("-c")) {
                $("#clickModalDraggable").modal('show');
                const deleteText = document.getElementById("deleting-draggable");
                const deleteImg = document.getElementById("delete-img-draggable");
                deleteText.addEventListener("click", function (event) {
                    $("#clickModalDraggable").modal('hide');
                    get_event_id.remove();
                });
                deleteImg.addEventListener("click", function (event) {
                    $("#clickModalDraggable").modal('hide');
                    get_event_id.remove()
                })

            } else {
                $('#clickModal').modal('show');
                const rescheduleText = document.getElementById("rescheduling");
                const rescheduleImage = document.getElementById("rescheduling-img");
                const deleteText = document.getElementById("deleting");
                const deleteImage = document.getElementById("delete-img");


                rescheduleText.addEventListener("click", function () {
                    $("#clickModal").modal('hide');
                    $("#resizeModal").modal('show');
                    clickEvent(info)


                });
                rescheduleImage.addEventListener("click", function () {
                    $("#clickModal").modal('hide');
                    $("#resizeModal").modal('show');
                    clickEvent(info)
                });

                deleteText.addEventListener("click", function () {
                    $("#clickModal").modal('hide');
                    get_event_id.remove()

                });

                deleteImage.addEventListener("click", function () {
                    $("#clickModal").modal('hide');
                    get_event_id.remove()

                });
            }


        }
        ,

    });

    calendar.render();

//FUNCTIONS
// 1- Edit Calendar Event Function
    function editAppointment(info) {
        var event_id = info.event.id;

        var startEvent = info.event.start;
        var endEvent = info.event.end;

        var date = startEvent.toISOString().slice(0, 10);

        var startHours = startEvent.getHours().toString().padStart(2, '0');
        var startMinutes = startEvent.getMinutes().toString().padStart(2, '0');
        var startFinal = startHours + ":" + startMinutes;

        var endHours = endEvent.getHours().toString().padStart(2, '0');
        var endMinutes = endEvent.getMinutes().toString().padStart(2, '0');
        var endFinal = endHours + ":" + endMinutes;

        var patientName = info.event.extendedProps.patientName;
        var familyName = info.event.extendedProps.familyName;
        var phone = info.event.extendedProps.phone


        //get close button and X to revert back if event was closed or X
        var closeSign = document.getElementById("close-sign");
        var closeButton = document.getElementById("close-button");


        $('[name="start-time"]').val(startFinal);
        $('[name="end-time"]').val(endFinal);
        $('[name="date"]').val(date);
        $('[name="event_id"]').val(event_id);
        $('[name="first-name"]').val(patientName);
        $('[name="family-name"]').val(familyName);
        $('[name="phone"]').val(phone);

        closeSign.addEventListener("click", function (event) {
            $("#resizeModal").modal('hide');
            info.revert()
        });
        closeButton.addEventListener("click", function () {
            $("#resizeModal").modal('hide');
            info.revert()
        })


    }

//2-Click Calendar Event Function
    function clickEvent(info) {
        var event_id = info.event.id
        var name = info.event.extendedProps.patientName;
        var family = info.event.extendedProps.familyName;
        var phone = info.event.extendedProps.phone;

        $('[name="first-name"]').val(name);
        $('[name="family-name"]').val(family);
        $('[name="phone"]').val(phone);
        $('[name="event_id"]').val(event_id);

    }


//SUBMIT FORMS
//1-submit the booking form and add the external events
    const bookingForm = document.getElementById("booking-form");
    const checkbox = document.getElementById('drop-remove');
    const externalEvents = document.getElementById("external-events");
    var get_event_original_id;
    var storedEvents = []

    bookingForm.onsubmit = function (event) {
        event.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/book_appointment',
            data: $("#booking-form").serialize(),
            dataType: 'json',
            success: function (response) {
                var eventData = {
                    id: response.encounter_id,
                    title: response.patient_name + ' ' + response.family_name + ':' + '  ' + response.appointment,
                    start: response.start_time,
                    end: response.end_time,
                    extendedProps: {
                        patientName: response.patient_name,
                        familyName: response.family_name,
                        phone: response.phone,
                        appointment: response.appointment,
                        treating_physician: response.treating_physician,
                        encounter_id_a: response.encounter_id_a,
                        encounter_id_b: response.encounter_id_b,
                        encounter_id_c: response.encounter_id_c
                    }
                };
                storedEvents.push(eventData)
                console.log("the evento data is", eventData)

                // Create a new fcEventElement for each event
                const fcEventElement = document.createElement("div");
                fcEventElement.classList.add("fc-event", "fc-h-event", "fc-daygrid-event", "fc-daygrid-block-event");
                fcEventElement.innerHTML = `<b>${response.patient_name} ${response.family_name}</b><br> <b>Unconfirmed</b>`;
                fcEventElement.style.backgroundColor = 'orange';
                fcEventElement.dataset.encounterId = response.encounter_id;
                fcEventElement.dataset.patientName = response.patient_name;
                fcEventElement.dataset.familyName = response.family_name;
                fcEventElement.dataset.phone = response.phone;
                fcEventElement.dataset.treating_physician = response.treating_physician;
                fcEventElement.dataset.event_id_a = response.encounter_id_a;
                fcEventElement.dataset.event_id_b = response.encounter_id_b;
                fcEventElement.dataset.event_id_c = response.encounter_id_c;
                externalEvents.appendChild(fcEventElement);
                console.log("the external event is ", externalEvents)

                get_event_original_id = response.encounter_id
                console.log("the get event original id is is is ", get_event_original_id)
                new Draggable(fcEventElement, {
                    eventData: {
                        title: fcEventElement.innerText,
                        duration: "00:30",
                        backgroundColor: "orange",
                        borderColor: "black",
                        textColor: "black",
                        id: response.encounter_id,
                        extendedProps: {
                            eventIdA: response.encounter_id_a,
                            eventIdB: response.encounter_id_b,
                            eventIdC: response.encounter_id_c
                        }
                    },
                    revert: true,
                });
                console.log("this is the event draggable data", eventData)


                var newEvent = calendar.addEvent(eventData);
                $('#appointmentModal').modal('hide')

            }
        });
    };

//2-Submit Resize Form

    const resizeForm = document.getElementById("resize-form");
    resizeForm.onsubmit = function (event) {
        event.preventDefault()
        $.ajax({
            type: 'POST',
            url: '/resize_appointment',
            data: $("#resize-form").serialize(),
            dataType: 'json',
            success: function (response) {
                var event_id = response.encounter_id;
                var get_event_id = calendar.getEventById(event_id)
                get_event_id.remove()

                var eventData = {
                    id: response.encounter_id,
                    title: response.patient_name + ' ' + response.family_name + ':' + '  ' + response.appointment,
                    start: response.start_time,
                    end: response.end_time,
                    extendedProps: {
                        patientName: response.patient_name,
                        familyName: response.family_name,
                        phone: response.phone,

                    }

                };

                var newEvent = calendar.addEvent(eventData);
                $('#resizeModal').modal('hide')
            },
            error: function (xhr, status, error) {
                console.log('Error', error)
            }

        })
    };


//3- Submit the save changes of the draggable event
    const saveChanges = document.querySelector('[name="save-changes"]');
    const reminderForm = document.getElementById("reminder-form");
    const buttonClickedInput = document.getElementById("button-clicked");
    const date2Display = document.getElementById("date2div");
    const date3Display = document.getElementById("date3div");
    const time2Display = document.getElementById("time2div");
    const time3Display = document.getElementById("time3div");

    saveChanges.addEventListener("click", function () {
        buttonClickedInput.value = 'save-form';
        date2Display.style.display = 'block';
        time2Display.style.display = 'block';
        date3Display.style.display = 'block';
        time3Display.style.display = 'block';

    })

    reminderForm.onsubmit = function (event) {
        event.preventDefault();
        $.ajax({
                type: 'POST',
                url: '/suggested_appointments',
                data: $("#reminder-form").serialize(),
                dataType: 'json',

                success: function (response) {
                    const events = calendar.getEvents();
                    console.log("the event ids are", calendar.getEvents())
                    var buttonClicked = buttonClickedInput.value;
                    if (buttonClicked === 'save-form') {
                        if (response.event_id_a) {
                            const event_id_a = response.event_id_a;
                            const eventToRemovea = events.find(event => event.extendedProps.eventIdA === event_id_a);
                            eventToRemovea.remove()
                            var eventData = {
                                id: response.event_id_a,
                                title: response.patient_name + ' ' + response.family_name + ' ' + 'Unconfirmed',
                                start: response.time1ISO,
                                borderColor: "black",
                                textColor: "black",
                                backgroundColor: "orange",
                                extendedProps: {
                                    patientName: response.patient_name,
                                    familyName: response.family_name,
                                }
                            };
                            var newEvent = calendar.addEvent(eventData);

                        } else if (response.event_id_b) {
                            const event_id_b = response.event_id_b;
                            const eventToRemoveb = events.find(event => event.extendedProps.eventIdB === event_id_b);
                            eventToRemoveb.remove();
                            var eventDatab = {
                                id: response.event_id_b,
                                title: response.patient_name + ' ' + response.family_name + ' ' + 'Unconfirmed',
                                start: response.time2ISO,
                                borderColor: "black",
                                textColor: "black",
                                backgroundColor: "orange",
                                extendedProps: {
                                    patientName: response.patient_name,
                                    familyName: response.family_name,
                                }
                            };
                            var newEventb = calendar.addEvent(eventDatab);
                        } else if (response.event_id_c) {
                            const event_id_c = response.event_id_c;
                            const eventToRemovec = events.find(event => event.extendedProps.eventIdC === event_id_c);
                            eventToRemovec.remove();
                            var eventDatac = {
                                id: response.event_id_c,
                                title: response.patient_name + ' ' + response.family_name + ' ' + 'Unconfirmed',
                                start: response.time3ISO,
                                borderColor: "black",
                                textColor: "black",
                                backgroundColor: "orange",
                                extendedProps: {
                                    patientName: response.patient_name,
                                    familyName: response.family_name,
                                }
                            };
                            var newEventc = calendar.addEvent(eventDatac);
                        }

                    }
                    $('#reminderModal').modal('hide')
                }
            }
        )
    }


//SEARCH FUNCTIONS AND VALIDATION FUNCTIONS

//1-search for patient names
    const searchForm = document.querySelector('.search-form');
    const searchInput = document.getElementById("search-patient");
    const searchResults = document.getElementById("search-results");


    const firstName = document.querySelector('[name="first-name"]');
    const familyName = document.querySelector('[name="family-name"]');
    const phone = document.querySelector('[name="phone"]');
    const father = document.querySelector('[name="fathers"]')

    searchForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const searchQuery = searchInput.value;
        const response = await fetch(`/search_patient?query=${searchQuery}`);
        const data = await response.json();


        searchResults.innerHTML = '';

        if (data.length > 0) {
            data.forEach(patient => {
                const listItem = document.createElement('li');
                listItem.classList.add('list-group-item');
                listItem.textContent = patient.name + ' ' + patient.father + ' ' + patient.family;

                listItem.addEventListener("click", () => {
                    searchInput.value = '';
                    firstName.value = patient.name;
                    familyName.value = patient.family;
                    phone.value = patient.phone;
                    father.value = patient.father;

                    searchResults.innerHTML = ''
                });

                searchResults.appendChild(listItem)

            })
        } else {
            const noResultItem = document.createElement('li');
            noResultItem.classList.add('list-group-item', 'text-muted');
            noResultItem.textContent = "No Matching patient found";
            searchResults.appendChild(noResultItem)
        }

    });
//2- show procedures when appointment type is procedure - original modal
    const appointmentType = document.querySelector('[name="select-appointment"]');
    const procedureType = document.querySelector('[name="procedure-group"]');
    appointmentType.addEventListener("change", function () {
        if (this.value === 'procedure') {
            procedureType.style.display = 'block';
        } else {
            procedureType.style.display = 'none';
        }

    });
//3-show procedures when appointment type is procedure - resize modal
    const apptype = document.querySelector('[name="select-appointment-resize"]');
    const protype = document.querySelector('[name="procedure-group-resize"]');
    apptype.addEventListener("change", function () {
        if (this.value === 'procedure') {
            protype.style.display = 'block';
        } else {
            protype.style.display = 'none';
        }

    });


//4-show instructions mapped with procedure type - original modal
    const procedureByType = document.querySelector('[name="select-procedure"]');

    procedureByType.addEventListener("change", async (event) => {
        event.preventDefault();
        queryInput = procedureByType.value
        const response = await fetch(`/search_procedure?query=${queryInput}`)
        const data = await response.json();
        const prior_instruction = document.getElementById("prior-reminder");
        const prior_instruction_label = document.getElementById("prior-reminder-label");
        const post_instruction = document.getElementById("post-reminder");
        const post_instruction_label = document.getElementById("post-reminder-label");

        if (data.prior_instruction) {
            prior_instruction.style.display = 'block';
            prior_instruction_label.innerHTML = data.prior_instruction;
        } else {
            prior_instruction.style.display = 'none';

        }
        if (data.post_instruction) {
            post_instruction.style.display = 'block';
            post_instruction_label.innerHTML = data.post_instruction;
        } else {
            post_instruction.style.display = 'none';

        }

    });

//5-show instructions mapped with procedure type - resize
    const procByType = document.querySelector('[name="select-procedure-resize"]');

    procByType.addEventListener("change", async (event) => {
        event.preventDefault();
        queryInput = procByType.value
        const response = await fetch(`/search_procedure?query=${queryInput}`)
        const data = await response.json();
        const prior_instruction = document.getElementById("prior-reminder-resize");
        const prior_instruction_label = document.getElementById("prior-reminder-label-resize");
        const post_instruction = document.getElementById("post-reminder-resize");
        const post_instruction_label = document.getElementById("post-reminder-label-resize");

        if (data.prior_instruction) {
            prior_instruction.style.display = 'block';
            prior_instruction_label.innerHTML = data.prior_instruction;
        } else {
            prior_instruction.style.display = 'none';

        }
        if (data.post_instruction) {
            post_instruction.style.display = 'block';
            post_instruction_label.innerHTML = data.post_instruction;
        } else {
            post_instruction.style.display = 'none';

        }

    });

})
;
