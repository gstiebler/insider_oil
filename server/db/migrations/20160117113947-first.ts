var promise_bb = require("bluebird");
import Sequelize = require('sequelize');  

interface ITableOpts {
	table:string; 
	fields: Sequelize.DefineAttributes;
}

module.exports = {
	up: function(queryInterface:Sequelize.QueryInterface, sequelize:Sequelize.Sequelize) {
		const parameters:ITableOpts[] = [];

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
				logo: {
					type: Sequelize.BLOB('long'),
					allowNull: true
				},
				site: {
					type: Sequelize.STRING,
					allowNull: true
				},
				telephones_text: {
					type: Sequelize.TEXT('tiny'),
					allowNull: true
				},
				segments_text: {
					type: Sequelize.TEXT('tiny'),
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
				updates: {
					type: Sequelize.TEXT,
					allowNull: true
				},
				polygons: {
					type: Sequelize.TEXT,
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
					allowNull: true
				},
				status: {
					type: Sequelize.STRING,
					allowNull: true
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
				day_rate: {
					type: Sequelize.DOUBLE,
					allowNull: true
				},
				photo: {
					type: Sequelize.BLOB('long'),
					allowNull: true
				},
				info: {
					type: Sequelize.TEXT,
					allowNull: true
				},
				contractor_id: {
					type: Sequelize.INTEGER,
					allowNull: true,
					references: {
						model: 'companies',
						key: 'id'
					}
				},
				operator_id: {
					type: Sequelize.INTEGER,
					allowNull: true,
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
				status: {
					type: Sequelize.STRING,
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
				day_rate: {
					type: Sequelize.DOUBLE,
					allowNull: true
				},
				photo: {
					type: Sequelize.BLOB('long'),
					allowNull: true
				},
				contractor_id: {
					type: Sequelize.INTEGER,
					allowNull: true,
					references: {
						model: 'companies',
						key: 'id'
					}
                },
				operator_id: {
					type: Sequelize.INTEGER,
					allowNull: true,
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
				shore: {
					type: Sequelize.ENUM('on', 'off'),
					allowNull: false
				},
				stage: {
					type: Sequelize.ENUM('production', 'development'),
					allowNull: false
				},
				updates: {
					type: Sequelize.TEXT,
					allowNull: true
				},
				polygons: {
					type: Sequelize.TEXT,
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
				block_id: {
					type: Sequelize.INTEGER,
					allowNull: true,
					references: {
						model: 'blocks',
						key: 'id'
					}
				},
				operator_id: {
					type: Sequelize.INTEGER,
					allowNull: true,
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
				}
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
				tableau_url: {
					type: Sequelize.TEXT,
					allowNull: true
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
				info: {
					type: Sequelize.TEXT,
					allowNull: true
				},
				company_id: {
					type: Sequelize.INTEGER,
					allowNull: true,
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
				block_id: {
					type: Sequelize.INTEGER,
					allowNull: true,
					references: {
						model: 'blocks',
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
				lat: {
					type: Sequelize.DECIMAL(10, 6),
					allowNull: true
				},
				lng: {
					type: Sequelize.DECIMAL(10, 6),
					allowNull: true
				},
				operator_id: { 
					type: Sequelize.INTEGER,
					allowNull: true,
					references: {
						model: 'companies',
						key: 'id'
					}
				},
				block_id: {
					type: Sequelize.INTEGER,
					allowNull: true,
					references: {
						model: 'blocks',
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

		return promise_bb.each(parameters, function(item) {
			return queryInterface.createTable(item.table, item.fields);
		});
	},

	down: function(queryInterface:Sequelize.QueryInterface, Sequelize) {
		const tables = [
		    'wells',
		    'seismics',
		    'persons',
		    'reserves',
		    'production',
		    'news_models',
		    'news',
		    'models_list',
		    'oil_fields',
		    'drilling_rigs_onshore',
		    'drilling_rigs_offshore',     
		    'blocks',
		    'basins',
		    'ambiental_licenses',
		    'companies',
		    'users'
		];
		
		return promise_bb.each(tables, function(table:string):Promise<void> {
			return queryInterface.dropTable(table);
		});
	}
};
