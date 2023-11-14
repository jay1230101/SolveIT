from google_auth_oauthlib.flow import InstalledAppFlow
from google.oauth2.credentials import Credentials
from flask import request, render_template, flash, url_for, redirect, Blueprint, jsonify, session
from .forms import *
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user, login_required, logout_user, current_user
from .user import User
from flask_mail import Message
from .extensions import db, mail
from .models import *
from sqlalchemy import and_

import string, secrets, os, json

main = Blueprint('main', __name__)
# company email for gmail password
company_email = "johny.achkar02@gmail.com"
email_content = "Dear User, this is your token to reset your password. Kindly reset within 2 minutes before it gets expired"
email_subject = "Password Change"
GMAIL_SCOPES = ['https://www.googleapis.com/auth/gmail.compose']


def get_gmail_credential():
    creds = None
    current_script_path = os.path.abspath(__file__)
    current_script_directory = os.path.dirname(current_script_path)
    resources = os.path.join(current_script_directory, "resources")
    credentials_file = f"{resources}/json_file.json"
    # token.json should be created when you run the function
    if os.path.exists('token.json'):
        with open('token.json', 'r') as token_file:
            credentials_data = token_file.read()
            creds = Credentials.from_authorized_user_info(json.loads(credentials_data))

    if not creds or not creds.valid:
        flow = InstalledAppFlow.from_client_secrets_file(credentials_file, GMAIL_SCOPES)
        creds = flow.run_local_server(port=0)

        with open('token.json', 'w') as token_file:
            token_file.write(creds.to_json())
    return creds


@main.route('/', methods=['POST', 'GET'])
def home():
    form = UserForm()
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')

        doctor = Doctors.query.filter_by(email=email).first()
        secretary = Secretaries.query.filter_by(email=email).first()
        admin = Admin.query.filter_by(email=email).first()

        if doctor is not None:
            doctor_password = doctor.hashed_password
            if check_password_hash(doctor_password, password) and (doctor.status == "active"):
                login_user(User('doctor', doctor.id), remember=True)
                return redirect(url_for('main.features'))

        elif secretary is not None:
            secretary_password = secretary.hashed_password
            if check_password_hash(secretary_password, password) and (secretary.status == "active"):
                login_user(User('secretary', secretary.id), remember=True)
                return redirect(url_for('main.features'))

        elif admin is not None:
            admin_password = admin.hashed_password
            if check_password_hash(admin_password, password) and (admin.status == "active"):
                login_user(User('admin', admin.id), remember=True)
                return redirect(url_for('main.admin_dashboard'))
        else:
            flash("Your credentials are incorrect !")
            return redirect(url_for('main.home'))

    return render_template("index.html", form=form)


@main.route('/features', methods=['GET', 'POST'])
def features():
    return render_template("features.html")


@main.route('/register_patient', methods=['GET', 'POST'])
def register_patient():
    form = registrationForm()
    if request.method == 'POST':
        name = request.form.get('name')
        name = name.capitalize()
        father = request.form.get('father')
        father = father.capitalize()
        family = request.form.get('family')
        family = family.capitalize()
        dob = request.form.get('dob')
        print("the dob is ",dob)
        gender = request.form.get('gender')
        phone = request.form.get('phone')
        email = request.form.get('email')
        city = request.form.get('city')
        registration = patientRegistrationInfo.query.filter(
            and_(
                patientRegistrationInfo.email == email,
                patientRegistrationInfo.phone == phone
            )
        ).first()
        if not registration:
            new_registration = patientRegistrationInfo(
                name=name,
                father=father,
                family=family,
                dob=dob,
                gender=gender,
                phone=phone,
                email=email,
                city=city,
                registered_by_who=current_user.get_id()
            )
            db.session.add(new_registration)
            db.session.commit()
            return redirect(url_for('main.book_appointment'))
        else:
            return redirect(url_for('main.book_appointment'))

    return render_template("register_patient.html", form=form)


