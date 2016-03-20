'use strict';

var Promise = require("bluebird");

module.exports = {
	up: function(queryInterface, Sequelize) {
		const
		parameters = [];
		// return queryInterface.dropAllTables().then( function() { return

		parameters.push({
			table: 'users',
			fields: {
				id: {
					type: Sequelize.INTEGER,
					primaryKey: true,
					autoIncrement: true
				},
				login: {
					type: Sequelize.STRING,
					allowNull: false,
                    unique: true
				},
				name: {
					type: Sequelize.STRING,
					allowNull: false
				},
				email: {
					type: Sequelize.STRING,
					allowNull: false
				},
				password: {
					type: Sequelize.STRING,
					allowNull: false
				},
				admin: {
					type: Sequelize.BOOLEAN,
					allowNull: false,
					defaultValue: false
				},
				token: {
					type: Sequelize.STRING,
					allowNull: true,
                    unique: true
				},
				created_at: {
					type: Sequelize.DATE
				},
				updated_at: {
					type: Sequelize.DATE
				}
			}
		});
		
		parameters.push({
			table: 'companies',
			fields: {
				id: {
					type: Sequelize.INTEGER,
					primaryKey: true,
					autoIncrement: true
				},
				name: {
					type: Sequelize.STRING,
					allowNull: false,
                    unique: true
				},
				address: {
					type: Sequelize.STRING,
					allowNull: true
				},
				created_at: {
					type: Sequelize.DATE
				},
				updated_at: {
					type: Sequelize.DATE
				},
			}
		});
		
		parameters.push({
			table: 'ambiental_licenses',
			fields: {
				id: {
					type: Sequelize.INTEGER,
					primaryKey: true,
					autoIncrement: true
				},
				created_at: {
					type: Sequelize.DATE
				},
				updated_at: {
					type: Sequelize.DATE
				},
				license: {
					type: Sequelize.STRING,
					allowNull: false
				},
				start: {
					type: Sequelize.DATEONLY,
					allowNull: false
				},
				end: {
					type: Sequelize.DATEONLY,
					allowNull: false
				},
				enterprise: {
					type: Sequelize.STRING,
					allowNull: false
				},
				entrepreneur: {
					type: Sequelize.STRING,
					allowNull: false
				},
				process: {
					type: Sequelize.STRING,
					allowNull: false
				},
				tipology: {
					type: Sequelize.STRING,
					allowNull: false
				},
				pac: {
					type: Sequelize.STRING,
					allowNull: false
				}
			}
		});
		
		parameters.push({
			table: 'basins',
			fields: {
				id: {
					type: Sequelize.INTEGER,
					primaryKey: true,
					autoIncrement: true
				},
				name: {
					type: Sequelize.STRING,
					allowNull: false,
                    unique: true
				},	
				created_at: {
					type: Sequelize.DATE
				},
				updated_at: {
					type: Sequelize.DATE
				}	
			}
		});

		parameters.push({
			table: 'blocks',
			fields: {
				id: {
					type: Sequelize.INTEGER,
					primaryKey: true,
					autoIncrement: true
				},
				name: {
					type: Sequelize.STRING,
					allowNull: false,
                    unique: true
				},
				name_contract: {
					type: Sequelize.STRING,
					allowNull: true
				},
				bid: {
					type: Sequelize.STRING,
					allowNull: true
				},
				end_1: {
					type: Sequelize.DATEONLY,
					allowNull: true
				},
				end_2: {
					type: Sequelize.DATEONLY,
					allowNull: true
				},
				end_3: {
					type: Sequelize.DATEONLY,
					allowNull: true
				},
				end_last: {
					type: Sequelize.DATEONLY,
					allowNull: true
				},
				status: {
					type: Sequelize.STRING,
					allowNull: true
				},
				concessionaries: {
					type: Sequelize.STRING,
					allowNull: true
				},
				operator_id: {
					type: Sequelize.INTEGER,
					allowNull: false,
					references: {
						model: 'companies',
						key: 'id'
					}
				},
				basin_id: {
					type: Sequelize.INTEGER,
					allowNull: false,
					references: {
						model: 'basins',
						key: 'id'
					}
				},
				created_at: {
					type: Sequelize.DATE
				},
				updated_at: {
					type: Sequelize.DATE
				}
			}
		});
		parameters.push({
			table: 'drilling_rigs_offshore',
			fields: {
				id: {
					type: Sequelize.INTEGER,
					primaryKey: true,
					autoIncrement: true
				},
				name: {
					type: Sequelize.STRING,
					allowNull: false
				},
				type: {
					type: Sequelize.STRING,
					allowNull: false
				},
				status: {
					type: Sequelize.STRING,
					allowNull: false
				},
				lda: {
					type: Sequelize.INTEGER,
					allowNull: true
				},
				start: {
					type: Sequelize.DATEONLY,
					allowNull: true
				},
				end: {
					type: Sequelize.DATEONLY,
					allowNull: true
				},
				contractor_id: {
					type: Sequelize.INTEGER,
					allowNull: false,
					references: {
						model: 'companies',
						key: 'id'
					}
				},
				created_at: {
					type: Sequelize.DATE
				},
				updated_at: {
					type: Sequelize.DATE
				},
			}
		});
		
		parameters.push({
			table: 'drilling_rigs_onshore',
			fields: {
				id: {
					type: Sequelize.INTEGER,
					primaryKey: true,
					autoIncrement: true
				},
				name: {
					type: Sequelize.STRING,
					allowNull: false
				},
				type: {
					type: Sequelize.STRING,
					allowNull: false
				},
				end: {
					type: Sequelize.DATEONLY,
					allowNull: true
				},
				contractor_id: {
					type: Sequelize.INTEGER,
					allowNull: false,
					references: {
						model: 'companies',
						key: 'id'
					}
                },
				created_at: {
					type: Sequelize.DATE
				},
				updated_at: {
					type: Sequelize.DATE
				},
			}
		});
		
		
		parameters.push({
			table: 'oil_fields',
			fields: {
				id: {
					type: Sequelize.INTEGER,
					primaryKey: true,
					autoIncrement: true
				},
				name: {
					type: Sequelize.STRING,
					allowNull: false
				},
				state: {
					type: Sequelize.STRING,
					allowNull: false
				},
				concessionaries: {
					type: Sequelize.STRING,
					allowNull: true
				},
				shore: {
					type: Sequelize.ENUM('on', 'off'),
					allowNull: false
				},
				stage: {
					type: Sequelize.ENUM('production', 'development'),
					allowNull: false
				},
				basin_id: {
					type: Sequelize.INTEGER,
					allowNull: false,
					references: {
						model: 'basins',
						key: 'id'
					}
				},
				created_at: {
					type: Sequelize.DATE
				},
				updated_at: {
					type: Sequelize.DATE
				}
			}
		});
		
		parameters.push({
			table: 'fpso_production',
			fields: {
				id: {
					type: Sequelize.INTEGER,
					primaryKey: true,
					autoIncrement: true
				},
				name: {
					type: Sequelize.STRING,
					allowNull: false
				},
				owner: {
					type: Sequelize.STRING,
					allowNull: false
				},
				status: {
					type: Sequelize.ENUM('operation', 'construction'),
					allowNull: false
				},
				oil_processing_capacity: {
					type: Sequelize.FLOAT,
					allowNull: false
				},
				gas_processing_capacity: {
					type: Sequelize.FLOAT,
					allowNull: false
				},
				oil_storage_capacity: {
					type: Sequelize.FLOAT,
					allowNull: false
				},
				depth: {
					type: Sequelize.FLOAT,
					allowNull: false
				},
				start: {
					type: Sequelize.DATEONLY,
					allowNull: false
				},
				end: {
					type: Sequelize.DATEONLY,
					allowNull: true
				},
				operating_wells: {
					type: Sequelize.INTEGER,
					allowNull: true
				},
				injecting_wells: {
					type: Sequelize.INTEGER,
					allowNull: true
				},
				field_id: {
					type: Sequelize.INTEGER,
					allowNull: false,
					references: {
						model: 'oil_fields',
						key: 'id'
					}
				},
				created_at: {
					type: Sequelize.DATE
				},
				updated_at: {
					type: Sequelize.DATE
				}
			}
		});
		
		parameters.push({
			table: 'fixed_uep_production',
			fields: {
				id: {
					type: Sequelize.INTEGER,
					primaryKey: true,
					autoIncrement: true
				},
				name: {
					type: Sequelize.STRING,
					allowNull: false
				},
				code: {
					type: Sequelize.STRING,
					allowNull: false
				},
				basin: {
					type: Sequelize.STRING,
					allowNull: false
				},
				lat: {
					type: Sequelize.DECIMAL,
					allowNull: false
				},
				lng: {
					type: Sequelize.DECIMAL,
					allowNull: false
				},
				depth: {
					type: Sequelize.FLOAT,
					allowNull: false
				},
				operator_id: {
					type: Sequelize.INTEGER,
					allowNull: false,
					references: {
						model: 'companies',
						key: 'id'
					}
				},
				created_at: {
					type: Sequelize.DATE
				},
				updated_at: {
					type: Sequelize.DATE
				},
			}
		});
		
		parameters.push({
			table: 'models_list',
			fields: {
				id: {
					type: Sequelize.INTEGER,
					primaryKey: true,
					autoIncrement: true
				},
				name: {
					type: Sequelize.STRING,
					allowNull: false
				},
				created_at: {
					type: Sequelize.DATE
				},
				updated_at: {
					type: Sequelize.DATE
				},
			}
		});
		
		parameters.push({
			table: 'news',
			fields: {
				id: {
					type: Sequelize.INTEGER,
					primaryKey: true,
					autoIncrement: true
				},
				title: {
					type: Sequelize.STRING,
					allowNull: false
				},
				content: {
					type: Sequelize.TEXT,
					allowNull: false
				},
				author_id: {
					type: Sequelize.INTEGER,
					allowNull: false,
					references: {
						model: 'users',
						key: 'id'
					}
				},
				created_at: {
					type: Sequelize.DATE
				},
				updated_at: {
					type: Sequelize.DATE
				},
			}
		});
		
		parameters.push({
			table: 'news_models',
			fields: {
				id: {
					type: Sequelize.INTEGER,
					primaryKey: true,
					autoIncrement: true
				},
				model_ref_id: {
					type: Sequelize.INTEGER,
					allowNull: false
				},
				news_id: {
					type: Sequelize.INTEGER,
					allowNull: false,
					references: {
						model: 'news',
						key: 'id'
					},
					onDelete: 'CASCADE'
				},
				model_id: {
					type: Sequelize.INTEGER,
					allowNull: false,
					references: {
						model: 'models_list',
						key: 'id'
					}
				},
				created_at: {
					type: Sequelize.DATE
				},
				updated_at: {
					type: Sequelize.DATE
				},
			}
		});
		
		parameters.push({
			table: 'persons',
			fields: {
				id: {
					type: Sequelize.INTEGER,
					primaryKey: true,
					autoIncrement: true
				},
				name: {
					type: Sequelize.STRING,
					allowNull: false
				},
				company_id: {
					type: Sequelize.INTEGER,
					allowNull: false,
					references: {
						model: 'companies',
						key: 'id'
					}
				},
				created_at: {
					type: Sequelize.DATE
				},
				updated_at: {
					type: Sequelize.DATE
				},
			}
		});
		
        
		parameters.push({
			table: 'person_projects',
			fields: {
				id: {
					type: Sequelize.INTEGER,
					primaryKey: true,
					autoIncrement: true
				},
				model_ref_id: {
					type: Sequelize.INTEGER,
					allowNull: false
				},
				person_id: {
					type: Sequelize.INTEGER,
					allowNull: false,
					references: {
						model: 'persons',
						key: 'id'
					},
					onDelete: 'CASCADE'
				},
				model_id: {
					type: Sequelize.INTEGER,
					allowNull: false,
					references: {
						model: 'models_list',
						key: 'id'
					}
				},
				description: {
					type: Sequelize.STRING,
					allowNull: true
				},
				created_at: {
					type: Sequelize.DATE
				},
				updated_at: {
					type: Sequelize.DATE
				},
			}
		});
        
		parameters.push({
			table: 'production',
			fields: {
				id: {
					type: Sequelize.INTEGER,
					primaryKey: true,
					autoIncrement: true
				},
				state: {
					type: Sequelize.STRING,
					allowNull: false
				},
				well_anp: {
					type: Sequelize.STRING,
					allowNull: false
				},
				well_operator: {
					type: Sequelize.STRING,
					allowNull: false
				},
				contract: {
					type: Sequelize.STRING,
					allowNull: false
				},
				period_year: {
					type: Sequelize.INTEGER,
					allowNull: false
				},
				period_month: {
					type: Sequelize.INTEGER,
					allowNull: false
				},
				oil_production: {
					type: Sequelize.FLOAT,
					allowNull: false
				},
				oil_condensed_production: {
					type: Sequelize.FLOAT,
					allowNull: false
				},
				gas_associated_production: {
					type: Sequelize.FLOAT,
					allowNull: false
				},
				gas_non_associated_production: {
					type: Sequelize.FLOAT,
					allowNull: false
				},
				gas_royaties_volume: {
					type: Sequelize.FLOAT,
					allowNull: false
				},
				water_production: {
					type: Sequelize.FLOAT,
					allowNull: false
				},
				instalation: {
					type: Sequelize.STRING,
					allowNull: false
				},
				instalation_type: {
					type: Sequelize.STRING,
					allowNull: false
				},
				production_time: {
					type: Sequelize.FLOAT,
					allowNull: false
				},
				shore: {
					type: Sequelize.ENUM('on', 'off'),
					allowNull: false
				},
				basin_id: {
					type: Sequelize.INTEGER,
					allowNull: false,
					references: {
						model: 'basins',
						key: 'id'
					}
				},
				operator_id: {
					type: Sequelize.INTEGER,
					allowNull: false,
					references: {
						model: 'companies',
						key: 'id'
					}
				},
				oil_field_id: {
					type: Sequelize.INTEGER,
					allowNull: false,
					references: {
						model: 'oil_fields',
						key: 'id'
					}
				},
				created_at: {
					type: Sequelize.DATE
				},
				updated_at: {
					type: Sequelize.DATE
				},
			}
		});
		
		parameters.push({
			table: 'reserves',
			fields: {
				id: {
					type: Sequelize.INTEGER,
					primaryKey: true,
					autoIncrement: true
				},
				state: {
					type: Sequelize.STRING,
					allowNull: false
				},
				reserve: {
					type: Sequelize.FLOAT,
					allowNull: false
				},
				year: {
					type: Sequelize.INTEGER,
					allowNull: false
				},
				shore: {
					type: Sequelize.ENUM('on', 'off'),
					allowNull: false
				},
				quantity_type: {
					type: Sequelize.ENUM('proven', 'total'),
					allowNull: false
				},
				type: {
					type: Sequelize.ENUM('oil', 'gas'),
					allowNull: false
				},
				created_at: {
					type: Sequelize.DATE
				},
				updated_at: {
					type: Sequelize.DATE
				},
			}
		});
		
		parameters.push({
			table: 'seismics',
			fields: {
				id: {
					type: Sequelize.INTEGER,
					primaryKey: true,
					autoIncrement: true
				},
				process: {
					type: Sequelize.STRING,
					allowNull: false
				},
				authorized_company: {
					type: Sequelize.STRING,
					allowNull: true
				},
				dou_publi_date: {
					type: Sequelize.DATEONLY,
					allowNull: true
				},
				end_date: {
					type: Sequelize.DATEONLY,
					allowNull: true
				},
				authorized_technologies: {
					type: Sequelize.STRING,
					allowNull: true
				},
				basin_id: {
					type: Sequelize.INTEGER,
					allowNull: false,
					references: {
						model: 'basins',
						key: 'id'
					}
				},
				created_at: {
					type: Sequelize.DATE
				},
				updated_at: {
					type: Sequelize.DATE
				},
			}
		});

		parameters.push({
			table: 'wells',
			fields: {
				id: {
					type: Sequelize.INTEGER,
					primaryKey: true,
					autoIncrement: true
				},
				name: {
					type: Sequelize.STRING,
					allowNull: false,
                    unique: true
				},
				state: {
					type: Sequelize.STRING,
					allowNull: false
				},
				lat: {
					type: Sequelize.DECIMAL(10, 6),
					allowNull: false
				},
				lng: {
					type: Sequelize.DECIMAL(10, 6),
					allowNull: false
				},
				operator_id: {
					type: Sequelize.INTEGER,
					allowNull: false,
					references: {
						model: 'companies',
						key: 'id'
					}
				},
				block_id: {
					type: Sequelize.INTEGER,
					allowNull: false,
					references: {
						model: 'blocks',
						key: 'id'
					}
				},
				basin_id: {
					type: Sequelize.INTEGER,
					allowNull: false,
					references: {
						model: 'basins',
						key: 'id'
					}
				},
				created_at: {
					type: Sequelize.DATE
				},
				updated_at: {
					type: Sequelize.DATE
				},
			}
		});

		return Promise.each(parameters, function(item) {
			return queryInterface.createTable(item.table, item.fields);
		});
	},

	down: function(queryInterface, Sequelize) {
		const tables = [
		    'wells',
		    'seismics',
		    'persons',
		    'reserves',
		    'production',
		    'news_models',
		    'news',
		    'models_list',
		    'fixed_uep_production',
		    'fpso_production',
		    'oil_fields',
		    'drilling_rigs_onshore',
		    'drilling_rigs_offshore',     
		    'blocks',
		    'basins',
		    'ambiental_licenses',
		    'companies',
		    'users'
		];
		
		return Promise.each(tables, function(table) {
			return queryInterface.dropTable(table);
		});
	}
};
