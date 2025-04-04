from flask import Blueprint, render_template, request, redirect, url_for, flash, session, jsonify
from app import db
from app.models.models import HealthMetric
from app.utils.auth_utils import login_required
from sqlalchemy import func
from datetime import datetime, timedelta
import json

dashboard = Blueprint('dashboard', __name__)

# Helper function to check if user is logged in
# def login_required(route_function):
#     def wrapper(*args, **kwargs):
#         if 'user_id' not in session:
#             flash('Please log in to access this page', 'error')
#             return redirect(url_for('auth.login'))
#         return route_function(*args, **kwargs)
#     wrapper.__name__ = route_function.__name__
#     return wrapper

@dashboard.route('/dashboard')
@login_required
def view_dashboard():
    user_id = session['user_id']
    username = session['username']
    
    # Get last 7 days of data for the charts
    end_date = datetime.now().date()
    start_date = end_date - timedelta(days=6)  # Last 7 days including today
    
    metrics = HealthMetric.query.filter(
        HealthMetric.user_id == user_id,
        HealthMetric.date_logged >= start_date,
        HealthMetric.date_logged <= end_date
    ).order_by(HealthMetric.date_logged).all()
    
    # Calculate summary stats
    total_metrics = HealthMetric.query.filter_by(user_id=user_id).count()
    
    # Get the latest metric entry
    latest_metric = HealthMetric.query.filter_by(user_id=user_id).order_by(HealthMetric.date_logged.desc()).first()
    
    # Get averages for the last 7 days
    avg_steps = db.session.query(func.avg(HealthMetric.steps)).filter(
        HealthMetric.user_id == user_id,
        HealthMetric.date_logged >= start_date
    ).scalar() or 0
    
    avg_calories = db.session.query(func.avg(HealthMetric.calories)).filter(
        HealthMetric.user_id == user_id,
        HealthMetric.date_logged >= start_date
    ).scalar() or 0
    
    avg_sleep = db.session.query(func.avg(HealthMetric.hours_sleep)).filter(
        HealthMetric.user_id == user_id,
        HealthMetric.date_logged >= start_date
    ).scalar() or 0
    
    # Prepare data for charts
    dates = [metric.date_logged.strftime('%Y-%m-%d') for metric in metrics]
    steps_data = [metric.steps for metric in metrics]
    calories_data = [metric.calories for metric in metrics]
    sleep_data = [metric.hours_sleep for metric in metrics]
    water_data = [metric.water_intake for metric in metrics]
    heart_rate_data = [metric.heart_rate for metric in metrics]
    
    return render_template(
        'dashboard/index.html',
        username=username,
        total_metrics=total_metrics,
        latest_metric=latest_metric,
        avg_steps=round(avg_steps, 1),
        avg_calories=round(avg_calories, 1),
        avg_sleep=round(avg_sleep, 1),
        chart_data={
            'dates': dates,
            'steps': steps_data,
            'calories': calories_data,
            'sleep': sleep_data,
            'water': water_data,
            'heart_rate': heart_rate_data
        }
    )

@dashboard.route('/dashboard/data')
@login_required
def dashboard_data():
    user_id = session['user_id']
    
    # Get filter parameters
    time_range = request.args.get('range', 'week')
    
    # Set date range based on filter
    end_date = datetime.now().date()
    if time_range == 'week':
        start_date = end_date - timedelta(days=6)
    elif time_range == 'month':
        start_date = end_date - timedelta(days=29)
    elif time_range == 'year':
        start_date = end_date - timedelta(days=364)
    else:  # Default to week
        start_date = end_date - timedelta(days=6)
    
    # Query data within date range
    metrics = HealthMetric.query.filter(
        HealthMetric.user_id == user_id,
        HealthMetric.date_logged >= start_date,
        HealthMetric.date_logged <= end_date
    ).order_by(HealthMetric.date_logged).all()
    
    # Format data for charts
    data = {
        'dates': [metric.date_logged.strftime('%Y-%m-%d') for metric in metrics],
        'steps': [metric.steps for metric in metrics],
        'calories': [metric.calories for metric in metrics],
        'sleep': [metric.hours_sleep for metric in metrics],
        'water': [metric.water_intake for metric in metrics],
        'heart_rate': [metric.heart_rate for metric in metrics]
    }
    
    return jsonify(data) 