@main.route('/book_appointment', methods=['GET', 'POST'])
def book_appointment():
    if request.method == 'POST':
        name = request.form.get('first-name')
        name = name.capitalize()
        family = request.form.get('family-name')
        family = family.capitalize()
        father = request.form.get('fathers')
        phone = request.form.get('phone')
        freeText=request.form.get('free-text')
        date = request.form.get('date')
        start_time = request.form.get('start-time')

        hidden_start_time = request.form.get('hidden-start')

        hidden_end_time = request.form.get('hidden-end')

        end_time = request.form.get('end-time')
        appointment_type = request.form.get('select-appointment')
        treating_physician = request.form.get('select-physician')
        procedure_type = request.form.get('select-procedure')
        chief_complaint = request.form.get('select-chief')
        booking_confirmation = request.form.get('booking_reminder')
        appointment_confirmation = request.form.get('appointment_reminder')
        weather = request.form.get('weather_reminder')
        traffic = request.form.get('traffic_reminder')
        prior_proc_reminder = request.form.get('prior_procedure_reminder')
        post_proc_reminder = request.form.get('post_procedure_reminder')

        doctor_instance = Doctors.query.filter_by(email=treating_physician).first()
        doctor_name = doctor_instance.name
        doctor_family = doctor_instance.family
        fullDoctorName = doctor_name + "" + doctor_family

        # get the dob of the patient and other params
        dob_instance=patientRegistrationInfo.query.filter(
            and_(
                phone==phone,
                name==name,
            )
        ).first()
        dob_attr=dob_instance.dob.strftime("%Y-%m-%d")
        patient_dob_formated = datetime.strptime(dob_attr, "%Y-%m-%d").strftime("%d %B %Y")
        session['dob']=patient_dob_formated



        session['patientName']=name
        session['familyName']=family
        session['phone']=phone



        new_encounter = bookingEncounter(
            date=date,
            start_time=start_time,
            end_time=end_time,
            patient_name=name,
            patient_family_name=family,
            patient_fathers_name=father,
            phone=phone,
            appointment_type=appointment_type,
            procedure_type=procedure_type,
            treating_physician=treating_physician,
            chief_complaint=chief_complaint,
            bookingConfirmation=booking_confirmation,
            appointmentReminder=appointment_confirmation,
            weatherReminder=weather,
            trafficReminder=traffic,
            priorProcedureInstructions=prior_proc_reminder,
            postProcedureInstructions=post_proc_reminder
        )
        db.session.add(new_encounter)
        db.session.commit()

        encounter_id = new_encounter.id

        response = {
            'start_time': hidden_start_time,
            'end_time': hidden_end_time,
            'patient_name': name,
            'family_name': family,
            'encounter_id': encounter_id,
            'encounter_id_a': str(encounter_id) + '-' + 'a',
            'encounter_id_b': str(encounter_id) + '-' + 'b',
            'encounter_id_c': str(encounter_id) + '-' + 'c',
            'phone': phone,
            'appointment': appointment_type,
            'treating_physician': fullDoctorName,
            'free_text':freeText


        }
        return jsonify(response)

    return render_template("book_appointment.html")


@main.route('/resize_appointment', methods=['GET', 'POST'])
def resize_appointment():
    if request.method == 'POST':
        date = request.form.get('date-edit')
        name = request.form.get('first-name-edit')
        family = request.form.get('family-name-edit')
        eventID = request.form.get('event_id')
        start_time = request.form.get('start-time-edit')
        phone = request.form.get('phone-edit')
        end_time = request.form.get('end-time-edit')
        constructed_start_time = date + "T" + start_time + ":00+03:00"
        constructed_end_time = date + "T" + end_time + ":00+03:00"
        appointment_type = request.form.get('select-appointment-resize')
        booking_confirmation = request.form.get('booking_reminder')
        appointment_confirmation = request.form.get('appointment_reminder')
        weather = request.form.get('weather_reminder')
        traffic = request.form.get('traffic_reminder')
        prior_proc_reminder = request.form.get('prior_procedure_reminder')
        post_proc_reminder = request.form.get('post_procedure_reminder')
        event_encounter = bookingEncounter.query.filter_by(id=eventID).first()
        if event_encounter:
            event_encounter.date = date,
            event_encounter.start_time = start_time,
            event_encounter.end_time = end_time,
            event_encounter.bookingConfirmation = booking_confirmation,
            event_encounter.appointmentReminder = appointment_confirmation,
            event_encounter.weatherReminder = weather,
            event_encounter.trafficReminder = traffic,
            event_encounter.priorProcedureInstructions = prior_proc_reminder,
            event_encounter.postProcedureInstructions = post_proc_reminder

            db.session.commit()

            response = {
                'start_time': constructed_start_time,
                'end_time': constructed_end_time,
                'patient_name': name,
                'family_name': family,
                'encounter_id': eventID,
                'phone': phone,
                'appointment': appointment_type
            }
            return jsonify(response)
        else:
            flash("Event encounter not found")
            return render_template("book_appointment.html")

    return render_template("book_appointment.html")


