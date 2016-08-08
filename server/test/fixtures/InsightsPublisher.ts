'use strict';
import Sequelize = require('sequelize');  

module.exports = function(db): Promise<any[]> {
    const InsightsPublisher:Sequelize.Model<any, any> = db.models.InsightsPublisher;
    const newRecordsData = [
        {
            order: 0,
            section: 'flexSlider',
            insight_id: 1,
        },
        {
            order: 1,
            section: 'flexSlider',
            insight_id: 3,
        },
        {
            order: 2,
            section: 'flexSlider',
            insight_id: 2,
        },
        {
            order: 0,
            section: 'section2Articles',
            insight_id: 3,
        },
        {
            order: 1,
            section: 'section2Articles',
            insight_id: 2,
        },
    ];
    
    return InsightsPublisher.bulkCreate(newRecordsData);
}