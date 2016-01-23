module.exports = function(sequelize, DataTypes) {
	var Person = sequelize.define('Person', {
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		phone: {
			type: DataTypes.STRING,
			allowNull: true
		},
		position: {
			type: DataTypes.STRING,
			allowNull: true
		},
		telephone1: {
			type: DataTypes.STRING,
			allowNull: true
		},
		telephone2: {
			type: DataTypes.STRING,
			allowNull: true
		},
		email: {
			type: DataTypes.STRING,
			allowNull: true
		},
		linkedin: {
			type: DataTypes.STRING,
			allowNull: true
		},
		address: {
			type: DataTypes.STRING,
			allowNull: true
		},
		directorship: {
			type: DataTypes.STRING,
			allowNull: true
		},
		management_sector: {
			type: DataTypes.STRING,
			allowNull: true
		},
		project1_ref_id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		photo: {
			type: DataTypes.BLOB,
			allowNull: true
		}
	}, {
		underscored: true,
		tableName: 'persons',
		validate: {
			nameNotNull: function() {
				if (!this.name)
					throw new Error('Nome não pode ser nulo');
			}
		},
		classMethods: {
			associate: function(models) {
				Person.belongsTo(models.Company, {
					as: 'company'
				});
				Person.belongsTo(models.ModelsList, {
					as: 'project1_model'
				});
			}
		}
	});

	return Person;
};