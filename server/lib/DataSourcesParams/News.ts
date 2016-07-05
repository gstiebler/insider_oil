import { IBaseDataSourceParams } from '../../../common/Interfaces';

const News: IBaseDataSourceParams = {
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
    hasMap: false
}

export = News;