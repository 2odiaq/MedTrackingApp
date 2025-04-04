# Make the app directory a proper Python package 

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import os

# Initialize SQLAlchemy
db = SQLAlchemy()

def create_app():
    # Load environment variables
    load_dotenv()
    
    # Initialize Flask app
    app = Flask(__name__, template_folder='templates', static_folder='static')
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-key-for-development')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'postgresql://postgres:postgres@localhost/healthtracker')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Initialize db with app
    db.init_app(app)
    
    # Import and register blueprints
    with app.app_context():
        from app.routes import auth_routes, metrics_routes, dashboard_routes
        app.register_blueprint(auth_routes.auth)
        app.register_blueprint(metrics_routes.metrics)
        app.register_blueprint(dashboard_routes.dashboard)
        
        from app.models import models
        
        @app.route('/')
        def index():
            from flask import session, redirect, url_for, render_template
            if 'user_id' in session:
                return redirect(url_for('dashboard.view_dashboard'))
            return render_template('index.html')
        
        @app.route('/favicon.ico')
        def favicon():
            from flask import send_from_directory
            return send_from_directory(app.static_folder, 'favicon.ico')
        
        @app.context_processor
        def inject_now():
            from datetime import datetime
            return {'now': datetime.utcnow()}
    
    return app 