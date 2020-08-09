import db from '../database/connections';

interface IClass {
    id: number,
    subject: string,
    cost: number,
    user_id: number,
}

interface IClassSchedule {
    id: number,
    week_day: number,
    from: number,
    to: number,
    class_id: number,
}

class ClassModel {
    static async find() {
        
    }
}