@main.route('/suggested_appointments', methods=['GET', 'POST'])
def suggested_appointments():
    if request.method == 'POST':
        event_id = request.form.get('original_event_id')
        event_id_a = request.form.get('event_id_reminder1')
        event_id_b = request.form.get('event_id_reminder2')
        event_id_c = request.form.get('event_id_reminder3')
        saveButton = request.form.get('button-clicked')

        sendPatientButton = request.form.get('submit-patient')

        booking_encounter = bookingEncounter.query.filter_by(id=event_id).first()
        patient_name = booking_encounter.patient_name
        family_name = booking_encounter.patient_family_name
        # date1 is for the reminder Modal format
        date1 = request.form.get("date1")
        # time1 is for the reminder Modal format
        time1 = request.form.get("time1")
        # constructed time1 is for the calendar format
        constructed_time1 = date1 + "T" + time1 + ":00+03:00"

        date2 = request.form.get("date2")
        if not date2:
            date2 = None
        time2 = request.form.get("time2")

        constructed_time2 = None
        if not time2:
            time2 = None
        else:
            constructed_time2 = date2 + "T" + time2 + ":00+03:00"

        date3 = request.form.get("date3")

        if not date3:
            date3 = None
        time3 = request.form.get("time3")

        constructed_time3 = None
        if not time3:
            time3 = None
        else:
            constructed_time3 = date3 + "T" + time3 + ":00+03:00"

        booking_reminder = request.form.get("booking_reminder")
        appointment_reminder = request.form.get("appointment_reminder")
        weather_reminder = request.form.get("weather_reminder")
        traffic_reminder = request.form.get("traffic_reminder")

        def saveReminderA():
            suggested_appt = suggestedAppointments(
                event_id=event_id,
                event_id_a=event_id_a,
                event_id_b=event_id_b,
                event_id_c=event_id_c,
                booking_reminder=booking_reminder,
                appointment_reminder=appointment_reminder,
                weather_reminder=weather_reminder,
                traffic_reminder=traffic_reminder,
                date1=date1,
                time1=time1,
                date2=date2,
                time2=time2,
                date3=date3,
                time3=time3,

            )
            db.session.add(suggested_appt)
            db.session.commit()
            response = {
                'event_id': event_id,
                'patient_name': patient_name,
                'family_name': family_name,
                'event_id_a': event_id_a,
                'time1ISO': constructed_time1,
                'date1': date1,
                'time1': time1,
                'message':'Your Message is Sent Successfully'
            }
            return jsonify(response)

        def saveReminderB():
            event = suggestedAppointments.query.filter_by(event_id=event_id).first()
            event.event_id_b = event_id_b,
            event.booking_reminder = booking_reminder,
            event.appointment_reminder = appointment_reminder,
            event.weather_reminder = weather_reminder,
            event.traffic_reminder = traffic_reminder,
            event.date2 = date2,
            event.time2 = time2

            db.session.commit()
            response = {
                'event_id': event_id,
                'patient_name': patient_name,
                'family_name': family_name,
                'event_id_b': event_id_b,
                'time2ISO': constructed_time2,
                'date1': date1,
                'time1': time1,
                'date2': date2,
                'time2': time2
            }
            return jsonify(response)

        def saveReminderC():
            event = suggestedAppointments.query.filter_by(event_id=event_id).first()
            event.event_id_c = event_id_c,
            event.booking_reminder = booking_reminder,
            event.appointment_reminder = appointment_reminder,
            event.weather_reminder = weather_reminder,
            event.traffic_reminder = traffic_reminder,
            event.date3 = date3,
            event.time3 = time3

            db.session.commit()

            response = {
                'event_id': event_id,
                'patient_name': patient_name,
                'family_name': family_name,
                'event_id_c': event_id_c,
                'time3ISO': constructed_time3
            }
            return jsonify(response)

        if (saveButton == "save-form" and event_id_a and not event_id_b and not event_id_c):
            return saveReminderA()
        elif (saveButton == 'save-form' and event_id_a and event_id_b and not event_id_c):
            return saveReminderB()
        elif (saveButton == 'save-form' and event_id_a and event_id_b and event_id_c):
            return saveReminderC()


        if(sendPatientButton =='submit-patient' and event_id_a and not event_id_b and not event_id_c):
            return saveReminderA()
            # send an email to the patient
        elif(sendPatientButton =='submit-patient' and event_id_a and event_id_b and not event_id_c):
            return saveReminderB()
            # send an email to the patient
        elif (sendPatientButton=='submit-patient' and event_id_a and event_id_b and event_id_c):
            return saveReminderC()
            # send an email to the patient




