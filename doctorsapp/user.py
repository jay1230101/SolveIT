from .models import Doctors, Secretaries, Admin
class User:
    def __init__(self, user_type, user_id):
        self.user_type = user_type
        self.id = user_id

    def get_id(self):
        return f"{self.user_type}:{self.id}"

    def is_active(self):
        if self.user_type in ['doctor', 'secretary', 'admin']:
            if self.user_type == 'doctor':
                user = Doctors.query.get(self.id)
            elif self.user_type == 'secretary':
                user = Secretaries.query.get(self.id)
            elif self.user_type == 'admin':
                user = Admin.query.get(self.id)

            if user and user.status == 'active':
                return True

        return False

    @property
    def is_authenticated(self):
        # Check user credentials here
        if self.user_type in ['doctor', 'secretary', 'admin']:
            if self.user_type == 'doctor':
                user = Doctors.query.get(self.id)
            elif self.user_type == 'secretary':
                user = Secretaries.query.get(self.id)
            elif self.user_type == 'admin':
                user = Admin.query.get(self.id)

            # Check if the user exists and their status is active
            if user and user.status == 'active':
                return True

        return False

    # def get_email(self):
    #     if self.user_type == 'doctor':
    #         user=Doctors.query.get(self.id)
    #         return user.email if user else None
    #     elif self.user_type =='secretary':
    #         user=Secretaries.query.get(self.id)
    #         return user.email if user else None
    #     elif self.user_type =='admin':
    #         user=Admin.query.get(self.id)
    #         return user.email if user else None

