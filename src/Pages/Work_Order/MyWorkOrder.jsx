import DataTable from '../../component/DataTable.jsx'

function MyWorkOrder() {
	return <DataTable title="Mi orden de trabajo" columns={['N.º de orden', 'Asunto', 'Prioridad', 'Fecha de asignación', 'Estado']} />
}

export default MyWorkOrder