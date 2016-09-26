const comboQueries = {
    AllDrillingRigs: () => {
        const queryOnshore = 'select concat(id, ":onshore") as id, name\
                from drilling_rigs_onshore';
        const queryOffshore = 'select concat(id, ":offshore") as id, name\
                from drilling_rigs_offshore ';
        return queryOnshore + ' union ' + queryOffshore + ' order by name';
    },
    UsersUsername: () => {
        const query = 'select login as id, name from users ' +
                ' order by name ';
        return query;
    }
};

export = comboQueries;