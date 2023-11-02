document.addEventListener('DOMContentLoaded', function () {
    var Calendar = FullCalendar.Calendar;
    var Draggable = FullCalendar.Draggable;
    var calendarEl = document.getElementById('calendar');
    const lastUsedEncounterIds = {};

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

            // Increment the encounter ID by 1
            if (!lastUsedEncounterIds[encounterId]) {
                lastUsedEncounterIds[encounterId] = parseInt(encounterId);
            }
            lastUsedEncounterIds[encounterId]++;
            const encounterIdDragged = lastUsedEncounterIds[encounterId];

            // Check if the limit has been reached (3 draggable events)
            if (lastUsedEncounterIds[encounterId] - parseInt(encounterId) > 3) {
                alert("You have reached the maximum number of draggable events for this encounter ID.");
                info.revert(); // Revert the draggable event back to its original position
                return;
            }


            console.log("the encounter id is:", encounterId);
            console.log("the dragged encounter id is:", encounterIdDragged);
            $("#reminderModal").modal('show');

            if (checkbox.checked) {
                // if so, remove the element from the "Draggable Events" list
                info.draggedEl.parentNode.removeChild(info.draggedEl);
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
        },

        eventResize: function (info) {

            $("#resizeModal").modal('show')
            editAppointment(info)

        },
        eventDrop: function (info) {
            $("#resizeModal").modal('show');
            editAppointment(info)

        },
        eventClick: function (info) {
            var event_id = info.event.id;
            console.log("the evento ido ", event_id)
            var get_event_id = calendar.getEventById(event_id);
            $('#clickModal').modal('show');
            const rescheduleText = document.getElementById("rescheduling");
            const rescheduleImage = document.getElementById("rescheduling-img");
            const deleteText = document.getElementById("deleting");
            const deleteImage = document.getElementById("delete-img");
            const draggableEvent = document.querySelector('.fc-event');


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

                if (get_event_id) {
                    get_event_id.remove();
                }

                const draggableEvent = document.querySelector('.fc-event[data-encounter-id="' + event_id + '"]')
                if (draggableEvent) {
                    draggableEvent.remove();
                }


            });

            deleteImage.addEventListener("click", function () {
                $("#clickModal").modal('hide');
                if (get_event_id) {
                    get_event_id.remove();
                }

                const draggableEvent = document.querySelector('.fc-event[data-encounter-id="' + event_id + '"]')
                if (draggableEvent) {
                    draggableEvent.remove();
                }


            });


        },

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
                        appointment: response.appointment
                    }
                };

                // Create a new fcEventElement for each event
                const fcEventElement = document.createElement("div");
                fcEventElement.classList.add("fc-event", "fc-h-event", "fc-daygrid-event", "fc-daygrid-block-event");
                fcEventElement.innerHTML = `<b>${response.patient_name} ${response.family_name}</b><br> <b>Unconfirmed</b>`;
                fcEventElement.style.backgroundColor = 'orange';
                fcEventElement.dataset.encounterId = response.encounter_id
                externalEvents.appendChild(fcEventElement);

                new Draggable(fcEventElement, {
                    eventData: {
                        title: fcEventElement.innerText,
                        duration: "00:30",
                        backgroundColor: "orange",
                        borderColor: "black",
                        textColor: "black",
                        id: fcEventElement.encounterId
                    },
                });
                console.log("this is the event data", eventData)


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
                    title: 'Booked Appointment',
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

});
