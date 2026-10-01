import DataTable from '../../component/DataTable.jsx'

function FormType() {
	return <DataTable title="Tipos de formulario" columns={['Tipo de formulario', 'Descripción', 'Formularios asociados', 'Estado']} />
}

export default FormType