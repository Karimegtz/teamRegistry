console.log("El archivo index.js se está ejecutando...");

const { prompt } = require('inquirer');
const logo = require('asciiart-logo');
const dbService = require('./db');



startApp();

function startApp() {
    console.log("Iniciando la aplicación...");
  console.log(logo({ name: 'Team Management System' }).render());
  showMainMenu();
}

// Muestra el menú principal con las opciones para el usuario
function showMainMenu() {
  prompt({
    type: 'list',
    name: 'action',
    message: 'Select an option:',
    choices: [
      { name: 'Show All Team Members', value: 'SHOW_MEMBERS' },
      { name: 'Show Members by Sector', value: 'SHOW_BY_SECTOR' },
      { name: 'Show Members by Mentor', value: 'SHOW_BY_MENTOR' },
      { name: 'Add New Member', value: 'ADD_MEMBER' },
      { name: 'Remove Member', value: 'REMOVE_MEMBER' },
      { name: 'Update Member Position', value: 'UPDATE_POSITION' },
      { name: 'Update Member Mentor', value: 'UPDATE_MENTOR' },
      { name: 'View All Positions', value: 'VIEW_POSITIONS' },
      { name: 'Add New Position', value: 'ADD_POSITION' },
      { name: 'Delete Position', value: 'DELETE_POSITION' },
      { name: 'Show All Sectors', value: 'VIEW_SECTORS' },
      { name: 'Create New Sector', value: 'ADD_SECTOR' },
      { name: 'Remove Sector', value: 'DELETE_SECTOR' },
      { name: 'View Sector Budgets', value: 'VIEW_SECTOR_BUDGET' },
      { name: 'Exit Application', value: 'EXIT' },
    ],
  }).then(({ action }) => {
    handleAction(action);
  });
}


function handleAction(action) {
  switch (action) {
    case 'SHOW_MEMBERS':
      listTeamMembers();
      break;
    case 'SHOW_BY_SECTOR':
      listMembersBySector();
      break;
    case 'SHOW_BY_MENTOR':
      listMembersByMentor();
      break;
    case 'ADD_MEMBER':
      addTeamMember();
      break;
    case 'REMOVE_MEMBER':
      removeTeamMember();
      break;
    case 'UPDATE_POSITION':
      updateMemberPosition();
      break;
    case 'UPDATE_MENTOR':
      updateMemberMentor();
      break;
    case 'VIEW_POSITIONS':
      listPositions();
      break;
    case 'ADD_POSITION':
      addPosition();
      break;
    case 'DELETE_POSITION':
      deletePosition();
      break;
    case 'VIEW_SECTORS':
      listSectors();
      break;
    case 'ADD_SECTOR':
      addSector();
      break;
    case 'DELETE_SECTOR':
      removeSector();
      break;
    case 'VIEW_SECTOR_BUDGET':
      showSectorBudgets();
      break;
    case 'EXIT':
      exitApp();
      break;
  }
}


function listTeamMembers() {
  dbService.getAllStaffMembers()
    .then(({ rows }) => {
      console.table(rows);
    })
    .then(() => showMainMenu());
}

function listMembersBySector() {
  dbService.getAllSectors().then(({ rows }) => {
    const sectorChoices = rows.map(({ sector_id, sector_name }) => ({
      name: sector_name,
      value: sector_id,
    }));

    prompt({
      type: 'list',
      name: 'sectorId',
      message: 'Select a sector to view its members:',
      choices: sectorChoices,
    })
      .then(({ sectorId }) => dbService.getStaffBySector(sectorId))
      .then(({ rows }) => {
        console.table(rows);
      })
      .then(() => showMainMenu());
  });
}

function listMembersByMentor() {
  dbService.getAllStaffMembers().then(({ rows }) => {
    const mentorChoices = rows.map(({ staff_id, given_name, surname }) => ({
      name: `${given_name} ${surname}`,
      value: staff_id,
    }));

    prompt({
      type: 'list',
      name: 'mentorId',
      message: 'Select a mentor to view their team:',
      choices: mentorChoices,
    })
      .then(({ mentorId }) => dbService.getStaffByMentor(mentorId))
      .then(({ rows }) => {
        if (rows.length === 0) {
          console.log('No team members found for the selected mentor.');
        } else {
          console.table(rows);
        }
      })
      .then(() => showMainMenu());
  });
}

function addTeamMember() {
  prompt([
    { name: 'first_name', message: "Enter the member's first name:" },
    { name: 'last_name', message: "Enter the member's last name:" },
  ]).then((answers) => {
    const { first_name, last_name } = answers;
    dbService.getAllPositions().then(({ rows }) => {
      const positionChoices = rows.map(({ position_id, position_title }) => ({
        name: position_title,
        value: position_id,
      }));

      prompt({
        type: 'list',
        name: 'positionId',
        message: 'Select a position for this member:',
        choices: positionChoices,
      }).then(({ positionId }) => {
        dbService.getAllStaffMembers().then(({ rows }) => {
          const mentorChoices = rows.map(({ staff_id, given_name, surname }) => ({
            name: `${given_name} ${surname}`,
            value: staff_id,
          }));
          mentorChoices.unshift({ name: 'None', value: null });

          prompt({
            type: 'list',
            name: 'mentorId',
            message: 'Assign a mentor to this member:',
            choices: mentorChoices,
          }).then(({ mentorId }) => {
            const newMember = { first_name, last_name, positionId, mentorId };
            dbService.addStaffMember(newMember)
              .then(() => console.log('Member added successfully!'))
              .then(() => showMainMenu());
          });
        });
      });
    });
  });
}

