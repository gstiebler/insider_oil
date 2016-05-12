function convertShore(val) {
    if(val == 'terra')
        return 'on';
    else if(val == 'mar')
        return 'off';
    else
        throw 'Terra/Mar deve conter "Terra" ou "Mar"';
}

module.exports = function(sequelize, DataTypes) {
  var OilField = sequelize.define('OilField', {
        name: {
          type: DataTypes.STRING,
          allowNull: false
        },
        state: {
          type: DataTypes.STRING,
          allowNull: false
        },
        shore: {
          type: DataTypes.ENUM('on', 'off'),
          allowNull: false
        },
        stage: {
          type: DataTypes.ENUM('production', 'development'),
          allowNull: false
        },
        /*userShore: {
            type: DataTypes.VIRTUAL,
            get: function() {
                const shore = this.get('shore');
                if(shore == 'on')
                    return 'Terra';
                else if (shore == 'off')
                    return 'Mar';
                else 
                    throw 'Campo "shore" deve conter "on" ou "off"';
            },
            set: function(val) {
                const shoreLower = val.toLowerCase();
                this.shore = convertShore(shoreLower);
            }
        }*/
    }, 
    {
        underscored: true,
        tableName: 'oil_fields',
        classMethods: {
            associate: function(models) {
                OilField.belongsTo(models.Basin, { as: 'basin', allowNull: false } );
            }
        }
    }    
  );
  
  return OilField;
};