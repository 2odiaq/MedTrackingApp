from flask import Blueprint, render_template, request, redirect, url_for, flash, session, jsonify
from app import db
from app.models.models import HealthMetric
from app.utils.auth_utils import login_required
from datetime import datetime, timedelta
import json

metrics = Blueprint('metrics', __name__)

# Helper function to check if user is logged in
# def login_required(route_function):
#     def wrapper(*args, **kwargs):
#         if 'user_id' not in session:
#             flash('Please log in to access this page', 'error')
#             return redirect(url_for('auth.login'))
#         return route_function(*args, **kwargs)
#     wrapper.__name__ = route_function.__name__
#     return wrapper

@metrics.route('/metrics', methods=['GET'])
@login_required
def get_metrics():
    user_id = session['user_id']
    
    # Get query parameters for filtering
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    
    # Get new metric filter parameters
    high_calories = request.args.get('high_calories') == 'true'
    low_steps = request.args.get('low_steps') == 'true'
    low_sleep = request.args.get('low_sleep') == 'true'
    high_hr = request.args.get('high_hr') == 'true'
    incomplete = request.args.get('incomplete') == 'true'
    
    query = HealthMetric.query.filter_by(user_id=user_id)
    
    # Apply date filters if provided
    if start_date:
        query = query.filter(HealthMetric.date_logged >= start_date)
    if end_date:
        query = query.filter(HealthMetric.date_logged <= end_date)
    
    # Apply new metric filters if enabled
    if high_calories:
        query = query.filter(HealthMetric.calories > 3000)
    if low_steps:
        query = query.filter(HealthMetric.steps < 5000)
    if low_sleep:
        query = query.filter(HealthMetric.hours_sleep < 6)
    if high_hr:
        query = query.filter(HealthMetric.heart_rate > 100)
    if incomplete:
        # Consider metrics with heart_rate of 0 as incomplete
        query = query.filter(HealthMetric.heart_rate == 0)
    
    # Order by date, most recent first
    metrics = query.order_by(HealthMetric.date_logged.desc()).all()
    
    # Check if JSON response is requested
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return jsonify([metric.to_dict() for metric in metrics])
    
    return render_template('metrics/index.html', metrics=metrics)

@metrics.route('/metrics/new', methods=['GET', 'POST'])
@login_required
def new_metric():
    if request.method == 'POST':
        try:
            # Parse form data
            date_logged = datetime.strptime(request.form.get('date_logged'), '%Y-%m-%d').date()
            steps = int(request.form.get('steps', 0))
            calories = int(request.form.get('calories', 0))
            water_intake = float(request.form.get('water_intake', 0.0))
            hours_sleep = float(request.form.get('hours_sleep', 0.0))
            heart_rate = int(request.form.get('heart_rate', 0))
            notes = request.form.get('notes', '')
            
            # Check if a metric already exists for this date
            existing_metric = HealthMetric.query.filter_by(
                user_id=session['user_id'],
                date_logged=date_logged
            ).first()
            
            if existing_metric:
                flash('A record for this date already exists. Please edit the existing record.', 'error')
                return redirect(url_for('metrics.get_metrics'))
            
            # Create new metric
            new_metric = HealthMetric(
                user_id=session['user_id'],
                date_logged=date_logged,
                steps=steps,
                calories=calories,
                water_intake=water_intake,
                hours_sleep=hours_sleep,
                heart_rate=heart_rate,
                notes=notes
            )
            
            db.session.add(new_metric)
            db.session.commit()
            
            flash('Health metrics added successfully!', 'success')
            return redirect(url_for('metrics.get_metrics'))
            
        except Exception as e:
            db.session.rollback()
            flash(f'An error occurred: {str(e)}', 'error')
    
    # GET request - show the form
    return render_template('metrics/new.html', today=datetime.now().strftime('%Y-%m-%d'))

@metrics.route('/metrics/<int:metric_id>', methods=['GET'])
@login_required
def get_metric(metric_id):
    metric = HealthMetric.query.filter_by(metric_id=metric_id, user_id=session['user_id']).first_or_404()
    
    # Check if JSON response is requested
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return jsonify(metric.to_dict())
    
    return render_template('metrics/show.html', metric=metric)

@metrics.route('/metrics/<int:metric_id>/edit', methods=['GET', 'POST'])
@login_required
def edit_metric(metric_id):
    metric = HealthMetric.query.filter_by(metric_id=metric_id, user_id=session['user_id']).first_or_404()
    
    if request.method == 'POST':
        try:
            # Update metric with form data
            metric.steps = int(request.form.get('steps', 0))
            metric.calories = int(request.form.get('calories', 0))
            metric.water_intake = float(request.form.get('water_intake', 0.0))
            metric.hours_sleep = float(request.form.get('hours_sleep', 0.0))
            metric.heart_rate = int(request.form.get('heart_rate', 0))
            metric.notes = request.form.get('notes', '')
            
            db.session.commit()
            
            flash('Health metrics updated successfully!', 'success')
            return redirect(url_for('metrics.get_metrics'))
            
        except Exception as e:
            db.session.rollback()
            flash(f'An error occurred: {str(e)}', 'error')
    
    return render_template('metrics/edit.html', metric=metric)

@metrics.route('/metrics/<int:metric_id>/delete', methods=['POST'])
@login_required
def delete_metric(metric_id):
    metric = HealthMetric.query.filter_by(metric_id=metric_id, user_id=session['user_id']).first_or_404()
    
    try:
        db.session.delete(metric)
        db.session.commit()
        flash('Health metric deleted successfully', 'success')
    except Exception as e:
        db.session.rollback()
        flash(f'An error occurred: {str(e)}', 'error')
    
    return redirect(url_for('metrics.get_metrics'))

@metrics.route('/metrics/yesterday', methods=['GET'])
@login_required
def get_yesterday_metrics():
    user_id = session['user_id']
    
    # Calculate yesterday's date
    yesterday = datetime.now().date() - timedelta(days=1)
    
    # Query for yesterday's metrics
    metric = HealthMetric.query.filter_by(
        user_id=user_id,
        date_logged=yesterday
    ).first()
    
    if metric:
        return jsonify(metric.to_dict())
    else:
        return jsonify({"error": "No data found for yesterday"}), 404 