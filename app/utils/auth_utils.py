from flask import session, redirect, url_for, flash
from functools import wraps

# Helper function to check if user is logged in
def login_required(route_function):
    @wraps(route_function)
    def wrapper(*args, **kwargs):
        if 'user_id' not in session:
            flash('Please log in to access this page', 'error')
            return redirect(url_for('auth.login'))
        return route_function(*args, **kwargs)
    return wrapper 