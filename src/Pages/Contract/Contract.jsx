import DataTable from '../../component/DataTable.jsx'

function Contract() {
	return <DataTable title="Contratos" columns={['N.º de contrato', 'Nombre', 'Fecha de inicio', 'Fecha de finalización', 'Estado']} />
}

export default Contract