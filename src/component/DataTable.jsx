function DataTable({ title, columns }) {
	return (
		<section aria-label={`Tabla de ${title}`} className="mx-auto max-w-[1520px] overflow-hidden rounded-md border border-[#DCDCDC] bg-white">
			<div className="flex min-h-[62px] items-center justify-between border-b border-[#DCDCDC] px-4 md:px-5">
				<h2 className="text-sm font-semibold text-[#d06519] ]">{title}</h2>
				<span className="text-[11px] text-[#898f94]">0 registros</span>
			</div>  
			<div className="overflow-x-auto">
				<table className="w-full min-w-[620px] border-collapse text-left">
					<thead className="bg-[#d06519 ]">
						<tr>
							{columns.map((column) => (
								<th className="border-b border-[#DCDCDC] px-4 py-3 text-[10px] font-bold tracking-[0.5px] text-[#696969] md:px-5" key={column} scope="col">
									{column}
								</th>
							))}
							<th className="border-b border-[#DCDCDC] px-4 py-3 text-[10px] font-bold tracking-[0.5px] text-[#d06519] md:px-5" scope="col">Acciones</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td className="h-32 px-5 text-center text-[13px] text-[#898f94]" colSpan={columns.length + 1}>
								No hay registros para mostrar.
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</section>
	)
}

export default DataTable