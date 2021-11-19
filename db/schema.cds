namespace demo;

    using { cuid } from '@sap/cds/common';
    
    // extend cuid with {
    //     new : String;
    // }

    type Address {
        street : String(100);
        city : String(100);
        state : String(100);
        zip : String(100); 
    }
    
    type Gender : String enum {
        Male;
        Female;
    };
    
    @cds.search : {password : false}
    entity Users : cuid {
        @mandatory name : String(100);
        email: String(100);
        phone: String(100);
        gender: Gender;
        address : Address;
        password : String;
        img : LargeBinary @Core.MediaType: 'image/png';
        project : Association to Projects;
    }

    @cds.search : {description}
    entity Projects : cuid {
        name : String(100);
        description: String(1000);
        user : Association to many Users on user.project = $self;
    }

    entity Orders {
      key ID   : UUID;
      client   : String;
      Items    : Composition of many Order_Items on Items.parent=$self;
    }

    entity Order_Items { // to be accessed through Orders only
      key parent : Association to Orders;
      key book   : String;
      quantity   : Integer;
    }