@main.route('/emr', methods=['GET', 'POST'])
def emr():
    patient_dob=session.get('dob')
    patient_name=session.get('patientName')
    family_name=session.get('familyName')
    phone=session.get('phone')

    return render_template("emr.html",dob=patient_dob,name=patient_name,family=family_name,phone=phone)




@main.route('/search_patient', methods=['GET', 'POST'])
def search_patient():
    query = request.args.get('query', '').lower()
    matching_names = patientRegistrationInfo.query.filter(patientRegistrationInfo.name.ilike(f"%{query}")).all()
    results = []
    for patient in matching_names:
        results.append({
            'id': patient.id,
            'name': patient.name,
            'father': patient.father,
            'family': patient.family,
            'phone': patient.phone,
            'email': patient.email,
        })
    return jsonify(results)


@main.route('/search_procedure', methods=['GET', 'POST'])
def search_procedure():
    query = request.args.get('query', '').strip()
    if not query:
        response = {
            'prior_instruction': '',
            'post_instruction': ''
        }
        return jsonify(response)

    procedure_query = procedure_type.query.filter_by(description=query).first()
    if procedure_query:
        procedure_prior_instruction = procedure_query.prior_procedure_reminder
        procedure_post_instruction = procedure_query.post_procedure_reminder
        response = {
            'prior_instruction': procedure_prior_instruction,
            'post_instruction': procedure_post_instruction
        }
        return jsonify(response)


def generate_token():
    alphabet = string.ascii_letters + string.digits
    token = ''.join(secrets.choice(alphabet) for _ in range(9))
    return token


@main.route('/change_password', methods=['GET', 'POST'])
def change_password():
    form = UserForm()
    if request.method == 'POST':
        get_gmail_credential()
        email = request.form.get('email')
        doctor_email = Doctors.query.filter_by(email=email).first()
        assistant_email = Secretaries.query.filter_by(email=email).first()
        admin_email = Admin.query.filter_by(email=email).first()

        if not doctor_email or not assistant_email or not admin_email:
            flash("Your Email is Incorrect ...")
            return redirect('main.change_password')
        elif doctor_email or assistant_email or admin_email:
            generated_token = generate_token()
            msg = Message(subject=email_subject, recipients=[email])
            msg.body = f"{email_content}\nToken:{generated_token}"
            new_token = Token(
                token=generated_token,
                email=email
            )
            db.session.add(new_token)
            db.session.committ()
            try:
                mail.send(msg)
                return redirect(url_for('main.add_token', token=generated_token))
            except Exception as e:
                flash(f"Error sending your token:{str(e)}")
                return redirect(url_for('main.home'))
        else:
            flash("Incorrect Email ...")
            return redirect(url_for('main.change_password'))

    return render_template("change_password.html", form=form)


@main.route('/add_token', methods=['GET', 'POST'])
def add_token():
    form = UserForm()
    if request.method == 'POST':
        token = request.form.get('password')
        tok = Token.query.filter_by(token=token).first()
        if tok and tok.expiry_time > datetime.utcnow():
            return redirect(url_for('main.change_password_final'))
        else:
            flash("Incorrect token or expired")
            return redirect(url_for('main.change_password'))
    return render_template("add_token.html", form=form)


@main.route('/change_password_final', methods=['GET', 'POST'])
def change_password_final():
    form = UserForm()
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        verified_password = request.form.get('verify_password')
        hashed_verified_password = generate_password_hash(verified_password,
                                                          method='pbkdf2:sha256')
        doc = Doctors.query.filter_by(email=email).first()
        assistant = Secretaries.query.filter_by(email=email).first()
        admin = Admin.query.filter_by(email=email).first()
        if doc and password == verified_password:
            doc.password = verified_password
            doc.hashed_password = hashed_verified_password
            db.session.commit()
            return redirect(url_for('main.home'))
        elif assistant and password == verified_password:
            assistant.password = verified_password
            assistant.hashed_password = hashed_verified_password
            db.session.commit()
            return redirect(url_for('main.home'))
        elif admin and password == verified_password:
            admin.password = verified_password
            admin.hashed_password = hashed_verified_password
            db.session.commit()
            return redirect(url_for('main.home'))
        else:
            return redirect(url_for('main.change_password'))

    return render_template("change_password_final.html", form=form)


