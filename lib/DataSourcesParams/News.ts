import BaseDataSourceParams = require('./BaseDataSourceParams');

const News: BaseDataSourceParams = {
    fields: {
        title: {
            label: 'Título'
        },
        content: {
            label: 'Conteúdo',
            isHTML: true
        },
        author_id: {
            label: 'Autor'
        },
        author_name: {
            label: 'Autor'
        },
        created_at: {
        	label: 'Criada em'
        }
    },
    labelField: 'title',
    gridFields: ['title', 'author_name', 'created_at'],
    tableLabel: 'Notícias',
    hasMap: false,
    queries: {
        byObject: (filters) => {
            const modelName = filters.modelName;
            const id = filters.id;
            const modelIdQuery = 'select id from models_list where name = "' + modelName + '" group by id';
            const newsIdQuery = 'SELECT news_id FROM news_models ' +
                ' where model_id = (' + modelIdQuery + ')' +
                ' and model_ref_id = ' + id;
            const newsQuery = 'select * from news ' +
                ' where id in (' + newsIdQuery + ')';
            return newsQuery;
        }
    }
}

export = News;