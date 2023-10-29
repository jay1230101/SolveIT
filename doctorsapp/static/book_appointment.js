//render the calendar
document.addEventListener('DOMContentLoaded', function () {
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        timeZone: 'local',
        initialView: 'timeGridWeek',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'timeGridWeek,dayGridMonth,timeGridDay,listWeek',
        },
        expandRows: true,
        weekends: true,
        hiddenDays: [0],
        slotMinTime: "07:00:00",
        slotMaxTime: "19:00:00",
        navLinks: true,
        selectable: true,
        editable: true,

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

        eventContent: function (arg) {
            let eventContent = document.createElement('div');
            let timeText = arg.timeText;
            let patientName = arg.event.extendedProps.patientName;
            let familyName = arg.event.extendedProps.familyName;

            eventContent.innerHTML = `${timeText}: ${patientName}  ${familyName}`;
            return {domNodes: [eventContent]}

        },

        eventResize: function (info) {

            $("#resizeModal").modal('show')
            var event_id = info.event.id;
            console.log("the event id is ", event_id)
            var startEvent = info.event.start;
            var endEvent = info.event.end;
            var startStr = info.event.startStr;
            var endStr = info.event.endStr;

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

            $('[name="start-time"]').val(startFinal);
            $('[name="end-time"]').val(endFinal);
            $('[name="date"]').val(date);
            $('[name="hidden-start"]').val(startStr);
            $('[name="hidden-end"]').val(endStr);
            $('[name="event_id"]').val(event_id);
            $('[name="first-name"]').val(patientName);
            $('[name="family-name"]').val(familyName);
            $('[name="phone"]').val(phone)

        },

        eventDrop: function (info) {
            $("#dropModal").modal('show');

            var event_id = info.event.id;
            var startEvent = info.event.start;
            var endEvent = info.event.end;
            var startStr = info.event.startStr;
            var endStr = info.event.endStr;

            var date = startEvent.toISOString().slice(0, 10);

            var startHours = startEvent.getHours().toString().padStart(2, '0');
            var startMinutes = startEvent.getMinutes().toString().padStart(2, '0');
            var startFinal = startHours + ":" + startMinutes;

            var endHours = endEvent.getHours().toString().padStart(2, '0');
            var endMinutes = endEvent.getMinutes().toString().padStart(2, '0');
            var endFinal = endHours + ":" + endMinutes;

            var patientName = info.event.extendedProps.patientName;
            var familyName = info.event.extendedProps.familyName;
            var phone = info.event.extendedProps.phone;
            console.log("this is the phone number")


            $('[name="start-time"]').val(startFinal);
            $('[name="end-time"]').val(endFinal);
            $('[name="date"]').val(date);
            $('[name="hidden-start"]').val(startStr);
            $('[name="hidden-end"]').val(endStr);
            $('[name="event_id"]').val(event_id);
            $('[name="first-name"]').val(patientName);
            $('[name="family-name"]').val(familyName);
            $('[name="phone"]').val(phone)

            /*
            $("#appointmentModal").modal('show');
            var event_id = info.event.id;
            var resize = "1";
            var startEvent = info.event.start;
            var endEvent = info.event.end;
            var startStr = info.event.startStr;
            var endStr = info.event.endStr;

            var date = startEvent.toISOString().slice(0, 10);

            var startHours = startEvent.getHours().toString().padStart(2, '0');
            var startMinutes = startEvent.getMinutes().toString().padStart(2, '0');
            var startFinal = startHours + ":" + startMinutes;

            var endHours = endEvent.getHours().toString().padStart(2, '0');
            var endMinutes = endEvent.getMinutes().toString().padStart(2, '0');
            var endFinal = endHours + ":" + endMinutes;


            $('[name="start-time"]').val(startFinal);
            $('[name="end-time"]').val(endFinal);
            $('[name="date"]').val(date);
            $('[name="hidden-start"]').val(startStr);
            $('[name="hidden-end"]').val(endStr);
            $('[name="resize"]').val(resize);
            $('[name="event_id"]').val(event_id);

            */
        }


    });
    calendar.render();

//search for patient names
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

//show procedures when appointment type is procedure - original modal
    const appointmentType = document.querySelector('[name="select-appointment"]');
    const procedureType = document.querySelector('[name="procedure-group"]');
    appointmentType.addEventListener("change", function () {
        if (this.value === 'procedure') {
            procedureType.style.display = 'block';
        } else {
            procedureType.style.display = 'none';
        }

    });
    //show procedures when appointment type is procedure - resize modal
    const apptype = document.querySelector('[name="select-appointment-resize"]');
    const protype = document.querySelector('[name="procedure-group-resize"]');
    apptype.addEventListener("change", function () {
        if (this.value === 'procedure') {
            protype.style.display = 'block';
        } else {
            protype.style.display = 'none';
        }

    });

    //show procedures when appointment type is procedure - drop modal
    const appointype = document.querySelector('[name="select-appointment-drop"]');
    const procedtype = document.querySelector('[name="procedure-group-drop"]');
    appointype.addEventListener("change", function () {
        if (this.value === 'procedure') {
            procedtype.style.display = 'block';
        } else {
            procedtype.style.display = 'none';
        }

    });

// show instructions mapped with procedure type - original modal
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

    // show instructions mapped with procedure type - resize
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

    // show instructions mapped with procedure type - drag and drop
    const prByType = document.querySelector('[name="select-procedure-drop"]');

    prByType.addEventListener("change", async (event) => {
        event.preventDefault();
        queryInput = prByType.value
        const response = await fetch(`/search_procedure?query=${queryInput}`)
        const data = await response.json();
        const prior_instruction = document.getElementById("prior-reminder-drop");
        const prior_instruction_label = document.getElementById("prior-reminder-label-drop");
        const post_instruction = document.getElementById("post-reminder-drop");
        const post_instruction_label = document.getElementById("post-reminder-label-drop");

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

//submit booking appointment form
    const bookingForm = document.getElementById("booking-form");
    bookingForm.onsubmit = function (event) {
        event.preventDefault()
        $.ajax({
            type: 'POST',
            url: '/book_appointment',
            data: $("#booking-form").serialize(),
            dataType: 'json',
            success: function (response) {

                var eventData = {
                    id: response.encounter_id,
                    title: 'Booked Appointment',
                    start: response.start_time,
                    end: response.end_time,
                    extendedProps: {
                        patientName: response.patient_name,
                        familyName: response.family_name,
                        phone: response.phone

                    }

                };

                var newEvent = calendar.addEvent(eventData);
                var generatedId = newEvent.id;
                var getgeneratedId = calendar.getEventById(generatedId)
                $('#appointmentModal').modal('hide')
            },
            error: function (xhr, status, error) {
                console.log('Error', error)
            }

        })
    };

    //submit resize form
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

    const dropForm = document.getElementById("drop-form");
    dropForm.onsubmit = function (event) {
        event.preventDefault()
        $.ajax({
            type: 'POST',
            url: '/drop_appointment',
            data: $("#drop-form").serialize(),
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
                        phone: response.phone

                    }

                };

                var newEvent = calendar.addEvent(eventData);
                $('#dropModal').modal('hide')
            },
            error: function (xhr, status, error) {
                console.log('Error', error)
            }

        })
    };

})




