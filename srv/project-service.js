const color = require('colors');
const bcrypt = require('bcryptjs');

module.exports =  srv => {
    srv.before('*', req => {
        console.log(`Method ${req.method}`.yellow.inverse);
        console.log(`Target ${(req.target) ? req.target.name : req.event}`.yellow.inverse);
    });

    srv.after('READ', 'Projects2', req => {
        req.forEach(element => {
            element.test = "test";
        });
    });

    // srv.before('CREATE', 'Users', async req => {
    //     const {password} = req.data;
    //     console.log(`Orig password ${password}`.yellow.inverse);
    //     const salt = await bcrypt.genSalt(10);
    //     req.data.password = await bcrypt.hash(password, salt);
    //     console.log(`New password ${req.data.password}`.yellow.inverse);
    // });

    srv.on('READ', 'Users/img', req => {
        if(!req) {
            return { img : '/img/sotm-stars-global.png' };
        }

        if(!Array.isArray(req)) req = [req];

        req.forEach(user => {
            user.img = './img/sotm-stars-global.png'
        });
    });

    // srv.on('READ', 'Users', async (req, next) => {
        
    //     // If not asking for specific User
    //     if(!req.data.ID) {
    //         return await next();
    //     }

    //     const id = req.data.ID;

    //     console.log(`ID: ${id}`);

    //     let users = await next() || [];

    //     if (!Array.isArray(users)) users = [users];

    //     if(users.length !== 1) return req.reject(401, 'No user with given ID');

    //     if(users[0].password) {
    //         let customHeader = req._.req.headers['customheader'];
    //         const match = await bcrypt.compare(customHeader, users[0].password);

    //         if(!match) return req.reject(401, 'Wrong password');
    //     }

    //     return users[0];
    // });

    srv.on('getDate', () => {
        return '24.08.2021';
    });

    srv.on('getProjectMemebers', async req => {
        const {id} = req.data;

        const db = srv.tx(req);
        const {Users} = srv.entities;

        const memebers = await db.read(Users, ['name']).where({PROJECT_ID: id});
        return memebers.map((user) => user.name );
    });

    srv.on('moveUserToAnotherProject', async req => { 
        const {userId, projectId} = req.data.data;

        const db = srv.transaction(req);
        const {Users} = srv.entities;

        const currentAssigmnet = await db.read(Users, ['ID', 'name as userName', 'project_ID as currentProjectId']).where({ID: userId});
        const {userName, currentProjectId} = currentAssigmnet[0];

        const currentProjectMemebers = await db.read(Users, ['name as userName']).where({PROJECT_ID: currentProjectId});

        // if(currentProjectMemebers.length <= 3) {
        //     return {
        //         code        : -200,
        //         success     : false,
        //         moveStatus  : 'Exising project assigment has 3 or less members'
        //     }
        // } 

        const newProjectMemebers = await db.run(
                SELECT.from(Users).columns(user => {
                    user.ID,
                    user.name,
                    user.project(project => {
                        project.name
                    })
                }).where({project_ID: projectId})
            );

        // if(newProjectMemebers.length > 7) {
        //     return {
        //         code        : -100,
        //         success     : false,
        //         moveStatus  : 'New project has more then 7 memebrs'
        //     }
        // }

        const updatedRowCount = await db.update(Users, userId).set({project_id: projectId});

        return updatedRowCount;
        // if(updatedRowCount !== 1) {
        //     return {
        //         code        : -300,
        //         success     : false,
        //         moveStatus  : 'Error while updating User'
        //     }
        // }

        // return {
        //     code        : 100,
        //     success     : true,
        //     moveStatus  : 'User updated with new assigment',
        //     userId,
        //     userName,
        //     projectId,
        //     projectName : newProjectMemebers[0].project.name
        // }
    });
}