function removeTeamMember() {
  dbService.getAllStaffMembers().then(({ rows }) => {
    const memberChoices = rows.map(({ staff_id, given_name, surname }) => ({
      name: `${given_name} ${surname}`,
      value: staff_id,
    }));

    prompt({
      type: 'list',
      name: 'staffId',
      message: 'Select a member to remove:',
      choices: memberChoices,
    })
      .then(({ staffId }) => dbService.deleteStaffMember(staffId))
      .then(() => console.log('Member removed successfully!'))
      .then(() => showMainMenu());
  });
}

function updateMemberPosition() {
  dbService.getAllStaffMembers().then(({ rows }) => {
    const memberChoices = rows.map(({ staff_id, given_name, surname }) => ({
      name: `${given_name} ${surname}`,
      value: staff_id,
    }));

    prompt({
      type: 'list',
      name: 'staffId',
      message: 'Select a member to update their position:',
      choices: memberChoices,
    }).then(({ staffId }) => {
      dbService.getAllPositions().then(({ rows }) => {
        const positionChoices = rows.map(({ position_id, position_title }) => ({
          name: position_title,
          value: position_id,
        }));

        prompt({
          type: 'list',
          name: 'positionId',
          message: 'Select a new position for the member:',
          choices: positionChoices,
        })
          .then(({ positionId }) => dbService.modifyStaffPosition(staffId, positionId))
          .then(() => console.log('Position updated successfully!'))
          .then(() => showMainMenu());
      });
    });
  });
}

function updateMemberMentor() {
  dbService.getAllStaffMembers().then(({ rows }) => {
    const memberChoices = rows.map(({ staff_id, given_name, surname }) => ({
      name: `${given_name} ${surname}`,
      value: staff_id,
    }));

    prompt({
      type: 'list',
      name: 'staffId',
      message: 'Select a member to update their mentor:',
      choices: memberChoices,
    }).then(({ staffId }) => {
      dbService.getPotentialMentors(staffId).then(({ rows }) => {
        const mentorChoices = rows.map(({ staff_id, given_name, surname }) => ({
          name: `${given_name} ${surname}`,
          value: staff_id,
        }));

        prompt({
          type: 'list',
          name: 'mentorId',
          message: 'Assign a new mentor to this member:',
          choices: mentorChoices,
        })
          .then(({ mentorId }) => dbService.changeStaffMentor(staffId, mentorId))
          .then(() => console.log('Mentor updated successfully!'))
          .then(() => showMainMenu());
      });
    });
  });
}

function listPositions() {
  dbService.getAllPositions()
    .then(({ rows }) => {
      console.table(rows);
    })
    .then(() => showMainMenu());
}

function addPosition() {
  dbService.getAllSectors().then(({ rows }) => {
    const sectorChoices = rows.map(({ sector_id, sector_name }) => ({
      name: sector_name,
      value: sector_id,
    }));

    prompt([
      { name: 'position_title', message: 'Enter the name of the new position:' },
      { name: 'position_salary', message: 'Enter the salary for this position:' },
      {
        type: 'list',
        name: 'sector_id',
        message: 'Select a sector for this position:',
        choices: sectorChoices,
      },
    ]).then((newPosition) => {
      dbService.createPosition(newPosition)
        .then(() => console.log('Position added successfully!'))
        .then(() => showMainMenu());
    });
  });
}

function deletePosition() {
  dbService.getAllPositions().then(({ rows }) => {
    const positionChoices = rows.map(({ position_id, position_title }) => ({
      name: position_title,
      value: position_id,
    }));

    prompt({
      type: 'list',
      name: 'positionId',
      message: 'Select a position to delete:',
      choices: positionChoices,
    })
      .then(({ positionId }) => dbService.deletePosition(positionId))
      .then(() => console.log('Position deleted successfully!'))
      .then(() => showMainMenu());
  });
}

function listSectors() {
  dbService.getAllSectors()
    .then(({ rows }) => {
      console.table(rows);
    })
    .then(() => showMainMenu());
}

function addSector() {
  prompt({
    name: 'sector_name',
    message: 'Enter the name of the new sector:',
  }).then(({ sector_name }) => {
    dbService.createSector({ sector_name })
      .then(() => console.log('Sector added successfully!'))
      .then(() => showMainMenu());
  });
}

function removeSector() {
  dbService.getAllSectors().then(({ rows }) => {
    const sectorChoices = rows.map(({ sector_id, sector_name }) => ({
      name: sector_name,
      value: sector_id,
    }));

    prompt({
      type: 'list',
      name: 'sectorId',
      message: 'Select a sector to delete:',
      choices: sectorChoices,
    })
      .then(({ sectorId }) => dbService.deleteSector(sectorId))
      .then(() => console.log('Sector deleted successfully!'))
      .then(() => showMainMenu());
  });
}

function showSectorBudgets() {
  dbService.viewSectorBudgets()
    .then(({ rows }) => {
      console.table(rows);
    })
    .then(() => showMainMenu());
}

function exitApp() {
  console.log('Exiting the system...');
  process.exit();
}
