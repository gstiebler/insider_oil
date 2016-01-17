'use strict';

module.exports = {
	up: function(queryInterface, Sequelize) {
		const
		promiseArray = [];
		promiseArray.push(queryInterface.dropAllTables());
		promiseArray.push(queryInterface.createTable('users', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			createdAt: {
				type: Sequelize.DATE
			},
			updatedAt: {
				type: Sequelize.DATE
			},
			login: {
				type: Sequelize.STRING,
				allowNull: false
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
				allowNull: true
			}
		}));

		promiseArray.push(queryInterface.createTable('companies', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			createdAt: {
				type: Sequelize.DATE
			},
			updatedAt: {
				type: Sequelize.DATE
			},
			name: {
				type: Sequelize.STRING,
				allowNull: false
			},
			address: {
				type: Sequelize.STRING,
				allowNull: true
			}
		}));

		promiseArray.push(queryInterface.createTable('ambiental_licenses', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			createdAt: {
				type: Sequelize.DATE
			},
			updatedAt: {
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
		}));

		promiseArray.push(queryInterface.createTable('basins', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			createdAt: {
				type: Sequelize.DATE
			},
			updatedAt: {
				type: Sequelize.DATE
			},
			name: {
				type: Sequelize.STRING,
				allowNull: false
			}
		}));

		promiseArray.push(queryInterface.createTable('blocks', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			createdAt: {
				type: Sequelize.DATE
			},
			updatedAt: {
				type: Sequelize.DATE
			},
			name: {
				type: Sequelize.STRING,
				allowNull: false
			},
			name_contract: {
				type: Sequelize.STRING,
				allowNull: false
			},
			bid: {
				type: Sequelize.STRING,
				allowNull: false
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
				references: 'basins',
				references: {
					model: 'basins',
					key: 'id'
				}
			}
		}));

		promiseArray.push(queryInterface.createTable('drilling_rigs_offshore', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			createdAt: {
				type: Sequelize.DATE
			},
			updatedAt: {
				type: Sequelize.DATE
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
			}
		}));

		promiseArray.push(queryInterface.createTable('drilling_rigs_onshore', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			createdAt: {
				type: Sequelize.DATE
			},
			updatedAt: {
				type: Sequelize.DATE
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
			}
		}));

		promiseArray.push(queryInterface.createTable('fpso_production', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			createdAt: {
				type: Sequelize.DATE
			},
			updatedAt: {
				type: Sequelize.DATE
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
			}
		}));

		promiseArray.push(queryInterface.createTable('fixed_uep_production', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			createdAt: {
				type: Sequelize.DATE
			},
			updatedAt: {
				type: Sequelize.DATE
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
			}
		}));

		promiseArray.push(queryInterface.createTable('oil_fields', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			createdAt: {
				type: Sequelize.DATE
			},
			updatedAt: {
				type: Sequelize.DATE
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
			}
		}));

		promiseArray.push(queryInterface.createTable('models_list', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			createdAt: {
				type: Sequelize.DATE
			},
			updatedAt: {
				type: Sequelize.DATE
			},
			name: {
				type: Sequelize.STRING,
				allowNull: false
			}
		}));

		promiseArray.push(queryInterface.createTable('news', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			createdAt: {
				type: Sequelize.DATE
			},
			updatedAt: {
				type: Sequelize.DATE
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
			}
		}));

		promiseArray.push(queryInterface.createTable('news_models', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			createdAt: {
				type: Sequelize.DATE
			},
			updatedAt: {
				type: Sequelize.DATE
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
				}
			},
			model_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'models_list',
					key: 'id'
				}
			}
		}));

		promiseArray.push(queryInterface.createTable('production', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			createdAt: {
				type: Sequelize.DATE
			},
			updatedAt: {
				type: Sequelize.DATE
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
			}
		}));

		promiseArray.push(queryInterface.createTable('reserves', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			createdAt: {
				type: Sequelize.DATE
			},
			updatedAt: {
				type: Sequelize.DATE
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
			}
		}));

		promiseArray.push(queryInterface.createTable('persons', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			createdAt: {
				type: Sequelize.DATE
			},
			updatedAt: {
				type: Sequelize.DATE
			},
			name: {
				type: Sequelize.STRING,
				allowNull: false
			},
			phone: {
				type: Sequelize.STRING,
				allowNull: true
			},
			company_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'companies',
					key: 'id'
				}
			}
		}));

		promiseArray.push(queryInterface.createTable('seismics', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			createdAt: {
				type: Sequelize.DATE
			},
			updatedAt: {
				type: Sequelize.DATE
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
			}
		}));

		promiseArray.push(queryInterface.createTable('wells', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			createdAt: {
				type: Sequelize.DATE
			},
			updatedAt: {
				type: Sequelize.DATE
			},
			name: {
				type: Sequelize.STRING,
				allowNull: false
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
			}
		}));

		return Promise.all(promiseArray);
	},

	down: function(queryInterface, Sequelize) {
		/*
		 * Add reverting commands here. Return a promise to correctly handle
		 * asynchronicity.
		 * 
		 * Example: return queryInterface.dropTable('users');
		 */
	}
};
