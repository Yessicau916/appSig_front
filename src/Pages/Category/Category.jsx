import DataTable from '../../component/DataTable.jsx'

const categories = [
    { id: 1, Nombre: 'Seguridad', Descripción: 'Elementos de seguridad', Estado: 'Activo' },
    { id: 2, Nombre: 'Herramientas', Descripción: 'Herramientas de trabajo', Estado: 'Activo' },
]

function Category() {
    return (
        <DataTable
            title="Categorías"
            columns={['Nombre', 'Descripción', 'Estado']}
            data={categories}
        />
    )
}

export default Category