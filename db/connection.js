const{ Pool}= require('pg');
const pool=new pool ({
    user: 'postgres',
    host: 'localhost',
    database: 'team_registry',
    password: 'refuGio4',
    port: 5432,


})

module.exports=pool;
