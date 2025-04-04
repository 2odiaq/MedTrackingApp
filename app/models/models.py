from app import db
from datetime import datetime

# Function to get current date for default value
def get_current_date():
    return datetime.utcnow().date()

class User(db.Model):
    __tablename__ = 'users'
    
    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationship with health metrics
    health_metrics = db.relationship('HealthMetric', backref='user', lazy=True, cascade="all, delete-orphan")
    
    def __repr__(self):
        return f'<User {self.username}>'

class HealthMetric(db.Model):
    __tablename__ = 'health_metrics'
    
    metric_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    date_logged = db.Column(db.Date, nullable=False, default=get_current_date)
    steps = db.Column(db.Integer, default=0)
    calories = db.Column(db.Integer, default=0)
    water_intake = db.Column(db.Float, default=0.0)
    hours_sleep = db.Column(db.Float, default=0.0)
    heart_rate = db.Column(db.Integer, default=0)
    notes = db.Column(db.Text, nullable=True)
    
    def __repr__(self):
        return f'<HealthMetric {self.date_logged} for user {self.user_id}>'
    
    def to_dict(self):
        return {
            'metric_id': self.metric_id,
            'user_id': self.user_id,
            'date_logged': self.date_logged.strftime('%Y-%m-%d'),
            'steps': self.steps,
            'calories': self.calories,
            'water_intake': self.water_intake,
            'hours_sleep': self.hours_sleep,
            'heart_rate': self.heart_rate,
            'notes': self.notes
        } 