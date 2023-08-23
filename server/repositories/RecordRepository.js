import dbPool from '../db.js';

class RecordRepository {
    constructor(dbPool){
        this.pool = dbPool;
    }

    createRecord(){
    }
}

export default new RecordRepository(dbPool);
