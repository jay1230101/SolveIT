from .extensions import db
from sqlalchemy.ext.hybrid import hybrid_property
from datetime import datetime, timedelta
class Doctors(db.Model):
    __tablename__ = 'doctors'
    id = db.Column(db.Integer, primary_key=True)
    type=db.Column(db.String(255))
    name = db.Column(db.String(255))  # Specify a length (e.g., 255)
    family = db.Column(db.String(255))  # Specify a length
    father = db.Column(db.String(255))  # Specify a length
    phone = db.Column(db.String(20))  # You can specify the length for other columns as well
    email = db.Column(db.String(255))
    password = db.Column(db.String(255))
    hashed_password=db.Column(db.String(255))
    specialty = db.Column(db.String(255))
    status = db.Column(db.String(255))
    secretaries = db.relationship('Secretaries', back_populates='doctor')
    contact_us = db.relationship('ContactUs', back_populates='doctor_contact')

class Secretaries(db.Model):
    __tablename__='secretary'
    id=db.Column(db.Integer,primary_key=True)
    type=db.Column(db.String(255))
    name=db.Column(db.String(255))
    family=db.Column(db.String(255))
    father=db.Column(db.String(255))
    phone=db.Column(db.String(255))
    email=db.Column(db.String(255),unique=True)
    password=db.Column(db.String(255))
    hashed_password=db.Column(db.String(255))
    status=db.Column(db.String(255))
    doctor_id=db.Column(db.Integer,db.ForeignKey('doctors.id'))
    doctor = db.relationship('Doctors',back_populates='secretaries')

class Admin(db.Model):
    __tablename__='admin'
    id=db.Column(db.Integer,primary_key=True)
    type=db.Column(db.String(255))
    name=db.Column(db.String(255))
    family=db.Column(db.String(255))
    email=db.Column(db.String(255))
    password=db.Column(db.String(255))
    hashed_password=db.Column(db.String(255))
    status=db.Column(db.String(255))

class patientRegistrationInfo(db.Model):
    __tablename__='patient_registration_info'
    id=db.Column(db.Integer, primary_key=True)
    name=db.Column(db.String(255))  # Specify a length (e.g., 255)
    family=db.Column(db.String(255))  # Specify a length
    father=db.Column(db.String(255))  # Specify a length
    dob=db.Column(db.Date())
    age = db.Column(db.Integer)
    phone=db.Column(db.String(255))
    gender=db.Column(db.String(255))  # Specify a length
    email=db.Column(db.String(255))  # Specify a length
    street_address=db.Column(db.String(255))  # Specify a length
    city = db.Column(db.String(255))  # Specify a length
    country = db.Column(db.String(255))  # Specify a length
    registered_by_who=db.Column(db.String(255))  # Specify a length
    order_patient=db.relationship('Orders_by_Encounter', back_populates='patient_order')
    medication_patient=db.relationship('PrescriptionByEncounter', backref='medication_ord')

    @hybrid_property
    def age(self):
        if self.dob:
            dob = self.dob
            today = datetime.today()
            age = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))
            return age
        return None

class bookingEncounter(db.Model):
    __tablename__ = 'booking_encounter'
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date())
    start_time = db.Column(db.Time())
    end_time = db.Column(db.Time())
    patient_name = db.Column(db.String(255))  # Specify the maximum length (e.g., 255)
    patient_family_name = db.Column(db.String(255))  # Specify the maximum length
    patient_fathers_name = db.Column(db.String(255))  # Specify the maximum length
    phone = db.Column(db.String(20))  # You can specify length for other columns as well
    appointment_type = db.Column(db.String(255))
    procedure_type = db.Column(db.String(255))
    treating_physician = db.Column(db.String(255))
    chief_complaint = db.Column(db.String(255))
    bookingConfirmation = db.Column(db.String(255))
    appointmentReminder = db.Column(db.String(255))
    weatherReminder=db.Column(db.String(255))
    trafficReminder=db.Column(db.String(255))
    priorProcedureInstructions = db.Column(db.String(255))
    postProcedureInstructions = db.Column(db.String(255))
    booked_by_who = db.Column(db.String(255))


class suggestedAppointments(db.Model):
    __tablename__='suggested_appointments'
    id=db.Column(db.Integer,primary_key=True)
    event_id=db.Column(db.String(255))
    event_id_a=db.Column(db.String(255))
    event_id_b=db.Column(db.String(255))
    event_id_c=db.Column(db.String(255))
    booking_reminder=db.Column(db.String(255))
    appointment_reminder=db.Column(db.String(255))
    weather_reminder=db.Column(db.String(255))
    traffic_reminder=db.Column(db.String(255))
    date1=db.Column(db.Date())
    time1=db.Column(db.Time())
    date2=db.Column(db.Date())
    time2=db.Column(db.Time())
    date3=db.Column(db.Date())
    time3=db.Column(db.Time())
    approved_date=db.Column(db.Date())
    approved_time=db.Column(db.Time())

class EMR_by_Encounter(db.Model):
    __tablename__='emr_by_encounter'
    id=db.Column(db.Integer,primary_key=True)
    date=db.Column(db.Date())
    past_medical_history=db.Column(db.String(255))
    patient_assessment=db.Column(db.String(255))
    patient_id=db.Column(db.Integer)


class appointment_type(db.Model):
    __tablename__='appointmenttype'
    id=db.Column(db.Integer,primary_key=True)
    code =db.Column(db.String(255))
    description=db.Column(db.String(255))
    rate=db.Column(db.Numeric())
    booking_reminder=db.Column(db.String(255))
    appointment_reminder=db.Column(db.String(255))
    weather_reminder=db.Column(db.String(255))
    traffic_reminder=db.Column(db.String(255))

