using {demo} from '../db/schema';

//@cds.query.limit.default: 2
//@cds.query.limit.max: 5
service ProjectSerice {
    @cds.query.limit.default: 0
    @cds.query.limit.max: 0
    
    entity Users as select from demo.Users;
    //@cds.search : {description}
    entity Projects as select from demo.Projects;

    function getDate() returns Date;
    function getProjectMemebers(id: String) returns array of String;

    type moveResult : {
        code        : Integer;
        success     : Boolean;
        moveStatus  : String;
        userId      : String;
        userName    : String;
        projectId   : String;
        projectName : String;
    }

    type move : {
        userToMove : { userId: String }; 
        projectId : String
    }
    
    action moveUserToAnotherProject (data: move) returns moveResult;

    entity Orders as select from demo.Orders;
    entity Order_Items as select from demo.Order_Items;


entity Projects2 { 
    key ID: UUID;
   members : Composition of many Users_in_Projects on members.project = $self;
   virtual test: String;
}
entity Users2 { 
    key ID: UUID;
    name : String(100);
 }
// link table to reflect many-to-many relationship:
entity Users_in_Projects { 
   project : Association to Projects2;
   member : Association to Users2; 
}

// entity Projects2 { 
//     key ID: UUID;
//    members : Composition of many { key user : Association to Users2; } 
// }
// entity Users2 { 
//     key ID: UUID;
//     name : String(100);
//  }


}