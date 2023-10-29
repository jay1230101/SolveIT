from flask_wtf import FlaskForm
from wtforms import StringField, EmailField, PasswordField, SubmitField, TelField, SelectField, DateField
from wtforms.validators import DataRequired, Email
from .cities import city_tuples

class UserForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(),Email()], render_kw={'autocomplete': 'off'})
    password = StringField('Password', validators=[DataRequired()], render_kw={'autocomplete': 'off'})
    verify_password=StringField('Pass',validators=[DataRequired()],render_kw={'autocomplete':'off'})
    sign_in = SubmitField('Sign In!')
    submit= SubmitField('Submit')


class registrationForm(FlaskForm):
    name=StringField('name',validators=[DataRequired()],render_kw={'autocomplete':'off'})
    father=StringField('father',validators=[DataRequired()],render_kw={'autocomplete':'off'})
    family=StringField('family',validators=[DataRequired()],render_kw={'autocomplete':'off'})
    dob=DateField('date',validators=[DataRequired()],render_kw={'autocomplete':'off'})
    gender=SelectField('gender',validators=[DataRequired()],choices=[(' ','Select gender ...'),('male','Male'),('female','Female')],render_kw={'autocomplete':'off'})
    phone=TelField('phone',validators=[DataRequired()],render_kw={'autocomplete':'off'})
    email=EmailField('email',validators=[DataRequired(),Email()],render_kw={'autocomplete':'off'})
    city=SelectField('city',validators=[DataRequired()],
                     render_kw={'autocomplete':'off'},
                     choices=city_tuples)

    submit=SubmitField('submit')