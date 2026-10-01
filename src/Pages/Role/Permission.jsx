import DataTable from '../../component/DataTable.jsx'

function Permission() {
	return <DataTable title="Permisos" columns={['Permiso', 'Descripción', 'Módulo', 'Estado']} />
}

export default Permission