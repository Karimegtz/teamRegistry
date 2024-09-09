const dbConnectionPool = require('./connection');

class DatabaseService {
  constructor() {}

  async executeQuery(queryText, params = []) {
    const client = await dbConnectionPool.connect();
    try {
      const result = await client.query(queryText, params);
      return result;
    } finally {
      client.release();
    }
  }

  getAllStaffMembers() {
    return this.executeQuery(
      "SELECT staff.staff_id, staff.given_name, staff.surname, position.position_title, sector.sector_name AS sector, position.position_salary, CONCAT(mentor.given_name, ' ', mentor.surname) AS mentor FROM staff LEFT JOIN position on staff.position_id = position.position_id LEFT JOIN sector on position.sector_id = sector.sector_id LEFT JOIN staff mentor on mentor.staff_id = staff.mentor_id;"
    );
  }


  getPotentialMentors(staffId) {
    return this.executeQuery(
      'SELECT staff_id, given_name, surname FROM staff WHERE staff_id != $1',
      [staffId]
    );
  }

   addStaffMember(staff) {
    const { given_name, surname, position_id, mentor_id } = staff;
    return this.executeQuery(
      'INSERT INTO staff (given_name, surname, position_id, mentor_id) VALUES ($1, $2, $3, $4)',
      [given_name, surname, position_id, mentor_id]
    );
  }

  deleteStaffMember(staffId) {
    return this.executeQuery('DELETE FROM staff WHERE staff_id = $1', [staffId]);
  }

  modifyStaffPosition(staffId, positionId) {
    return this.executeQuery(
      'UPDATE staff SET position_id = $1 WHERE staff_id = $2',
      [positionId, staffId]
    );
  }
  changeStaffMentor(staffId, mentorId) {
    return this.executeQuery(
      'UPDATE staff SET mentor_id = $1 WHERE staff_id = $2',
      [mentorId, staffId]
    );
  }

  getAllPositions() {
    return this.executeQuery(
      'SELECT position.position_id, position.position_title, sector.sector_name AS sector, position.position_salary FROM position LEFT JOIN sector on position.sector_id = sector.sector_id;'
    );
  }

   createPosition(position) {
    const { position_title, position_salary, sector_id } = position;
    return this.executeQuery(
      'INSERT INTO position (position_title, position_salary, sector_id) VALUES ($1, $2, $3)',
      [position_title, position_salary, sector_id]
    );
  }


  deletePosition(positionId) {
    return this.executeQuery('DELETE FROM position WHERE position_id = $1', [positionId]);
  }

  getAllSectors() {
    return this.executeQuery('SELECT sector.sector_id, sector.sector_name FROM sector;');
  }

    viewSectorBudgets() {
    return this.executeQuery(
      'SELECT sector.sector_id, sector.sector_name, SUM(position.position_salary) AS total_budget FROM staff LEFT JOIN position on staff.position_id = position.position_id LEFT JOIN sector on position.sector_id = sector.sector_id GROUP BY sector.sector_id, sector.sector_name;'
    );
  }

  createSector(sector) {
    return this.executeQuery('INSERT INTO sector (sector_name) VALUES ($1)', [sector.sector_name]);
  }

  deleteSector(sectorId) {
    return this.executeQuery('DELETE FROM sector WHERE sector_id = $1', [sectorId]);
  }

    getStaffBySector(sectorId) {
    return this.executeQuery(
      'SELECT staff.staff_id, staff.given_name, staff.surname, position.position_title FROM staff LEFT JOIN position on staff.position_id = position.position_id LEFT JOIN sector sector on position.sector_id = sector.sector_id WHERE sector.sector_id = $1;',
      [sectorId]
    );
  }

    getStaffByMentor(mentorId) {
    return this.executeQuery(
      'SELECT staff.staff_id, staff.given_name, staff.surname, sector.sector_name AS sector, position.position_title FROM staff LEFT JOIN position on position.position_id = staff.position_id LEFT JOIN sector ON sector.sector_id = position.sector_id WHERE mentor_id = $1;',
      [mentorId]
    );
  }
}

module.exports = new DatabaseService();
