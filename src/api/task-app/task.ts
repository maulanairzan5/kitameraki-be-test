import { app } from "@azure/functions";
import { GetTask } from '../../services/task-app/get-task';
import { GetTasks } from '../../services/task-app/get-tasks';
import { DeleteTask } from '../../services/task-app/delete-task';
import { BulkDeleteTasks } from '../../services/task-app/bulk-delete-tasks';
import { InsertTask } from '../../services/task-app/insert-task';
import { UpdateTask } from '../../services/task-app/update-task';


// GET TASK
app.http('get-task', {
    methods: ["GET"],
    authLevel: "anonymous",
    handler: GetTask,
});

// GET TASKS
app.http('get-tasks', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: GetTasks
});

// DELETE TASK
app.http('delete-task', {
    methods: ['DELETE'],
    authLevel: 'anonymous',
    handler: DeleteTask
});

// DELETE BULK TASK
app.http('delete-tasks', {
    methods: ['DELETE'],
    authLevel: 'anonymous',
    handler: BulkDeleteTasks
});

// INSERT TASK
app.http('insert-task', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: InsertTask
});

// UPDATE TASK
app.http('update-task', {
    methods: ['PATCH'],
    authLevel: 'anonymous',
    handler: UpdateTask
});

