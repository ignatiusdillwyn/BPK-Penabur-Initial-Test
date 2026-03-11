# final-project-backend-coursenet
npx sequelize-cli model:generate --name Product --attributes name:string,description:string,qty:integer,price:integer,image:string,UserId:integer

Cara menjalankan project:
1. npm install
2. npx sequelize-cli db:migrate
3. npx nodemon app.js

1. Siswa
npx sequelize-cli model:generate --name Student --attributes student_number:string,name:string,grade_level:string,priority_level:string,status:string

2. Guru
npx sequelize-cli model:generate --name Teacher --attributes name:string,subject_speciality:string,status:string

3. Mata Pelajaran
npx sequelize-cli model:generate --name Subject --attributes subject_code:string,subject_name:string,credit:integer

4. Kelas
npx sequelize-cli model:generate --name Class --attributes subject_id:integer,teacher_id:integer,capacity:integer,schedule_day:date,schedule_start:time,schedule_end:time,room:string,status:string

5. EnrollmentRequest
npx sequelize-cli model:generate --name EnrollmentRequest --attributes request_code:string,student_id:integer,class_id:integer,requested_at:date,status:string,allow_waitlist:boolean

6. Waitlist
npx sequelize-cli model:generate --name Waitlist --attributes request_id:integer,position:string

7. Enrollment
npx sequelize-cli model:generate --name Enrollment --attributes student_id:integer,class_id:integer,enrolled_at:date

8. Audit Log
npx sequelize-cli model:generate --name Audit_Log --attributes entity:string,entity_id:integer,action:string,old_value:string,new_value:string

9. Login
npx sequelize-cli model:generate --name User --attributes email:string,password:string
