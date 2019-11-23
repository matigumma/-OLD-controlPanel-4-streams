db.createUser(
    {
        user    : "freewuser",
        pwd     : "fran29141099",
        rolse   : [
            {
                role    : "readWrite",
                db      : "freewaves"
            }
        ]
    }
);