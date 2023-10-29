from flask import Flask
from .extensions import db, migrate, bootstrap, login_manager, mail
from .views import main
from .user import User
def create_app():
    app = Flask(__name__)
    app.config['DEBUG'] = True
    app.config.from_pyfile('config.py')
    app.config['MYSQL_HOST'] = app.config['MYSQL_HOST']
    app.config['MYSQL_USER'] = app.config['MYSQL_USER']
    app.config['MYSQL_PASSWORD'] = app.config['MYSQL_PASSWORD']
    app.config['MYSQL_DB'] = app.config['MYSQL_DB']
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://johny:karim91@localhost/mynewdb'
    app.config['SECRET_KEY'] = 'GOPIDXA-shapkhe389857389djhie48721929'
    app.config['MAIL_SERVER'] = 'smtp.gmail.com'
    app.config['MAIL_PORT'] = 587
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USERNAME'] = 'johny.achkar02@gmail.com'
    app.config['MAIL_PASSWORD'] = 'Karim!@81'
    app.config['MAIL_DEFAULT_SENDER'] = 'johny.achkar02@gmail.com'
    app.config['MAIL_DEBUG'] = True
    db.init_app(app)
    migrate.init_app(app,db)
    bootstrap.init_app(app)
    login_manager.init_app(app)
    mail.init_app(app)
    login_manager.login_view = 'home'
    app.register_blueprint(main)
    @login_manager.user_loader
    def load_user(user_id):
        if ':' in user_id:
            user_type, id = user_id.split(':')
            return User(user_type, id)
        return None
    return app

