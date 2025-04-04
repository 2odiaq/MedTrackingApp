import os
import tempfile
import pytest
from app import app, db
from app.models.models import User, HealthMetric

@pytest.fixture
def client():
    """Create a test client for the app."""
    # Create a temporary file to isolate the database for each test
    db_fd, db_path = tempfile.mkstemp()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
    
    # Create the database and the database tables
    with app.app_context():
        db.create_all()
    
    # Create a test client
    with app.test_client() as client:
        yield client
    
    # Close and remove the temporary database
    os.close(db_fd)
    os.unlink(db_path)

def test_index_page(client):
    """Test that the index page loads correctly."""
    response = client.get('/')
    assert response.status_code == 200
    assert b'Track Your Health Journey' in response.data

def test_register_page(client):
    """Test that the registration page loads correctly."""
    response = client.get('/register')
    assert response.status_code == 200
    assert b'Create an Account' in response.data

def test_login_page(client):
    """Test that the login page loads correctly."""
    response = client.get('/login')
    assert response.status_code == 200
    assert b'Log In to Your Account' in response.data

def test_user_registration(client):
    """Test user registration process."""
    response = client.post('/register', data={
        'username': 'testuser',
        'email': 'test@example.com',
        'password': 'testpassword',
        'confirm_password': 'testpassword'
    }, follow_redirects=True)
    assert response.status_code == 200
    
    # Check that the user was created
    with app.app_context():
        user = User.query.filter_by(username='testuser').first()
        assert user is not None
        assert user.email == 'test@example.com'

def test_login_logout(client):
    """Test login and logout functionality."""
    # Register a user
    client.post('/register', data={
        'username': 'testuser',
        'email': 'test@example.com',
        'password': 'testpassword',
        'confirm_password': 'testpassword'
    })
    
    # Login
    response = client.post('/login', data={
        'email': 'test@example.com',
        'password': 'testpassword'
    }, follow_redirects=True)
    assert response.status_code == 200
    assert b'Welcome back' in response.data or b'Dashboard' in response.data
    
    # Logout
    response = client.get('/logout', follow_redirects=True)
    assert response.status_code == 200
    assert b'You have been logged out' in response.data 