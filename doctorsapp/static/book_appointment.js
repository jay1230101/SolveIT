document.addEventListener('DOMContentLoaded', function () {
        var Calendar = FullCalendar.Calendar;
        var Draggable = FullCalendar.Draggable;
        var calendarEl = document.getElementById('calendar');
        let eventLabelIndex = 0;
        var draggableBox = [];
        const firstThreeDraggableEvents = []
        console.log("the first three draggables are ", firstThreeDraggableEvents)
        console.log("the second three draggables are ", firstThreeDraggableEvents[0])
        console.log("the draggable box are ", draggableBox)

        console.log("the event label index", eventLabelIndex)

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


                //get the modal demographic info
                const patientName = info.draggedEl.dataset.patientName;
                const familyName = info.draggedEl.dataset.familyName;
                const phone = info.draggedEl.dataset.phone;
                const treatingPhysician = info.draggedEl.dataset.treating_physician

                //let us set the info of the modal
                var date = info.date;
                var dateString = date.toISOString().slice(0, 10);
                var startHour = date.getHours().toString().padStart(2, '0');
                var startMinutes = date.getMinutes().toString().padStart(2, '0');
                const startFinal = startHour + ":" + startMinutes;

                // Get the current event labels
                const event_id_a = info.draggedEl.dataset.event_id_a;
                const event_id_b = info.draggedEl.dataset.event_id_b;
                const event_id_c = info.draggedEl.dataset.event_id_c;
                const eventLabels = [event_id_a, event_id_b, event_id_c];

                if (
                    firstThreeDraggableEvents.filter(event => event.encounter_id === encounterId).length >= 3
                ) {
                    alert('You can only have up to three draggable events (-a, -b, -c) per encounter.');
                    info.revert()

                }

                if (firstThreeDraggableEvents.length === 0 || !firstThreeDraggableEvents.some(event => event.encounter_id === encounterId)) {
                    eventLabelIndex = 0;
                } else {
                    // Find the last label for this encounter
                    const lastLabel = firstThreeDraggableEvents
                        .filter(event => event.encounter_id === encounterId)
                        .map(event => event.encounter_labeled_id)
                        .pop();

                    // Determine the next label based on the last label
                    if (lastLabel === event_id_a) {
                        eventLabelIndex = 1; // Last label was "-a," use "-b"
                    } else if (lastLabel === event_id_b) {
                        eventLabelIndex = 2; // Last label was "-b," use "-c"
                    } else {
                        eventLabelIndex = 0; // Last label was not "-a," "-b," or "-c," start with "-a"
                    }
                }

                const encounterLabeledId = eventLabels[eventLabelIndex];
                console.log("the encounter labeled id", encounterLabeledId);
                const draggableEventDetails = {
                    encounter_id: encounterId,
                    encounter_labeled_id: encounterLabeledId,
                    date: dateString,
                    startTime: startFinal
                };

                firstThreeDraggableEvents.push(draggableEventDetails);
                $("#reminderModal").modal('show')


                //add the values to the modal
                $('[name="first-name-reminder"]').val(patientName);
                $('[name="family-name-reminder"]').val(familyName);
                $('[name="phone-reminder"]').val(phone);
                $('[name="physician-reminder"]').val(treatingPhysician);
                $('[name="original_event_id"]').val(encounterId);

                if (encounterLabeledId === event_id_a) {
                    console.log("hello")
                    reminderOption1(encounterId)


                } else if (encounterLabeledId === event_id_b) {
                    console.log("hello b")
                    reminderOption2(encounterId)


                } else if (encounterLabeledId === event_id_c) {
                    console.log("hello c")
                    reminderOption3(encounterId);
                }


            }


            ,
            select:

                function (info) {

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

        });

        calendar.render();


//3- Clear booking form fields
        function clearBookingForm() {
            $('[name="first-name"]').val("");
            $('[name="family-name"]').val("");
            $('[name="phone"]').val("");
            $('[name="date"]').val("");
            $('[name="start-time"]').val("");
            $('[name="end-time"]').val("");
            $('[name="select-appointment"]').val("");
            $('[name="select-physician"]').val("");
            $('[name="select-chief"]').val("")
        }


