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
        basin: {
          type: DataTypes.STRING,
          allowNull: true
        },
        state: {
          type: DataTypes.STRING,
          allowNull: true
        },
        concessionaries: {
          type: DataTypes.STRING,
          allowNull: true
        },
        shore: {
          type: DataTypes.STRING,
          allowNull: true
        },
        stage: {
          type: DataTypes.STRING,
          allowNull: true
        },
        userShore: {
            type: DataTypes.VIRTUAL,
            get: function() {
                const shore = this.get('shore');
                if(shore == 'on')
                    return 'Terra';
                else if (shore == 'off')
                    return 'Mar';
                else 
                    throw 'Campo "shore" deve conter "on" ou "off"';
                return null;
            }
        }
    }, 
    {
        underscored: true,
        tableName: 'oil_fields',
        hooks: {
            beforeCreate: function(oilField, options) {
                const shoreLower = oilField.shore.toLowerCase();
                oilField.shore = convertShore(shoreLower);
            }
        }
    }    
  );
  
  return OilField;
};