@main.route('/add_doctors', methods=['GET', 'POST'])
@login_required
def add_doctors():
    if current_user.user_type == 'admin':
        if request.method == 'POST':
            name = request.form.get('name')
            family = request.form.get('family')
            father = request.form.get('father')
            phone = request.form.get('phone')
            email = request.form.get('email')
            password = request.form.get('password')
            type = request.form.get('type')
            hashed_and_salted = generate_password_hash(password,
                                                       method='pbkdf2:sha256')
            specialty = request.form.get('specialty')
            status = request.form.get('status')

            new_doctor = Doctors.query.filter_by(email=email).first()
            if new_doctor:
                flash("Data already available")
                return redirect(url_for('main.add_doctors'))

            new_doc = Doctors(
                name=name,
                family=family,
                father=father,
                phone=phone,
                email=email,
                password=password,
                type=type,
                hashed_password=hashed_and_salted,
                specialty=specialty,
                status=status
            )
            db.session.add(new_doc)
            db.session.commit()
        return render_template("add_doctors.html")
    else:
        flash("You don't have permission to access this page")
        return redirect(url_for('main.home'))


@main.route('/add_assistant', methods=['GET', 'POST'])
@login_required
def add_assistant():
    if request.method == 'POST':
        name = request.form.get('name')
        father = request.form.get('father')
        family = request.form.get('family')
        phone = request.form.get('phone')
        email = request.form.get('email')
        password = request.form.get('password')
        type = request.form.get('type')
        hashed_and_salted = generate_password_hash(password,
                                                   method='pbkdf2:sha256')
        doctor_email = request.form.get('doctor_email')
        status = request.form.get('status')

        secretary = Secretaries.query.filter_by(email=email).first()
        if secretary:
            flash("Data Already available")
            return redirect(url_for('add_assistant'))
        doctor_instance = Doctors.query.filter_by(email=doctor_email).first()
        doctor_id = doctor_instance.id
        new_secretary = Secretaries(
            name=name,
            family=family,
            father=father,
            email=email,
            type=type,
            phone=phone,
            password=password,
            hashed_password=hashed_and_salted,
            status=status,
            doctor_id=doctor_id
        )
        db.session.add(new_secretary)
        db.session.commit()

    return render_template('add_assistant.html')


@main.route('/deactivate_user', methods=['GET', 'POST'])
def deactivate_user():
    if request.method == 'POST':
        email = request.form.get('email')
        print(email)
        status = request.form.get('status')
        print(status)

        doctor = Doctors.query.filter_by(email=email).first()
        assistant = Secretaries.query.filter_by(email=email).first()
        if doctor:
            doctor.status = status
            db.session.commit()
            return redirect(url_for('main.home'))
        elif assistant:
            assistant.status = status
            db.session.commit()
            return redirect(url_for('main.home'))
        else:
            flash("User is not in our database")
            return redirect(url_for('main.deactivate_user'))

    return render_template("deactivate_user.html")


@main.route('/add_admin', methods=['GET', 'POST'])
def add_admin():
    if request.method == 'POST':
        name = request.form.get('name')
        family = request.form.get('family')
        email = request.form.get('email')
        password = request.form.get('password')
        hashed_password = generate_password_hash(password,
                                                 method='pbkdf2:sha256')
        status = request.form.get('status')
        type = request.form.get('type')
        admin = Admin.query.filter_by(email=email).first()
        if not admin:
            new_admin = Admin(
                name=name,
                family=family,
                email=email,
                password=password,
                hashed_password=hashed_password,
                status=status,
                type=type,
            )
            db.session.add(new_admin)
            db.session.commit()
        else:
            flash("Admin already available in data")
            return redirect(url_for('main.home'))
    return render_template("add_admin.html")


@main.route('/admin', methods=['GET', 'POST'])
@login_required
def admin_dashboard():
    return render_template("admin_dashboard.html")


@main.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('main.home'))