class procedure_type(db.Model):
    __tablename__='proceduretype'
    id=db.Column(db.Integer,primary_key=True)
    code=db.Column(db.String(255))
    description=db.Column(db.String(255))
    rate = db.Column(db.Numeric())
    prior_procedure_reminder=db.Column(db.String(255))
    post_procedure_reminder=db.Column(db.String(255))




class chief_complaint(db.Model):
    __tablename__='chiefcomplaint'
    id=db.Column(db.Integer,primary_key=True)
    description=db.Column(db.String(255))
    general_surgery=db.Column(db.Boolean())
    cardiology=db.Column(db.Boolean())
    dentistry=db.Column(db.Boolean())






















class Orders(db.Model):
    __tablename__='orders'
    id=db.Column(db.Integer,primary_key=True)
    order_code = db.Column(db.String(255))
    order_type=db.Column(db.String(255))
    order_description=db.Column(db.String(255))
    order_price=db.Column(db.Numeric())

class DiagnosticOrders(db.Model):
    __tablename__='diagnostic_orders'
    id=db.Column(db.Integer,primary_key=True)
    order_id=db.Column(db.Integer,db.ForeignKey('orders_by_encounter.id'))
    service_code=db.Column(db.String(255))
    service_description=db.Column(db.String(255))
    service_price=db.Column(db.String(255))
    remark=db.Column(db.String(255))


class Orders_by_Encounter(db.Model):
    __tablename__='orders_by_encounter'
    id=db.Column(db.Integer,primary_key=True)
    data=db.Column(db.Date())
    patient_id=db.Column(db.Integer,db.ForeignKey('patient_registration_info.id'))
    patient_order=db.relationship('patientRegistrationInfo',back_populates='order_patient')
    diagnostic_orders=db.relationship('DiagnosticOrders',backref='diagnostic',lazy='dynamic')


class Prescription(db.Model):
    __tablename__='prescription'
    id=db.Column(db.Integer,primary_key=True)
    prescription_code=db.Column(db.String(255))
    prescription_description=db.Column(db.String(255))
    prescription_price=db.Column(db.Numeric())


class MedicationOrder(db.Model):
    __tablename__='medication_order'
    id=db.Column(db.Integer,primary_key=True)
    prescription_id=db.Column(db.Integer,db.ForeignKey('prescription_by_encounter.id'))
    medication_code=db.Column(db.String(255))
    medication_desription=db.Column(db.String(255))
    medication_dose=db.Column(db.String(255))
    medication_frequency=db.Column(db.Integer)
    medication_duration=db.Column(db.String(255))
    medication_food_relation=db.Column(db.String(255))
    medication_start_date=db.Column(db.Date())
    medication_price=db.Column(db.Numeric())

class PrescriptionByEncounter(db.Model):
    __tablename__='prescription_by_encounter'
    id=db.Column(db.Integer,primary_key=True)
    date=db.Column(db.Date())
    patient_id=db.Column(db.Integer,db.ForeignKey('patient_registration_info.id'))
    medication_orders=db.relationship('MedicationOrder',backref='prescription',lazy='dynamic')

class procedureDetails(db.Model):
    __tablename__='procedure_details'
    id=db.Column(db.Integer,primary_key=True)
    procedure_code=db.Column(db.Integer)
    procedure_description=db.Column(db.String(255))
    procedure_price_center1=db.Column(db.Numeric())
    procedure_price_center2=db.Column(db.Numeric())
    procedure_price_center3=db.Column(db.Numeric())
    procedure_price_center4 = db.Column(db.Numeric())
    procedure_price_center5 = db.Column(db.Numeric())
    procedure_price_center6 = db.Column(db.Numeric())
    procedure_price_center7 = db.Column(db.Numeric())
    procedure_price_center8 = db.Column(db.Numeric())
    procedure_price_center9 = db.Column(db.Numeric())


class patientBill(db.Model):
    __tablename__='patient_bill'
    id=db.Column(db.Integer,primary_key=True)
    appointment_date=db.Column(db.Date())
    receipt_number=db.Column(db.String(255))
    patient_name=db.Column(db.String(255))
    family=db.Column(db.String(255))
    charge_code1 = db.Column(db.String(255))
    code_description1 = db.Column(db.String(255))
    gross_amount1 = db.Column(db.Numeric())
    discount1 = db.Column(db.Float())
    net_amount1 = db.Column(db.Numeric())
    charge_code2 = db.Column(db.String(255))
    code_description2 = db.Column(db.String(255))
    gross_amount2 = db.Column(db.Numeric())
    discount2 = db.Column(db.Float())
    net_amount2 = db.Column(db.Numeric())
    charge_code3 = db.Column(db.String(255))
    code_description3 = db.Column(db.String(255))
    gross_amount3 = db.Column(db.Numeric())
    discount3 = db.Column(db.Float())
    net_amount3 = db.Column(db.Numeric())
    paid = db.Column(db.Numeric())

class ContactUs(db.Model):
    __tablename__='contact_us'
    id=db.Column(db.Integer,primary_key=True)
    name=db.Column(db.String(255))
    email=db.Column(db.String(255))
    phone=db.Column(db.String(255))
    message=db.Column(db.String(255))
    date=db.Column(db.DateTime,default=datetime.utcnow)
    doctor_id=db.Column(db.Integer,db.ForeignKey("doctors.id"))
    doctor_contact = db.relationship("Doctors",back_populates="contact_us")


class Token(db.Model):
    __tablename__='token'
    id=db.Column(db.Integer,primary_key=True)
    token=db.Column(db.String(255))
    email=db.Column(db.String(255))
    expiry_time=db.Column(db.DateTime,
                          nullable=False,
                          default= lambda:datetime.utcnow() + timedelta(seconds=120))