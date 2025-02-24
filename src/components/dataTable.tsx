function DataTable() {
	return (
		<div className='data-table'>
			<h2>Data Table</h2>
			<table>
				<thead>
					<tr>
						<th>Header1</th>
						<th>Header2</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>Row1, Data1</td>
						<td>Row1, Data2</td>
					</tr>
					{/* Additional rows as needed */}
				</tbody>
			</table>
		</div>
	);
}

export default DataTable;
