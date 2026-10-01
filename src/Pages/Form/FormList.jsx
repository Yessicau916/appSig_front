import DataTable from '../../component/DataTable.jsx'

function FormList() {
	return <DataTable title="Formularios" columns={['Formulario', 'Tipo', 'Fecha de actualización', 'Estado']} />
}

export default FormList