//4- Add reminders input to Modal

        function getEncounterLabeledIdA(encounterId) {
            const event = firstThreeDraggableEvents.find(event => event.encounter_id === encounterId && event.encounter_labeled_id.includes("-a"));
            if (event) {
                if (event.encounter_labeled_id.includes("-a")) {
                    return {
                        encounter_labeled: event.encounter_labeled_id,
                        date: event.date,
                        time: event.startTime
                    }
                }
            }
        }

        function getEncounterLabeledIdB(encounterId) {
            const event = firstThreeDraggableEvents.find(event => event.encounter_id === encounterId && event.encounter_labeled_id.includes("-b"));
            if (event) {
                if (event.encounter_labeled_id.includes("-b")) {
                    return {
                        encounter_labeled: event.encounter_labeled_id,
                        date: event.date,
                        time: event.startTime
                    }
                }
            }
        }

        function getEncounterLabeledIdC(encounterId) {
            const event = firstThreeDraggableEvents.find(event => event.encounter_id === encounterId && event.encounter_labeled_id.includes("-c"));
            if (event) {
                if (event.encounter_labeled_id.includes("-c")) {
                    return {
                        encounter_labeled: event.encounter_labeled_id,
                        date: event.date,
                        time: event.startTime
                    }
                }
            }
        }


        function reminderOption1(encounterId) {
            const encounterLabeledId = getEncounterLabeledIdA(encounterId);
            console.log("encounter labeled id for option 1", encounterLabeledId)

            if (encounterLabeledId) {
                $('[name="event_id_reminder1"]').val(encounterLabeledId.encounter_labeled);
                console.log("event a", encounterLabeledId.encounter_labeled)
                $('[name="date1"]').val(encounterLabeledId.date);
                $('[name="time1"]').val(encounterLabeledId.time);
            }
        }

        function reminderOption2(encounterId) {
            const encounterLabeledId = getEncounterLabeledIdB(encounterId);
            console.log("encounter labeled id for option 2", encounterLabeledId)
            if (encounterLabeledId) {
                const eventA = firstThreeDraggableEvents.find(event => event.encounter_id === encounterId && event.encounter_labeled_id.includes('-a'));
                const eventB = firstThreeDraggableEvents.find(event => event.encounter_id === encounterId && event.encounter_labeled_id.includes('-b'));

                $('[name="event_id_reminder1"]').val(eventA.encounter_labeled_id);
                console.log("event a", eventA.encounter_labeled_id)
                $('[name="date1"]').val(eventA.date);
                $('[name="time1"]').val(eventA.startTime);


                $('[name="event_id_reminder2"]').val(eventB.encounter_labeled_id);
                console.log("event b", eventB.encounter_labeled_id)
                $('[name="date2"]').val(eventB.date);
                $('[name="time2"]').val(eventB.startTime);
            }
        }

        function reminderOption3(encounterId) {
            const encounterLabeledId = getEncounterLabeledIdC(encounterId);
            if (encounterLabeledId) {
                const eventA = firstThreeDraggableEvents.find(event => event.encounter_id === encounterId && event.encounter_labeled_id.includes('-a'));
                const eventB = firstThreeDraggableEvents.find(event => event.encounter_id === encounterId && event.encounter_labeled_id.includes('-b'));
                const eventC = firstThreeDraggableEvents.find(event => event.encounter_id === encounterId && event.encounter_labeled_id.includes('-c'));


                $('[name="event_id_reminder1"]').val(eventA.encounter_labeled_id);
                console.log("event a again", eventA.encounter_labeled_id)
                $('[name="date1"]').val(eventA.date);
                $('[name="time1"]').val(eventA.startTime);
                $('[name="event_id_reminder2"]').val(eventB.encounter_labeled_id);
                console.log("event b", eventB.encounter_labeled_id)
                $('[name="date2"]').val(eventB.date);
                $('[name="time2"]').val(eventB.startTime);


                $('[name="event_id_reminder3"]').val(eventC.encounter_labeled_id);
                $('[name="date3"]').val(eventC.date);
                $('[name="time3"]').val(eventC.startTime);
            }


        }


//5- clear date adn times in reminder modal
        function clearDateTime() {
            $('[name="date1"]').val("");
            $('[name="date2"]').val("");
            $('[name="date3"]').val("");
            $('[name="time1"]').val("");
            $('[name="time2"]').val("");
            $('[name="time3"]').val("");
            $('[name="event_id_reminder1"]').val("");
            $('[name="event_id_reminder2"]').val("");
            $('[name="event_id_reminder3"]').val("");
            //firstThreeDraggableEvents.length = 0;

        }


//SUBMIT FORMS
//1-submit the booking form and add the external events
        const bookingForm = document.getElementById("booking-form");
        const externalEvents = document.getElementById("external-events");


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
                    fcEventElement.id = 'draggable-' + response.encounter_id
                    externalEvents.appendChild(fcEventElement);


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

                    clearDateTime()
                    clearBookingForm()
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
                                const startTime = response.constructed_time1;
                                const endTime = new Date(startTime);
                                endTime.setMinutes(endTime.getMinutes() + 30)
                                var eventData = {
                                    id: response.event_id_a,
                                    title: response.patient_name + ' ' + response.family_name + ' ' + 'Unconfirmed',
                                    start: response.constructed_time1,
                                    end: endTime,
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
                                const startTime = response.constructed_time2;
                                const endTime = new Date(startTime);
                                endTime.setMinutes(endTime.getMinutes() + 30)
                                var eventDatab = {
                                    id: response.event_id_b,
                                    title: response.patient_name + ' ' + response.family_name + ' ' + 'Unconfirmed',
                                    start: response.constructed_time2,
                                    end: endTime,
                                    borderColor: "black",
                                    textColor: "black",
                                    backgroundColor: "orange",
                                    duration: "00:30",
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
                                const startTime = response.constructed_time3;
                                const endTime = new Date(startTime);
                                endTime.setMinutes(endTime.getMinutes() + 30)
                                var eventDatac = {
                                    id: response.event_id_c,
                                    title: response.patient_name + ' ' + response.family_name + ' ' + 'Unconfirmed',
                                    start: response.constructed_time3,
                                    end: endTime,
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

    }
)
;