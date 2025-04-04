# HealthTracker

A responsive web application for tracking daily health metrics such as steps, calories, water intake, sleep, and heart rate.

## Features

- User authentication (register, login, logout)
- Daily health metrics logging
- Interactive dashboard with data visualization
- Historical data viewing and filtering
- CRUD operations on health metrics
- Responsive design for all devices

## Tech Stack

- **Backend**: Python with Flask
- **Frontend**: HTML, TailwindCSS, JavaScript
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy
- **Authentication**: Flask session-based authentication

## Installation

1. Clone the repository:

   ```
   git clone <repository-url>
   cd healthtracker
   ```

2. Create a virtual environment and activate it:

   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:

   ```
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   Create a `.env` file in the project root with the following contents:

   ```
   SECRET_KEY=your_secret_key
   DATABASE_URL=postgresql://username:password@localhost/healthtracker
   ```

5. Create the PostgreSQL database:

   ```
   createdb healthtracker
   ```

6. Run the application:

   ```
   python app.py
   ```

7. Visit `http://localhost:5000` in your browser.

## Running Tests

```
pytest
```

## Development

- **Database migrations**: When making changes to models, update the database schema by running the Flask app with the `db.create_all()` command.

## Deployment

This application can be deployed on platforms like Heroku, PythonAnywhere, or AWS.

1. Provision a PostgreSQL database
2. Set the required environment variables
3. Deploy the application code

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Flask](https://flask.palletsprojects.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [Chart.js](https://www.chartjs.org/)
