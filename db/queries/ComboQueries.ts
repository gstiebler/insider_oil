exports.AllDrillingRigs = () => {
    const queryOnshore = 'select concat(id, ":onshore") as id, name\
             from drilling_rigs_onshore';
    const queryOffshore = 'select concat(id, ":offshore") as id, name\
             from drilling_rigs_offshore ';
    return queryOnshore + ' union ' + queryOffshore + ' order by name';
}