import { Request, Response } from 'express';
import db from '../database/connections';
import convertHourToMinutes from '../utils/convertHourToMinutes';

interface ScheduleItem {
    week_day: number,
    from: string,
    to: string,
}

export default class ClassesController {

    async index (request: Request, response: Response){

        const filters = request.query;

        const week_day = filters.week_day as string;
        const subject = filters.subject as string;
        const time = filters.time as string;

        if(!week_day || !subject || !time){
            return response.status(400).json({
                error: 'Missing filters to search classes'
            });
        }

        const timeInMinutes = convertHourToMinutes(time as string);

        const classes = await db('classes')
            .whereExists(function () {
                this.select('class_schedule.*')
                    .from('class_schedule')
                    .whereRaw('class_schedule.class_id = classes.id')
                    .whereRaw('class_schedule.week_day = ??', [Number(week_day)])
                    .whereRaw('class_schedule.from <= ??', [timeInMinutes])
                    .whereRaw('class_schedule.to > ??', [timeInMinutes])
            })
            .where('classes.subject', '=', subject)
            .join('users', 'classes.user_id', '=', 'users.id')
            .select(['classes.*', 'users.*'])
        ;

        return response.send(classes)

    }

    async create (request: Request, response: Response) {
    
        const { subject, cost, schedule } = request.body;
    
        const transaction = await db.transaction();
    
        try {

            const user_id = request.user?.id;
            if(!user_id){
                throw Error('Server Error');
            }
        
            const [ class_id ] = await transaction('classes').insert({
                subject,
                cost,
                user_id
            }).returning('id');
        
            const classSchedule = schedule.map((schedule_item: ScheduleItem) => {
                return {
                    class_id,
                    week_day: schedule_item.week_day,
                    from: convertHourToMinutes(schedule_item.from),
                    to: convertHourToMinutes(schedule_item.to),
                }
            });
        
            await transaction('class_schedule').insert(classSchedule)
        
            await transaction.commit();
        
            return response.status(201).send();
        } catch (error) {
            await transaction.rollback();
            return response.status(400).json({
                error: "Unexpected error while creating a new class",
            })
        }
    }
    async findMine (request: Request, response: Response) {

        const user_id = request.user?.id;
        if(!user_id){
            return response.status(400).json({error: 'Bad Reuest'});
        }

        const classes = await db('classes')
            .where('classes.user_id', '=', user_id)
            .join('class_schedule', 'classes.id', '=', 'class_schedule.class_id')
            .select(['classes.*', 'class_schedule.*'])
        ;

        return response.send(classes)
    }

    async update(request: Request, response: Response){
        const { subject, cost, schedule } = request.body;
    
        const transaction = await db.transaction();
    
        try {

            const user_id = request.user?.id;
            if(!user_id){
                throw Error('Server Error');
            }
        
            const class_updated = await transaction('classes')
            .where('classes.user_id', '=', user_id)
            .update(
                {
                    subject,
                    cost
                },
            );

            const [ class_item ] = await transaction('classes')
            .where('classes.user_id', '=', user_id)
            .select('classes.id');

            const class_id = class_item.id;

            const classSchedule = schedule.map((schedule_item: ScheduleItem) => {
                return {
                    class_id,
                    week_day: schedule_item.week_day,
                    from: convertHourToMinutes(schedule_item.from),
                    to: convertHourToMinutes(schedule_item.to),
                }
            });
        
            await transaction('class_schedule')
                .where('class_schedule.class_id', '=', class_id)
                .del()

            await transaction('class_schedule').insert(classSchedule);
        
            await transaction.commit();
        
            return response.status(201).send();
        } catch (error) {
            await transaction.rollback();
            return response.status(400).json({
                error: "Unexpected error while creating a new class",
            })
        }
    }
}