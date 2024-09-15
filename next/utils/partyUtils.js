// utils/partyUtils.js

import connection from '##/configs/mysql-promise.js'

export async function checkAndUpdateExpiredParties() {
  const updateQuery = `
    UPDATE party 
    SET status = 'failed' 
    WHERE date < CURDATE() AND status = 'waiting'
  `;
  
  try {
    const [result] = await connection.execute(updateQuery);
    console.log(`Updated ${result.affectedRows} expired parties to failed status.`);
  } catch (error) {
    console.error('Error updating expired parties:', error);
  }
}