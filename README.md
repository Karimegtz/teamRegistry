# Team Registry Manager

## Description

Team Registry Manager is a command-line application built with Node.js, Inquirer, and PostgreSQL that enables business owners to manage their team's database. The application provides an interface for non-developers to easily view and interact with information stored in the database, including divisions, roles, and team members.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Schema](#schema)
- [Bonus Features](#bonus-features)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. Clone the repository to your local machine:
   ```bash
   git clone git clone https://github.com/Karimegtz/team-registry-manager.git

2. Navigate to the project directory
   ```bash
   cd team-registry-manager
3. Install the required dependencies:
   ```bash
  npm install 
   ```
4. Set up the PostgreSQL database using the provided schema and seed data.

## Usage

To start the application, run the following command in your terminal:

```bash
node index.js
```
You will be presented with a menu of options to manage your team’s database, including viewing all divisions, roles, and team members, as well as adding and updating information.

## Features

- **View All Divisions:**:  Displays a formatted table showing division names and their IDs.
- **View All Roles**:  Shows job titles, role IDs, divisions, and salaries for each role.
- **View All Team Members**: Displays team member information, including IDs, names, job titles, divisions, salaries, and supervisors.
- **Add Division**:  Prompts for the division name and adds it to the database.
- **Add Role:**: Prompts for the role title, salary, and division, then adds the role to the database.
- **Add Team Member**: Prompts for the team member's first and last name, role, and supervisor, then adds the member to the database.
- **Update Team Member Role:**: Prompts to select a team member and their new role, updating the information in the database.


## Schema

The database schema consists of three tables:

1.  **Division**
    
    -   `division_id`: `SERIAL PRIMARY KEY`
    -   `division_name`: `VARCHAR(30) UNIQUE NOT NULL`

2.  **Job**
    
    -   `job_id`: `SERIAL PRIMARY KEY`
    -   `job_title`: `VARCHAR(30) UNIQUE NOT NULL`
    -   `job_salary`: `DECIMAL NOT NULL`
    -   `division_id`: `INTEGER NOT NULL` (References `division.division_id`)

3.  **Team Member**
    
    -   `employee_id`: `SERIAL PRIMARY KEY`
    -   `first_name`: `VARCHAR(30) NOT NULL`
    -   `last_name`: `VARCHAR(30) NOT NULL`
    -   `job_id`: `INTEGER NOT NULL` (References `job.job_id`)
    -   `supervisor_id`: `INTEGER` (References `employee.employee_id`)

## Contributing

Contributions are welcome! If you would like to contribute to this project, please open an issue or submit a pull request.


## Contributing

Contributions are welcome! If you would like to contribute to this project, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
