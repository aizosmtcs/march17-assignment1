const fs = require('fs');
const express = require('express');
const e = require('express');
const app = express();
const port = 6500;


app.get('/', (req,res) => {
    res.send('<div> Welcome to Homepage </div><br>'+
              'Goto /employee/insert-id to get employee by id<br>'+
              'Goto /project/insert-id to get project by id<br>'+
              'Goto /getemployeedetails to get employee & their projects')
})


app.get('/employee/:id', (req,res) => {
    fs.readFile('./data/employee-db.json',(err,result) => {
        if(err){
            throw err;
        }else {
            const employeeData = (JSON.parse(result)).employees;
            for(let i =0; i<employeeData.length; i++){
                if(employeeData[i].id == req.params.id){
                    res.send(employeeData[i]);
                }
            }
        }
    })
})

app.get('/project/:id', (req,res) => {
    fs.readFile('./data/project-db.json',(err,result) => {
        if(err){
            throw err;
        }else {
            const projectData = (JSON.parse(result)).projects;
            for(let i =0; i<projectData.length; i++){
                if(projectData[i].id == req.params.id){
                    res.send(projectData[i]);
                }
            }
        }
    })
})

app.get('/getemployeedetails', (req,res) => {
    function read(file){
        return new Promise((resolve, reject) => {
            fs.readFile(file, function(err,result) {
                if(err){
                    reject(err);
                }else {
                    resolve(JSON.parse(result));
                }
            });
        });
    }

    const promises = [
        read('./data/employee-db.json'),
        read('./data/project-db.json')
    ];

    Promise.all(promises).then(result => {
        employeeData = result[0].employees;
        projectData = result[1].projects;
        for(let i =0; i<employeeData.length; i++){
            employeeData[i].project_name = 
                projectData.find(project => project.id 
                    === employeeData[i].project_id).project_name;
        }
        res.json(employeeData);
    });
})

app.listen(port,(err) => {
    console.log('server is running on port '+port);
})